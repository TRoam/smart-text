import IntlMessageFormat from 'intl-messageformat';
import {get as getCookie} from 'js-cookie';
import zhCN from '../locale/zh-CN';
import enUS from '../locale/en-US';

const defaultLocale = 'zhCN';
const secondLocale = 'enUS';

const parseLocale = input => {
  if (input === undefined) {
    return defaultLocale;
  }
  let output = input.replace(/_/g, '-');
  if (output.indexOf('-') > -1) {
    const infos = output.split('-');
    output = `${infos[0].toLowerCase()}-${infos[1].toUpperCase()}`;
  }
  if (output.toUpperCase() === 'EN' || output.toUpperCase() === 'EN-US') {
    output = 'en-US';
  }
  if (
    output.toUpperCase() === 'CN' ||
    output.toUpperCase() === 'ZH' ||
    output.toUpperCase() === 'ZH-CN'
  ) {
    output = 'zh-CN';
  }

  return output.replace(/-/g, '');
};

const currentSecoundLocale = locale =>
  locale === defaultLocale ? secondLocale : defaultLocale;

const getQuery = key => new URLSearchParams(location.href).get(key);

const currentMainLocale = () =>
  parseLocale(
    getQuery('locale') ||
      getQuery('lang') ||
      getQuery('language') ||
      getCookie('locale') ||
      getCookie('lang') ||
      (window.localStorage && window.localStorage.getItem('locale')) ||
      (window.localStorage && window.localStorage.getItem('lang')) ||
      (navigator
        ? navigator.language ||
          navigator.browserLanguage ||
          navigator.userLanguage ||
          navigator.systemLanguage ||
          (navigator.languages && navigator.languages[0])
        : defaultLocale)
  );

class I18nBase {
  constructor() {
    this.currentMainLocale = currentMainLocale();
    this.currentSecoundLocale = currentSecoundLocale(this.currentMainLocale);
    this.messages = {enUS, zhCN};
  }

  bundle(key, locale, options, defaultMessage) {
    let msg = this.messages[locale][key];
    if (msg === null) {
      if (defaultMessage != null) {
        return defaultMessage;
      }
      return key;
    }
    if (options) {
      msg = new IntlMessageFormat(msg, locale);
      return msg.format(options);
    }
    return msg;
  }

  get(key, options, defaultMessage) {
    return this.bundle(key, this.currentMainLocale, options, defaultMessage);
  }

  getSecond(key, options, defaultMessage) {
    return this.bundle(key, this.currentSecoundLocale, options, defaultMessage);
  }

  getLocale() {
    return {main: this.currentMainLocale, second: this.currentSecoundLocale};
  }

  localeEN = () => secondLocale;

  localeZH = () => defaultLocale;
}

const I18n = new I18nBase();

export default I18n;
