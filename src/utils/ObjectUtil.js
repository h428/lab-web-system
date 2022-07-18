

/**
 * 以 to 的属性做判断，是否发生变化
 * @param from
 * @param to
 * @returns {boolean}
 */
const change = (from, to) => {
  let change = false;
  for (const key of Object.keys(to)) {
    if (from[key] !== to[key]) {
      change = true;
      break;
    }
  }
  return change;
}

/**
 * 以 to 的属性做判断，移除未改变的字段
 * @param from
 * @param to
 * @returns {boolean}
 */
const judgeChangedAmdRemoveNotChange = (from, to) => {
  let change = false;
  for (const key of Object.keys(to)) {
    if (from[key] !== to[key]) {
      change = true;
      continue;
    }
    // 删除 to 中未发生改变的字段
    delete to[key];
  }
  return change;
}


export default {
  change,
  judgeChangedAmdRemoveNotChange
}
