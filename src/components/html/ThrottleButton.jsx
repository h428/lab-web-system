import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import _ from 'lodash';

const ThrottleButton = (props) => {
  const {
    children,
    onClick,
    ms = 1000, // 默认 1000 毫秒
  } = props;

  const onClickThrottle = _.throttle(() => {
    onClick();
  }, ms);

  return (
    <Button {...props} onClick={onClickThrottle}>
      {children}
    </Button>
  );
};

export default ThrottleButton;
