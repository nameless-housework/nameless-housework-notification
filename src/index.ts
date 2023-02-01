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

app.get('/', (req: express.Request, res: express.Response) => {
  res.redirect(`${WEB_GUI_URL}/?api=${SYSTEM.ngrokUrl}`);
});

app.get('/api/notification/config', (req: express.Request, res: express.Response) => {
  res.status(200).json(db.CONTENTS);
});

app.put(
  '/api/notification/config/:name/:active/:threshold/:over_or_less/:about',
  (req: express.Request, res: express.Response) => {
    if (!db.CONTENT_NAMES.includes(req.params.name)) {
      res.status(404).json({ message: 'not found' });
      return;
    }
    if (!['true', 'false'].includes(req.params.active)) {
      res.status(422).json({ message: 'plz set true or false to active' });
      return;
    }
    if (req.params.threshold.match(/^(-|\+|)\d+$/)) {
      res.status(422).json({ message: 'plz set number to threshold' });
      return;
    }
    if (
      ![db.COMPARISON.OVER, db.COMPARISON.LESS].includes(
        req.params.over_or_less as typeof db.COMPARISON.OVER | typeof db.COMPARISON.LESS
      )
    ) {
      res.status(422).json({ message: 'plz set over or less to over_or_less' });
      return;
    }
    if (req.params.about) {
      res.status(422).json({ message: 'plz set text to about' });
      return;
    }

    const name = req.params.name as keyof typeof db.CONTENTS;
    db.CONTENTS[name].active = req.params.active === 'true';
    db.CONTENTS[name].threshold = parseInt(req.params.threshold);
    db.CONTENTS[name].over_or_less = req.params.over_or_less;
    db.CONTENTS[name].about = req.params.about;
    db.saveToFile();

    res.status(200).json({ message: 'saved!', saved: db.CONTENTS });
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
    const amLatest = (await amReadLatest())[0];
    const targetNames = [];

    for (const name of db.CONTENT_NAMES) {
      const dbContent = db.CONTENTS[name as keyof typeof db.CONTENTS];
      const sensorVal = parseInt(amLatest[name]);
      if (!dbContent.active) {
        continue;
      }

      if (dbContent.over_or_less === db.COMPARISON.OVER && dbContent.threshold <= sensorVal) {
        targetNames.push(name);
        continue;
      }
      if (dbContent.over_or_less === db.COMPARISON.LESS && dbContent.threshold >= sensorVal) {
        targetNames.push(name);
        continue;
      }
    }

    console.log(targetNames); // 家事が発生しているセンサの名前が表示される
    await wait(1000);
  }
})();
