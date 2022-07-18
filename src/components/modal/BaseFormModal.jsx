import React, { useEffect, useState } from 'react';
import { message, Modal } from 'antd';
import ModalFooter from '@/components/modal/ModalFooter';

export const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 },
};

/**
 * 最基础的抽象 FormModal，补充 onOk 逻辑后可用
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const BaseFormModal = (props) => {
  const {
    // title
    title,
    // 表单对应的 Form.useForm() 节点
    form,
    // 子节点，一般是一个 Form，不同的数据有不同的 Form
    children,
    // 确定按钮的文本
    okName = '保存',
    // 确定按钮的回调函数
    onOk,
    // ok 按钮成功后的消息提示字符串
    successMessage,

    // 控制 modal 显示
    visible, setVisible,
    // 控制加载数据
    setReload,

    // 数据和函数
    rowData = {},

    // 子传父函数
    getChildrenProps

  } = props;


  // 数据变化时重置表单值
  useEffect(() => {
    setTimeout(() => {
      if (form) {
        form.resetFields();
      }
    }, 1);
  }, [rowData]);

  // 控制按钮加载状态
  const [loading, setLoading] = useState(false);

  // 修改成功后的回调，关闭窗口并加载数据
  const thenCallback = ({local, message: msg} = {}) => {

    // 如果响应是 ResBean，则使用 ResBean 的 message
    // 否则使用传入的静态 message
    // 若都没有则不弹出
    const showMessage = msg || successMessage;
    if (showMessage) {
      message.info(showMessage)
    }

    // 关闭 modal
    setVisible(false);
    // 重新加载数据
    if (!local && setReload) {
      setReload(Math.random());
    }
  };

  const finallyCallback = () => {
    setLoading(false);
  }

  const onOkReal = () => {
    form.validateFields().then((values) => {
      onOk(values);
    });
  };

  const onCancel = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (getChildrenProps) {
      // 把 thenCallback, finallyCallback 通过函数调用传给父组件
      getChildrenProps({
        thenCallback, finallyCallback,
        setLoading, setVisible
      });
    }
  }, [])

  return (
    <Modal
      forceRender={true}
      visible={visible}
      title={title}
      onOk={onOkReal}
      onCancel={onCancel}
      footer={<ModalFooter onCancel={onCancel} onOk={onOkReal} loading={loading} okName={okName} />}
    >
      {children}
    </Modal>
  );
};

export default BaseFormModal;
