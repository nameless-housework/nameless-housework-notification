// system
export const PORT = parseInt(process.env.PORT || '5000');
export const NGROK_AUTH_TOKEN = process.env.NGROK_AUTH_TOKEN;
/**
 * 末尾に `/` は無い前提で実装すること
 */
export const WEB_GUI_URL =
  process.env.WEB_GUI_URL || 'https://nameless-housework.github.io/nameless-housework-notification';
export const DB_PATH = `${__dirname}/../../db.json`;

// ambient
export const AM_CH_ID = process.env.AM_CH_ID;
export const AM_READ_KEY = process.env.AM_READ_KEY;
export const AM_WRITE_KEY = process.env.AM_WRITE_KEY;
