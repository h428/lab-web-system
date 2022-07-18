import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, message, Modal, Space, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import SaveLabRoleModal from './components/SaveLabRoleModal';
// import ChangePermsModal from '@/components/modal/ChangePermsModal';
import DataWrapper from '@/components/data-table/DataWrapper';
import RouteUtil from '@/utils/RouteUtil';
import AntdUtil from '@/utils/AntdUtil';
import { reqDeleteLabRole } from '@/services/LabRoleService';
import DateUtil from '@/utils/DateUtil';
import ChangePermsModal from './components/ChangePermsModal';

const Role = (props) => {
  const labId = RouteUtil.getPathParam(props, 'labId');

  // 页面 state
  const [reload, setReload] = useState(0);
  const [showSaveLabRoleModal, setShowSaveLabRoleModal] = useState(false);
  const [showChangePermModal, setShowChangePermModal] = useState(false);
  const [currentLabRole, setCurrentLabRole] = useState({});
  const { currentLabRoleList, refreshCurrentLabRoleList } = useModel('CurrentModel')

  // Model 数据

  const doInit = () => {
    useEffect(async () => {
      refreshCurrentLabRoleList(labId);
    }, [reload]);
  };

  doInit();

  const getCardExtra = () => {
    const onAddClick = (event) => {
      setCurrentLabRole({});
      setShowSaveLabRoleModal(true);
    };

    return (
      <div>
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddClick} size="small" >
          新建角色
        </Button>
      </div>
    );
  };

  const getColumns = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const getColumnSearchProps = AntdUtil.generateColumnSearchPropsFun(
      searchText,
      setSearchText,
      setSearchedColumn,
    );

    const deleteCallback = () => {
      message.info('删除成功');
      setReload(Math.random);
    };

    const onUpdateClick = (record) => {
      setCurrentLabRole(record);
      setShowSaveLabRoleModal(true);
    };

    const onUpdatePermsClick = (record) => {
      setCurrentLabRole(record);
      setShowChangePermModal(true);
    };

    const onDeleteClick = (record) => {
      Modal.confirm({
        title: (
          <span>
            即将删除角色：<strong>{record.name}</strong>，确认删除？
          </span>
        ),
        onOk: (_) => {
          reqDeleteLabRole(record.id, labId).then(deleteCallback);
          return Promise.resolve();
        },
      });
    };

    return [
      {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        ...getColumnSearchProps('name'),
      },
      {
        title: '描述信息',
        dataIndex: 'descInfo',
        key: 'descInfo',
        align: 'center',
        ...getColumnSearchProps('descInfo'),
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
        sorter: (a, b) => a['createTime'] - b['createTime'],
        defaultSortOrder: 'descend',
        render: (text) => DateUtil.format(new Date(Number(text))),
      },
      {
        title: '修改时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        align: 'center',
        render: (text) => DateUtil.format(new Date(Number(text))),
      },
      {
        title: '操作',
        align: 'center',
        key: 'action',
        render: (text, record) => {
          return (
            <Space size="middle">
              <Button onClick={() => {onUpdateClick(record);}}
                      size='small' type='primary'>修改</Button>
              <Button onClick={() => {onUpdatePermsClick(record);}}
                      size='small' type='primary'>设置权限</Button>
              <Button onClick={() => {onDeleteClick(record);}}
                      size='small'  type='primary' danger>删除</Button>
            </Space>
          );
        },
      },
    ];
  };

  return (
    <div>
      <PageHeaderWrapper title={false}>
        <DataWrapper left={<h2>角色列表</h2>} right={getCardExtra()}>
          <Table dataSource={currentLabRoleList} columns={getColumns()} rowKey="id" />
        </DataWrapper>
      </PageHeaderWrapper>
      <SaveLabRoleModal
        labId={labId}
        labRole={currentLabRole}
        visible={showSaveLabRoleModal}
        setVisible={setShowSaveLabRoleModal}
        setReload={setReload}
      />
      <ChangePermsModal
        labId={labId}
        labRole={currentLabRole}
        visible={showChangePermModal}
        setVisible={setShowChangePermModal}
        setReload={setReload}
      />
    </div>
  );
};

export default Role;
