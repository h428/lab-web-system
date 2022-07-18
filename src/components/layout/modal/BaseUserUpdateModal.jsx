import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Modal, Switch, Tooltip } from 'antd';
import { reqUpdateBaseUser } from '@/services/BaseUserService';
import ModalFooter from '@/components/modal/ModalFooter';
import { reqExistUsername } from '@/services/OpenService';
import { formLayout } from '@/components/modal/BaseFormModal';

// 修改用户基本信息的对话框
const BaseUserUpdateModal = (props) => {
  const { currentBaseUser, visible, setVisible } = props;

  // 页面数据
  const [allowAdd, setAllowAdd] = useState(true);
  const [loading, setLoading] = useState(false);

  // 辅助变量
  const [form] = Form.useForm();

  useEffect(() => {
    setTimeout(() => form.resetFields(), 0);
    if (currentBaseUser) setAllowAdd(currentBaseUser.allowAdd);
  }, [currentBaseUser]);

  const onOk = () => {
    const callback = () => {
      // getCurrentBaseUserDispatch(dispatch);
      setVisible(false);
    };

    form.validateFields().then((values) => {
      let change = false;
      for (const key of Object.keys(values)) {
        if (values[key] === currentBaseUser[key]) {
          delete values[key];
        } else {
          change = true;
        }
      }

      if (change) {
        setLoading(true)
        reqUpdateBaseUser(values).then(callback).finally(() => setLoading(false));
      } else {
        setVisible(false);
      }
    });
  };

  const onCancel = () => {
    setVisible(false);
  };

  return (
    <div>
      <Modal
        title={`个人信息`}
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        forceRender={true}
        footer={<ModalFooter onCancel={onCancel} onOk={onOk} loading={loading} okName="更新" />}
        destroyOnClose={false}
        getContainer={false}
      >
        <Form {...formLayout} initialValues={currentBaseUser} form={form}>
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              { required: true, message: '名称不能为空' },
              {
                validateTrigger: 'onBlur',
                validator: (async (rule, value) => {

                  // 没有变动名称，直接通过
                  if (value === currentBaseUser.username) {
                    return Promise.resolve();
                  }

                  const exi = await reqExistUsername(value);

                  if (exi) {
                    return Promise.reject("该用户名已存在");
                  }

                  return Promise.resolve();
                })
              }
            ]}
          >
            <Input />
          </Form.Item>
          {/*<Form.Item label="姓名" name="name">*/}
          {/*  <Input />*/}
          {/*</Form.Item>*/}
          {/*<Form.Item label="手机" name="phone">*/}
          {/*  <Input />*/}
          {/*</Form.Item>*/}
          {/*<Form.Item label="头像" name="avatar">*/}
          {/*  <Input placeholder='请输入图片的全路径地址，可直接采用网络图片'/>*/}
          {/*</Form.Item>*/}
        </Form>
      </Modal>
    </div>
  );
};

export default BaseUserUpdateModal;
