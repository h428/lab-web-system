import React, { useEffect, useState } from 'react';
import { Button, message, Space, Table, Tooltip } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import LabUtil from '@/utils/LabUtil';
import DataWrapper from '@/components/data-table/DataWrapper';
import { INT_FLOAT_BASE } from '@/common/LabConfig';
import styles from './LabApplyDataTable.less';
import DateUtil from '@/utils/DateUtil';
import { Link, useModel } from 'umi';
import AntdUtil from '@/utils/AntdUtil';
import { LabApplyStatusEnum } from '@/common/LabEnum';
import { SYSTEM_LAB_USER_ID } from '@/common/LabConstant';
import { reqConfirm } from '@/services/OpService';
import { MODULE_LAB_PREFIX } from '@/common/Config';
import GoBackFulTitle from '@/components/other/GoBackFulTitle';
import TimeSearch from '@/components/other/TimeSearch';
import AntdIcon from '@/components/base/AntdIcon';

const LabApplyDataTable = (props) => {
  const {
    // html 相关变量
    title,

    // 路由参数
    labId,
    labItemId,
    labInId,
    fromLabUserId,
    toLabUserId,
    pathname,


    // 控制变量
    showOp = false, // 控制是否展示操作按钮列
    myApply= false, // 是否个人申请页，从而控制物品和 labInId 的链接化

    // state
    startTime, setStartTime,
    endTime, setEndTime,

    // 刷新数据
    setReload,

    // 数据
    labApplyPageBean = { list: []},
  } = props;


  // 右上角部分数据
  const {
    labUserMap, refreshLabUserMap,
    labItemMap, refreshLabItemMap,
    labShelfMap, refreshLabShelfMap,
    labInMap, refreshLabInMap,
  } = useModel('CacheModel');

  // state
  const [dataSource, setDataSource] = useState([]);



  const doInit = () => {

    useEffect(() => {
      // 级联请求关联数据
      const cascadeRequest = (pageBean) => {
        const labApplyList = pageBean.list || [];

        const labUserIdList = labApplyList.reduce((prev, cur) => {
          prev.push(cur.fromLabUserId);
          prev.push(cur.toLabUserId);
          prev.push(cur.confirmLabUserId);
          return prev;
        }, []);
        refreshLabUserMap(labUserIdList, labId);

        const labShelfIdList = labApplyList.reduce((prev, cur) => {
          prev.push(cur.fromLabShelfId);
          prev.push(cur.toLabShelfId);
          return prev;
        }, []);
        refreshLabShelfMap(labShelfIdList, labId);

        const labItemIdList = labApplyList.map(r => r.labItemId);
        refreshLabItemMap(labItemIdList, labId);

        const labInIdList = labApplyList.map(r => r.labInId);
        refreshLabInMap(labInIdList, labId);
      }

      cascadeRequest(labApplyPageBean);

    }, [labApplyPageBean]);


    const getDataSource = () => {
      const labApplyList = labApplyPageBean.list;

      if (!labApplyList) {
        return [];
      }

      return labApplyList.map(cur => {

        const labApply = Object.assign({}, cur)

        labApply.key = labApply.id;

        const {
          labItemId,
          labInId,
          fromLabShelfId,
          toLabShelfId,
          fromLabUserId,
          toLabUserId,
          confirmLabUserId,
          status,
        } = labApply;

        // 组装 hubIn 信息
        const labIn = labInMap.get(labInId) || {};
        labApply.labItemId = labIn.labItemId;
        labApply.inTime = labIn.opTime;

        // 组装 hubItem 信息
        const labItem = labItemMap.get(labItemId) || {};
        labApply.labItemName = labItem.name;
        labApply.labItemUnit = labItem.unit;
        labApply.labItemCapacity = labItem.capacity;
        labApply.labItemCapacityUnit = labItem.capacityUnit;

        // 组装架子信息
        const fromLabShelf = labShelfMap.get(fromLabShelfId) || {};
        labApply.fromLabShelfName = fromLabShelf.name;

        const toLabShelf = labShelfMap.get(toLabShelfId) || {};
        labApply.toLabShelfName = toLabShelf.name;

        // 组装用户信息
        const fromLabUser = labUserMap.get(fromLabUserId) || {};
        labApply.fromLabUserName = fromLabUser.name;

        const toLabUser = labUserMap.get(toLabUserId) || {};
        labApply.toLabUserName = toLabUser.name;

        // 组装审批人信息
        const confirmLabUser = labUserMap.get(confirmLabUserId) || {};
        labApply.confirmLabUserName = confirmLabUser.name;

        if (status !== LabApplyStatusEnum.TO_BE_CONFIRM
          && confirmLabUserId === SYSTEM_LAB_USER_ID) {
          labApply.confirmLabUserName = '系统审批';
        }

        return labApply;
      });
    };

    // 组装 dataSource
    useEffect(() => {
      const ds = getDataSource();
      setDataSource(ds);
    }, [labApplyPageBean, labItemMap, labShelfMap, labInMap]);

  };

  // 加载数据
  doInit();

  const getColumns = () => {

    const thenCallback = () => {
      message.info('审批完成');
      setReload(Math.random());
    }

    const onAccept = (record) => {
      // 审批同意，成功后刷新数据
      reqConfirm(record.id, true, labId)
      .then(thenCallback);
    };

    const onReject = (record) => {
      // 审批拒绝，成功后刷新数据
      reqConfirm(record.id, false, labId)
      .then(thenCallback);
    };

    const prefix = `${MODULE_LAB_PREFIX}/${labId}/record/lab-apply`

    const columns = [
      {
        title: (
          <span>
          <Tooltip title="同一种物品会有不同批次的入库，后面的数字为某次入库标记，相同则表示同一次入库的物品流动到各个架子上">
            物品&nbsp;<a>?</a>
          </Tooltip>
        </span>
        ),
        dataIndex: 'labItemName',
        key: 'labItemName',
        align: 'center',
        render: (text, record) => {

          const tooltipFul = (children) => {
            const title = (
              <span>
                <p>入库标记：{record.labId}</p>
                <p>入库时间：{DateUtil.format(new Date(Number(record.inTime)))}</p>
                <p>容量：{record.labItemCapacity / INT_FLOAT_BASE} {record.labItemCapacityUnit}</p>
              </span>
            );

            return (
              <Tooltip title={title}>
                {children}
              </Tooltip>
            );
          }

          const labItemName = text;
          const labInIdSuffix = record.labInId.substr(-6);

          // 是个人页面的申请查询，或者是审批页面，都无需链接化，直接返回
          if (myApply || showOp) {
            return tooltipFul(`${labItemName}/${labInIdSuffix}`);
          }

          // 根据路由参数决定是否链接化

          const labItemNameLinkFul = (labItemName) => {
            return (
              <Link to={`${prefix}/lab-item-id/${record.labItemId}`}>
                {labItemName}
              </Link>
            );
          }

          const labInIdSuffixLinkFul = (labInIdSuffix) => {
            return (
              <Link to={`${prefix}/lab-in-id/${record.labInId}`}>
                {labInIdSuffix}
              </Link>
            );
          }

          // 当前在 labItemId 页面，则 labItemName 无需链接化，但 labInIdSuffix 要链接化
          if (labItemId) {
            return tooltipFul(<>{labItemName}/{labInIdSuffixLinkFul(labInIdSuffix)}</>);
          }

          // 反之链接化 labItemName
          if (labInId) {
            return tooltipFul(<>{labItemNameLinkFul(labItemName)}/{labInIdSuffix}</>);
          }

          // 主页面，二者都需要链接化
          return tooltipFul(<>{labItemNameLinkFul(labItemName)}/{labInIdSuffixLinkFul(labInIdSuffix)}</>);
        },
      },
      {
        title: '物品流向',
        key: 'item-flow',
        align: 'center',
        render: (text, record) => {
          const { fromLabShelfName, toLabShelfName, fromLabUserName = '系统', toLabUserName = '系统', move } = record;
          return (
            <span>
              <span className={styles.info}>{fromLabShelfName}({fromLabUserName})</span>
              <span className={[styles.warning]}> {AntdIcon.SWAP_RIGHT} </span>
              <span className={styles.info}>{toLabShelfName}({toLabUserName})</span>
            </span>
          );
        },
      },
      {
        title: '数量',
        dataIndex: 'num',
        key: 'num',
        align: 'center',
        render: (text, row) => {
          return text / INT_FLOAT_BASE + " " + LabUtil.getRecordUnit(row);
        },
      },
      {
        title: '备注',
        dataIndex: 'opInfo',
        key: 'opInfo',
        align: 'center',
        render: (text) => text ? text : '无',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        responsive: ['lg'],
        render: (text) => {
          let status = <span className={styles.warning}>待审批</span>;
          switch (text) {
            case 1:
              status = <span className={styles.success}>通过</span>;
              break;
            case 2:
              status = <span className={styles.error}>拒绝</span>;
              break;
          }
          return status;
        },
      },
      {
        title: '申请人',
        dataIndex: 'toLabUserName',
        key: 'toLabUserName',
        align: 'center',
        responsive: ['lg'],
        render: (text, record) => {
          if (record.move) {
            return '移动操作';
          }

          if (!text) {
            return '无';
          }

          // 判断是否链接化

          // 若是审批页面，或是个人记录页面，
          // 或是已经是该 toLabUserId 的页面，则无需链接化
          if (myApply || showOp || record.toLabUserId === toLabUserId) {
            return text;
          }

          // 否则链接化
          return (
            <Link to={`${prefix}/to-lab-user-id/${record.toLabUserId}`}>
              {text}
            </Link>
          );
        },
      },
      {
        title: '申请时间',
        dataIndex: 'opTime',
        key: 'opTime',
        align: 'center',
        responsive: ['md'],
        sortDirections: ['ascend', 'descend', 'ascend'],
        sortOrder: 'descend',
        sorter: (a, b) => {
          return Number(a['opTime']) - Number(b['opTime']);
        },
        render: (text) => {
          const date = new Date(Number(text));
          return <span>{DateUtil.format(date)}</span>;
        },
      },
      {
        title: '借出人',
        dataIndex: 'fromLabUserName',
        key: 'fromLabUserName',
        align: 'center',
        responsive: ['lg'],
        render: (text, record) => {
          if (record.move) {
            return '移动操作';
          }

          if (!text) {
            return '无';
          }

          // 判断是否链接化

          // 若是审批页面，或是个人记录页面，
          // 或是已经是该 toLabUserId 的页面，则无需链接化
          if (myApply || showOp || record.fromLabUserId === fromLabUserId) {
            return text;
          }

          // 否则链接化
          return (
            <Link to={`${prefix}/from-lab-user-id/${record.fromLabUserId}`}>
              {text}
            </Link>
          );
        },
      },
      {
        title: '审批人',
        dataIndex: 'confirmLabUserName',
        key: 'confirmLabUserName',
        align: 'center',
        responsive: ['lg'],
        render: (text, record) => {
          if (!text) {
            return '无';
          }
          return text;
        },
      },
      {
        title: '审批时间',
        dataIndex: 'confirmTime',
        key: 'confirmTime',
        align: 'center',
        responsive: ['lg'],
        render: (text) => {
          if (text === '0') {
            return '无';
          }
          const date = new Date(Number(text));
          return <span>{DateUtil.format(date)}</span>;
        },
      },
    ];

    const extraColumns = [
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => {
          return (
            <Space>
              <Button type="primary"
                      size="small"
                      onClick={() => {onAccept(record);}}
              >
                同意
              </Button>{' '}
              <Button type="danger"
                      size="small"
                      onClick={() => {onReject(record);}}
              >
                拒绝
              </Button>
            </Space>
          );
        },
      },
    ];

    if (showOp) {
      columns.push(...extraColumns);
    }

    return columns;
  };

  const getTitle = () => {

    // 若父组件传入则使用父组件的（个人申请/借出页面要自己控制，故那个页面需要自己传入）
    if (title) {
      return title;
    }

    // 是否需要回退按钮
    const needGoBack = labItemId || labInId || fromLabUserId || toLabUserId;

    if (!needGoBack) {
      const t = myApply ? '个人申请记录' : '实验室申请记录';
      return (<h2>{t}</h2>);
    }

    // 没有数据或数据未加载，则无法根据数据展示，直接展示通用标题
    if (!dataSource || !dataSource[0]) {
      return <GoBackFulTitle title='申请记录' />;
    }

    const labOut = dataSource[0];

    if (labItemId) {
      const title = labOut.labItemName + '的申请记录';
      return <GoBackFulTitle title={title} />;
    }

    if (labInId) {
      return <GoBackFulTitle title={`${labOut.labItemName}/${labOut.labInId.substr(-6)}的申请记录`} />;
    }

    if (fromLabUserId) {
      return <GoBackFulTitle title={labOut.fromLabUserName + '的借出记录'} />;
    }

    if (toLabUserId) {
      return <GoBackFulTitle title={labOut.toLabUserName + '的申请记录'} />;
    }

    return '实验室申请记录';
  }

  const getRight = () => {
    return (
      <TimeSearch startTime={startTime} setStartTime={setStartTime}
                  endTime={endTime} setEndTime={setEndTime}
                  setReload={setReload}
      />
    )
  };

  const pagination = AntdUtil.pageBeanToPagination(labApplyPageBean);

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

export default LabApplyDataTable;
