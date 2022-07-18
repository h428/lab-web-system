import React, { useEffect, useState } from 'react';
import LabOutDataTable
  from '@/pages/lab/[labId]/record/lab-out/components/LabOutDataTable';
import RouteUtil from '@/utils/RouteUtil';
import {
  reqLabOutPage,
  reqMyLabOutPageByLabId,
  reqMyOutPageByLabId,
} from '@/services/LabOutService';
import moment from 'moment';
import DateUtil from '@/utils/DateUtil';

/**
 * 高度抽象的 LabOut 路由组件：各个消耗记录页面只有 ajax 的区别，因此可高度抽象
 * @param props 所有路由参数，以及区分的 reqMethod
 * @returns {JSX.Element}
 * @constructor
 */
const LabOutComponent = (props) => {
  // 解析 props
  const labId = RouteUtil.getPathParam(props, 'labId');
  const labItemId = RouteUtil.getPathParam(props, 'labItemId');
  const labInId = RouteUtil.getPathParam(props, 'labInId');
  const labUserId = RouteUtil.getPathParam(props, 'labUserId');
  const page = RouteUtil.getQueryParam(props, 'page');
  const size = RouteUtil.getQueryParam(props, 'size');
  const pathname = RouteUtil.getPathname(props);
  const { reqMethod, myOut } = props;


  const [startTime, setStartTime] = useState(DateUtil.getFirstDayOfLastMonth());
  const [endTime, setEndTime] = useState(DateUtil.getTodayEnd());
  const [reload, setReload] = useState(0);
  const [labOutPageBean, setLabOutPageBean] = useState({});

  useEffect(async () => {
    const params = {page, size, labItemId, labInId, opLabUserId: labUserId, startTime, endTime};
    const pageBean = await reqMethod(labId, params);
    setLabOutPageBean(pageBean);
  }, [page, size, reload])


  return (
    <div>
      <LabOutDataTable pathname={pathname}
                       labId={labId} labItemId={labItemId}
                       labUserId={labUserId} labInId={labInId}
                       startTime={startTime} setStartTime={setStartTime}
                       endTime={endTime} setEndTime={setEndTime}
                       myOut={myOut}
                       setReload={setReload}
                       labOutPageBean={labOutPageBean}
      />
    </div>
  );
};

export default LabOutComponent;
