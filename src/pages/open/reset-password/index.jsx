import React, { useState } from 'react';
import { Button, Form, message, Tabs } from 'antd';
import styles from '../register/index.less';
import PatternUtil from '@/utils/PatternUtil';
import {
  reqExistEmail,
  reqResetPassword,
  reqResetPasswordCaptcha,
} from '@/services/OpenService';
import { history, Link } from 'umi';
import EmailFormItem from '@/pages/open/register/components/EmailFormItem';
import PasswordFormItem
  from '@/pages/open/register/components/PasswordFormItem';
import CaptchaFormItem from '@/pages/open/register/components/CaptchaFormItem';
import WebPage from '@/common/WebPage';
import RouteUtil from '@/utils/RouteUtil';
import PasswordAndConfirmFormItem
  from '@/pages/open/register/components/PasswordAndConfirmFormItem';

const { TabPane } = Tabs;

const ResetPassword = (props) => {
  // 路由参数
  const query = RouteUtil.getQuery(props);

  // 页面数据
  const [count, setCount] = useState(0);

  // 辅助变量
  const [form] = Form.useForm();

  const onFinish = (values) => {
    reqResetPassword(values)
    .then(() => {
      message.info('密码重置成功');
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
          return Promise.resolve(); // 邮箱不合法，不用重复校验，前面校验过了，直接通过
        }

        // 邮箱合法则发送请求校验是否已注册
        const res = await reqExistEmail(email);

        if (!res) {
          return Promise.reject('该邮箱未注册');
        }

        return Promise.resolve();
      },
    },
  ];

  return (
    <div className={styles.main}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="重置密码" key="1">
          <Form form={form} onFinish={onFinish}>
            <EmailFormItem extraRules={extraRules} />

            <PasswordAndConfirmFormItem />

            <CaptchaFormItem
              count={count}
              setCount={setCount}
              form={form}
              sendEmail={reqResetPasswordCaptcha}
            />

            <Form.Item>
              <Button type="primary" size="large" htmlType="submit" className={styles.blockBtn}>
                提交
              </Button>
            </Form.Item>

            <div className={styles.other}>
              <Link to={WebPage.LOGIN + RouteUtil.objectToQuery(query)} className={styles.right}>
                马上登录
              </Link>
            </div>
          </Form>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ResetPassword;
