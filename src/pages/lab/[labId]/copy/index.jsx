import styles from './index.less';
import { Link } from 'umi';

const CopyPage = (props) => {

  return (
    <div>
      <h1 className={styles.title}>Page Copy</h1>
      <p>props: {JSON.stringify(props.location)}</p>
    </div>
  );
};

export default CopyPage;
