import React, { useEffect, useState } from 'react';
import { Table, Tooltip } from 'antd';
import { INT_FLOAT_BASE, PRICE_BASE } from '@/common/LabConfig';
import { useModel, Link } from 'umi';
import DateUtil from '@/utils/DateUtil';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import DataWrapper from '@/components/data-table/DataWrapper';
import AntdUtil from '@/utils/AntdUtil';
import GoBackFulTitle from '@/components/other/GoBackFulTitle';
import { MODULE_LAB_PREFIX } from '@/common/Config';
import TimeSearch from '@/components/other/TimeSearch';

const LabInDataTable = (props) => {
  const {
    title,

    // 路由参数
    labId,
    labItemId,
    pathname,

    // state
    startTime, setStartTime,
    endTime, setEndTime,
    setReload,

    // 数据
    labInPageBean = { list: [] },
  } = props;

  // state
  const [dataSource, setDataSource] = useState([]);

  // 解析各个 model 中的数据
  const {
    labUserMap, refreshLabUserMap,
    labItemMap, refreshLabItemMap,
    labShelfMap, refreshLabShelfMap,
  } = useModel('CacheModel');

  const doInit = () => {

    // 级联请求数据
    useEffect(() => {

      const cascadeRequest = (pageBean) => {
        const labInList = (pageBean && pageBean.list) || [];

        const labItemIdList = labInList.map(r => r.labItemId);
        refreshLabItemMap(labItemIdList, labId);

        const labShelfIdList = labInList.map(r => r.opLabShelfId);
        refreshLabShelfMap(labShelfIdList, labId);

        const labUserIdList = labInList.map(r => r.opLabUserId);
        refreshLabUserMap(labUserIdList, labId);
      };

      cascadeRequest(labInPageBean);

    }, [labInPageBean]);

    // 组装数据
    useEffect(() => {

      const getDataSource = () => {

        const list = labInPageBean.list || [];

        // 组装各个 map 的数据
        return list.map((cur) => {

          const labIn = Object.assign({}, cur);

          labIn.key = labIn.id;

          const { labItemId, opLabShelfId, opLabUserId } = labIn;

          // 组装 labItem 数据
          const labItem = labItemMap.get(labItemId) || {};
          labIn['labItemName'] = labItem.name;
          labIn['labItemPrice'] = labItem.price;
          labIn['labItemUnit'] = labItem.unit;

          // 组装 labShelf 数据
          const labShelf = labShelfMap.get(opLabShelfId) || {};
          labIn.opLabShelfName = labShelf.name;

          // 组装 labUser 数据
          const labUser = labUserMap.get(opLabUserId) || {};
          labIn.opLabUserName = labUser.name;

          return labIn;
        });
      };

      const ds = getDataSource();
      setDataSource(ds);

    }, [labInPageBean, labUserMap, labItemMap, labShelfMap]);


  };

  doInit();

  // 定义 columns
  const getColumns = () => {
    return [
      {
        title: (
          <span>
            <Tooltip title='即入库到哪个架子'>
              入库架子&nbsp;<a>?</a>
            </Tooltip>
          </span>
        ),
        dataIndex: 'opLabShelfName',
        key: 'opLabShelfName',
        align: 'center',
      },
      {
        title: '入库物品',
        dataIndex: 'labItemName',
        key: 'labItemName',
        align: 'center',
        render: (text, record) => {

          if (record.labItemId === labItemId) {
            return text + '/' + record.id.substr(-6);
          }

          return (
            <>
              <Link to={`${MODULE_LAB_PREFIX}/${labId}/record/lab-in/lab-item-id/${record.labItemId}`} >{text}</Link>
              /{record.id.substr(-6)}
            </>
          )
        },
      },
      {
        title: '入库数量',
        dataIndex: 'num',
        key: 'num',
        align: 'center',
        render: (text, record) => {
          return text / INT_FLOAT_BASE + ' ' + record.labItemUnit;
        },
      },
      {
        title: '入库价格',
        dataIndex: 'price',
        key: 'price',
        align: 'center',
        render: (text) => text / PRICE_BASE,
      },
      {
        title: '入库时间',
        dataIndex: 'opTime',
        key: 'opTime',
        align: 'center',
        sorter: true,
        sortDirections: ['ascend', 'descend', 'ascend'],
        sortOrder: 'descend',
        render: (text) => DateUtil.format(new Date(Number(text))),
      },
      {
        title: '操作人',
        dataIndex: 'opLabUserName',
        key: 'opLabUserName',
        align: 'center',
      },
      {
        title: '备注',
        dataIndex: 'opInfo',
        key: 'opInfo',
        align: 'center',
        render: (text) => text ? text : '无',
      },
    ];
  };

  const getTitle = () => {
    if (title) {
      return title;
    }

    // 非具体物品页面，无需后退按钮，直接返回即可
    if (!labItemId) {
      return (<h2>入库记录</h2>);
    }

    // 否则为指定物品的入库页面，根据物品信息展示标题，同时提供返回按钮

    const labIn = dataSource && dataSource[0];

    // 若数据还未加载或还没有数据，使用默认值
    if (!labIn) {
      return <GoBackFulTitle title={'入库记录'} />;
    }

    // 需要细致展示，同时需要返回按钮
    return <GoBackFulTitle title={labIn.labItemName + '的入库记录'} />;
  };

  const getRight = () => {
    return (
      <TimeSearch startTime={startTime} setStartTime={setStartTime}
                  endTime={endTime} setEndTime={setEndTime}
                  setReload={setReload}
      />
    );
  };

  const pagination = AntdUtil.pageBeanToPagination(labInPageBean);
  const onChange = AntdUtil.generateOnPageChange(pathname);

  return (
    <div>
      <PageHeaderWrapper title={false}>
        <DataWrapper left={getTitle()} right={getRight()}>
          <Table dataSource={dataSource}
                 columns={getColumns()}
                 pagination={pagination}
                 onChange={onChange}
          />
        </DataWrapper>
      </PageHeaderWrapper>
    </div>
  );
};

export default LabInDataTable;
