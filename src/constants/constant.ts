import dotenv from 'dotenv';
dotenv.config();

// system
export const PORT = parseInt(process.env.PORT || '5000');
export const NGROK_AUTH_TOKEN = process.env.NGROK_AUTH_TOKEN;
/**
 * 末尾に `/` は無い前提で実装すること
 */
export const WEB_GUI_URL =
  process.env.WEB_GUI_URL || 'https://nameless-housework.github.io/nameless-housework-notification';
