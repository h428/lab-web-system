import React, { useState } from 'react';
import BaseFormModal from '@/components/modal/BaseFormModal';

/**
 * 在 BaseFormModal 基础上进一步封装的通用 FormModal
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const FormModal = (props) => {
  const {
    // title
    title,
    // 表单对应的 Form.useForm() 节点
    form,
    // 子节点，一般是一个 Form，不同的数据有不同的 Form
    children,
    // ok 按钮成功的消息提示
    successMessage,

    // 控制窗口显示
    visible, setVisible,
    // 刷新数据
    setReload,

    // 数据和函数
    rowData = {},
    generateBody,

    // ajax 方法
    reqMethod,

  } = props;

  // 子传父变量
  const [baseFormModalProps, setBaseFormModalProps] = useState({})

  const onOk = (values) => {

    // 获取 BaseFormModal 子组件提供的属性（子传父）
    const {setLoading, thenCallback, finallyCallback} = baseFormModalProps;

    // 生成请求体
    const body = generateBody(values);

    // 标记加载
    setLoading(true);

    // 开始请求
    reqMethod(body).then(thenCallback).finally(finallyCallback);
  };

  return (
    <BaseFormModal title={title} form={form}
                   onOk={onOk} successMessage={successMessage}
                   visible={visible} setVisible={setVisible}
                   rowData={rowData} setReload={setReload}
                   getChildrenProps={(props) => {
                     setBaseFormModalProps(props);
                   }} // 子传父
    >
      {children}
    </BaseFormModal>
  );
};

export default FormModal;
