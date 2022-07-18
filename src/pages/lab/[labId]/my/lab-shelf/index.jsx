import React, { useEffect, useState } from 'react';
import RouteUtil from '@/utils/RouteUtil';
import LabShelfDataTable
  from '@/pages/lab/[labId]/lab/shelf/components/LabShelfDataTable';
import { useModel } from 'umi';

const MyLabShelf = (props) => {
  const labId = RouteUtil.getPathParam(props, 'labId');

  // state
  const [reload, setReload] = useState(0);

  const { myLabShelfList, refreshMyLabShelfList, } = useModel('CurrentModel');

  // 初始化数据
  const doInit = () => {
    useEffect(async () => {
      refreshMyLabShelfList(labId);
    }, [reload]);

  };

  doInit();


  return (
    <div>
      <LabShelfDataTable
        labShelfList={myLabShelfList}
        labId={labId}
        setReload={setReload}
        my={true}
      />
    </div>
  );
};

export default MyLabShelf;
