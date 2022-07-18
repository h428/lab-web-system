import React, { useState, useEffect } from 'react';
import { Col, Row, Alert, Form, Input, Select, Button } from 'antd';
import { connect, history } from 'umi';
import { reqLabJoinLinkByLink } from '@/services/LabJoinLinkService';
import { reqJoinLabByLink } from '@/services/LabUserService';
import { MODULE_LAB_PREFIX } from '@/common/Config';
import MainPageLayout from '@/layouts/MainPageLayout';
import RouteUtil from '@/utils/RouteUtil';

const JoinByLink = (props) => {
  // props
  const link = RouteUtil.getPathParam(props, 'link');

  // vars
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };
  const [form] = Form.useForm();

  // state
  const [labJoinLink, setLabJoinLink] = useState({});

  const doInit = () => {
    useEffect(() => {
      // 请求该链接的信息
      reqLabJoinLinkByLink(link)
        .then((resp) => setLabJoinLink(resp));
    }, []);
  };

  doInit();

  const onFinish = (values) => {

    const labUserName = values.labUserName;

    // 请求加入
    reqJoinLabByLink(labJoinLink.labId, link, labUserName).then(() => {
      // 加入成功后刷新数据
      history.push(MODULE_LAB_PREFIX);
    });
  };

  return (
    <MainPageLayout>
      <Row style={{ marginTop: 20 }}>
        <Col span={20} offset={2}>
          {labJoinLink && labJoinLink.id && labJoinLink.id !== '-1' ? (
            <Alert message="链接正确有效，请填写实验室用户名" type="success" />
          ) : (
            <Alert message="链接已过期" type="error" />
          )}
        </Col>
      </Row>
      <Row style={{ marginTop: 30 }}>
        <Col span={20} offset={2}>
          {labJoinLink && labJoinLink.id && labJoinLink.id !== '-1' && (
            <Form {...layout} initialValues={labJoinLink} form={form} onFinish={onFinish}>
              <Form.Item
                label="实验室用户名"
                name="labUserName"
                rules={[{ required: true, message: '实验室用户名不能为空' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="实验室名" name="labName">
                <Input disabled />
              </Form.Item>
              <Form.Item label="授权角色" name="labRoleName">
                <Input disabled />
              </Form.Item>
              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </Form.Item>
            </Form>
          )}
        </Col>
      </Row>
    </MainPageLayout>
  );
};

export default JoinByLink;
