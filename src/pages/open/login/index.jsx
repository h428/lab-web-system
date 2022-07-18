import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Form, Tabs } from 'antd';
import styles from '../register/index.less';
import { reqExistEmail, reqLogin } from '@/services/OpenService';
import { Link } from 'umi';
import PatternUtil from '@/utils/PatternUtil';
import StorageUtil from '@/utils/StorageUtil';
import EmailFormItem from '@/pages/open/register/components/EmailFormItem';
import PasswordFormItem
  from '@/pages/open/register/components/PasswordFormItem';
import RouteUtil from '@/utils/RouteUtil';
import WebPage from '@/common/WebPage';

const { TabPane } = Tabs;

const Login = (props) => {

  const query = RouteUtil.getQuery(props);

  // rememberPassword 用于控制 “记住密码 checkbox” 的勾选状态
  const [rememberPassword, setRememberPassword] = useState(false);

  // 辅助变量
  const [form] = Form.useForm();
  // localStorage 中的 loginInfo 为勾选记住密码时的登录信息，
  const loginInfo = StorageUtil.getLoginInfo();

  useEffect(() => {
    // 若本地存储了 loginInfo，表示用户上次勾选了记住密码，则初始化 checkbox 的勾选状态为 true
    if (loginInfo) {
      setRememberPassword(true);
    }
  }, []);

  // 登录表单的提交回调函数，登录表单触发 submit 事件时调用
  const onLoginFormSubmit = async (values) => {
    // 处理记住密码请求
    if (rememberPassword) {
      StorageUtil.setLoginInfo(values);
    } else {
      StorageUtil.removeLoginInfo();
    }

    try {
      // 执行登录请求
      const loginResult = await reqLogin(values.email, values.password)
      // 保存登录结果到本地
      StorageUtil.setLoginResult(loginResult);
      // 重定向到主页面
      RouteUtil.recoverFromLogin();
    } catch (err) {

    }
  };

  // 邮箱输入框额外的校验规则，每个校验对象符合 antd 的表单校验对象的规范
  const emailInputExtraRules = [
    {
      // 邮箱输入框额外做 onBlur 校验，在失焦时通过 ajax 请求提前判断邮箱是否是成功注册的邮箱，
      // 不是则校验失败，不允许登录
      validateTrigger: 'onBlur',
      validator: async (rule, value) => {
        const email = value;
        if (!PatternUtil.emailValid(email)) {
          // 邮箱不合法，不用重复校验，前面校验过了，直接通过，不向后端发送 ajax 请求
          return Promise.resolve();
        }

        // 邮箱合法则发送请求校验是否已注册
        const data = await reqExistEmail(email);

        // ResBean.data 为 false 表示数据库不存在对应邮箱，即邮箱未注册
        if (!data) {
          return Promise.reject('该邮箱未注册');
        }

        return Promise.resolve();
      },
    },
  ];

  return (
    <div className={styles.main}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="邮箱登录" key="1">
          <Form form={form} onFinish={onLoginFormSubmit} initialValues={loginInfo}>
            <EmailFormItem extraRules={emailInputExtraRules} />
            <PasswordFormItem />
            <div className={styles.marginBottom}>
              <Checkbox
                checked={rememberPassword}
                onChange={(e) => setRememberPassword(e.target.checked)}
              >
                记住密码
              </Checkbox>
              <Link className={`${styles.right}`} to={WebPage.RESET_PASSWORD + RouteUtil.objectToQuery(query)}>
                忘记密码
              </Link>
            </div>
            <Form.Item>
              <Button type="primary" size="large" htmlType="submit" className={styles.blockBtn}>
                登录
              </Button>
            </Form.Item>
            <div className={styles.other}>
              <Link to={WebPage.REGISTER + RouteUtil.objectToQuery(query)} className={styles.right}>
                注册账户
              </Link>
            </div>
          </Form>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Login;
