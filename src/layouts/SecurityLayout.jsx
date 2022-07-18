import React, { useEffect } from 'react';
import { Redirect, useModel } from 'umi';
import StorageUtil from '@/utils/StorageUtil';
import RouteUtil from '@/utils/RouteUtil';

/**
 * 要求登录的 Wrapper 布局文件，主要统一处理本地不存在登录结果时的重定向
 * @param props
 * @returns {JSX.Element|*}
 * @constructor
 */
const SecurityLayout = (props) => {
  const { children } = props;

  const hasLoginResult = !!StorageUtil.getLoginResult();

  if (!hasLoginResult && window.location.pathname !== '/login') {
    return <Redirect to={RouteUtil.getRedirectLoginUrl()} />;
  }

  const { refreshCurrentBaseUser } = useModel('CurrentModel');

  const doInit = () => {
    useEffect(() => {
      refreshCurrentBaseUser();
    }, []);
  };

  doInit();

  return children;
};

export default SecurityLayout;
