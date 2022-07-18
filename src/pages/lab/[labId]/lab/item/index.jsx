import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, message, Modal, Switch, Table } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import SaveLabItemModal from './components/SaveLabItemModal';
import { PERM_LAB_ITEM, PERM_OP_IN } from '@/common/MenuConfig';
import InModal from './components/InModal';
import {
  reqDeleteLabItem,
  reqLabItemListByLabId,
} from '@/services/LabItemService';
import DataWrapper from '@/components/data-table/DataWrapper';
import OpButtons from '@/components/other/OpButtons';
import DateUtil from '@/utils/DateUtil';
import PermUtil from '@/utils/PermUtil';
import { INT_FLOAT_BASE } from '@/common/LabConfig';
import RouteUtil from '@/utils/RouteUtil';
import { useModel } from 'umi';

const Item = (props) => {

  const labId = RouteUtil.getPathParam(props, 'labId')


  // reload 控制刷新数据
  const [reload, setReload] = useState(0);

  // 控制 InModal  的展示
  const [showLabItemModal, setShowLabItemModal] = useState(false);

  const [showInModal, setShowInModal] = useState(false);

  // 表格额外列描述
  const [showExtraCols, setShowExtraCols] = useState(false);

  // 表格数据源
  const [dataSource, setDataSource] = useState([]);

  // 当前选定的数据行
  const [currentLabItem, setCurrentLabItem] = useState({});

  // 控制上传 Modal 的展示
  const [showUploadModal, setShowUploadModal] = useState(false);

  // 当前实验室用户
  const { currentLabUser } = useModel('CurrentModel');

  // 辅助变量，当前实验室用户权限
  const currentLabPerms = currentLabUser.labRole.labPerms;

  const doInit = () => {
    useEffect(async () => {
      // 请求 labItem 数据
      // getHubItemListDispatch(dispatch, labId);
      const ds = await reqLabItemListByLabId(labId)
      setDataSource(ds);
    }, [reload]);
  };
  doInit();

  const getCardExtra = () => {
    const onAddClick = () => {
      setCurrentLabItem({});
      setShowLabItemModal(true);
    };

    const onUploadClick = () => {
      message.info('待重构');
      setShowUploadModal(true);
    }

    return (
      <div>
        <Switch
          checked={showExtraCols}
          size="small"
          onChange={(checked) => {
            setShowExtraCols(!showExtraCols);
          }}
        />{' '}
        &nbsp;
        <Button type="primary" icon={<PlusOutlined/>} onClick={onAddClick} size="small">新建</Button>
        &nbsp;
        <Button
          icon={<UploadOutlined/>}
          style={{ display: 'inline-block' }}
          size="small"
          onClick={onUploadClick}
        >
          上传
        </Button>

      </div>
    );
  };

  const getTitle = () => {
    return <h2>实验室物品列表</h2>;
  };

  // 辅助变量

  const getColumns = () => {
    const onUpdateClick = (labItem) => {
      setCurrentLabItem(labItem);
      setShowLabItemModal(true);
    };
    const onDeleteClick = (labItem) => {
      const callback = () => {
        message.info('删除成功');
        setReload(Math.random);
      };
      Modal.confirm({
        title: (
          <span>
            正在删除 <strong>{labItem.name}</strong>，确认删除？
          </span>
        ),
        onOk: () => reqDeleteLabItem(labItem.id, labId).then(callback),
      });
    };
    const onInClick = (hubItem) => {
      setCurrentLabItem(hubItem);
      setShowInModal(true);
    };

    const extraColumns = showExtraCols
      ? [
        {
          title: '容量',
          dataIndex: 'capacity',
          key: 'capacity',
          align: 'center',
          render: (text) => {
            if (text === 0) {
              return '非容量品';
            }
            return text / INT_FLOAT_BASE;
          },
        },
        {
          title: '容量单位',
          dataIndex: 'capacityUnit',
          key: 'capacityUnit',
          align: 'center',
          render: (text, record) => {
            if (record.capacityUnit === 0) {
              return '非容量品';
            }
            return text;
          },
        },
        {
          title: '英文名',
          dataIndex: 'engName',
          key: 'engName',
          align: 'center',
        },
        {
          title: '描述信息',
          dataIndex: 'descInfo',
          key: 'descInfo',
          align: 'center',
        },
      ]
      : [];

    return [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
        align: 'center',
        render: (value) => value / 100,
      },
      {
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
        align: 'center',
      },
      ...extraColumns,
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
        render: (text) => {
          return DateUtil.format(new Date(Number(text)));
        },
      },
      {
        title: '操作',
        align: 'center',
        key: 'action',
        render: (text, record) => (
          <OpButtons>
            {
              PermUtil.hasPerm(currentLabPerms, PERM_LAB_ITEM) && (
                <Button size='small' type="primary" onClick={() => {onUpdateClick(record);}}>
                  修改
                </Button>)
            }
            {
              PermUtil.hasPerm(currentLabPerms, PERM_LAB_ITEM) && (
                <Button size='small' type="primary" danger onClick={() => {onDeleteClick(record);}}>
                  删除
                </Button>)
            }
            {
              PermUtil.hasPerm(currentLabPerms, PERM_OP_IN) && (
                <Button size='small' type="primary" onClick={() => {onInClick(record);}}>
                  入库
                </Button>)
            }
          </OpButtons>
        )
      },
    ];
  };


  return (
    <div>
      <PageHeaderWrapper title={false}>
        <DataWrapper left={getTitle()} right={getCardExtra()}>
          <Table dataSource={dataSource} columns={getColumns()} rowKey="id"/>
        </DataWrapper>
      </PageHeaderWrapper>
      <SaveLabItemModal
        labItem={currentLabItem}
        setReload={setReload}
        labId={labId}
        visible={showLabItemModal} setVisible={setShowLabItemModal}
      />
      <InModal
        labItem={currentLabItem}
        visible={showInModal}
        setVisible={setShowInModal}
        setReload={setReload}
        labId={labId}
      />
      {/*<UploadHubItemModal*/}
      {/*  dispatch={dispatch}*/}
      {/*  showUploadModal={showUploadModal}*/}
      {/*  setShowUploadModal={setShowUploadModal}*/}
      {/*  labId={labId}*/}
      {/*/>*/}
    </div>
  );
};

export default Item;
