import React, { useState, useEffect } from 'react';
import { Button, Card, List, Modal, Tooltip, Typography } from 'antd';
const { Paragraph } = Typography;
import styles from './LabCard.less';
import { EditOutlined, InfoOutlined, RightOutlined } from '@ant-design/icons';
import { Link, useModel } from 'umi';
import { MODULE_LAB_PREFIX } from '@/common/Config';
import logo from '@/assets/logo.svg';
import { reqDeleteLab } from '@/services/LabService';
import { reqLeaveLab } from '@/services/LabUserService';
import DateUtil from '@/utils/DateUtil';

const LabCard = (props) => {
  // lab 实验室数据
  const { lab = {} } = props;

  const own = lab['own'] || false;

  const onDelete = async (hubId) => {
    await reqDeleteLab(hubId);
    // todo 更新已加入的实验室列表
  };

  // 退出实验室
  const onLeave = async (labId) => {
    await reqLeaveLab(labId);
    // todo 更新已加入的实验室列表
  };

  return (
    <Card
      hoverable
      className={styles.card}
      actions={[
        <Tooltip
          title={
            <div>
              <p>
                <strong>实验室详细信息：</strong>
              </p>
              <p>名称：{lab.name}</p>
              <p>描述：{lab.descInfo || '无描述'}</p>
              <p>
                创建时间：{DateUtil.format(new Date(Number(lab.createTime)))}
              </p>
            </div>
          }
        >
          详细
          <InfoOutlined key="info" />
        </Tooltip>,
        <Link to={MODULE_LAB_PREFIX + '/' + lab.id} target="_blank">
          打开
          <RightOutlined key="open" />
        </Link>,
      ]}
      title={lab && lab['name']}
      extra={
        own ? (
          // 拥有实验室的面板，按钮为删除按钮
          <Button
            type="link"
            onClick={() =>
              Modal.confirm({
                title: (
                  <span>
                    确定删除实验室 <strong>{lab.name}</strong> ？
                  </span>
                ),
                content: '删除后将无法恢复？',
                onOk: () => onDelete(lab.id),
              })
            }
          >
            删除
          </Button>
        ) : (
          // 已加入实验室的面板，按钮为退出按钮
          <Button
            type="link"
            onClick={() =>
              Modal.confirm({
                title: (
                  <span>
                    确定退出实验室 <strong>{lab.name}</strong> ？
                  </span>
                ),
                content: '退出后将无法继续对该实验室进行相关操作？',
                onOk: () => onLeave(lab.id),
              })
            }
          >
            退出
          </Button>
        )
      }
    >
      <Card.Meta
        avatar={<img alt="" src={logo} className={styles.cardAvatar} />}
        title={<h4>{lab.name}</h4>}
        description={
          <Paragraph className={styles.item} ellipsis={{ rows: 3 }}>
            {lab.labUserName || '无用户'} / {lab.labRoleName || '无角色'}
          </Paragraph>
        }
      />
    </Card>
  );
};

export default LabCard;
