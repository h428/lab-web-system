import React from 'react';
import { Form, Input } from 'antd';
import PasswordFormItem from '@/pages/open/register/components/PasswordFormItem';
import PatternUtil from '@/utils/PatternUtil';
import MyIcon from '@/components/base/MyIcon';

// 密码和确认密码
const PasswordAndConfirmFormItem = (props) => {

  const {
    passwordLabel,
    confirmPasswordLabel
  } = props;


  return (
    <div>
      <PasswordFormItem validatePassword={validatePassword} label={passwordLabel}/>

      <Form.Item
        label={confirmPasswordLabel}
        name='confirmPassword'
        rules={[
          { required: true, message: '确认密码不能为空' },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (getFieldValue('password') !== value) {
                return Promise.reject('两次输入的密码不一致');
              }
              return Promise.resolve();
            },
          }),
        ]}
      >
        <Input
          placeholder='请确认密码'
          size='large'
          type='password'
          prefix={MyIcon.PASSWORD}
        />
      </Form.Item>
    </div>
  );
};

export default PasswordAndConfirmFormItem;

// 手动校验密码
export const validatePassword = (_, value) => {
  const promise = Promise; // 没有值的情况

  // 有值的情况
  if (!value) {
    return Promise.reject('必须输入密码');
  }

  if (!PatternUtil.passwordValid(value)) {
    return Promise.reject(PatternUtil.PASSWORD_ERROR_MESSAGE);
  }

  return promise.resolve();
};
