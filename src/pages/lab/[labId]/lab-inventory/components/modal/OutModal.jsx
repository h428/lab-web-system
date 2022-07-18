import React from 'react';
import { Form, Input } from 'antd';
import { reqOut } from '@/services/OpService';
import IntToFloatFormItem from '@/components/html/IntToFloatFormItem';
import LabUtil from '@/utils/LabUtil';
import FormModal from '@/components/modal/FormModal';
import { formLayout } from '@/components/modal/BaseFormModal';

const OutModal = (props) => {
  const {
    // 必须：控制当前 Modal 是否显示的 bool 类型 state
    visible, setVisible,
    // 必须：展示该 Modal 所需的数据，为某一行库存对象
    labInventory,
    // 必须：用于刷新库存列表的标记函数
    setReload
  } = props;


  // 辅助数据
  const {
    labId, num, capacityId, capacity,
  } = labInventory;
  const [form] = Form.useForm();

  const generateBody = (values) => {
    const id = values.id;
    const num = LabUtil.floatNumberToInt(values.outNum);
    const opInfo = values.opInfo;
    return {id, num, opInfo, labId};
  };

  return (
    <FormModal title="消耗库存" form={form} successMessage='消耗成功'
               visible={visible} setVisible={setVisible}
               setReload={setReload}
               rowData={labInventory}
               generateBody={generateBody}
               reqMethod={reqOut}
    >
      <Form {...formLayout} initialValues={labInventory} form={form} name="out">
        <Form.Item label="库存 id" name="id" hidden={true}>
          <Input disabled />
        </Form.Item>
        <Form.Item label="消耗架子 id" name="labShelfId" hidden={true}>
          <Input disabled />
        </Form.Item>
        <Form.Item label="消耗物品 id" name="labInId" hidden={true}>
          <Input disabled />
        </Form.Item>
        <Form.Item label="消耗架子" name="labShelfName">
          <Input disabled />
        </Form.Item>
        <Form.Item label="消耗物品" name="labItemName">
          <Input disabled />
        </Form.Item>
        { !!capacity && (
          <IntToFloatFormItem
            label='容量'
            name='capacityTmp'
            disabled={true}
            value={capacity}
            length={4}
            inputProps={{addonAfter: labInventory.labItemSpecUnit}}
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
          label="消耗数量"
          name="outNum"
          length={4}
          inputProps={{addonAfter: LabUtil.getOpUnit(labInventory)}}
          extraRules={[
            {
              validator: (rule, value) => {
                // 判断小数位数
                value = LabUtil.floatNumberToInt(value);

                // 判断该行是非库存行
                let maxNum = num;

                if (capacity !== 0 && capacityId === '0') {
                  // 完整容量行
                  maxNum = capacity;
                }

                if (value && value > 0 && value <= maxNum) {
                  return Promise.resolve();
                }

                if (maxNum === capacity) {
                  return Promise.reject('容量品必须逐项消耗，单次消耗数量不得超过容量');
                }

                return Promise.reject('消耗数量不得超过剩余数量');
              },
            },
          ]}
        />
        <Form.Item label="消耗备注" name="opInfo">
          <Input />
        </Form.Item>
      </Form>
    </FormModal>
  );
};

export default OutModal;
