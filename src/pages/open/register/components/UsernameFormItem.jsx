import React from 'react';
import PatternUtil from '@/utils/PatternUtil';
import { reqExistUsername } from '@/services/OpenService';
import { Form, Input } from 'antd';
import AntdIcon from '@/components/base/AntdIcon';

const UserNameFormItem = (props) => {
  let { name } = props;
  if (!name) {
    name = 'username';
  }

  return (
    <Form.Item
      name={name}
      validateTrigger={['onChange', 'onBlur']}
      rules={[
        {
          required: true,
          message: '用户名不能为空',
        },
        {
          pattern: PatternUtil.USERNAME_PATTERN,
          message: PatternUtil.USERNAME_ERROR_MESSAGE,
        },
        {
          validateTrigger: 'onBlur',
          validator: async (rule, value) => {
            const username = value;
            if (!PatternUtil.usernameValid(username)) {
              return Promise.resolve(); // 用户名不合法，不用重复校验，前面校验过了，直接通过
            }

            // 邮箱合法则发送请求校验是否已注册
            const res = await reqExistUsername(username);

            if (res) {
              return Promise.reject('该用户名已存在');
            }

            return Promise.resolve();
          },
        },
      ]}
    >
      <Input size='large' placeholder='请输入用户名' prefix={AntdIcon.USER} />
    </Form.Item>
  );
};

export default UserNameFormItem;
