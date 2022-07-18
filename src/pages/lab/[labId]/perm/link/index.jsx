import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Modal, Space, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import AddLabJoinLinkModal from './components/AddLabJoinLinkModal';
import { reqDeleteLabJoinLink, reqLabJoinLinkList } from '@/services/LabJoinLinkService';
import {
  MODULE_LAB_PREFIX,
  SYSTEM_DOMAIN,
  SYSTEM_PREFIX,
} from '@/common/Config';
import CommonUtil from '@/utils/CommonUtil';
import AntdUtil from '@/utils/AntdUtil';
import DataWrapper from '@/components/data-table/DataWrapper';
import RouteUtil from '@/utils/RouteUtil';
import { useModel } from 'umi';

const LabJoinLink = (props) => {
  const labId = RouteUtil.getPathParam(props, 'labId');

  // 页面 state 数据
  const [reload, setReload] = useState(0);
  const [showAddLabJoinLinkModal, setShowAddLabJoinLinkModal] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [labJoinLinkList, setLabJoinLinkList] = useState([]);

  // model
  const { labRoleMap, refreshLabRoleMap } = useModel('CacheModel');

  const doInit = () => {
    useEffect(async () => {
      const labJoinLinkList = await reqLabJoinLinkList(labId);
      setLabJoinLinkList(labJoinLinkList);

      // 级联请求数据
      const cascadeRequest = () => {
        const labRoleIdList = labJoinLinkList.map(r => r.labRoleId);
        refreshLabRoleMap(labRoleIdList, labId);
      };
      cascadeRequest();

    }, [reload]);

    useEffect(() => {
      const getDataSource = () => {
        return labJoinLinkList.map(cur => {
          const labJoinLink = Object.assign({}, cur);

          const labRole = labRoleMap.get(labJoinLink.labRoleId) || {};

          labJoinLink.labRoleName = labRole.name || '';

          return labJoinLink;
        });
      }
      setDataSource(getDataSource());
    }, [labJoinLinkList, labRoleMap])
  };

  doInit();

  const getCardExtra = () => {
    const onAddClick = (event) => {
      setShowAddLabJoinLinkModal(true);
    };

    return (
      <div>
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddClick} size="small" >
          创建授权链接
        </Button>
      </div>
    );
  };

  const getColumns = () => {

    const onDeleteClick = (record) => {
      Modal.confirm({
        title: (
          <span>
            即将删除链接：<strong>{record.link}</strong>，确认删除？
          </span>
        ),
        onOk: () => {
          reqDeleteLabJoinLink(record.id)
            .then(() => setReload(Math.random()));
        },
      });
    };

    return [
      {
        title: '链接',
        dataIndex: 'link',
        key: 'link',
        align: 'center',
        render: (text) => {
          const fullLink = SYSTEM_DOMAIN + '/join/' + text;

          return (
            <span>
              {fullLink} &nbsp;&nbsp;
              <Button
                size="small"
                onClick={() => {
                  CommonUtil.copyToClip(fullLink);
                }}
              >
                复制
              </Button>
            </span>
          );
        },
      },
      {
        title: '分配角色',
        dataIndex: 'labRoleName',
        key: 'labRoleName',
        align: 'center',
      },
      {
        title: '操作',
        align: 'center',
        key: 'action',
        render: (text, record) => {
          return (
            <Space size="middle">
              <a onClick={() => { onDeleteClick(record); }}>
                删除
              </a>
            </Space>
          );
        },
      },
    ];
  };

  return (
    <div>
      <PageHeaderWrapper title={false}>
        <DataWrapper left={<h2>授权链接列表</h2>} right={getCardExtra()}>
          <Table dataSource={dataSource} columns={getColumns()} rowKey="id" />
        </DataWrapper>
      </PageHeaderWrapper>
      <AddLabJoinLinkModal
        labId={labId}
        visible={showAddLabJoinLinkModal}
        setVisible={setShowAddLabJoinLinkModal}
        setReload={setReload}
      />
    </div>
  );
};

export default LabJoinLink;
