import React, { useState } from 'react';
import { Button, Form, message, Tabs } from 'antd';
import styles from './index.less';
import {
  reqExistEmail,
  reqRegister,
  reqRegisterCaptcha,
} from '@/services/OpenService';

import { Link } from 'umi';
import EmailFormItem from '@/pages/open/register/components/EmailFormItem';
import UserNameFormItem
  from '@/pages/open/register/components/UsernameFormItem';
import PasswordAndConfirmFormItem
  from '@/pages/open/register/components/PasswordAndConfirmFormItem';
import CaptchaFormItem from '@/pages/open/register/components/CaptchaFormItem';
import PatternUtil from '@/utils/PatternUtil';
import RouteUtil from '@/utils/RouteUtil';
import WebPage from '@/common/WebPage';

const { TabPane } = Tabs;

const Register = (props) => {
  // 页面数据
  const [count, setCount] = useState(0);
  const query = RouteUtil.getQuery(props);

  // 辅助变量
  const [form] = Form.useForm();

  const onFinish = (values) => {
    // 最好同时传递 query 中的 redirect 参数
    reqRegister(values).then(() => {
      message.info('注册成功');
      RouteUtil.redirect(WebPage.LOGIN, query);
    });
  };

  // 额外的校验规则
  const extraRules = [
    {
      validateTrigger: 'onBlur',
      validator: async (rule, value) => {
        const email = value;
        if (!PatternUtil.emailValid(email)) {
          return Promise.resolve('邮箱合法'); // 邮箱不合法，不用重复校验，前面校验过了，直接通过
        }

        // 邮箱合法则发送请求校验是否已注册
        const res = await reqExistEmail(email);

        if (res) {
          return Promise.reject('该邮箱已注册');
        }

        return Promise.resolve('邮箱合法');
      },
    },
  ];

  return (
    <div className={styles.main}>
      <Tabs defaultActiveKey='1'>
        <TabPane tab='用户注册' key='1'>
          <Form form={form} onFinish={onFinish}>
            <EmailFormItem extraRules={extraRules} />
            <UserNameFormItem />
            <PasswordAndConfirmFormItem />
            <CaptchaFormItem
              count={count}
              setCount={setCount}
              form={form}
              sendEmail={reqRegisterCaptcha}
            />
            <Form.Item>
              <Button type='primary' size='large' htmlType='submit'
                      className={styles.blockBtn}>
                注册
              </Button>
            </Form.Item>
            <div className={styles.other}>
              <div className={styles.right}>
                <span>已有账号？</span>
                <Link to={WebPage.LOGIN + RouteUtil.objectToQuery(query)} className={styles.right}>登录</Link>
              </div>
            </div>
          </Form>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Register;
