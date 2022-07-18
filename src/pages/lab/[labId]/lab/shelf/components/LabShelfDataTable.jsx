import { PageHeaderWrapper } from '@ant-design/pro-layout';
import DataWrapper from '@/components/data-table/DataWrapper';
import { Button, message, Modal, Table } from 'antd';
import SaveLabShelfModal
  from '@/pages/lab/[labId]/lab/shelf/components/SaveLabShelfModal';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { reqDeleteLabShelf } from '@/services/LabShelfService';
import { PlusOutlined } from '@ant-design/icons';
import LabUtil from '@/utils/LabUtil';
import DateUtil from '@/utils/DateUtil';
import OpButtons from '@/components/other/OpButtons';

const LabShelfDataTable = (props) => {

  const {
    // 架子数据
    labShelfList,
    // 路由参数
    labId,
    // 刷新数据
    setReload,
    // 是否个人架子列表
    my = false
  } = props;

  // const
  const title = my ? '个人架子列表' : '实验室架子列表';


  // state
  const [dataSource, setDataSource] = useState([])
  const [currentLabShelf, setCurrentLabShelf] = useState({});
  const [addUpdateLabShelfModalType, setAddUpdateLabShelfModalType] = useState(0);

  // model
  const { labUserMap, refreshLabUserMap } = useModel('CacheModel');

  // 初始化数据
  const doInit = () => {
    useEffect(async () => {

      if (!labShelfList) {
        return;
      }

      // 级联请求用户信息
      const labUserIdList = labShelfList.map(r => r.belongLabUserId);
      refreshLabUserMap(labUserIdList, labId);

    }, [labShelfList]);


    useEffect(() => {
      // 组装 dataSource 数据
      const getDateSource = () => {

        if (!labShelfList) {
          return [];
        }

        return labShelfList.map(cur => {
          const labShelf = Object.assign({}, cur);

          const labUser = labUserMap.get(labShelf.belongLabUserId) || {};
          labShelf.labUserName = labUser.name || '无';

          return labShelf;
        });
      }

      const ds = getDateSource();
      setDataSource(ds);
    }, [labShelfList, labUserMap])

  };

  doInit();

  const getCardExtra = () => {
    const onAddClick = (event) => {
      setCurrentLabShelf({});
      setAddUpdateLabShelfModalType(1);
    };

    return (
      <div>
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddClick} size="small" >
          新建
        </Button>
      </div>
    );
  };

  // Columns
  const getColumns = () => {

    const onUpdateClick = (record) => {
      setCurrentLabShelf(record);
      setAddUpdateLabShelfModalType(2);
    };

    const onDeleteClick = (record) => {
      const callback = () => {
        setReload(Math.random());
        message.info('删除成功');
      };
      Modal.confirm({
        title: (
          <span>您正在删除架子：<strong>{record.name}</strong>，确定删除？</span>
        ),
        onOk: () => reqDeleteLabShelf(record.id, labId).then(callback),
      });
    };

    const onQrCodeClick = (record) => {
      message.info('即将推出，敬请期待！');
    };

    return [
      {
        title: '架子名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: '位置',
        dataIndex: 'pos',
        key: 'pos',
        align: 'center',
      },
      {
        title: '架子类型',
        dataIndex: 'type',
        key: 'type',
        align: 'center',
        render: (text) => {
          return LabUtil.getLabShelfType(text);
        },
      },
      {
        title: '所属用户',
        dataIndex: 'labUserName',
        key: 'labUserName',
        align: 'center',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
        render: (text) => DateUtil.format(new Date(Number(text))),
      },
      {
        title: '操作',
        align: 'center',
        key: 'action',
        render: (text, record) => (
          <OpButtons>
            <Button type="primary" size='small'
                    onClick={() => {onUpdateClick(record);}}>
              修改
            </Button>
            <Button type="primary" size='small' danger
                    onClick={() => {onDeleteClick(record);}}>
              删除
            </Button>
            <Button type="primary" size='small'
                    onClick={() => {onQrCodeClick(record);}}>
              二维码
            </Button>
          </OpButtons>
        ),
      },
    ];
  };

  return (
    <div>
      <PageHeaderWrapper title={false}>
        <DataWrapper left={<h2>{title}</h2>} right={getCardExtra()}>
          <Table dataSource={dataSource} columns={getColumns()} rowKey="id" />
        </DataWrapper>
      </PageHeaderWrapper>
      <SaveLabShelfModal
        labId={labId}
        labShelf={currentLabShelf}
        visible={addUpdateLabShelfModalType}
        setVisible={setAddUpdateLabShelfModalType}
        setReload={setReload}
        my={my}
      />
    </div>
  );
};

export default LabShelfDataTable;
