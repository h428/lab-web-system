import React from 'react';
import { Form, Input } from 'antd';
import MyIcon from '@/components/base/MyIcon';

// 邮箱
const EmailFormItem = (props) => {
  let { name, extraRules } = props; // 表单项名称，默认 email

  // 初始化默认值
  if (!name) {
    name = 'email';
  }

  if (!extraRules) {
    extraRules = [];
  }

  return (
    <span>
      <Form.Item
        validateTrigger={['onChange', 'onBlur']}
        name={name}
        rules={[
          {
            required: true,
            message: '邮箱不能为空',
          },
          {
            type: 'email',
            message: '邮箱格式不正确',
          },
          ...extraRules,
        ]}
      >
        <Input placeholder='请输入注册邮箱' size='large' prefix={MyIcon.EMAIL} />
      </Form.Item>
    </span>
  );
};

export default EmailFormItem;
