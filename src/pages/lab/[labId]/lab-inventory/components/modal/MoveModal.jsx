import React, { useEffect } from 'react';
import { Form, Input, Select } from 'antd';
import { reqMove } from '@/services/OpService';
import IntToFloatFormItem from '@/components/html/IntToFloatFormItem';
import LabUtil from '@/utils/LabUtil';
import { useModel } from 'umi';
import FormModal from '@/components/modal/FormModal';
import { formLayout } from '@/components/modal/BaseFormModal';

const MoveModal = (props) => {
  const {
    // 控制 Modal 是否展示的 state
    visible, setVisible,
    // 本行数据
    labInventory,
    // 路由参数 labId
    labId,
    // 刷新数据
    setReload
  } = props;

  const { labShelfId, num } = labInventory;
  const [form] = Form.useForm();

  const { currentLabShelfList, refreshCurrentLabShelfList } = useModel('CurrentModel');
  const { labUserMap } = useModel('CacheModel');

  useEffect(() => {

    // 第一次显示 modal 时加载架子列表
    if (visible && !currentLabShelfList) {
      refreshCurrentLabShelfList(labId);
    }

  }, [visible])

  const getToLabShelfList = () => {
    if (!currentLabShelfList) {
      return [];
    }

    return currentLabShelfList.reduce((prev, hubShelf) => {
      // 跳过源架子
      if (hubShelf.id === labShelfId) {
        return prev;
      }
      prev.push(hubShelf);
      return prev;
    }, []);
  };

  const toLabShelfList = getToLabShelfList();


  const generateBody = (values) => {
    const fromLabShelfId = labInventory.labShelfId;
    const toLabShelfId = values.toLabShelfId;
    const labInId = labInventory.labInId;
    const capacityId = labInventory.capacityId;
    const num = LabUtil.floatNumberToInt(values.moveNum);
    const opInfo = values.opInfo;

    return {
      fromLabShelfId,
      toLabShelfId,
      labInId,
      capacityId,
      num,
      opInfo,
      labId,
    };
  };

  return (
    <FormModal title="移动库存" form={form} successMessage='移动成功'
               visible={visible} setVisible={setVisible}
               setReload={setReload}
               rowData={labInventory}
               generateBody={generateBody}
               reqMethod={reqMove}
    >
      <Form {...formLayout} initialValues={labInventory} form={form} name="move">
        <Form.Item label="源架子" name="labShelfName">
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="移动到"
          name="toLabShelfId"
          initialValue={toLabShelfList[0] && toLabShelfList[0].id}
        >
          <Select>
            {toLabShelfList &&
              toLabShelfList.map((labShelf) => {
                const labUserName = labUserMap[labShelf.labUserId] ?
                  '/' + labUserMap[labShelf.labUserId].name : '';
                return (
                  <Select.Option value={labShelf && labShelf.id} key={labShelf.id}>
                    {labShelf && (labShelf.name + labUserName)}
                  </Select.Option>
                );
              })}
          </Select>
        </Form.Item>
        <Form.Item label="归还物品" name="labItemName">
          <Input disabled />
        </Form.Item>
        <IntToFloatFormItem label="剩余数量" name="leftNum" value={num} disabled length={4}/>
        <IntToFloatFormItem
          label="移动数量"
          name="moveNum"
          length={4}
          extraRules={[
            {
              validator: (rule, value) => {
                value = LabUtil.floatNumberToInt(value)
                if (value && value > 0 && value <= num) {
                  return Promise.resolve();
                }
                return Promise.reject('移动数量不得超过剩余数量');
              },
            },
          ]}
        />
        <Form.Item label="移动备注" name="opInfo">
          <Input />
        </Form.Item>
      </Form>
    </FormModal>
  );
};

export default MoveModal;
