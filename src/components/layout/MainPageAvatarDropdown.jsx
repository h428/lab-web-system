import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, message, Spin } from 'antd';
import React, { useState } from 'react';
import HeaderDropdown from './HeaderDropdown';
import styles from './style.less';
import { useModel } from 'umi';
import BaseUserUpdateModal from '@/components/layout/modal/BaseUserUpdateModal';
import AntdUtil from '@/utils/AntdUtil';
import StorageUtil from '@/utils/StorageUtil';
import RouteUtil from '@/utils/RouteUtil';
import UpdatePasswordModal from '@/components/layout/modal/UpdatePasswordModal';
import { reqLogout } from '@/services/BaseUserService';
import avatar from '@/assets/avatar.svg';
import AntdIcon from '@/components/base/AntdIcon';

const MainPageAvatarDropdown = () => {

  const [showBaseUserModal, setShowBaseUserModal] = useState(false);
  const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);

  const { currentBaseUser } = useModel('CurrentModel');

  const onMenuClick = async (event) => {
    const { key } = event;

    if (key === 'logout') {
      // 执行后端请求
      await reqLogout();
      message.info('退出成功');
      // 移除登录的 token
      StorageUtil.removeLoginResult();
      // 重定向到登录页
      RouteUtil.redirectToLogin();
      return;
    }
    //
    if (key === 'base-user') {
      setShowBaseUserModal(true);
      return;
    }

    if (key === 'update-password') {
      setShowUpdatePasswordModal(true);
      return;
    }

  };


  const menuItems = [
    AntdUtil.generateMenuItem('个人信息', AntdIcon.USER, 'base-user'),
    AntdUtil.generateMenuItem('修改密码', AntdIcon.LOCK, 'update-password'),
    AntdUtil.menuItemDivider,
    AntdUtil.generateMenuItem('退出登录', AntdIcon.LOGOUT, 'logout')
  ];

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick} items={menuItems} />
  );

  return currentBaseUser ? (
    <div>
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action}` }
              style={{ cursor: 'pointer' }}>
          <Avatar size='small' className={styles.avatar} style={{background: '#fff'}}
                  src={avatar} >
          </Avatar>
          &nbsp;&nbsp;
          <span>{currentBaseUser && currentBaseUser['username']}</span>
        </span>
      </HeaderDropdown>
      <BaseUserUpdateModal
        currentBaseUser={currentBaseUser}
        visible={showBaseUserModal}
        setVisible={setShowBaseUserModal}
      />
      <UpdatePasswordModal
        currentBaseUser={currentBaseUser}
        visible={showUpdatePasswordModal}
        setVisible={setShowUpdatePasswordModal}
      />
    </div>
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

export default MainPageAvatarDropdown;
