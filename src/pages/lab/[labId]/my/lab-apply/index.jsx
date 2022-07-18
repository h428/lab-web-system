import React, { useEffect, useState } from 'react';
import LabApplyDataTable
  from '@/pages/lab/[labId]/record/lab-apply/components/LabApplyDataTable';
import RouteUtil from '@/utils/RouteUtil';
import {
  reqMyLabApplyPageByLabId, reqMyLendPageByLabId,
} from '@/services/LabApplyService';
import { Switch } from 'antd';

const LabApply = (props) => {

  const labId = RouteUtil.getPathParam(props, 'labId');
  const page = RouteUtil.getQueryParam(props, 'page');
  const search = RouteUtil.getQueryParam(props, 'search');
  const pathname = RouteUtil.getPathname(props);

  const [reload, setReload] = useState(0);

  // 是否借出
  const [lend, setLend] = useState(false);

  const [labApplyPageBean, setLabApplyPageBean] = useState({})

  useEffect(async () => {

    if (lend) {
      const pageBean = await reqMyLendPageByLabId(labId, { page });
      setLabApplyPageBean(pageBean);
      return;
    }

    // 请求数据
    const pageBean = await reqMyLabApplyPageByLabId(labId, { page });
    setLabApplyPageBean(pageBean);
  }, [lend, reload, page, search]);

  const title = lend ? '个人借出记录' : '个人申请记录';

  const getCardExtra = () => {

    const onChange = (checked) => {
      setLend(checked);
    }

    return (
      <>
        <Switch checkedChildren="借出记录"
                unCheckedChildren="申请记录"
                checked={lend}
                onChange={onChange}
        />
      </>
    );
  }

  return (
    <div>
      <LabApplyDataTable title={(<h2>{title}</h2>)} cardExtra={getCardExtra()}
                         labId={labId} pathname={pathname}
                         myApply={true}
                         setReload={setReload}
                         labApplyPageBean={labApplyPageBean}
      />
    </div>
  );
};

export default LabApply;
