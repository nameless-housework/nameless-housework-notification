import fs from 'fs';
import { DB_PATH } from '../constants/constant';

export const CONTENTS = {
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
};

export const CONTENT_NAMES = Object.keys(CONTENTS);

export const COMPARISON = {
  OVER: 'over',
  LESS: 'less',
} as const;

export const initFileIfNotExists = () => {
  if (fs.existsSync(DB_PATH)) {
    return;
  }
  fs.appendFileSync(DB_PATH, JSON.stringify(CONTENTS, null, 2));
};

export const reflectFromFile = () => {
  const draft = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  CONTENTS.d1 = draft.d1;
  CONTENTS.d2 = draft.d2;
  CONTENTS.d3 = draft.d3;
  CONTENTS.d4 = draft.d4;
  CONTENTS.d5 = draft.d5;
  CONTENTS.d6 = draft.d6;
  CONTENTS.d7 = draft.d7;
  CONTENTS.d8 = draft.d8;
};

export const saveToFile = (draft?: typeof CONTENTS) => {
  if (draft) {
    fs.writeFileSync(DB_PATH, JSON.stringify(draft, null, 2));
    return;
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(CONTENTS, null, 2));
};
