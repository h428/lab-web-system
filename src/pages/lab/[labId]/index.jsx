import React from 'react';
import { Redirect } from 'umi';
import { MODULE_LAB_PREFIX } from '@/common/Config';

// 重定向到欢迎页
const Index = (props) => {
  const labId = props.match.params['labId'];

  return (
    <div>
      <Redirect to={`${MODULE_LAB_PREFIX}/${labId}/welcome`} />
    </div>
  );
};

export default Index;
