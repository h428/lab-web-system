import { Button, DatePicker, Space } from 'antd';
import moment from 'moment';
import React from 'react';
import DateUtil from '@/utils/DateUtil';
const { RangePicker } = DatePicker;


const TimeSearch = (props) => {

  const {
    // state: 毫秒级时间错
    startTime, setStartTime,
    endTime, setEndTime,

    // 刷新数据
    setReload

  } = props;

  const show = startTime && endTime && setStartTime && setEndTime;

  if (!show) {
    return '';
  }

  const onCalendarChange = (dates) => {

    if (!dates) {
      // 若是清除日期，则设置一个默认值：[上个月第一天 - 明天]
      setStartTime(DateUtil.getFirstDayOfLastMonth());
      setEndTime(DateUtil.getTodayEnd());
      return;
    }


    if (dates) {
      const [startTime, endTime] = dates;
      if (startTime && endTime) {
        // 从 dateRange 的时间获取对应的时间戳，并回写到父组件
        setStartTime(startTime.valueOf());
        // endTime 为某天的 00:00，要变为当天的最后一毫秒
        setEndTime(endTime.add(1, 'd').subtract(1, 'milliseconds').valueOf());
      }
    }
  };

  const onQueryClick = () => {
    // 触发重新请求
    setReload(Math.random());
  };


  return (
    <div>
      <Space>
        <RangePicker
          style={{ width: 230 }}
          value={[moment(startTime), moment(endTime)]}
          onCalendarChange={onCalendarChange}
        />
        <Button onClick={onQueryClick}>查询</Button>
      </Space>
    </div>
  );

}

export default TimeSearch;
