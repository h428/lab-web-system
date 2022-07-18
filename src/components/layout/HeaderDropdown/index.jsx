import { Dropdown } from 'antd';
import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

/**
 * antd 提供的 Header 处头像的下拉选项
 * @param cls
 * @param restProps
 * @returns {JSX.Element}
 * @constructor
 */
const HeaderDropdown = ({ overlayClassName: cls, ...restProps }) => (
  <Dropdown overlayClassName={classNames(styles.container, cls)} {...restProps} />
);

export default HeaderDropdown;
