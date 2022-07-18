import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Modal, Space, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import {
  reqDeleteLabUser,
  reqLabUserListByLabId,
} from '@/services/LabUserService';
import UpdateLabUserModal from './components/UpdateLabUserModal';
import AntdUtil from '@/utils/AntdUtil';
import DataWrapper from '@/components/data-table/DataWrapper';
import RouteUtil from '@/utils/RouteUtil';
import DateUtil from '@/utils/DateUtil';

const User = (props) => {
  const labId = RouteUtil.getPathParam(props, 'labId');

  // state
  const [showUpdateLabUserModal, setShowUpdateLabUserModal] = useState(false);
  const [reload, setReload] = useState(0);
  const [currentLabUser, setCurrentLabUser] = useState({});
  const [labUserList, setLabUserList] = useState([]);
  const [dataSource, setDataSource] = useState([]);

  // model
  const { labRoleMap, refreshLabRoleMap, baseUserMap, refreshBaseUserMap } = useModel('CacheModel');

  const doInit = () => {
    useEffect(async () => {
      const labUserList = await reqLabUserListByLabId(labId);
      setLabUserList(labUserList);

      // 级联请求
      const cascadeRequest = () => {
        const labRoleIdList = labUserList.map(labUser => labUser.labRoleId);
        refreshLabRoleMap(labRoleIdList, labId);


        const baseUserIdList = labUserList.map(labUser => labUser.baseUserId);
        refreshBaseUserMap(baseUserIdList);
      };
      cascadeRequest();

    }, [reload]);

    useEffect(() => {

      const getDataSource = () => {
        if (!labUserList) {
          return [];
        }

        // 组装 BaseUser数据
        return labUserList.map((labUser) => {

          const baseUser = baseUserMap.get(labUser.baseUserId) || {};
          labUser.baseUserName = baseUser.username;

          const labRole = labRoleMap.get(labUser.labRoleId) || {};
          labUser.labRoleName = labRole.name;

          return labUser;
        });
      };
      setDataSource(getDataSource());

    }, [labRoleMap, baseUserMap, labUserList]);


  };

  doInit();

  const getCardExtra = () => {
    const onAddClick = (event) => {
      setCurrentLabUser({});
      setShowUpdateLabUserModal(true);
    };

    return (
      <div>
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddClick} size="small" />
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

    const callback = () => {
      setReload(Math.random());
    };

    const onUpdateClick = (record) => {
      setCurrentLabUser(record);
      setShowUpdateLabUserModal(true);
    };

    const onDeleteClick = (record) => {
      Modal.confirm({
        title: (
          <span>
            即将移除实验室用户：<strong>{record.name}</strong>，确认移除？
          </span>
        ),
        onOk: (_) => {
          reqDeleteLabUser(record.id, labId)
          .then(callback);
          return Promise.resolve();
        },
      });
    };

    return [
      {
        title: '已加入用户',
        dataIndex: 'baseUserName',
        key: 'baseUserName',
        align: 'center',
        ...getColumnSearchProps('baseUserName'),
      },
      {
        title: '在本实验室名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        ...getColumnSearchProps('name'),
      },
      {
        title: '所属角色',
        dataIndex: 'labRoleName',
        key: 'labRoleName',
        align: 'center',
        ...getColumnSearchProps('labRoleName'),
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
        title: '操作',
        align: 'center',
        key: 'action',
        render: (text, record) => {
          return (
            <Space size="middle">
              <Button type='primary' size='small'
                      onClick={() => {onUpdateClick(record);}}>修改</Button>
              <Button type='primary' size='small' danger
                      onClick={() => {onDeleteClick(record);}}>删除</Button>
            </Space>
          );
        },
      },
    ];
  };



  return (
    <div>
      <PageHeaderWrapper title={false}>
        <DataWrapper left={<h2>实验室用户列表</h2>}>
          <Table dataSource={dataSource} columns={getColumns()} rowKey="id" />
        </DataWrapper>
      </PageHeaderWrapper>
      <UpdateLabUserModal
        labUser={currentLabUser}
        labId={labId}
        visible={showUpdateLabUserModal}
        setVisible={setShowUpdateLabUserModal}
        setReload={setReload}
      />
    </div>
  );
};

export default User;
