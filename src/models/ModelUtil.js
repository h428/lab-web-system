import { useCallback, useState } from 'react';

/**
 * 生成数据模型以及对应的 ajax 更新方法
 * @param initData 初始数据
 * @param reqMethod 对应的后端请求方法
 * @param reqMethodArgs 请求方法的参数
 * @returns {[unknown, ((function(): Promise<void>)|*)]}
 */
export const generateData = (initData, reqMethod) => {
  const [data, setData] = useState(initData)

  const refreshData = useCallback(async (...refreshMethodArgs) => {
    const data = await reqMethod(refreshMethodArgs)
    setData(data);
  }, [])

  return [data, refreshData];
}


export default {
  generateData
}
