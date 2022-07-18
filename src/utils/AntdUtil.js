import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { Button, Input, Space } from 'antd';
import { history } from 'umi';
import CommonUtil from '@/utils/CommonUtil';
import React from 'react';
import RouteUtil from '@/utils/RouteUtil';

const generateMenuItem = (label, icon, key) => {
  return {
    label,
    icon,
    key
  }
};

const menuItemDivider = {type: 'divider'};

/**
 * 生成表格列搜索需要的属性函数，注意返回一个函数，需要在 Table 组件中继续执行获得列
 */
export const generateColumnSearchPropsFun = (searchText, setSearchText, setSearchedColumn) => {
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    // 单击该列的搜索图标弹出的搜索选项
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`搜索内容`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            搜索
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            重置
          </Button>
        </Space>
      </div>
    ),
    // 展示的图标，filtered 有过滤值则为 true
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    // 过滤条件，value 为过滤值，record 为本行记录，返回 true 则表示本行通过
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : false,
    // 处理搜索结果，对所有结果中的关键字着色
    render: (text) => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ''}
      />
    ),
  });

  return getColumnSearchProps;
};

// 将后台的 pageBean 对象转化为 antd 的 pagination 对象
const pageBeanToPagination = (pageBean) => {
  return {
    total: Number(pageBean.total),
    current: pageBean.page,
    pageSize: pageBean.size,
  }
}

// 高阶函数：根据 prefix 生成 antd 的 onChange 函数
const generateOnPageChange = (pathname, search) => {
  // 生成 onChange 函数
  return (pagination, filters, sorter) => {
    // 用 history 跳转
    const queryObj = {search};
    if (pagination.current > 1) {
      queryObj.page = pagination.current;
    }

    if (pagination.pageSize > 10) {
      queryObj.size = pagination.pageSize;
    }

    const query = RouteUtil.objectToQuery(queryObj);
    const urlWithPage = `${pathname}${query}`
    history.push(urlWithPage);
  };
}

// 为传入的 title 添加返回的按钮以回退


export default {
  generateMenuItem,
  menuItemDivider,
  generateColumnSearchPropsFun,
  pageBeanToPagination,
  generateOnPageChange,
}
