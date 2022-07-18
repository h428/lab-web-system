import React, { useEffect } from 'react';
import { Form, Input, Select } from 'antd';
import { reqUpdateLabUser } from '@/services/LabUserService';
import { useModel } from 'umi';
import SaveRowDataModal from '@/components/modal/SaveRowDataModal';

const UpdateLabUserModal = (props) => {

  const {
    // 数据
    labUser,
    // 路由参数
    labId,
    // 控制 modal 显示
    visible, setVisible,
    // 重新加载数据
    setReload
  } = props;

  // constant
  const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
  };
  const [form] = Form.useForm();

  // model
  const { currentLabRoleList, refreshCurrentLabRoleList } = useModel('CurrentModel');


  const doInit = () => {

    useEffect(() => {
      // 第一次展示 Modal 时加载必要数据
      if (visible && !currentLabRoleList) {
        refreshCurrentLabRoleList(labId);
      }
    }, [visible]);
  }

  doInit();


  const generateBody = (values) => {
    const name = values.name;
    const labRoleId = values.labRoleId;
    return { name, labRoleId, labId };
  }

  return (
    <div>
      <SaveRowDataModal title={'实验室成员'} form={form}
                        labId={labId}
                        visible={visible} setVisible={setVisible}
                        setReload={setReload}
                        rowData={labUser} generateBody={generateBody}
                        reqCreate={null} reqUpdate={reqUpdateLabUser}
      >
        <Form {...layout} initialValues={labUser} form={form}>
          <Form.Item
            label="在本实验室的名称"
            name="name"
            rules={[{ required: true, message: '在本实验室的名称不能为空' }]}
          >
            <Input />
          </Form.Item>
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
      </SaveRowDataModal>
    </div>
  );
};

export default UpdateLabUserModal;
