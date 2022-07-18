import React, { useEffect } from 'react';
import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
import { Link, Redirect, useModel } from 'umi';
import { MODULE_LAB_PREFIX } from '@/common/Config';
import MenuConfig from '@/common/MenuConfig';
import RightContent from '@/components/layout/RightContent';
import logo from '@/assets/logo.svg';
import PermUtil from '@/utils/PermUtil';
import RouteUtil from '@/utils/RouteUtil';
import WebPage from '@/common/WebPage';

// 页脚：版权信息
const defaultFooterDom = (
  <DefaultFooter
    copyright={
      <span>
        {new Date().getFullYear()} <strong>Labmate</strong>
      </span>
    }
    links={false}
  />
);

const LabLayout = (props) => {
  // 解析 props
  const labId = RouteUtil.getPathParam(props, 'labId');

  // 解析 model 数据
  const {currentLab, refreshCurrentLab, currentLabUser, refreshCurrentLabUser} = useModel('CurrentModel');


  // 辅助数据
  const menuList = MenuConfig.getMenuList(labId);

  // 注意该布局组件为所有页面复用，因此数据请求需要判断避免重复请求
  const doInit = () => {

    useEffect(() => {
      // 请求当前仓库信息
      // 由于该布局为多个页面复用，因此最好判断一下避免切换不同页面时重复加载
      if (!currentLab.id) {
        refreshCurrentLab(labId);
      }

      // 请求当前仓库用户和角色信息
      if (!currentLabUser.id) {
        refreshCurrentLabUser(labId);
      }
    }, []);
  };

  doInit();

  if (!currentLabUser) {
    // currentLabUser 初始时是有空对象的，但若变为 undefined 表示未加入该实验室，需要重定向
    RouteUtil.redirect(WebPage.LAB);
    return '';
  }

  const currentLabRole = currentLabUser.labRole;
  const currentPerms =  currentLabRole.labPerms || '';

  // 处理 MenuList 并处理 icon
  const loopMenu = (menuList) => {
    return menuList.map((item) => {
      // 处理当前 item 的图标，同时递归处理子菜单
      const antdMenuItem = {
        ...item,
        routes: item.children ? loopMenu(item.children) : undefined,
      };
      // 校验当前菜单，具有当前权限才可以
      const itemRes = PermUtil.validate(item.authority, antdMenuItem, currentPerms);
      return itemRes;
    });
  };

  // 在 currentPerms 已经获取到服务器的数据后
  // 若服务器给定的权限列表不包含 own 和 added-in，则表示不该访问该仓库，则跳转到后台首页
  if (currentPerms && !PermUtil.existPerm(currentPerms, ['own', 'added-in'])) {
    return <Redirect to={MODULE_LAB_PREFIX} />;
  }

  return (
    <div>
      <ProLayout logo={logo} title='Labmate'
                 fixSiderbar={true}
                 menuHeaderRender={(logoDom, titleDom) => (
                   <Link to={MODULE_LAB_PREFIX + '/' + labId}>
                     {logoDom}
                     {titleDom}
                   </Link>
                 )}
                 menuItemRender={(menuItemProps, defaultDom) => {
                   if (menuItemProps.isUrl || !menuItemProps.path) {
                     return defaultDom;
                   }
                   return <Link to={menuItemProps.path}>{defaultDom}</Link>;
                 }}
                 breadcrumbRender={(routers = []) => [
                   {
                     path: '/' + labId,
                     breadcrumbName: '首页',
                   },
                   ...routers,
                 ]}
                 itemRender={(route, params, routes, paths) => {
                   const first = routes.indexOf(route) === 0;
                   return first ? (
                     <Link to={route.path}>{route.breadcrumbName}</Link>
                   ) : (
                     <span>{route.breadcrumbName}</span>
                   );
                 }}
                 footerRender={() => defaultFooterDom}
                 menuDataRender={() => loopMenu(menuList)}
                 rightContentRender={() => <RightContent labId={labId}/>}
                 pageTitleRender={(arg1, arg2, item) => {
                   return item.pageName;
                 }}
      >
        {props.children}
      </ProLayout>
    </div>
  );
};

export default LabLayout;

