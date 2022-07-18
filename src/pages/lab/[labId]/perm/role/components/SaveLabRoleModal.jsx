import React from 'react';
import { Form, Input } from 'antd';
import { reqCreateLabRole, reqUpdateLabRole } from '@/services/LabRoleService';
import SaveRowDataModal from '@/components/modal/SaveRowDataModal';
import { formLayout } from '@/components/modal/BaseFormModal';

const SaveLabRoleModal = (props) => {
  const {
    // 路由参数
    labId,

    // 控制 modal 显示
    visible, setVisible,
    // 刷新数据
    setReload,

    // 数据
    labRole
  } = props;


  const [form] = Form.useForm();

  const generateBody = (values) => {
    const name = values.name;
    const descInfo = values.descInfo;
    return { name, descInfo, labId };
  }

  return (
    <div>
      <SaveRowDataModal title={'实验室角色'} form={form}
                        labId={labId}
                        visible={visible} setVisible={setVisible}
                        setReload={setReload}
                        rowData={labRole} generateBody={generateBody}
                        reqCreate={reqCreateLabRole} reqUpdate={reqUpdateLabRole}
      >
        <Form {...formLayout} initialValues={labRole} form={form}>
          <Form.Item
            label="角色名称"
            name="name"
            rules={[{ required: true, message: '名称不能为空' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="描述信息" name="descInfo">
            <Input />
          </Form.Item>
        </Form>
      </SaveRowDataModal>

    </div>
  );
};

export default SaveLabRoleModal;
