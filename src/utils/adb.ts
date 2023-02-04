import util from 'util';
import { spawn } from 'child_process';
import * as childProcess from 'child_process';
import { wait } from '../utils/wait';
import { WEB_GUI_URL } from '../constants/constant';

const exec = util.promisify(childProcess.exec);
const ADB = 'adb';

export class Adb {
  private deviceId: string;

  async setDeviceIdFromCliRes(): Promise<void> {
    const proc = spawn(ADB, ['devices']);
    this.deviceId = await new Promise((resolve, reject) => {
      proc.stdout.on('data', (data) => {
        resolve(data.toString().split(/\n|\t/)[1]);
      });
      proc.stdout.on('error', (err) => {
        reject(err);
      });
    });
  }

  isActive(): boolean {
    return !!this.deviceId;
  }

  async call(tel: string): Promise<'connected' | 'disconnected'> {
    console.log('calling...');
    const procOfCall = spawn(ADB, [
      '-s',
      this.deviceId,
      'shell',
      'am',
      'start',
      '-a',
      'android.intent.action.CALL',
      '-d',
      `tel:${tel}`,
    ]);
    const resOfCall = await new Promise((resolve, reject) => {
      procOfCall.stdout.on('data', (data) => {
        resolve(data.toString());
      });
      procOfCall.stdout.on('error', (err) => {
        reject(err);
      });
    });
    if (typeof resOfCall !== 'string') {
      throw new Error(`Failed to call. ${resOfCall}`);
    }
    if (!resOfCall.includes('Starting:')) {
      throw new Error(`Failed to call. ${resOfCall}`);
    }

    /**
     * 発信前/着信中: 0
     * 発信中: 4
     * 通話中: 1
     */
    const callingStatus = { val: '0', countOfCheck: 0 };
    while (callingStatus.val !== '1') {
      console.log(`callingStatus.val = ${callingStatus.val}`);
      console.log(`callingStatus.countOfCheck = ${callingStatus.countOfCheck}`);
      const procOfCheckCallingStatus = spawn(ADB, ['shell', 'dumpsys', 'telephony.registry']);
      const resOfCheckCallingStatus = await new Promise((resolve, reject) => {
        procOfCheckCallingStatus.stdout.on('data', (data) => {
          resolve(data.toString());
        });
        procOfCheckCallingStatus.stdout.on('error', (err) => {
          reject(err);
        });
      });
      if (typeof resOfCheckCallingStatus !== 'string') {
        throw new Error(`Failed to check calling status. ${resOfCheckCallingStatus}`);
      }

      const matched = resOfCheckCallingStatus.match(/mForegroundCallState=\d/);
      if (!matched) {
        throw new Error(`Failed to check calling status. ${resOfCheckCallingStatus}`);
      }
      callingStatus.val = matched[0].split('mForegroundCallState=')[1];

      await wait(1000);

      // 10秒待って電話に出なかったら不在ということで通話状況確認を終了する
      if (++callingStatus.countOfCheck === 10) {
        console.log('calling timeout');
        break;
      }
    }

    return callingStatus.val === '1' ? 'connected' : 'disconnected';
  }

  async hangUp() {
    console.log('hanging up...');
    await exec(`${ADB} -s ${this.deviceId} shell input keyevent KEYCODE_ENDCALL`);
  }

  async showQRCodeAtChrome(endpoint: string) {
    console.log(`show qr code... "${WEB_GUI_URL}/qr/?api=${endpoint}"`);
    await exec(`${ADB} -s ${this.deviceId} shell am start "${WEB_GUI_URL}/qr/?api=${endpoint}"`);
  }

  async openChrome() {
    console.log('open chrome...');
    await exec(`${ADB} -s ${this.deviceId} shell am start -n com.android.chrome/com.google.android.apps.chrome.Main`);
  }
}
