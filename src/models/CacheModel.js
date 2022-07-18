import { useCallback, useEffect, useState } from 'react';
import {
  reqBaseUserListByIds,
  reqCurrentBaseUser,
} from '@/services/BaseUserService';
import { reqLabListByIds } from '@/services/LabService';
import { reqLabUserListByIds } from '@/services/LabUserService';
import { reqLabRoleListByIds } from '@/services/LabRoleService';
import { reqLabItemListByIds } from '@/services/LabItemService';
import { reqLabShelfListByIds } from '@/services/LabShelfService';
import { reqLabInListByIds } from '@/services/LabInService';

/**
 * 使用已有的数据列表更新数据 map
 * @param dataMap 数据 map，例如 labMap, labUserMap, labRoleMap 等
 * @param setDataMap map 对应的设置函数
 * @param dataList 已有的数据，每一个元素必须带 id，根据其 id 做 map 更新
 */
const refreshLabMapLocal = (dataMap, setDataMap, dataList) => {

  if (!dataList || dataList.length <= 0) {
    return;
  }

  for (let i = 0; i < dataList.length; i++) {
    dataMap.set(dataList[i].id, dataList[i]);
  }
  const newMap = new Map(dataMap.entries());
  // 刷新 dataMap 以触发 dom 数据的刷新
  setDataMap(newMap);
};

/**
 * 通用的刷新某个数据 map 的方法
 * @param dataMap 数据 map，例如 labMap, labUserMap, labRoleMap 等
 * @param setDataMap map 对应的设置函数
 * @param reqMethod 请求方法，其入参 idList，为根据 idList 请求对应的多条记录，返回列表
 * @param idList 入参 idList
 * @param forceUpdate 是否强制更新，是的话则即使 map 已有对应 id 数据，还是会发起指定 id
 *                    的数据请求，否则不会发起请求
 * @returns {Promise<void>}
 */
const refreshMap = async (dataMap, setDataMap, reqMethod, idList, labId, forceUpdate) => {

  // idList 为空，直接结束
  if (!idList) {
    return;
  }

  // 过滤掉 idList 中的重复 id；以及已经在 dataMap 中有值的 id（若是 forceUpdate 则不过滤）
  idList = idList.reduce((prev, cur) => {
    // 过滤掉 id 为 0 的数据，一般表示公共架子或公共用户无需请求
    if (cur !== '0' && prev.indexOf(cur) === -1 && (forceUpdate || !dataMap.has(cur))) {
      prev.push(cur);
    }
    return prev;
  }, []);

  // 根据 idList 触发更新请求
  if (idList && idList.length > 0) {
    // 请求和 idList 对应的 dataList
    const dataList = await reqMethod(idList, labId);
    refreshLabMapLocal(dataMap, setDataMap, dataList);
  }
};

/**
 * 缓存模型，以 labMap 举例：
 *
 *  1， 每类缓存都是一个 Map，key 为数据的 id，值即为对应的对象；
 *  2. labMap 可以通过由 ajax 接口 reqByIds 向后端接口请求数据获得；（即 r1 方法）,
 *  注意所有的 reqByIds 方法都必须是一个 ajax 接口，且接收 id 数组 ids 为参数并返回数据数组；
 *  3. 也可以直接使用 dataList(每个 data 必须含有 id 字段) 遍历并做缓存；（即 r2 方法）
 *
 *  故以 labMap 为例，其返回的数组结构为：[labMap, refreshLabMap, refreshLabMapLocal]
 *  1. labMap 即缓存了 lab 数据的 map，key 为 lab.id，值为 lab 对象；
 *  2. refreshLabMap(idList, forceUpdate) 为基于 reqLabListByIds 接口生成的方法，
 *  其可以根据 labIdList 请求服务端数据刷 labMap
 *  forceUpdate 作用：默认情况下，对于传递进来的 idList 做了剔除，若 labMap 中已经有某一 id
 *  对应的数据了，则不会向服务器请求该 id 对应的数据；若传入 forceUpdate = true，则表示需要强
 *  制更新，即使 labMap 中已经有数据了，也会想服务端请求最新数据并更新 labMap
 *  3. refreshLabMapLocal 即直接提供 labList 数组对象刷新 labMap，要求 labList 中的每一
 *  各 lab 都必须带有 lab.id 属性
 *
 *
 *  其中 refreshMap 和 refreshMapLocal 对所有 map 逻辑都一致，故在上面提供了通用
 *  方法，直接提供对应的 map 并调用即可；本函数的 r1, r2 即调用通用的 refreshMap 和
 *  refreshMapLocal 方法作为实现，并返回
 *
 * @param reqByIds 请求方法
 * @returns [] 一个数组，按顺序为：缓存数据 map，http 请求刷新方法，本地数据刷新方法
 */
const generateCache = (reqByIds) => {
  const [map, setMap] = useState(new Map());
  const r1 = useCallback(async (idList, labId, forceUpdate = false) => {
    await refreshMap(map, setMap, reqByIds, idList, labId, forceUpdate);
  }, []);

  const r2 = useCallback((dataList) => {
    refreshLabMapLocal(map, setMap, dataList);
  }, []);

  return [map, r1, r2];
};

const CacheModel = () => {

  const [labMap, refreshLabMap, refreshLabMapWithDataList] = generateCache(reqLabListByIds);
  const [labUserMap, refreshLabUserMap, refreshLabUserMapLocal] = generateCache(reqLabUserListByIds);
  const [labRoleMap, refreshLabRoleMap, refreshLabRoleMapLocal] = generateCache(reqLabRoleListByIds);
  const [labItemMap, refreshLabItemMap, refreshLabItemMapLocal] = generateCache(reqLabItemListByIds);
  const [labShelfMap, refreshLabShelfMap, refreshLabShelfMapLocal] = generateCache(reqLabShelfListByIds);
  const [labInMap, refreshLabInMap, refreshLabInMapLocal] = generateCache(reqLabInListByIds);
  const [baseUserMap, refreshBaseUserMap, refreshBaseUserMapLocal] = generateCache(reqBaseUserListByIds);

  return {
    labMap, refreshLabMap, refreshLabMapWithDataList,
    labUserMap, refreshLabUserMap, refreshLabUserMapLocal,
    labRoleMap, refreshLabRoleMap, refreshLabRoleMapLocal,
    labItemMap, refreshLabItemMap, refreshLabItemMapLocal,
    labShelfMap, refreshLabShelfMap, refreshLabShelfMapLocal,
    labInMap, refreshLabInMap, refreshLabInMapLocal,
    baseUserMap, refreshBaseUserMap, refreshBaseUserMapLocal,
  };

};

export default CacheModel;
