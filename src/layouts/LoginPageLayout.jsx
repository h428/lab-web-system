import { getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Link, Helmet } from 'umi';
import React from 'react';
import styles from './LoginPageLayout.less';
import logo from '@/assets/logo.svg';

/**
 * 登录页面的布局组件，可供注册页面、重置密码页面复用
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const LoginPageLayout = (props) => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;

  const { breadcrumb } = getMenuData(routes);

  const title = 'Labmate';

  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name='description' content={title} />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to='/'>
                <img alt='logo' className={styles.logo} src={logo} />
                <span className={styles.title}>Labmate</span>
              </Link>
            </div>
            <div className={styles.desc}>您最贴心的实验室助手！</div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default LoginPageLayout;
