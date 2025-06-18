import { useState } from 'react';
import { Tabs } from 'antd';
import TaskTable from './TaskTable'; // pastikan path sesuai

const TaskTabs = () => {
  const [activeKey, setActiveKey] = useState('10'); // default tab: All

  const tabItems = [
    { key: 'all', label: 'All' },
    { key: '0', label: 'Pending' },
    { key: '1', label: 'In Progress' },
    { key: '2', label: 'Done' },
    { key: '3', label: 'Rejected' },
  ];

  // Map key tab ke status yang dikirim ke TaskTable
  const getStatusFromKey = (key) => {
    return key === 'all' ? null : key;
  };

  return (
    <>
      <Tabs
        type="card"
        activeKey={activeKey}
        onChange={setActiveKey}
        items={tabItems}
        tabPosition='top'
      />
      <TaskTable status={getStatusFromKey(activeKey)} />
    </>
  );
};

export default TaskTabs;
