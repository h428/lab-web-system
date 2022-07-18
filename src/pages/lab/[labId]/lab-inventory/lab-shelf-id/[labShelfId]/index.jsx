import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { history } from 'umi';
import { ArrowLeftOutlined, MinusOutlined } from '@ant-design/icons';
import LabInventoryDataTable from '../../components/LabInventoryDataTable';
import RouteUtil from '@/utils/RouteUtil';
import { reqLabInventoryPage } from '@/services/LabInventoryService';
import styles from './style.less';

export const LabShelfInventory = (props) => {
  const labId = RouteUtil.getPathParam(props, 'labId');
  const labShelfId = RouteUtil.getPathParam(props, 'labShelfId')
  const page = RouteUtil.getQueryParam(props, 'page') || 1;
  const search = RouteUtil.getQueryParam(props, 'search');
  const pathname = RouteUtil.getPathname(props);

  const [pageBean, setPageBean] = useState({});
  const [reload, setReload] = useState(false);

  const doInit = () => {
    useEffect(async () => {
      const r = await reqLabInventoryPage({labId, page, labShelfId, search})
      setPageBean(r);
    }, [page, search, reload]);
  };

  doInit();

  const getTitle = () => {
    return (
      <div className={styles.title}>
        <a type="link" onClick={() => history.goBack()}>
          <ArrowLeftOutlined/><MinusOutlined className={styles.right}/>
        </a> &nbsp;
        <h2>架子库存列表</h2>
      </div>
    );
  };

  return (
    <div>
      <PageHeaderWrapper title={false}>
        <LabInventoryDataTable title={getTitle()}
                               labId={labId} labShelfId={labShelfId}
                               showSearchBox={true} search={search}
                               pathname={pathname}
                               setReload={setReload}
                               labInventoryPageBean={pageBean}
       />
      </PageHeaderWrapper>
    </div>
  );
};

export default LabShelfInventory;
