import React, { useState, useEffect } from 'react';
import { Form, Input } from 'antd';

// 类似价格类的 Form.Item 的显示
// 接收整数的价格或者数量，按两位小数转化为对应的小数显示
const IntToFloatFormItem = (props) => {
  const {
    label = '菜单栏', // 该项的含义
    name, // 表单名称
    value = '',
    extraRules = [], // 额外校验规则
    disabled = false,
    inputProps = {},
    length = 2,
  } = props;

  return (
    <Form.Item
      label={label}
      name={name}
      initialValue={value && value / Math.pow(10, length)}
      rules={[
        {
          required: true,
          message: `${label}不能为空`,
        },
        {
          validator: (rule, value) => {
            // 判断小数位数
            value = value + ''; // 确保 value 为 str
            const n = value.split('.')[1]; // 小数部分
            if (n && n.length > length) {
              const str = length === 0 ? '必须为整数' : ('小数点位数最多保留 ' + length + ' 位');
              return Promise.reject(str);
            }

            value = Number(value);
            if (value && value > 0) {
              return Promise.resolve();
            }
            return Promise.reject(`${label}必须为正数`);
          },
        },
        ...extraRules,
      ]}
    >
      <Input type="number" disabled={disabled} {...inputProps} />
    </Form.Item>
  );
};

export default IntToFloatFormItem;
