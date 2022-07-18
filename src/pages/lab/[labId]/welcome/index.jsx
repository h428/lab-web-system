import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Alert, Card, List, Space, Tag } from 'antd';
import { Link, useModel } from 'umi';
import { MODULE_LAB_PREFIX } from '@/common/Config';

const Welcome = (props) => {
  // const { dispatch, hubApplyBackModel, hubUserModel, hubModel } = props;
  const labId = props.match.params['labId'];

  // model 数据
  const {currentLab, currentLabUser} = useModel('CurrentModel');

  const doInit = () => {
    // BasicLayout 已经获取仓库用户后，同时获取仓库用户的审批单情况
    // useEffect(() => {
    //   if (currentHubUser && currentHubUser.id) {
    //     getToBeConfirmHubApplyBackListDispatch(dispatch, hubId);
    //   }
    // }, [currentHubUser]);
  };

  doInit();

  // 统计审批单私人、公共的数量
  let privateCnt = 0, commonCnt = 0;
  const doProcessConfirmCount = () => {
    // if (!toBeConfirmHubApplyBackList || !currentStringPermissionList || !currentHubUser) {
    //   return;
    // }
    //
    // const tag = currentStringPermissionList.indexOf(PERM_OP_CONFIRM_COMMON_APPLY) !== -1;
    //
    // toBeConfirmHubApplyBackList.forEach((hubApplyBack) => {
    //   if (hubApplyBack.anotherHubUserId === currentHubUser.id) {
    //     ++privateCnt;
    //   } else if (tag && hubApplyBack.type !== 0 && hubApplyBack.type !== 1) {
    //     // 具有审批权限且有未审批的公共申请
    //     ++commonCnt;
    //   }
    // });
  };

  doProcessConfirmCount();

  const data = [
    (
      <span>您当前位于实验室 <Tag>{currentLab.name}</Tag></span>),
  ];

  if (currentLabUser.id) {
    data.push((
      <span>您在当前实验室的用户名为 <Tag>{currentLabUser.name}</Tag>，授权角色为 <Tag>{currentLabUser.labRole.name}</Tag></span>));
  }

  return (
    <PageHeaderWrapper title={false}>
      <Card title={<h2>欢迎使用 Labmate</h2>}>
        {/*{JSON.stringify(currentHub)}*/}

        <List
          size='small'
          bordered
          dataSource={data}
          renderItem={item => <List.Item>{item}</List.Item>}
        /> <br />

        <Space direction='vertical' style={{ width: '100%' }}>
          {privateCnt !== 0 && <Alert message={
            <span>
              您个人有 {privateCnt} 条待审批的私人申请 <Link
              to={`${MODULE_LAB_PREFIX}/${labId}/op/confirm-apply-back/`}>去审批</Link>
            </span>
          } />}
          {commonCnt !== 0 && (
            <Alert message={
              <span>
                实验室有 {commonCnt} 条待审批的公共申请 <Link
                to={`${MODULE_LAB_PREFIX}/${labId}/op/confirm-common-apply/`}>去审批</Link>
              </span>
            } type='success' />
          )}
        </Space>
      </Card>
    </PageHeaderWrapper>
  );
};

export default Welcome;
