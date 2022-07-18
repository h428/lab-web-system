import React from 'react';
import { Button, Col, Form, Input, Row } from 'antd';
import styles from '@/pages/open/register/index.less';
import MyIcon from '@/components/base/MyIcon';

const CaptchaFormItem = (props) => {
  // 要求提供的参数
  let { count, setCount, form, emailName, sendEmail } = props;

  if (!emailName) {
    emailName = 'email';
  }

  let interval;

  const onGetCaptchaClick = () => {
    form.validateFields([emailName]).then((values) => {
      let c = 59;
      setCount(c);

      interval = setInterval(() => {
        c -= 1;
        setCount(c);

        if (c === 0) {
          clearInterval(interval);
        }
      }, 1000);

      // 发送邮件，要求提供发送邮件的请求函数
      if (sendEmail) {
        sendEmail(values[emailName]);
      }
    });
  };

  return (
    <Form.Item name='captcha' rules={[{ required: true, message: '验证码不能为空' }]}>
      <Row gutter={8}>
        <Col span={16}>
          <Input placeholder='验证码' size='large' prefix={MyIcon.SECURITY} />
        </Col>
        <Col span={8}>
          <Button
            size='large'
            className={styles.blockBtn}
            onClick={onGetCaptchaClick}
            disabled={!!count}
          >
            {count === 0 ? '发送' : `${count} S`}
          </Button>
        </Col>
      </Row>
    </Form.Item>
  );
};

export default CaptchaFormItem;
