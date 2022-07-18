import React from 'react';
import LoginPageLayout from '@/layouts/LoginPageLayout';
import { MODULE_LAB_PREFIX } from '@/common/Config';
import SecurityLayout from '@/layouts/SecurityLayout';
import { Redirect } from 'umi';

// 全局布局文件
const GlobalLayout = (props) => {
  const path = props.location.pathname;

  // 对于登录、注册之类的页面，无需登录，采用登录页面的小窗布局
  if (path.startsWith('/open')) {
    return <LoginPageLayout {...props}>{props.children}</LoginPageLayout>;
  }

  // 其他页面需要登录，使用 SecurityLayout 统一处理重定向
  if (path.startsWith(MODULE_LAB_PREFIX) || path.startsWith('/join')) {
    return <SecurityLayout {...props}>{props.children}</SecurityLayout>;
  }

  // 其他页面重定登录后的主页，但 dev 阶段出于测试需要直接放行
  return <Redirect to={MODULE_LAB_PREFIX} />;
  // return (
  //   <div>
  //     {props.children}
  //   </div>
  // );
};

export default GlobalLayout;
