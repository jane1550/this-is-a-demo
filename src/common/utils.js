/**
 * Created by haydn.chen on 3/29/2018.
 */
import numeral from 'numeral'
import moment from 'moment'
import {translate, language} from '../i18n'

export const t = translate
export const lang = language

export function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

// Replace all occorrencies of a string in another using RegExp
function _replaceAll (find, replace, str) {
  // Escape find
  find = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1')
  return str.replace(new RegExp(find, 'g'), replace)
}

export function formatString(str, ...values) {
  if (!str) {
    return ''
  }
  var res = str
  for (let i = 0; i < values.length; i++) {
    res = _replaceAll('{' + i + '}', values[i], res)
  }
  return res
}

export function formatNumber(number, format = '0,0[.][00]') {
  return numeral(number).format(format)
}

export function formatDate(date, format = 'YYYY-MM-DD') {
  return moment(date).format(format)
}

export function getToday(format = 'YYYY-MM-DD') {
  return moment(new Date()).format(format)
}

export function getTomorrow(format = 'YYYY-MM-DD') {
  return moment().add(1, 'days').format(format)
}

export function getAgeByBirthday(birthday) {
  return moment().diff(birthday, 'years')
}


export function deepClone(o) {
  if (typeof o === "null") {
    return null
  }
  if (typeof o === "undefined") {
    return undefined
  }
  let no = JSON.parse(JSON.stringify(o))
  return no
}

export function getLabelByValue(options, value) {
  if (options && options.length > 0) {
    for (let option of options) {
      if (option && typeof (option.value) !== "undefined" && option.value == value) {
        return option.label
      } else if (option == value) {
        return option
      }
    }
  }
  return ""
}

export function maskString(value, mask) {
  if (value == null || value == "" || value == undefined) {
    return "";
  }

  var index = mask.indexOf("|");
  var left, regex;

  if (index == -1) {
    left = mask;
    regex = ".";
  } else {
    regex = mask.substr(index + 1, mask.length);
    if ("" == regex || "()" == regex) {
      regex = ".";
    } else {
      regex = "[^" + regex.substr(1, regex.length - 1) + "]";
    }
    left = mask.substr(0, index);
  }

  var maskArray = left.split(":");
  var maskChar = maskArray[0]; // the mask char
  var startEndArray = maskArray[1].split("),");

  for (var i = 0; i < startEndArray.length; i++) {
    var startEnd = startEndArray[i].replace(/[-|(|)]/g, '').split(",");
    var startTemp = parseInt(startEnd[0]);
    var endTemp = startEnd.length > 1 ? parseInt(startEnd[1]) : null;

    var length = value.length;
    var start, end;
    if (startEndArray[i].charAt(0) == '-') {// from end to start
      if (endTemp == null) {
        start = 0;
        end = (length < startTemp) ? 0 : (length - startTemp);
      } else {
        start = (length < endTemp) ? 0 : (length - endTemp);
        end = (length < startTemp) ? 0 : (length - startTemp);
      }
    } else {// from start to end
      if (endTemp == null) {
        start = (length < startTemp) ? length : startTemp;
        end = length;
      } else {
        start = (length < startTemp) ? length : startTemp;
        end = (length < endTemp) ? length : endTemp;
      }
    }
    value = value.substr(0, start)
      + value.substr(start, end - start).replace(/./g, maskChar)
      + value.substr(end, length - end);
  }

  return value;
}

export function getUrlWithAuthParams(url) {
  let currentLocation = url
  if (currentLocation.indexOf('?') < 0 && sessionStorage.getItem('SALES_APP_TENANT_CODE')) {
    currentLocation += '?tenantCode=' + sessionStorage.getItem('SALES_APP_TENANT_CODE')
  } else if (currentLocation.indexOf('tenantCode=') < 0 && sessionStorage.getItem('SALES_APP_TENANT_CODE')) {
    currentLocation += '&tenantCode=' + sessionStorage.getItem('SALES_APP_TENANT_CODE')
  }
  if (currentLocation.indexOf('msg=') < 0 && sessionStorage.getItem('SALES_APP_MSG')) {
    currentLocation += '&msg=' + sessionStorage.getItem('SALES_APP_MSG')
  }
  if (currentLocation.indexOf('sign=') < 0 && sessionStorage.getItem('SALES_APP_SIGN')) {
    currentLocation += '&sign=' + sessionStorage.getItem('SALES_APP_SIGN')
  }
  let langCode = sessionStorage.getItem('SALES_APP_LANGUAGE')
  if (langCode && currentLocation.indexOf('lang=') < 0) {
    currentLocation += '&lang=' + langCode
  }
  return currentLocation
}
