import React, { useEffect } from 'react';
import { Form, Input, Select } from 'antd';
import { reqApply, reqApplyFull, reqOut } from '@/services/OpService';
import IntToFloatFormItem from '@/components/html/IntToFloatFormItem';
import LabUtil from '@/utils/LabUtil';
import { useModel } from 'umi';
import FormModal from '@/components/modal/FormModal';
import { formLayout } from '@/components/modal/BaseFormModal';

const ApplyModal = (props) => {
  const {
    // 必须：控制当前 Modal 是否显示的 bool 类型 state
    visible, setVisible,
    // 必须：展示该 Modal 所需的数据，为某一行库存对象
    labInventory,
    // 必须：用于刷新库存列表的标记函数
    setReload,
    // 必须：路由参数中的 labId，若不传入无法请求当前用户所在实验室的架子
    labId,
  } = props;

  // 辅助数据
  const {
    num, capacityId, capacity,
  } = labInventory;

  const [form] = Form.useForm();

  const { myLabShelfList, refreshMyLabShelfList } = useModel('CurrentModel');

  useEffect(() => {
    // 第一次展示 modal 时加载个人架子列表
    if (visible && !myLabShelfList && labId) {
      refreshMyLabShelfList(labId)
    }
  }, [visible])

  const generateBody = (values) => {
    const id = labInventory.id;
    const toLabShelfId = values.toLabShelfId;
    const num = LabUtil.floatNumberToInt(values.applyNum);
    const opInfo = values.opInfo;

    return {id, toLabShelfId, num, opInfo, labId};
  };

  return (
    <FormModal title="申请库存" form={form} successMessage='申请成功'
               visible={visible} setVisible={setVisible}
               setReload={setReload}
               rowData={labInventory}
               generateBody={generateBody}
               reqMethod={reqApplyFull}
    >
      <Form {...formLayout} initialValues={labInventory} form={form} name="apply">
        <Form.Item label="申请处" name="labShelfName">
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="申请到"
          name="toLabShelfId"
          initialValue={myLabShelfList && myLabShelfList[0] && myLabShelfList[0].id}
        >
          <Select>
            {myLabShelfList &&
            myLabShelfList.map((labShelf) => {
                return (
                  <Select.Option value={labShelf && labShelf.id} key={labShelf.id}>
                    {labShelf && labShelf.name}
                  </Select.Option>
                );
              })}
          </Select>
        </Form.Item>
        <Form.Item label="申请物品" name="labItemName">
          <Input disabled />
        </Form.Item>
        { capacityId !== '0' && (
          <IntToFloatFormItem
            label='容量'
            name='capacityUnitTmp'
            disabled={true}
            value={capacity}
            length={4}
            inputProps={{addonAfter: labInventory.labItemCapacityUnit}}
          />
        )}
        <IntToFloatFormItem
          label="剩余数量"
          name="leftNum"
          value={num}
          disabled={true}
          length={4}
          inputProps={{addonAfter: LabUtil.getLeftUnit(labInventory)}}
        />
        <IntToFloatFormItem
          label="申请数量"
          name="applyNum"
          length={4}
          inputProps={{addonAfter: LabUtil.getLeftUnit(labInventory)}}
          extraRules={[
            {
              validator: (rule, value) => {
                // 判断小数位数
                value = LabUtil.floatNumberToInt(value);

                if (value && value > 0 && value <= num) {
                  return Promise.resolve();
                }

                return Promise.reject('申请数量不得超过剩余数量');
              },
            },
          ]}
        />
        <Form.Item label="申请备注" name="opInfo">
          <Input />
        </Form.Item>
      </Form>
    </FormModal>
  );
};

export default ApplyModal;
