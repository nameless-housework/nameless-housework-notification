import dotenv from 'dotenv';
dotenv.config();

// system
export const PORT = parseInt(process.env.PORT || '5000');
export const NGROK_AUTH_TOKEN = process.env.NGROK_AUTH_TOKEN;
