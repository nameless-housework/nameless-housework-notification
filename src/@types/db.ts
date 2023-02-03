export const LANG = {
  JP: 'jp',
  EN: 'en',
} as const;

export const OVER_OR_LESS = {
  OVER: 'over',
  LESS: 'less',
} as const;

export type OverOrLess = typeof OVER_OR_LESS.OVER | typeof OVER_OR_LESS.LESS | '';
export type Lang = typeof LANG.JP | typeof LANG.EN;

export type Configs = {
  lang: Lang;
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

export type SensorKeys = keyof Configs['sensor'];
