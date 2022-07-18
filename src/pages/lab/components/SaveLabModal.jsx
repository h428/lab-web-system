import React from 'react';
import { Form, Input } from 'antd';
import { reqCreateLab, reqUpdateLab } from '@/services/LabService';
import { formLayout } from '@/components/modal/BaseFormModal';
import SaveRowDataModal from '@/components/modal/SaveRowDataModal';

const SaveLabModal = (props) => {

  const {
    // state
    visible, setVisible,
    setReload,

    // 数据
    lab = {}

  } = props;

  const [form] = Form.useForm();

  const generateBody = (values) => {

    const id = lab.id;
    const name = values.name;
    const descInfo = values.descInfo;

    return {id, name, descInfo};
  };

  const successMessage = lab.id ? '修改成功' : '创建成功';

  return (
    <SaveRowDataModal title={'实验室'} form={form} successMessage={successMessage}
                      visible={visible} setVisible={setVisible}
                      setReload={setReload}
                      rowData={lab} generateBody={generateBody}
                      reqCreate={reqCreateLab} reqUpdate={reqUpdateLab}
    >
      <Form {...formLayout} initialValues={lab} form={form} name='saveLab'>
        <Form.Item label='实验室名称' name='name' rules={[{ required: true, message: '名称不能为空' }]}>
          <Input />
        </Form.Item>
        <Form.Item label='描述信息' name='descInfo'>
          <Input />
        </Form.Item>
      </Form>
    </SaveRowDataModal>
  );
};

export default SaveLabModal;
