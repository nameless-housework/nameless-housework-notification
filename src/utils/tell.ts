import util from 'util';
import * as childProcess from 'child_process';
import { Lang } from '../@types/db';

const exec = util.promisify(childProcess.exec);
const AUDIO_DIR = `${__dirname}/../../audio`;

export class Tell {
  private active: boolean;

  /**
   * USB Audio Device が接続されている前提で作られているのでその確認
   * スマホにスピーカの音を直接聞かせる仕組みなので音量は最大にする
   */
  async checkDeviceAndChangeVolumeToMax() {
    // linux で開発している方々には申し訳ないがこのメソッドは本番(Raspberry Pi)の時だけ動いてほしいので以下のようにする *Mac 等の開発機で動作確認できない
    if (process.platform !== 'linux') {
      return;
    }
    const resOfAmixer = await exec('amixer -c 1 set Speaker 100%');
    this.active = !!resOfAmixer.stdout;
  }

  isActive(): boolean {
    return this.active;
  }

  async tellHousework(ops: { lang: Lang; sensorKeys: string[] }) {
    console.log('telling...');
    await this.play(`${AUDIO_DIR}/${ops.lang}_hello.wav`);
    for (const sensorKey of ops.sensorKeys) {
      await this.play(`${AUDIO_DIR}/${ops.lang}_${sensorKey.split('')[1]}.wav`);
      await this.play(`${AUDIO_DIR}/${ops.lang}_while.wav`);
    }
    await this.play(`${AUDIO_DIR}/${ops.lang}_end.wav`);
  }

  private async play(path: string): Promise<void> {
    console.log(`play... ${path}`);
    await exec(`aplay --device="sysdefault:CARD=Device" ${path}`);
  }
}
