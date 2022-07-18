// 根据 hubApplyBackList 从各个 map 中组装数据
import React, { useState } from 'react';
import { Tooltip } from 'antd';
import styles from '@/assets/css/main.less';
import {
  INT_FLOAT_BASE,
  LabShelfTypeMap,
  PRICE_BASE,
} from '@/common/LabConfig';
import { PERM_LAB_ITEM } from '@/common/MenuConfig';



const getLeftUnit = (row) => {
  if (!row) return '';

  if (row.capacityId !== '0') {
    return row.labItemSpecUnit;
  }

  return row.labItemUnit;
}

const getOpUnit = (row) => {

  if (!row) return '';

  if (row.capacity !== 0) {
    return row.labItemCapacityUnit;
  }

  return row.labItemUnit;
}

const getRecordUnit = (labApplyVO) => {

  if (!labApplyVO) return '';

  if (labApplyVO.labItemCapacity !== 0) {
    return labApplyVO.labItemCapacityUnit;
  }

  return labApplyVO.labItemUnit;
}

const getLabShelfType = (type) => {
  const val = LabShelfTypeMap.get(type);
  if (val === null) {
    return '未知类型';
  }
  return val;
}

const getGroupOrderStatus = (status) => {
  switch (status) {
    case 0:
      return '进行中';
    case 1:
      return '已完成';
    case 2:
      return '已取消';
    default:
      return '未知类型';
  }
}

const getGroupOrderItemStatus = (status) => {
  switch (status) {
    case 0:
      return '待确认';
    case 1:
      return '已确认';
    case 2:
      return '已取消';
    case 3:
      return '已拒绝';
    default:
      return '未知类型';
  }
}


const floatPriceToInt = (num) => {
  num = Number(num) * PRICE_BASE;
  return Math.floor(num);
}

const floatNumberToInt = (num) => {
  num = Number(num) * INT_FLOAT_BASE;
  return Math.floor(num);
}

export default {
  floatPriceToInt,
  floatNumberToInt,
  getLeftUnit,
  getOpUnit,
  getRecordUnit,
  getLabShelfType,
}
