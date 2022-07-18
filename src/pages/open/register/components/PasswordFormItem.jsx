import React from 'react';
import { Form, Input } from 'antd';
import MyIcon from '@/components/base/MyIcon';

const PasswordFormItem = (props) => {
  const { validatePassword, name, label } = props;

  const realName = name || 'password';

  return (
    <Form.Item
      label={label}
      name={realName}
      rules={[
        { validator: validatePassword }, // 手动校验，调用注册页面提供的校验器
      ]}
    >
      <Input
        placeholder='请输入密码'
        type='password'
        size='large'
        prefix={MyIcon.PASSWORD}
      />
    </Form.Item>
  );
};

export default PasswordFormItem;
