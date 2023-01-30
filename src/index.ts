import http from 'http';

import express from 'express';
import ngrok from 'ngrok';
// import { requestI2CAccess } from 'node-web-i2c';
// import NPIX from '@chirimen/neopixel-i2c';
// import ambient from 'ambient-lib';

import { PORT, NGROK_AUTH_TOKEN } from './constants/constant';

const SYSTEM = { ngrokUrl: '' };
const app = express();

app.get('/', (req: express.Request, res: express.Response) => {
  res.redirect(`https://nameless-housework.github.io/nameless-housework-notification?api=${SYSTEM.ngrokUrl}`);
});

(async () => {
  http.createServer(app).listen(PORT, async () => {
    SYSTEM.ngrokUrl = await ngrok.connect({ authtoken: NGROK_AUTH_TOKEN, addr: PORT });
    console.log(SYSTEM.ngrokUrl);
  });
})();
