import http from 'http';

import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import ngrok from 'ngrok';
import axios from 'axios';
import { execSync } from 'child_process';
// import { requestI2CAccess } from 'node-web-i2c';
// import NPIX from '@chirimen/neopixel-i2c';

import { TEL, PORT, NGROK_AUTH_TOKEN, WEB_GUI_URL, AM_CH_ID, AM_READ_KEY } from './constants/constant';
import * as db from './utils/db';
import { Adb } from './utils/adb';
import { Tell } from './utils/tell';
import { wait } from './utils/wait';
import { LANG, OVER_OR_LESS, SensorKeys, OverOrLess } from './@types/db';
import { AmRes } from './@types/ambient';

const SYSTEM = { ngrokUrl: '', isActiveCalling: false };
const SENSOR_KEYS = Object.keys(db.CONTENTS.sensor);

// setup file db
db.initFileIfNotExists();
db.reflectFromFile();

// express
const app = express();

// adb
const adb = new Adb();

// tell
const tell = new Tell();

// 基本的に直接はインターネットに公開はされないプロダクトなので許可する
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.get('/', (req: express.Request, res: express.Response) => {
  res.redirect(`${WEB_GUI_URL}/?api=${SYSTEM.ngrokUrl}`);
});

app.get('/api/notification/config', (req: express.Request, res: express.Response) => {
  res.status(200).json(db.CONTENTS);
});

app.put('/api/notification/config/lang/:type', (req: express.Request, res: express.Response) => {
  if (![LANG.JP, LANG.EN].includes(req.params.type as typeof LANG.JP | typeof LANG.EN)) {
    res.status(422).json({ message: `plz set ${LANG.JP} or ${LANG.EN} to lang` });
    return;
  }

  res.status(200).json({ message: 'saved lang!', saved: db.CONTENTS });
});

app.put(
  '/api/notification/config/sensor/:name/:active/:threshold/:over_or_less/:about',
  (req: express.Request, res: express.Response) => {
    if (!SENSOR_KEYS.includes(req.params.name)) {
      res.status(404).json({ message: 'not found' });
      return;
    }
    if (!['true', 'false'].includes(req.params.active)) {
      res.status(422).json({ message: 'plz set true or false to active' });
      return;
    }
    if (!req.params.threshold.match(/^(-|\+|)\d+$/)) {
      res.status(422).json({ message: 'plz set number to threshold' });
      return;
    }
    if (
      ![OVER_OR_LESS.OVER, OVER_OR_LESS.LESS].includes(
        req.params.over_or_less as typeof OVER_OR_LESS.OVER | typeof OVER_OR_LESS.LESS
      )
    ) {
      res.status(422).json({ message: `plz set ${OVER_OR_LESS.OVER} or ${OVER_OR_LESS.LESS} to over_or_less` });
      return;
    }
    if (!req.params.about) {
      res.status(422).json({ message: 'plz set text to about' });
      return;
    }

    const name = req.params.name as SensorKeys;
    db.CONTENTS.sensor[name].active = req.params.active === 'true';
    db.CONTENTS.sensor[name].threshold = parseInt(req.params.threshold);
    db.CONTENTS.sensor[name].over_or_less = req.params.over_or_less as OverOrLess;
    db.CONTENTS.sensor[name].about = req.params.about;
    db.saveToFile();

    res.status(200).json({ message: 'saved sensor!', saved: db.CONTENTS });
  }
);

// main
(async () => {
  http.createServer(app).listen(PORT, async () => {
    SYSTEM.ngrokUrl = await ngrok.connect({ authtoken: NGROK_AUTH_TOKEN, addr: PORT });
    console.log(SYSTEM.ngrokUrl);
    await adb.showQRCodeAtChrome(SYSTEM.ngrokUrl);
  });

  try {
    await adb.setDeviceIdFromCliRes();
    await tell.checkDeviceAndChangeVolumeToMax();
    SYSTEM.isActiveCalling = true;
  } catch (err) {
    console.error(err);
    console.log('INFO: The Android/Audio call/play function is not available.');
  }
  console.log(`SYSTEM.isActiveCalling = ${SYSTEM.isActiveCalling}`);

  for (;;) {
    try {
      /**
       * 全センサの最新の値を取得
       */
      const amLatest = (
        await axios.get<AmRes>(`https://ambidata.io/api/v2/channels/${AM_CH_ID}/data?readKey=${AM_READ_KEY}&n=1`)
      ).data[0];
      console.log(amLatest);

      /**
       * 家事が発生しているセンサの名前が格納される
       */
      const targetNames = SENSOR_KEYS.filter((name) => {
        const sensorVal = parseInt(amLatest[name]);
        const sensorConf = db.CONTENTS.sensor[name as SensorKeys];
        return (
          sensorConf.active &&
          ((sensorConf.over_or_less === OVER_OR_LESS.OVER && sensorConf.threshold <= sensorVal) ||
            (sensorConf.over_or_less === OVER_OR_LESS.LESS && sensorConf.threshold >= sensorVal))
        );
      });
      console.log(targetNames);

      // 家事が発生してなければコンティニュー
      if (!targetNames.length) {
        await wait(1000);
        continue;
      }

      /* ここから先、家事発生時の処理 */

      //led
      if (process.platform !== 'linux') {
        console.log('LED: not raspberrypi');
      } else {
        const stdout = execSync(`node ${__dirname}/pi.js '${JSON.stringify(targetNames)}'`);
        console.log(stdout.toString());
      }

      // 架電機能有効なら架電
      if (SYSTEM.isActiveCalling) {
        try {
          // 架電開始
          const resOfCalled = await adb.call(TEL);
          console.log(resOfCalled);
          // 繋がらない場合はコンティニュー
          if (resOfCalled === 'disconnected') {
            // 流石に電話しまくるので1分待機
            await wait(60000);
            continue;
          }
          // 繋がったら喋る
          await tell.tellHousework({ lang: db.CONTENTS.lang, sensorKeys: targetNames });
          // 喋りきったら電話切る
          await adb.hangUp();
          // 再度 QR Code 表示
          await adb.openChrome();
          // 流石に電話しまくるので1分待機
          await wait(60000);
        } catch (err) {
          console.error(err);
        }
      }
    } catch (err) {
      console.error(err);
    }
    await wait(1000);
  }
})();
