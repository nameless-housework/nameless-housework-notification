import axios from 'axios';
import { Configs, OverOrLess, Lang } from '../../../src/@types/db';

export class Client {
  readonly endpoint: string;

  /**
   * @param {string} endpoint ex: https://xxx.ngrok.io
   */
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async getAll() {
    return (await axios.get<Configs>(`${this.endpoint}/api/notification/config`)).data;
  }

  async updateSensor(ops: {
    name: keyof Configs['sensor'];
    active: boolean;
    about: string;
    threshold: number;
    over_or_less: OverOrLess;
  }) {
    return (
      await axios.put<Configs>(
        `${this.endpoint}/api/notification/config/sensor/${ops.name}/${ops.active}/${ops.threshold}/${ops.over_or_less}/${ops.about}`
      )
    ).data;
  }

  async updateLang(type: Lang) {
    return (await axios.put<Configs>(`${this.endpoint}/api/notification/config/lang/${type}`)).data;
  }
}
