import moment from 'moment';

function format(date, fmt = 'yyyy-MM-dd hh:mm:ss') {
  let o = {
    'M+': date.getMonth() + 1,
    //月份
    'd+': date.getDate(),
    //日
    'h+': date.getHours(),
    //小时
    'm+': date.getMinutes(),
    //分
    's+': date.getSeconds(),
    //秒
    'q+': Math.floor((date.getMonth() + 3) / 3),
    //季度
    S: date.getMilliseconds(), //毫秒
  };

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }

  for (let k of Object.keys(o)) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length),
      );
    }
  }

  return fmt;
}

function formatTimestamp(timestamp, fmt) {
  const time = new Date(Number(timestamp));
  return format(time, fmt);
}

const getFirstDayOfLastMonth = () => {
  return moment().subtract(1, 'months').startOf('month').valueOf()
}

const getLastDayOfThisMonth = () => {
  return moment().endOf('month').valueOf();
}

const getTomorrow = () => {
  return moment().add(1, 'd').valueOf();
}

const getToday = () => {
  return moment().valueOf();
}

const getTodayEnd = () => {
  return moment().startOf('day')
  .add(1, 'd')
  .subtract(10, 'milliseconds')
  .valueOf();
}

export default {
  format,
  formatTimestamp,
  getFirstDayOfLastMonth,
  getLastDayOfThisMonth,
  getTomorrow,
  getToday,
  getTodayEnd
}
