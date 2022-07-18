import styles from './GoBackFulTitle.less';
import { history } from 'umi';
import { ArrowLeftOutlined, MinusOutlined } from '@ant-design/icons';
import React from 'react';

const GoBackFulTitle = ({title}) => {
  return (
    <div className={styles.title}>
      <a type="link" onClick={() => history.goBack()}>
        <ArrowLeftOutlined/><MinusOutlined className={styles.right}/>
      </a> &nbsp;
      <h2>{title}</h2>
    </div>
  );
}

export default GoBackFulTitle;
