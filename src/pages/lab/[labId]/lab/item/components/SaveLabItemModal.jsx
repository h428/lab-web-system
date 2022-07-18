import React, { useEffect, useState } from 'react';
import { Form, Input, Switch, Tooltip } from 'antd';
import { reqCreateLabItem, reqUpdateLabItem } from '@/services/LabItemService';
import IntToFloatFormItem from '@/components/html/IntToFloatFormItem';
import LabUtil from '@/utils/LabUtil';
import { PRICE_BASE } from '@/common/LabConfig';
import SaveRowDataModal from '@/components/modal/SaveRowDataModal';
import { formLayout } from '@/components/modal/BaseFormModal';

const SaveLabItemModal = (props) => {
  const {
    // 路由参数
    labId,

    // 控制 modal 显示
    visible, setVisible,
    // 刷新数据
    setReload,

    // 数据
    labItem = {},
  } = props;

  const [form] = Form.useForm();

  const { price, capacity } = labItem;

  // 是否容量品，true 则是，否则为否
  const [hasCapacity, setHasCapacity] = useState(false);
  const [floated, setFloated] = useState(false);


  useEffect(() => {
    setTimeout(() => {
      setHasCapacity(capacity && capacity !== 0);
      setFloated(labItem.floated || false);
    }, 1);
  }, [labItem]);


  const generateBody = (values) => {
    // 准备 body 数据
    const id = labItem.id;
    const name = values.name;
    const engName = values.engName;
    const descInfo = values.descInfo;
    const price = Math.floor(values.priceInput * PRICE_BASE);
    const unit = values.unit;

    // 默认非规则品，容量参数默认值
    let capacity = 0;
    let capacityUnit = '';

    if (hasCapacity) {
      // 是容量品，则设置容量参数
      capacity = LabUtil.floatNumberToInt(values.capacityInput);
      capacityUnit = values.specUnit;
    }

    return  {
      name,
      engName,
      descInfo,
      price,
      unit,
      floated,
      labId,
      capacity,
      capacityUnit,
    };
  }

  return (
    <div>
      <SaveRowDataModal title={'实验室物品'} form={form}
                        labId={labId}
                        visible={visible} setVisible={setVisible}
                        setReload={setReload}
                        rowData={labItem} generateBody={generateBody}
                        reqCreate={reqCreateLabItem} reqUpdate={reqUpdateLabItem}
      >
        <Form {...formLayout} initialValues={labItem} form={form}>
          <Form.Item label="名称" name="name" rules={[{ required: true, message: '名称不能为空' }]}>
            <Input />
          </Form.Item>
          <IntToFloatFormItem label="价格" name="priceInput" value={price}
                              inputProps={{addonAfter: '元'}}
          />
          <Form.Item label="单位" name="unit" rules={[{ required: true, message: '单位不能为空' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="英文名" name="engName">
            <Input />
          </Form.Item>
          <Form.Item label="描述信息" name="descInfo">
            <Input />
          </Form.Item>
          <Form.Item label="是否支持小数操作">
            <Switch checked={floated} onChange={(checked => setFloated(checked))}/>
          </Form.Item>
          <Form.Item label="是否容量品">
            <Switch checked={hasCapacity} onChange={(checked => setHasCapacity(checked))}/>
          </Form.Item>
          {
            !!hasCapacity  && (
              <span>
                <Tooltip title="以酒精为例，每瓶酒精 50 毫升，则容量为 50，容量单位为毫升，瓶则为前面的总单位，最终按瓶入库，按毫升消耗">
                  <IntToFloatFormItem label='容量' name='capacityInput' length={4} value={labItem.capacity}/>
                </Tooltip>
                <Form.Item label="容量单位" name='capacityUnit' rules={[{ required: true, message: '容量单位不能为空' }]}>
                  <Input />
                </Form.Item>
              </span>
            )
          }
        </Form>
      </SaveRowDataModal>
    </div>
  );
};

export default SaveLabItemModal;
