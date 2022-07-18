import React, { useState, useEffect } from 'react';
import {
  SmileOutlined,
  HeartOutlined,
  DashboardOutlined,
  UnorderedListOutlined,
  SwapRightOutlined,
  DoubleRightOutlined,
  UserOutlined, ArrowRightOutlined, HomeOutlined, LogoutOutlined, LockOutlined,
} from '@ant-design/icons';

const SMILE = <SmileOutlined />;
const HEART = <HeartOutlined />;
const DASHBOARD = <DashboardOutlined />;
const UNORDERED_LIST = <UnorderedListOutlined />;
const SWAP_RIGHT = <SwapRightOutlined />;
const DOUBLE_RIGHT = <DoubleRightOutlined />;
const USER = <UserOutlined />;
const ARROW_RIGHT = <ArrowRightOutlined />;
const HOME = <HomeOutlined />;
const LOGOUT = <LogoutOutlined />;
const LOCK = <LockOutlined />;

/**
 * 基于 AntD 的图标封装的常量，并组成 map
 */
export const AntdIconMap = {
  smile: SMILE,
  heart: HEART,
  dashboard: DASHBOARD,
  unorderedList: UNORDERED_LIST,
  swapRight: SWAP_RIGHT,
  doubleRight: DOUBLE_RIGHT,
  user: USER,
};

const AntdIcon = {
  SMILE,
  HEART,
  DASHBOARD,
  UNORDERED_LIST,
  SWAP_RIGHT,
  DOUBLE_RIGHT,
  USER,
  ARROW_RIGHT,
  HOME,
  LOGOUT,
  LOCK
}

export default AntdIcon;
