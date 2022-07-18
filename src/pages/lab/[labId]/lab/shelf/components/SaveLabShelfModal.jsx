import React, { useEffect, useState } from 'react';
import { Form, Input, Select } from 'antd';
import { useModel } from 'umi';
import { reqCreateLabItem, reqUpdateLabItem } from '@/services/LabItemService';
import SaveRowDataModal from '@/components/modal/SaveRowDataModal';
import {
  reqCreateLabShelf,
  reqCreateMyLabShelf, reqUpdateLabShelf, reqUpdateMyLabShelf,
} from '@/services/LabShelfService';
import { formLayout } from '@/components/modal/BaseFormModal';

const SaveLabShelfModal = (props) => {
  const {
    // 传入架子数据
    labShelf,
    // 路由参数 labId
    labId,
    // 控制 modal 展示的 state
    visible, setVisible,
    // 刷新数据
    setReload,
    // 是否个人架子的创建和修改
    my = false
  } = props;

  // const
  const isCreate = !labShelf.id;
  const [form] = Form.useForm();
  const title = my ? '个人架子' : '实验室架子';

  // state
  const [labShelfType, setLabShelfType] = useState(1);

  // model
  const { currentLabUserList, refreshCurrentLabUserList } = useModel('CurrentModel');


  const doInit = () => {

    useEffect(() => {
      // 额外初始化逻辑
      setLabShelfType(labShelf.type);
    }, [labShelf]);

  }

  doInit();

  const generateBody = (values) => {
    const name = values.name;
    const pos = values.pos;
    const type = labShelfType;
    let belongLabUserId = values.labUserId;

    return {
      name,
      pos,
      type,
      belongLabUserId,
      labId,
    };
  }

  const reqCreate = my ? reqCreateMyLabShelf : reqCreateLabShelf;
  const reqUpdate = my ? reqUpdateMyLabShelf : reqUpdateLabShelf;

  const onSelect = (value) => {
    setLabShelfType(value);
    // 当 select 选取个人架子时，加载实验室的所有用户
    if (value === 0 && !currentLabUserList) {
      refreshCurrentLabUserList(labId);
    }
  }

  return (
    <div>
      <SaveRowDataModal title={title} form={form}
                        labId={labId}
                        visible={visible} setVisible={setVisible}
                        setReload={setReload}
                        rowData={labShelf} generateBody={generateBody}
                        reqCreate={reqCreate} reqUpdate={reqUpdate}
      >
        <Form {...formLayout} initialValues={labShelf} form={form}>
          <Form.Item label="名称" name="name" rules={[{ required: true, message: '名称不能为空' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="位置" name="pos">
            <Input />
          </Form.Item>
          {/*是创建架子，且不是用户创建自己架子的情况才展示类型*/}
          {isCreate && !my && (
            <div>
              <Form.Item
                label="类型"
                name="type"
                rules={[{ required: true, message: '类型不能为空' }]}
              >
                <Select onSelect={onSelect}>
                  <Select.Option value={0}>私人架子</Select.Option>
                  <Select.Option value={1}>公共架子</Select.Option>
                  <Select.Option value={2}>贮藏架子</Select.Option>
                </Select>
              </Form.Item>
              {/*如果是私人架子，才展示；如果是用户创建或修改自己的架子，不展示*/}
              {labShelfType === 0 && !my && (
                <Form.Item
                  label="所属用户"
                  name="labUserId"
                  rules={[{ required: true, message: '所属用户不能为空' }]}
                >
                  <Select>
                    {currentLabUserList && currentLabUserList.map((labUser) => (
                        <Select.Option value={labUser.id} key={labUser.id}>
                          {labUser.name}
                        </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
            </div>
          )}
        </Form>
      </SaveRowDataModal>
    </div>
  );
};

export default SaveLabShelfModal;
