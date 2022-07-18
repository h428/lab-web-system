import React, { useState, useEffect } from 'react';
import styles from './style.less';
import LabAvatarDropdown from '@/components/layout/LabAvatarDropdown';

// 实验室界面的右侧部分
const RightContent = (props) => {
  let className = `${styles.right}  ${styles.dark}`;

  return (
    <div className={className}>
      <LabAvatarDropdown {...props}/>
    </div>
  );
};

export default RightContent;
