/**
 * 复制内容到粘贴板
 * content : 需要复制的内容
 * message : 复制完后的提示，不传则默认提示"复制成功"
 */
import { message } from 'antd';

export function copyToClip(content, msg) {
  const aux = document.createElement('input');
  aux.setAttribute('value', content);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand('copy');
  document.body.removeChild(aux);
  if (msg == null) {
    message.info('复制成功');
  } else {
    message.error(msg);
  }
}

const CommonUtil = {
  copyToClip
}

export default CommonUtil;
