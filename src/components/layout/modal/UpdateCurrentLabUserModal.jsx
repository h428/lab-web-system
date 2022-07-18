import React from 'react';
import { Form, Input } from 'antd';
import { reqUpdateCurrentLabUser } from '@/services/LabUserService';
import SaveRowDataModal from '@/components/modal/SaveRowDataModal';
import { formLayout } from '@/components/modal/BaseFormModal';

const UpdateCurrentLabUserModal = (props) => {
  const {

    // 路由参数
    labId,

    // state
    visible, setVisible,
    setReload,

    labUser = {},
  } = props;


  const [form] = Form.useForm();


  const generateBody = (values) => {
    const name = values.name;
    const labId = labUser.labId;
    return { name, labId };
  };

  return (
    <SaveRowDataModal title={'在本实验室的用户信息'} form={form}
                      labId={labId}
                      visible={visible} setVisible={setVisible}
                      setReload={setReload}
                      rowData={labUser} generateBody={generateBody}
                      reqCreate={null} reqUpdate={reqUpdateCurrentLabUser}
    >
      <Form {...formLayout} initialValues={labUser} form={form} name="updateCurrentLabUser">
        <Form.Item label="实验室用户名称" name="name" rules={[{ required: true, message: '名称不能为空' }]}>
          <Input />
        </Form.Item>
      </Form>
    </SaveRowDataModal>
  );
};

export default UpdateCurrentLabUserModal;
