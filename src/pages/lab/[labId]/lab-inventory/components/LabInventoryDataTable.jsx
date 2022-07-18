import React, { useEffect, useState } from 'react';
import { Button, Col, Input, Row, Table, Tooltip } from 'antd';
import { history, Link, useModel } from 'umi';
import { MODULE_LAB_PREFIX } from '@/common/Config';
import DateUtil from '@/utils/DateUtil';
import DataWrapper from '@/components/data-table/DataWrapper';
import { PERM_OP_MOVE } from '@/common/MenuConfig';
import { INT_FLOAT_BASE, PRICE_BASE } from '@/common/LabConfig';
import OpButtons from '@/components/other/OpButtons';
import OutModal from './modal/OutModal';
import ApplyModal from './modal/ApplyModal';
import MoveModal from './modal/MoveModal';
import AntdUtil from '@/utils/AntdUtil';
import RouteUtil from '@/utils/RouteUtil';

const LabInventoryDataTable = (props) => {
  // props 中的参数，注意要把路由组件的 props 传进来
  const {
    // 标题
    title = (<h2>库存列表</h2>),
    // 额外的 cardExtra
    cardExtra,

    // 路由参数
    labId,
    labShelfId,
    pathname,
    search,

    // 控制变量
    showSearchBox = false, // 是否显示搜索框
    extraColumns, // 额外数据列

    // state
    setReload, // 用于刷新数据

    labInventoryPageBean, // 库存分页结果

  } = props;

  // 解析 model 中的数据
  const { currentLabUser } = useModel('CurrentModel');
  const {
    labUserMap, refreshLabUserMap,
    labItemMap, refreshLabItemMap,
    labShelfMap, refreshLabShelfMap,
    labInMap, refreshLabInMap,
  } = useModel('CacheModel');
  const currentLabPerms = currentLabUser.labRole.labPerms;

  // state
  const [currentRow, setCurrentRow] = useState({});
  const [showOutModal, setShowOutModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [pagination, setPagination] = useState({});
  const [dataSource, setDataSource] = useState([]);

  // 辅助变量
  const currentLabUserId = currentLabUser && currentLabUser.id;
  const page = labInventoryPageBean.page;

  const doInit = () => {

    let labShelfIdList = [];

    useEffect(() => {

      const cascadeRequest = (pageBean) => {
        const list = pageBean.list || [];

        // 级联请求架子信息
        labShelfIdList = list.map(r => r.labShelfId);
        refreshLabShelfMap(labShelfIdList, labId);

        // 级联请求用户信息
        const labItemIdList = list.map(r => r.labItemId);
        refreshLabItemMap(labItemIdList, labId);

        // 级联请求物品信息
        const labUserIdList = list.reduce((arr, cur) => {
          if (cur.labUserId !== '0') {
            arr.push(cur.labUserId);
          }
          return arr;
        }, []);

        refreshLabUserMap(labUserIdList, labId);


        // 级联请求入库信息
        const labInIdList = list.map(r => r.labInId);
        refreshLabInMap(labInIdList, labId);
      }

      cascadeRequest(labInventoryPageBean);
    }, [labInventoryPageBean])



    const getDataSource = () => {
      const list = labInventoryPageBean.list || [];

      return list && list.map(cur => {
        // 天坑，不拷贝 antd table 不刷新
        const labInventory = Object.assign({}, cur);
        labInventory.key = labInventory.id;

        const labShelf = labShelfMap.get(labInventory.labShelfId) || {}
        labInventory.labShelfName = labShelf.name;
        labInventory.labShelfType = labShelf.type;

        const labUserId = labInventory.labUserId;
        const labUser = labUserMap.get(labUserId) || {}
        labInventory.labUserName = labUser.name;
        if (labUserId === '0') {
          labInventory.labUserName = '共用';
        }

        const labItem = labItemMap.get(labInventory.labItemId) || {}
        labInventory.labItemName = labItem.name;
        labInventory.labItemEngName = labItem.engName;
        labInventory.labItemDescInfo = labItem.descInfo;
        labInventory.labItemUnit = labItem.unit;
        labInventory.labItemCapacityUnit = labItem.capacityUnit;

        const labIn = labInMap.get(labInventory.labInId) || {}
        labInventory.inTime = labIn.opTime;
        labInventory.inPrice = labIn.price;

        return labInventory;
      });
    }

    useEffect(() => {
      const ds = getDataSource();
      setDataSource(ds);

      // 设置分页信息
      setPagination(AntdUtil.pageBeanToPagination(labInventoryPageBean));
    }, [labInventoryPageBean, labShelfMap, labUserMap, labItemMap, labInMap]);

  }

  doInit();

  const onOutClick = (record) => {
    setCurrentRow(record);
    setShowOutModal(true);
  };

  const onApplyClick = (record) => {
    setCurrentRow(record);
    setShowApplyModal(true);
  };

  const onMoveClick = (record) => {
    setCurrentRow(record);
    setShowMoveModal(true);
  };

  const getColumns = () => {

    const columns = [
      {
        title: '架子',
        dataIndex: 'labShelfName',
        key: 'labShelfName',
        align: 'center',
        render: (text, record) => {

          // 已经是具体架子的页面，只需返回 text
          if (labShelfId) {
            return text;
          }

          // 否则是实验室库存页面，返回 Link 打开对应架子库存页面
          const labUserName = record.labUserName || '无';

          const wrapper = (children) => <Tooltip title={'所属用户：' + labUserName}>{children}</Tooltip>

          // 返回普通的指定架子页面 link
          return wrapper(
            <Link to={`${MODULE_LAB_PREFIX}/${labId}/inventory/lab-shelf-id/${record.labShelfId}`}>{text}</Link>
          )
        },
      },
      {
        title: (
          <span>
            <Tooltip title="同一种物品会有不同批次的入库，后面的数字为某次入库标记，相同则表示同一次入库的物品流动到各个架子上">
              物品/批次号&nbsp;<a>?</a>
            </Tooltip>
          </span>
        ),
        dataIndex: 'labItemName',
        key: 'labItemName',
        align: 'center',
        render: (text, record) => {
          const title = (
            <span>
              <p>入库批次号：{record.labInId}</p>
              <p>入库时间：{DateUtil.format(new Date(Number(record.inTime)))}</p>
              <p>英文名：{record.labItemEngName}</p>
              <p>描述信息：{record.labItemDescInfo}</p>
              <p>价格：{record.inPrice / PRICE_BASE}</p>
              <p>容量：{record.capacity === 0 ? '非容量品' : (record.capacity / INT_FLOAT_BASE + ' ' + record.labItemCapacityUnit)}</p>
            </span>
          );

          return (
            <Tooltip title={title}>
              {text + '/' + record['labInId'].substr(-6)}
            </Tooltip>
          );
        },
      },
      {
        title: '容量',
        dataIndex: 'capacityId',
        key: 'capacityId',
        align: 'center',
        render: (text, record) => {

          if (!text) {
            return '';
          }

          if (record.capacity === 0) return '非容量品';

          if (record.capacityId === '0') return '完整容量品'

          return `${record.capacity / INT_FLOAT_BASE} ${record.labItemCapacityUnit}/${text.substr(-6)}(已开封)`;
        },
      },
      {
        title: '入库时间',
        dataIndex: 'inTime',
        key: 'inTime',
        align: 'center',
        responsive: ['md'],
        render: (text) => {
          return DateUtil.formatTimestamp(text);
        },
      },
      {
        title: '数量',
        dataIndex: 'num',
        key: 'num',
        align: 'center',
        render: (text, record) => {

          // 非库存品或者库存品的非库存行
          if (record.capacityId === '0') {
            return text / INT_FLOAT_BASE + " " + record.labItemUnit;
          } else {
            return text / INT_FLOAT_BASE + " " + record.labItemCapacityUnit;
          }
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <div>
            <OpButtons>
              {(currentLabUserId === record.labUserId || record.labShelfType === 1) && (
                <Button onClick={() => { onOutClick(record); }} type="primary" size="small">
                  消耗
                </Button>
              )}
              {currentLabUserId !== record.labUserId && (
                <Button onClick={() => { onApplyClick(record); }} type="primary" size="small">
                  申请
                </Button>
              )}
              {currentLabPerms && currentLabPerms.indexOf(PERM_OP_MOVE) !== -1 && (
                <Button type="primary" size="small" onClick={() => { onMoveClick(record); }}>
                  移动
                </Button>
              )}
            </OpButtons>
          </div>
        ),
      },
    ];

    if (extraColumns && Array.isArray(extraColumns)) {
      columns.push(...extraColumns);
    }

    return columns;
  };

  const getSearch = () => {

    if (!showSearchBox) {
      return '';
    }


    // 单击搜索按钮后的回调
    const onSearch = (value) => {
      // 若文本框没有值，则跳转到初始库存页
      const query = RouteUtil.objectToQuery({search: value, page});
      history.push(`${pathname}${query}`)
    }

    return (
      <Row>
        <Col xs={24} sm={16} md={12}>
          <Input.Search
            placeholder="请输入搜索内容"
            onSearch={onSearch}
            defaultValue={search}
            style={{ width: '100%' }}
            size="middle"
          />
        </Col>
      </Row>
    );
  }

  const onChange = AntdUtil.generateOnPageChange(pathname, search);

  return (
    <div>
      <DataWrapper left={title} right={cardExtra} searchBox={getSearch()}>
        <Table
          columns={getColumns()}
          dataSource={dataSource}
          pagination={pagination}
          onChange={onChange}
        />
      </DataWrapper>
      <OutModal
        setReload={setReload}
        visible={showOutModal}
        setVisible={setShowOutModal}
        labInventory={currentRow}
      />
      <ApplyModal
        setReload={setReload}
        visible={showApplyModal}
        setVisible={setShowApplyModal}
        labInventory={currentRow}
        labId={labId}
      />
      <MoveModal
        visible={showMoveModal}
        setVisible={setShowMoveModal}
        setReload={setReload}
        labInventory={currentRow}
        labId={labId}
      />
    </div>
  );
};

export default LabInventoryDataTable;
