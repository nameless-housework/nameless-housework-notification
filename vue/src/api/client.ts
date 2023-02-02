import axios from 'axios';

type OverOrLess = 'over' | 'less';

export type GetAllRes = {
  lang: 'jp' | 'en';
  sensor: {
    d1: {
      active: boolean;
      about: string;
      threshold: number;
      over_or_less: OverOrLess;
    };
    d2: {
      active: boolean;
      about: string;
      threshold: number;
      over_or_less: OverOrLess;
    };
    d3: {
      active: boolean;
      about: string;
      threshold: number;
      over_or_less: OverOrLess;
    };
    d4: {
      active: boolean;
      about: string;
      threshold: number;
      over_or_less: OverOrLess;
    };
    d5: {
      active: boolean;
      about: string;
      threshold: number;
      over_or_less: OverOrLess;
    };
    d6: {
      active: boolean;
      about: string;
      threshold: number;
      over_or_less: OverOrLess;
    };
    d7: {
      active: boolean;
      about: string;
      threshold: number;
      over_or_less: OverOrLess;
    };
    d8: {
      active: boolean;
      about: string;
      threshold: number;
      over_or_less: OverOrLess;
    };
  };
};

export class Client {
  readonly endpoint: string;

  /**
   * @param {string} endpoint ex: https://xxx.ngrok.io
   */
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async getAll() {
    return (await axios.get<GetAllRes>(`${this.endpoint}/api/notification/config`)).data;
  }

  async updateSensor(ops: {
    name: keyof GetAllRes['sensor'];
    active: boolean;
    about: string;
    threshold: number;
    over_or_less: OverOrLess;
  }) {
    return (
      await axios.put<GetAllRes>(
        `${this.endpoint}'/api/notification/config/sensor/${ops.name}/${ops.active}/:${ops.threshold}/:${ops.over_or_less}/:${ops.about}`
      )
    ).data;
  }
}
