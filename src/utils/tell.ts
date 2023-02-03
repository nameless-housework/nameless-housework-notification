import { spawn } from 'child_process';
import { Lang } from '../@types/db';

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
    const proc = spawn('amixer', ['-c', '1', 'set', 'Speaker', '100%']);
    const EXIT_ZERO = 'exit 0';
    const resOfChangedVolume = await new Promise((resolve, reject) => {
      proc.stdout.on('data', () => {
        resolve(EXIT_ZERO);
      });
      proc.stdout.on('error', (err) => {
        reject(err);
      });
    });
    this.active = resOfChangedVolume === EXIT_ZERO;
  }

  isActive(): boolean {
    return this.active;
  }

  async tellHousework(ops: { lang: Lang; sensorKeys: string[] }) {
    await this.play(`${AUDIO_DIR}/${ops.lang}_hello.wav`);
  }

  private async play(path: string): Promise<void> {
    const proc = spawn('aplay', ['--device="sysdefault:CARD=Device"', path]);
    await new Promise((resolve, reject) => {
      proc.stdout.on('data', (data) => {
        resolve(data);
      });
      proc.stdout.on('error', (err) => {
        reject(err);
      });
    });
  }
}
