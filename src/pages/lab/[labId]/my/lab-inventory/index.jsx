import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { reqLabInventoryPage } from '@/services/LabInventoryService';
import RouteUtil from '@/utils/RouteUtil';
import LabInventoryDataTable
  from '@/pages/lab/[labId]/lab-inventory/components/LabInventoryDataTable';
import { useModel } from 'umi';

const LabInventory = (props) => {
  // 解析 props
  const labId = RouteUtil.getPathParam(props, 'labId');
  const search = RouteUtil.getQueryParam(props, 'search');
  const page = RouteUtil.getQueryParam(props, 'page');
  const pathname = RouteUtil.getPathname(props);

  // 解析数据

  const [pageBean, setPageBean] = useState({})
  const [reload, setReload] = useState(0);

  // model
  const { currentLabUser } = useModel('CurrentModel');
  const labUserId = currentLabUser && currentLabUser.id;

  const doInit = () => {
    useEffect(async () => {

      // labUser 确定加载完毕才能发送请求
      if (labUserId) {
        const r = await reqLabInventoryPage({labUserId, labId, page, search})
        setPageBean(r);
      }
    }, [page, reload, search, currentLabUser]);
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
