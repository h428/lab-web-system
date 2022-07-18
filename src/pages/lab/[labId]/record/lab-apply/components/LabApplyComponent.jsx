import React, { useEffect, useState } from 'react';
import LabApplyDataTable
  from '@/pages/lab/[labId]/record/lab-apply/components/LabApplyDataTable';
import RouteUtil from '@/utils/RouteUtil';
import {
  reqLabApplyPageByLabId,
  reqMyLabApplyPageByLabId, reqMyLendPageByLabId,
} from '@/services/LabApplyService';
import { Switch } from 'antd';
import moment from 'moment';
import DateUtil from '@/utils/DateUtil';

/**
 * 高度抽象的 LabApplyComponent 路由组件：各个消耗记录页面只有 ajax 的区别，因此可高度抽象
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const LabApplyComponent = (props) => {

  const labId = RouteUtil.getPathParam(props, 'labId');
  const labItemId = RouteUtil.getPathParam(props, 'labItemId');
  const labInId = RouteUtil.getPathParam(props, 'labInId');
  const fromLabUserId = RouteUtil.getPathParam(props, 'fromLabUserId');
  const toLabUserId = RouteUtil.getPathParam(props, 'toLabUserId');
  const page = RouteUtil.getQueryParam(props, 'page');
  const pathname = RouteUtil.getPathname(props);
  const { reqMethod, myApply, showOp, title } = props;

  const [startTime, setStartTime] = useState(DateUtil.getFirstDayOfLastMonth());
  const [endTime, setEndTime] = useState(DateUtil.getTodayEnd());
  const [reload, setReload] = useState(0);
  const [labApplyPageBean, setLabApplyPageBean] = useState({})

  useEffect(async () => {
    // 请求数据
    const pageBean = await reqMethod(labId, { page, labItemId, labInId, fromLabUserId, toLabUserId, startTime, endTime });
    setLabApplyPageBean(pageBean);
  }, [reload, page, labItemId]);

  return (
    <div>
      <LabApplyDataTable title={title} labId={labId} labItemId={labItemId} labInId={labInId}
                         fromLabUserId={fromLabUserId} toLabUserId={toLabUserId}
                         pathname={pathname}
                         startTime={startTime} setStartTime={setStartTime}
                         endTime={endTime} setEndTime={setEndTime}
                         showOp={showOp} myApply={myApply}
                         setReload={setReload}
                         labApplyPageBean={labApplyPageBean}
      />
    </div>
  );
};

export default LabApplyComponent;
