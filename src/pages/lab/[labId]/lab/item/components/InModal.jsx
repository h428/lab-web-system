import React, { useState, useEffect } from 'react';
import { Form, Input, message, Modal, Select } from 'antd';
import { reqIn } from '@/services/OpService';
import ModalFooter from '@/components/modal/ModalFooter';
import IntToFloatFormItem from '@/components/html/IntToFloatFormItem';
import LabUtil from '@/utils/LabUtil';
import { useModel } from 'umi';

const InModal = (props) => {
  const {
    // 本行数据
    labItem = {},
    // 控制 Modal 是否显示的 state
    visible, setVisible,
    // 路由参数 labId
    labId
  } = props;


  // 辅助数据
  const [form] = Form.useForm();
  const { price, unit } = labItem;
  const [loading, setLoading] = useState(false);

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  const { currentLabShelfList, refreshCurrentLabShelfList, } = useModel('CurrentModel');

  useEffect(() => {
    if (!currentLabShelfList && labId) {
      refreshCurrentLabShelfList(labId)
    }
  }, [])

  useEffect(() => {
    form.resetFields();
  }, [labItem]);

  const callback = () => {
    message.info('入库成功');
    setVisible(false);
  };

  const onOk = () => {
    form.validateFields().then((values) => {
      setLoading(true);
      const labShelfId = values.labShelfId;
      const labItemId = labItem.id;
      const num = LabUtil.floatNumberToInt(values.num);
      const price = LabUtil.floatPriceToInt(values.inPrice);
      const opInfo = values.opInfo;

      const body = {labId, labShelfId, labItemId, num, price, opInfo};

      reqIn(body)
        .then(callback)
        .finally(() => {
          setLoading(false);
        });
    });
  };
  const onCancel = () => {
    setVisible(false);
  };

  return (
    <Modal
      forceRender={true}
      visible={visible}
      title="入库"
      onOk={onOk}
      onCancel={onCancel}
      footer={<ModalFooter onCancel={onCancel} onOk={onOk} loading={loading} okName="入库" />}
    >
      <Form {...layout} initialValues={labItem} form={form} name="in">
        <Form.Item label="物品名称" name="name">
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="入库到哪个架子"
          name="labShelfId"
          initialValue={currentLabShelfList && currentLabShelfList[0] && currentLabShelfList[0].id}
          rules={[
            {
              required: true,
              message: '入库架子不能为空',
            },
          ]}
        >
          <Select>
            {currentLabShelfList &&
              currentLabShelfList.map((labShelf) => {
                return (
                  <Select.Option value={labShelf && labShelf.id} key={labShelf.id}>
                    {labShelf && labShelf.name}
                  </Select.Option>
                );
              })}
          </Select>
        </Form.Item>
        <IntToFloatFormItem label="物品原价" name="itemPrice" value={price} disabled={true} />
        <IntToFloatFormItem label="入库价格" name="inPrice" value={price} />
        <IntToFloatFormItem label="入库数量" name="num" length={4} inputProps={{addonAfter: unit}}/>
        <Form.Item label="入库备注" name="opInfo">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default InModal;
