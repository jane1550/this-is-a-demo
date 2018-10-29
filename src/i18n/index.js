import LocalizedStrings from 'react-localization';
import en from './en';
import zhCN from './zh-CN';

const strings = new LocalizedStrings({
  en,
  "zh-CN": zhCN,
});

export function translate(message, ...args) {
  let trans = strings[message];
  if (!trans || trans === '') {
    trans = message;
  }
  if (args && args.length >= 0) {
    trans = strings.formatString(trans, ...args);
  }
  return trans;
}

export function language(langCode) {
  if (!langCode || !strings.getAvailableLanguages().includes(langCode)) {
    return strings.getLanguage();
  } else {
    strings.setLanguage(langCode);
    return strings.getLanguage();
  }
}
