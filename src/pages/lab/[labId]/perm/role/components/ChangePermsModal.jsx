import React, { useEffect, useState } from 'react';
import { message, Modal, Tree } from 'antd';
import { reqUpdateLabRole } from '@/services/LabRoleService';
import ModalFooter from '@/components/modal/ModalFooter';

const ChangePermsModal = (props) => {
  const {
    labId,
    labRole,
    visible, setVisible,
    setReload
  } = props;

  const [checkedKeys, setCheckedKeys] = useState([]);
  const [halfCheckedKeys, setHalfCheckedKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 请求角色的权限信息
    if (labRole.id) {
      const labPerms = labRole.labPerms || '';
      const permList = labPerms.split(',') || [];
      // 遍历 permList 设置 checkedKeys
      const keys = [];
      permList.forEach(perm => {
        if (getParent(perm) != null) {
          keys.push(perm);
        }
      })
      setCheckedKeys(keys);
    }
  }, [labRole]);

  // treeData 理论上应该根据后端数据生成，由于本项目固定，故直接写死
  const treeData = [
    {
      title: '基本操作',
      key: 'op',
      children: [
        { title: '入库', key: 'op:in' },
        { title: '审批贮藏架子申请', key: 'op:confirm-common-apply' },
        { title: '审批购买申请', key: 'op:confirm-buy-apply' },
        { title: '移动架子物品', key: 'op:move' },
      ],
    },
    {
      title: '实验室管理',
      key: 'lab',
      children: [
        { title: '物品管理', key: 'lab:item' },
        { title: '架子管理', key: 'lab:shelf' },
      ],
    },
    {
      title: '权限管理',
      key: 'perm',
      children: [
        { title: '用户管理', key: 'perm:user' },
        { title: '角色管理', key: 'perm:role' },
      ],
    },
    {
      title: '记录单管理',
      key: 'record',
      children: [
        { title: '入库记录', key: 'record:in' },
        { title: '消耗记录', key: 'record:out' },
        { title: '申请/归还记录', key: 'record:apply' },
        { title: '购买申请记录', key: 'record:buy-apply' },
      ],
    },
  ];

  // 计算父节点
  const getParent = (key) => {
    for (const parent of treeData) {
      for (const son of parent.children) {
        if (son.key === key) {
          return parent;
        }
      }
    }
    return null; // 父节点的 paren 为 null
  }

  const onOk = () => {

    const callback = () => {
      message.info('保存成功');
      setReload(Math.random());
      setVisible(false);
    }

    // 组合勾选的叶子或非叶子节点，以及半勾选状态的非叶子节点，即为所有授权节点
    const keys = [...checkedKeys, ...halfCheckedKeys];

    const id = labRole.id;
    const labPerms = keys.join(",");

    const body = {id, labPerms, labId}

    setLoading(true);
    reqUpdateLabRole(body)
      .then(callback)
      .finally(() => setLoading(false));
  };

  const onCancel = () => {
    setVisible(false);
  };

  const onCheck = (checkedKeys, e) => {
    setCheckedKeys(checkedKeys);
    setHalfCheckedKeys(e.halfCheckedKeys);
  }

  return (
    <div>
      <Modal
        title={
          <span>
            修改权限：<strong>{labRole.name}</strong>
          </span>
        }
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        forceRender={true}
        footer={<ModalFooter onCancel={onCancel} onOk={onOk} loading={loading} okName="保存" />}
        destroyOnClose={false}
        getContainer={false}
      >
        <Tree
          checkable={true}
          onCheck={onCheck}
          checkedKeys={checkedKeys}
          defaultExpandAll={true}
          treeData={treeData}
        />
      </Modal>
    </div>
  );
};

export default ChangePermsModal;
