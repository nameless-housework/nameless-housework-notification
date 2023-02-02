import http from 'http';

import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import ngrok from 'ngrok';
import Ambient from 'ambient-lib';
// import { requestI2CAccess } from 'node-web-i2c';
// import NPIX from '@chirimen/neopixel-i2c';

import { PORT, NGROK_AUTH_TOKEN, WEB_GUI_URL, AM_CH_ID, AM_READ_KEY, AM_WRITE_KEY } from './constants/constant';
import * as db from './utils/db';
const wait = (n: number) => new Promise((resolve) => setTimeout(resolve, n));

const SYSTEM = { ngrokUrl: '' };

// setup file db
db.initFileIfNotExists();
db.reflectFromFile();

// express
const app = express();

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
  if (![db.LANG.JP, db.LANG.EK].includes(req.params.name as typeof db.LANG.JP | typeof db.LANG.EK)) {
    res.status(422).json({ message: `plz set ${db.LANG.JP} or ${db.LANG.EK} to lang` });
    return;
  }

  res.status(200).json({ message: 'saved lang!', saved: db.CONTENTS });
});

app.put(
  '/api/notification/config/sensor/:name/:active/:threshold/:over_or_less/:about',
  (req: express.Request, res: express.Response) => {
    if (!db.SENSOR_NAMES.includes(req.params.name)) {
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
      ![db.COMPARISON.OVER, db.COMPARISON.LESS].includes(
        req.params.over_or_less as typeof db.COMPARISON.OVER | typeof db.COMPARISON.LESS
      )
    ) {
      res.status(422).json({ message: `plz set ${db.COMPARISON.OVER} or ${db.COMPARISON.LESS} to over_or_less` });
      return;
    }
    if (!req.params.about) {
      res.status(422).json({ message: 'plz set text to about' });
      return;
    }

    const name = req.params.name as keyof typeof db.CONTENTS;
    db.CONTENTS.sensor[name].active = req.params.active === 'true';
    db.CONTENTS.sensor[name].threshold = parseInt(req.params.threshold);
    db.CONTENTS.sensor[name].over_or_less = req.params.over_or_less;
    db.CONTENTS.sensor[name].about = req.params.about;
    db.saveToFile();

    res.status(200).json({ message: 'saved sensor!', saved: db.CONTENTS });
  }
);

// ambient
const am = new Ambient(AM_CH_ID, AM_WRITE_KEY, AM_READ_KEY);
const amReadLatest = () =>
  new Promise((resolve) => {
    am.read({ n: 1 }, (res) => {
      resolve(res.data);
    });
  });

// main
(async () => {
  http.createServer(app).listen(PORT, async () => {
    SYSTEM.ngrokUrl = await ngrok.connect({ authtoken: NGROK_AUTH_TOKEN, addr: PORT });
    console.log(SYSTEM.ngrokUrl);
  });

  for (;;) {
    try {
      const amLatest = (await amReadLatest())[0];

      const targetNames = db.SENSOR_NAMES.filter((name) => {
        const sensorVal = parseInt(amLatest[name]);
        const sensorConf = db.CONTENTS.sensor[name as keyof typeof db.CONTENTS.sensor];
        return (
          sensorConf.active &&
          ((sensorConf.over_or_less === db.COMPARISON.OVER && sensorConf.threshold <= sensorVal) ||
            (sensorConf.over_or_less === db.COMPARISON.LESS && sensorConf.threshold >= sensorVal))
        );
      });

      console.log(targetNames); // 家事が発生しているセンサの名前が表示される
    } catch (err) {
      console.error(err);
    }
    await wait(1000);
  }
})();
