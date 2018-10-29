const configDev = {
  bffServiceBase: 'http://210.13.77.92:19600/bff',
  printServiceBase: 'http://172.25.11.219:8082/print/services/rest/reportService',
  needLogin: true,
}

const configSit = {
  // bffServiceBase: 'http://210.13.77.75:16200/bff2',
  bffServiceBase: 'https://sit-li.ebaocloud.com/bff',
  printServiceBase: 'http://210.13.77.78:17600/print/services/rest/reportService',
  needLogin: true,
}

const configUat = {
  bffServiceBase: 'https://eli.ebaocloud.com.cn/bff2',
}

const configProd = {
  bffServiceBase: 'https://li.ebaocloud.com.cn/bff2',
}

let config = __PROD__ ? configProd : __UAT__ ? configUat : __SIT__ ? configSit : configDev
export default config
