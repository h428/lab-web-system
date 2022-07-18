import React, { useEffect, useState } from 'react';
import { history, Link, useModel } from 'umi';
import { ArrowLeftOutlined, MinusOutlined } from '@ant-design/icons';
import { MODULE_LAB_PREFIX } from '@/common/Config';
import { INT_FLOAT_BASE } from '@/common/LabConfig';
import DateUtil from '@/utils/DateUtil';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import DataWrapper from '@/components/data-table/DataWrapper';
import { Button, Space, Table, DatePicker } from 'antd';
import AntdUtil from '@/utils/AntdUtil';
import styles from './LabOutDataTable.less';
import moment from 'moment';
import GoBackFulTitle from '@/components/other/GoBackFulTitle';
import TimeSearch from '@/components/other/TimeSearch';
const { RangePicker } = DatePicker;

const LabOutDataTable = (props) => {
  const {
    // 路由参数
    pathname,
    labId,
    labItemId,
    labInId,
    labUserId,

    // 控制变量
    myOut = false,

    // state
    loading = false,
    setReload,
    startTime, setStartTime,
    endTime, setEndTime,

    // 数据
    labOutPageBean = { list: []},

  } = props;




  const [dataSource, setDataSource] = useState([]);

  // model
  const {
    labUserMap, refreshLabUserMap,
    labItemMap, refreshLabItemMap,
    labShelfMap, refreshLabShelfMap,
    labInMap, refreshLabInMap,
  } = useModel('CacheModel');

  // help

  // 跳转的 url 前缀
  const prefix = myOut ? `${MODULE_LAB_PREFIX}/${labId}/my/lab-out`:
    `${MODULE_LAB_PREFIX}/${labId}/record/lab-out`;

  const doInit = () => {

    // 级联请求数据
    useEffect(() => {

      const cascadeRequest = (pageBean) => {
        const list = pageBean.list || [];

        const labUserIdList = list.map(r => r.opLabUserId);
        refreshLabUserMap(labUserIdList, labId);

        const labItemIdList = list.map(r => r.labItemId);
        refreshLabItemMap(labItemIdList, labId);

        const labShelfIdList = list.map(r => r.opLabShelfId);
        refreshLabShelfMap(labShelfIdList, labId);
      }

      cascadeRequest(labOutPageBean);

    }, [labOutPageBean]);

    // 组装数据
    useEffect(() => {
      const getDataSource = () => {
        const labOutList = labOutPageBean && labOutPageBean.list || [];

        // 组装数据
        return labOutList.map((cur) => {

          const labOut = Object.assign({}, cur)

          labOut.key = labOut.id;

          // 组装 labItem 数据
          const labItem = labItemMap.get(labOut.labItemId) || {};
          labOut.labItemName = labItem.name;
          labOut.labItemUnit = labItem.unit;
          labOut.labItemCapacity = labItem.capacity;
          labOut.labItemCapacityUnit = labItem.capacityUnit;

          // 组装 labShelf
          const opLabShelf = labShelfMap.get(labOut.opLabShelfId) || {};
          labOut.opLabShelfName = opLabShelf.name;

          // 组装 labUser 数据
          const opLabUser = labUserMap.get(labOut.opLabUserId) || {};
          labOut.opLabUserName = opLabUser.name;

          return labOut;
        });
      };

      const ds = getDataSource();
      setDataSource(ds);
    }, [labOutPageBean, labUserMap, labItemMap, labShelfMap]);

  };

  doInit();

  // 定义 columns
  const getColumns = () => {

    const columns = [
      {
        title: '消耗物品',
        dataIndex: 'labItemName',
        key: 'labItemName',
        align: 'center',
        render: (text, record) => {



          // 使 labItemName 链接化
          const linkLabItemName = (labItemName) => {
            return (
              <Link to={`${prefix}/lab-item-id/${record.labItemId}`}>
                {labItemName}
              </Link>
            );
          }

          // 是 labInIdSuffix 链接化
          const linkLabIdSuffix = (labInIdSuffix) => {
            return (
              <Link to={`${prefix}/lab-in-id/${record.labInId}`}>
                {labInIdSuffix}
              </Link>
            );
          }

          const labItemName = record.labItemName;
          const labInIdSuffix = record.labInId.substr(-6);

          // labItemId 页面，则 labItemName 不加 Link，labInIdSuffix 加 Link
          if (labItemId) {
            return (
              <>{labItemName}/{linkLabIdSuffix(labInIdSuffix)}</>
            );
          }

          // labInId 页面，则 labInIdSuffix 不加 Link，labItemName 加 Link
          if (labInId) {
            return (
              <>{linkLabItemName(labItemName)}/{labInIdSuffix}</>
            );
          }

          // 普通页面，二者都链接化
          return (
            <>{linkLabItemName(labItemName)}/{linkLabIdSuffix(labInIdSuffix)}</>
          );
        },
      },
      {
        title: '消耗架子',
        dataIndex: 'opLabShelfName',
        key: 'opLabShelfName',
        align: 'center',
      },
      {
        title: '容量品标记',
        dataIndex: 'capacityId',
        key: 'capacityId',
        align: 'center',
        render: (text, record) => {
          // 如果是私人消耗记录，直接返回 text
          if (text === '0') {
            return '非容量品';
          }
          return text;
        },
      },
      {
        title: '消耗数量',
        dataIndex: 'num',
        key: 'num',
        align: 'center',
        render: (text, record) => {
          let res = (text / INT_FLOAT_BASE) + ' ';
          if (record.capacityId === '0') {
            // 非容量品
            res += record.labItemUnit;
          } else {
            // 容量品
            res += record.labItemCapacityUnit;
          }
          return res;
        },
      },
      {
        title: '消耗人',
        dataIndex: 'opLabUserName',
        key: 'opLabUserName',
        align: 'center',
        render: (text, record) => {
          // 如果是私人消耗记录，直接返回 text
          if (myOut) {
            return text;
          }

          // 表示具有 hubOut 权限，若是非当前用户的界面，则根据路径判断

          if (labUserId) {
            return text; // 路径已经是根据用户查询，则返回 text
          }

          return (
            <Link to={`${MODULE_LAB_PREFIX}/${labId}/record/lab-out/lab-user-id/${record.opLabUserId}`}>
              {text}
            </Link>
          );
        },
      },
      {
        title: '消耗时间',
        dataIndex: 'opTime',
        key: 'opTime',
        align: 'center',
        sorter: true,
        sortDirections: ['ascend', 'descend', 'ascend'],
        sortOrder: 'descend',
        render: (text) => {
          const date = new Date(Number(text));
          return <span>{DateUtil.format(date)}</span>;
        },
      },
      {
        title: '备注',
        dataIndex: 'opInfo',
        key: 'opInfo',
        align: 'center',
        render: (text) => text ? text : '无',
      },
    ];

    return columns;
  };


  const getTitle = () => {

    // 没有数据或数据未加载，则无法根据数据展示，直接展示通用标题
    if (!dataSource || !dataSource[0]) {
      return <GoBackFulTitle title='消耗记录' />;
    }

    const labOut = dataSource[0];


    if (labItemId) {
      const title = labOut.labItemName + '的消耗记录';
      return <GoBackFulTitle title={title} />;
    }

    if (labInId) {
      return <GoBackFulTitle title={`${labOut.labItemName}/${labOut.labInId.substr(-6)}的消耗记录`} />;
    }

    if (labUserId) {
      return <GoBackFulTitle title={labOut.opLabUserName + '的消耗记录'} />;
    }

    // 无需返回按钮，直接返回
    const t = myOut ? '个人消耗记录' : '实验室消耗记录';
    return (<h2>{t}</h2>);
  };

  const getRight = () => {
    return (
      <TimeSearch startTime={startTime} setStartTime={setStartTime}
                  endTime={endTime} setEndTime={setEndTime}
                  setReload={setReload}
      />
    );
  };


  const pagination = AntdUtil.pageBeanToPagination(labOutPageBean);
  pagination.showSizeChanger = true;

  const onChange = AntdUtil.generateOnPageChange(pathname);

  return (
    <PageHeaderWrapper title={false}>
      <DataWrapper left={getTitle()} right={getRight()}>
        <Table
          dataSource={dataSource}
          columns={getColumns()}
          pagination={pagination}
          loading={loading}
          onChange={onChange}
          // rowClassName={rowClassName}
        />
      </DataWrapper>
    </PageHeaderWrapper>
  );
};

export default LabOutDataTable;
