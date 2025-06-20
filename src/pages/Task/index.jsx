import { Tabs } from 'antd';
import { useState } from 'react';
import TaskTable from './components/TaskTable'; // pastikan path sesuai

const TaskPage = () => {
  const [activeKey, setActiveKey] = useState('all'); // default tab: All

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

export default TaskPage;
