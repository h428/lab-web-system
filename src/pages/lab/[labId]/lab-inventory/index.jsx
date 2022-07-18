import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import LabInventoryDataTable from './components/LabInventoryDataTable';
import { reqLabInventoryPage } from '@/services/LabInventoryService';
import RouteUtil from '@/utils/RouteUtil';

const LabInventory = (props) => {
  // 解析 props
  const labId = RouteUtil.getPathParam(props, 'labId');
  const search = RouteUtil.getQueryParam(props, 'search');
  const page = RouteUtil.getQueryParam(props, 'page');
  const pathname = RouteUtil.getPathname(props);

  // 解析数据
  const [pageBean, setPageBean] = useState({})
  const [reload, setReload] = useState(0);


  const doInit = () => {
    useEffect(async () => {
      const r = await reqLabInventoryPage({labId, page, search})
      setPageBean(r);
    }, [page, reload, search]);
  };

  doInit();

  return (
    <div>
      <PageHeaderWrapper title={false}>
        <LabInventoryDataTable labId={labId} pathname={pathname}
                               showSearchBox={true} search={search}
                               setReload={setReload}
                               labInventoryPageBean={pageBean}
        />
      </PageHeaderWrapper>
    </div>
  );
};

export default LabInventory;
