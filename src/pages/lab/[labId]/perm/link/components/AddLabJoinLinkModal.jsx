import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Modal, Select } from 'antd';
import { reqAddLabJoinLink } from '@/services/LabJoinLinkService';
import ModalFooter from '@/components/modal/ModalFooter';
import { useModel } from 'umi';

const AddLabJoinLinkModal = (props) => {
  const {
    // 路由参数
    labId,
    // 刷新函数
    setReload,
    // 控制 modal 显示
    visible,
    setVisible,
  } = props;

  const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
  };
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const { currentLabRoleList, refreshCurrentLabRoleList } = useModel('CurrentModel')

  const doInit = () => {
    useEffect(() => {
      if (!currentLabRoleList) {
        refreshCurrentLabRoleList(labId)
      }
    }, []);
  };

  doInit();

  const onOk = () => {
    form.validateFields().then((values) => {
      const callback = () => {
        refreshCurrentLabRoleList(labId);
        setVisible(false);
        setReload(Math.random());
      };

      const labRoleId = values.labRoleId;

      const body = { labRoleId, labId };

      setLoading(true);
      reqAddLabJoinLink(body)
        .then(callback)
        .finally(() => setLoading(false));
    });
  };

  const onCancel = () => {
    setVisible(false);
  };

  return (
    <div>
      <Modal
        title="创建授权链接"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        forceRender={true}
        footer={<ModalFooter onCancel={onCancel} onOk={onOk} loading={loading} okName="创建" />}
        destroyOnClose={false}
        getContainer={false}
      >
        <Form {...layout} form={form}>
          <Form.Item
            label="在本实验室的角色"
            name="labRoleId"
            rules={[{ required: true, message: '在本实验室的角色不能为空' }]}
          >
            <Select>
              {currentLabRoleList &&
                currentLabRoleList.map((labRole) => (
                  <Select.Option value={labRole.id} key={labRole.id}>
                    {labRole.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddLabJoinLinkModal;
