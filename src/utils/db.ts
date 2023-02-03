import fs from 'fs';
import { DB_PATH } from '../constants/constant';
import { Configs } from '../@types/db';

export const CONTENTS: Configs = {
  lang: 'jp',
  sensor: {
    d1: {
      active: false,
      about: '',
      threshold: 0,
      over_or_less: '',
    },
    d2: {
      active: false,
      about: '',
      threshold: 0,
      over_or_less: '',
    },
    d3: {
      active: false,
      about: '',
      threshold: 0,
      over_or_less: '',
    },
    d4: {
      active: false,
      about: '',
      threshold: 0,
      over_or_less: '',
    },
    d5: {
      active: false,
      about: '',
      threshold: 0,
      over_or_less: '',
    },
    d6: {
      active: false,
      about: '',
      threshold: 0,
      over_or_less: '',
    },
    d7: {
      active: false,
      about: '',
      threshold: 0,
      over_or_less: '',
    },
    d8: {
      active: false,
      about: '',
      threshold: 0,
      over_or_less: '',
    },
  },
};

export const initFileIfNotExists = () => {
  if (fs.existsSync(DB_PATH)) {
    return;
  }
  fs.appendFileSync(DB_PATH, JSON.stringify(CONTENTS, null, 2));
};

export const reflectFromFile = () => {
  const draft = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  CONTENTS.lang = draft.lang;
  CONTENTS.sensor.d1 = draft.sensor.d1;
  CONTENTS.sensor.d2 = draft.sensor.d2;
  CONTENTS.sensor.d3 = draft.sensor.d3;
  CONTENTS.sensor.d4 = draft.sensor.d4;
  CONTENTS.sensor.d5 = draft.sensor.d5;
  CONTENTS.sensor.d6 = draft.sensor.d6;
  CONTENTS.sensor.d7 = draft.sensor.d7;
  CONTENTS.sensor.d8 = draft.sensor.d8;
};

export const saveToFile = (draft?: Configs) => {
  if (draft) {
    fs.writeFileSync(DB_PATH, JSON.stringify(draft, null, 2));
    return;
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(CONTENTS, null, 2));
};
