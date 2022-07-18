import React, { useState, useEffect } from 'react';
import LabLayout from '@/layouts/LabLayout';

// 带菜单栏的布局
const Layout = (props) => {
  const labId = props.match.params['labId'];

  return <LabLayout {...props}> {props.children}</LabLayout>;
};

export default Layout;
