if (process.platform !== 'linux') {
  return 'not raspberrypi';
}

const { requestI2CAccess } = require('./../node_modules/node-web-i2c/index.js');
const NPIX = require('@chirimen/neopixel-i2c');

const data = JSON.parse(process.argv[2]);
console.log('console.log');
console.log(data);

main(data);

async function setPattern(npix, pattern) {
  // パターン設定
  const grbArray = [];
  for (const color of pattern) {
    const r = (color >> 16) & 0xff;
    const g = (color >> 8) & 0xff;
    const b = color & 0xff;
    grbArray.push(g);
    grbArray.push(r);
    grbArray.push(b);
  }
  await npix.setPixels(grbArray);
}

async function main(val) {
  const neoPixels = 8; // LED個数
  val = ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8'];
  //val = ['d1','d2']
  //val = []
  const i2cAccess = await requestI2CAccess();
  const port = i2cAccess.ports.get(1);
  const npix = new NPIX(port, 0x41);
  await npix.init(neoPixels);

  const BLACK = 0x000000;
  const MAGENTA = 0xff00ff;
  const CYAN = 0x00ffff;
  const YELLOW = 0xffff00;
  const RED = 0xff0000;
  const GREEN = 0x00ff00;
  const BLUE = 0x0000ff;

  const pattern = [
    val.indexOf('d1') + 1 ? MAGENTA : BLACK,
    val.indexOf('d2') + 1 ? CYAN : BLACK,
    val.indexOf('d3') + 1 ? YELLOW : BLACK,
    val.indexOf('d4') + 1 ? RED : BLACK,
    val.indexOf('d5') + 1 ? GREEN : BLACK,
    val.indexOf('d6') + 1 ? BLUE : BLACK,
    val.indexOf('d7') + 1 ? MAGENTA : BLACK,
    val.indexOf('d8') + 1 ? CYAN : BLACK,
  ];
  await setPattern(npix, pattern);
  return 'led success'
}
