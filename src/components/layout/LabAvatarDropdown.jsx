import { Avatar, Menu, message, Modal, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import HeaderDropdown from './HeaderDropdown';
import styles from './style.less';
import { MODULE_LAB_PREFIX } from '@/common/Config';
import UpdateCurrentLabUserModal
  from '@/components/layout/modal/UpdateCurrentLabUserModal';
import AntdUtil from '@/utils/AntdUtil';
import StorageUtil from '@/utils/StorageUtil';
import SaveLabModal from '@/pages/lab/components/SaveLabModal';
import AntdIcon from '@/components/base/AntdIcon';
import MyIcon from '@/components/base/MyIcon';
import { reqLeaveLab } from '@/services/LabUserService';
import RouteUtil from '@/utils/RouteUtil';
import avatar from '@/assets/avatar.svg';

const LabAvatarDropdown = (props) => {

  const {

    // 路由参数
    labId,

  } = props;

  // state
  const [lab, setLab] = useState({})
  const [reloadLab, setReloadLab] = useState(0);
  const [reloadLabUser, setReloadLabUser] = useState(0);
  const [showUpdateCurrentLabUserModal, setShowUpdateCurrentLabUserModal] = useState(false);
  const [showUpdateCurrentLabModal, setShowUpdateCurrentLabModal] = useState(false);

  // model
  const {
    currentBaseUser,
    currentLab, refreshCurrentLab,
    currentLabUser, refreshCurrentLabUser,
  } = useModel('CurrentModel');

  const {
    refreshLabMap, refreshLabUserMap,
  } = useModel('CacheModel');

  const own = currentLab.belongBaseUserId === currentBaseUser.id;

  const doInit = () => {
    useEffect(() => {
      // 第一次加载不刷新，只有真正变化了才刷新当前用户
      if (!reloadLab) {
        return;
      }

      // 刷新当前实验室信息
      refreshCurrentLab(labId);
      // 同时强制刷新 labMap 中的缓存
      refreshLabMap([labId], labId, true);

    }, [reloadLab]);

    useEffect(() => {
      // 第一次加载不刷新，只有真正变化了才刷新当前用户
      if (!reloadLabUser) {
        return;
      }

      // 刷新当前实验室用户信息
      const labUserId = currentLabUser.id;
      refreshCurrentLabUser(labId);
      // 同时强制刷新 labMap 中的缓存
      refreshLabUserMap([labUserId], labId, true);

    }, [reloadLabUser]);
  };

  doInit();

  const onMenuClick = (event) => {
    const { key } = event;

    if (key === 'logout') {
      // 移除登录的 token
      StorageUtil.removeLoginResult();
      // 重定向到登录页
      RouteUtil.redirectToLogin();
      return;
    }

    if (key === 'edit-lab-user') {
      setShowUpdateCurrentLabUserModal(true);
      return;
    }

    if (key === 'edit-lab') {
      setLab(Object.assign({}, currentLab));
      setShowUpdateCurrentLabModal(true);
      return;
    }

    if (key === 'exit-lab') {
      Modal.confirm({
        title: (
          <span>
            即将退出实验室：<strong>{currentLab.name}</strong> ？
          </span>
        ),
        content: '退出后将无法访问该实验室，确认退出？',
        onOk: () => reqLeaveLab(labId).then(() => {
          message.info('退出成功');
          RouteUtil.push(`${MODULE_LAB_PREFIX}`);
        }),
      });
      return;
    }

    if (key === 'labmate-index') {
      history.replace(MODULE_LAB_PREFIX);
      return;
    }
  };

  const menuItems = [
    AntdUtil.generateMenuItem('编辑信息', AntdIcon.USER, 'edit-lab-user'),
    own && AntdUtil.generateMenuItem('修改实验室', MyIcon.LOGO, 'edit-lab'),
    !own && AntdUtil.generateMenuItem('退出实验室', AntdIcon.LOGOUT, 'exit-lab'),
    AntdUtil.menuItemDivider,
    AntdUtil.generateMenuItem('后台主页', AntdIcon.HOME, 'labmate-index'),
    AntdUtil.menuItemDivider,
    AntdUtil.generateMenuItem('退出登录', AntdIcon.LOGOUT, 'logout'),
  ];

  const menuHeaderDropdown =
    <Menu className={styles.menu} selectedKeys={[]}
          onClick={onMenuClick} items={menuItems} />;

  return currentBaseUser ? (
    <span>
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action}`}>
          <Avatar size='small' className={styles.avatar} style={{background: '#fff'}}
                  src={avatar} >
          </Avatar>
          &nbsp;&nbsp;
          <span>{(currentLabUser && currentLabUser['name'])
          || '未加入'}</span>
        </span>
      </HeaderDropdown>
      <UpdateCurrentLabUserModal labId={labId}
                                 visible={showUpdateCurrentLabUserModal}
                                 setVisible={setShowUpdateCurrentLabUserModal}
                                 setReload={setReloadLabUser}
                                 labUser={currentLabUser}

      />
      <SaveLabModal visible={showUpdateCurrentLabModal}
                    setVisible={setShowUpdateCurrentLabModal}
                    setReload={setReloadLab}
                    lab={lab}
      />
    </span>
  ) : (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size='small'
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );
};

export default LabAvatarDropdown;
