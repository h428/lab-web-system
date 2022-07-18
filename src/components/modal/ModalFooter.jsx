import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import ThrottleButton from '@/components/html/ThrottleButton';

// 对话框的 footer 部分
const ModalFooter = (props) => {
  const { onOk, onCancel, okName = '确认', cancelName = '取消', loading = false } = props;

  return [
    <Button key="cancel" onClick={onCancel}>
      {cancelName}
    </Button>,
    <ThrottleButton key="submit" type="primary" loading={loading} onClick={onOk}>
      {okName}
    </ThrottleButton>,
  ];
};

export default ModalFooter;
