import React, { useState } from 'react';
import ObjectUtil from '@/utils/ObjectUtil';
import BaseFormModal from '@/components/modal/BaseFormModal';

const SaveRowDataModal = (props) => {
  const {
    // title
    title,
    // 表单对应的 Form.useForm() 节点
    form,
    // 子节点，一般是一个 Form，不同的数据有不同的 Form
    children,
    successMessage = '保存成功',

    // 路由参数
    labId,

    // 控制 modal 显示
    visible, setVisible,
    // 刷新数据
    setReload,

    // 数据和函数
    rowData = {},
    generateBody,

    // ajax 方法
    reqCreate,
    reqUpdate,

  } = props;

  // 辅助变量
  const id = rowData.id;
  const isCreate = !rowData.id;
  const [baseFormModalProps, setBaseFormModalProps] = useState({})

  // 获取 BaseFormModal 子组件提供的属性
  const {setLoading, thenCallback, finallyCallback} = baseFormModalProps;

  const onOk = (values) => {
    const body = generateBody(values);

    // 是创建操作
    if (isCreate) {
      setLoading(true);
      reqCreate(body)
        .then(thenCallback)
        .finally(finallyCallback);
      return;
    }


    // 是更新操作，进一步判断是否变更，若所有字段相比 row 都没有变更，表示本次未做更新，无需发送请求
    // 判断过程同时移除未变更字段，避免重复更新
    // 未做变更直接关闭窗口即可
    if (!ObjectUtil.judgeChangedAmdRemoveNotChange(rowData,  body)) {
      const local = true;
      thenCallback({local});
      return;
    }

    // 补充必要数据并执行更新
    body.id = id; // 更新时要提供 id
    body.labId = labId; // labId 被移除了，需要补充用于鉴权
    reqUpdate(body)
    .then(thenCallback)
    .finally(finallyCallback);
  };

  return (
    <div>
      <BaseFormModal title={`${isCreate ? '创建' : '修改'}${title}`} form={form}
                     onOk={onOk} successMessage={successMessage}
                     visible={visible} setVisible={setVisible}
                     rowData={rowData} setReload={setReload}
                     getChildrenProps={(props) => {
                       setBaseFormModalProps(props);
                     }} // 子传父
      >
        {children}
      </BaseFormModal>
    </div>
  );
};

export default SaveRowDataModal;
