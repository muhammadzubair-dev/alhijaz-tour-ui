import { ResultSuccess } from '@/components';
import { apiFetchTasks } from '@/services/TaskService';
import getSortOrder from '@/utils/getSortOrder';
import { SearchOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Flex, Input, Select, Table, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';

const getStatusColor = (status) => {
  switch (status) {
    case '0':
      return { color: '#faad14', label: 'Pending' };
    case '1':
      return { color: '#1890ff', label: 'In Progress' };
    case '2':
      return { color: '#52c41a', label: 'Done' };
    case '3':
      return { color: '#ff4d4f', label: 'Rejected' };
    default:
      return { color: '#d9d9d9', label: 'Unknown' };
  }
};

const TaskTable = ({ status }) => {
  const [openResult, setOpenResult] = useState({
    open: false,
    title: '',
    subtitle: '',
  });

  const [filterTasks, setFilterTasks] = useState({
    page: 1,
    limit: 10,
    sortBy: null,
    sortOrder: null,
    id: '',
    title: '',
    status: status, // initial dari props
  });

  // Sync status props ke filterTasks saat props.status berubah
  useEffect(() => {
    setFilterTasks((prev) => ({
      ...prev,
      status: status,
    }));
  }, [status]);

  const { data: dataTasks, refetch: refetchTasks } = useQuery({
    queryKey: ['tasks', filterTasks.page, filterTasks.limit, filterTasks.sortBy, filterTasks.sortOrder, filterTasks.status],
    queryFn: () => apiFetchTasks(filterTasks),
    keepPreviousData: false,
  });

  const handleChangeFilter = (e) => {
    setFilterTasks((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeStatus = (value) => {
    setFilterTasks((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const handleTableChange = (pagination, filters, sorter) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    setFilterTasks((prev) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
      sortBy: singleSorter?.field || null,
      sortOrder: singleSorter?.order ? (singleSorter.order === 'ascend' ? 'asc' : 'desc') : null,
    }));
  };

  const handleSubmit = () => {
    refetchTasks();
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: true,
      sortOrder: getSortOrder(filterTasks.sortBy, 'id', filterTasks.sortOrder),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      sorter: true,
      sortOrder: getSortOrder(filterTasks.sortBy, 'title', filterTasks.sortOrder),
    },
    {
      title: 'Tipe',
      dataIndex: 'type',
      key: 'type',
      width: 150,
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      width: 200,
      render: (val) => val || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      sorter: true,
      sortOrder: getSortOrder(filterTasks.sortBy, 'status', filterTasks.sortOrder),
      render: (status) => {
        const { color, label } = getStatusColor(status);
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 120,
      sorter: true,
      sortOrder: getSortOrder(filterTasks.sortBy, 'createdBy', filterTasks.sortOrder),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (val) => moment(val).format('YYYY-MM-DD HH:mm'),
      sorter: true,
      sortOrder: getSortOrder(filterTasks.sortBy, 'createdAt', filterTasks.sortOrder),
    },
  ];

  return (
    <div>
      <Flex justify="space-between" gap={32} style={{ marginBottom: 16 }}>
        <Flex flex={1} gap={8} wrap>
          <Input
            placeholder="ID Task"
            style={{ maxWidth: 150 }}
            name="id"
            allowClear
            onChange={handleChangeFilter}
          />
          <Input
            placeholder="Judul Task"
            style={{ maxWidth: 200 }}
            name="title"
            allowClear
            onChange={handleChangeFilter}
          />
          {/* <Select
            allowClear
            placeholder="Status"
            style={{ width: 120 }}
            onChange={handleChangeStatus}
            value={filterTasks.status}
            options={[
              { value: '0', label: 'Pending' },
              { value: '1', label: 'In Progress' },
              { value: '3', label: 'Selesai' },
              { value: '4', label: 'Ditolak' },
            ]}
          /> */}
          <Button
            type="primary"
            icon={<SearchOutlined />}
            style={{ maxWidth: 40 }}
            onClick={handleSubmit}
          />
        </Flex>
      </Flex>

      <Table
        rowKey="id"
        size="middle"
        columns={columns}
        dataSource={dataTasks?.data}
        scroll={{ x: 1200, y: `calc(100vh - 400px)` }}
        sticky={{ offsetHeader: 64 }}
        onChange={handleTableChange}
        pagination={{
          total: dataTasks?.paging?.total,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} dari ${total} entri`,
          pageSize: filterTasks.limit,
          showSizeChanger: true,
          current: filterTasks.page,
          pageSizeOptions: [10, 25, 50, 100],
        }}
      />

      <ResultSuccess open={openResult} onOpenResult={setOpenResult} />
    </div>
  );
};

export default TaskTable;
