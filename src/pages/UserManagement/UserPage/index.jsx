import { ResultSuccess } from '@/components';
import queryClient from '@/lib/queryClient';
import { apiDeleteUser, apiFetchUsers } from '@/services/userService';
import getSortOrder from '@/utils/getSortOrder';
import { CheckCircleFilled, CloseCircleFilled, DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Avatar, Button, Flex, Input, notification, Popconfirm, Select, Space, Table, Tag, Tooltip, Typography } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import FormUser from './FormUser';

const UserPage = () => {
  const [openForm, setOpenForm] = useState(false)
  const [openResult, setOpenResult] = useState({
    open: false,
    title: '',
    subtitle: '',
    extra: ''
  })
  const [filterUsers, setFilterUsers] = useState({
    page: 1,
    limit: 10,
    sortBy: null,
    sortOrder: null,
    username: '',
    name: '',
    type: '',
    isActive: null,
  })
  const [selectedUser, setSelectedUser] = useState(null);
  const [api, contextHolder] = notification.useNotification();
  const { data: dataUsers, refetch: refetchUsers } = useQuery({
    queryKey: ['users', filterUsers.page, filterUsers.limit, filterUsers.sortBy, filterUsers.sortOrder],
    queryFn: () => apiFetchUsers(filterUsers),
  });

  const deactivateUserMutation = useMutation({
    mutationFn: (data) => apiDeleteUser(data),
    onSuccess: (data) => {
      api.open({
        message: 'User Berhasil Dihapus',
        description: `Akun pengguna dengan username ${data.data.username} telah berhasil dihapus dan tidak dapat lagi mengakses sistem.`,
        showProgress: true,
        pauseOnHover: true,
      });
      queryClient.invalidateQueries(['users'])
    }
  })

  const handleCloseForm = () => {
    setSelectedUser(null)
    setOpenForm(false)
  }

  const handleOpenFormEdit = (data) => {
    setSelectedUser(data)
    setOpenForm(true)
  }

  const handleOpenResult = (values) => {
    setOpenResult((prevState) => ({
      ...prevState,
      ...values
    }))
  }

  const handleChangeFilter = (e) => {
    setFilterUsers((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const handleChangeType = (value) => {
    setFilterUsers((prevState) => ({
      ...prevState,
      type: value
    }))
  }

  const handleChangeStatus = (value) => {
    setFilterUsers((prevState) => ({
      ...prevState,
      isActive: value
    }))
  }

  const handleTableChange = (pagination, filters, sorter) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    setFilterUsers(prev => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
      sortBy: singleSorter?.field || null,
      sortOrder: singleSorter?.order ? (singleSorter.order === 'ascend' ? 'asc' : 'desc') : null,
    }));
  };

  const handleSubmit = () => {
    refetchUsers(filterUsers)
  }

  const handleDeactivateUser = (id, username) => {
    deactivateUserMutation.mutate({ id, username })
  }

  const columns = [
    {
      title: '',
      width: 50,
      dataIndex: 'username',
      key: 'username',
      align: 'center',
      render: (value) => <Avatar>{value?.[0].toUpperCase()}</Avatar>
    },
    {
      title: 'Username',
      width: 100,
      dataIndex: 'username',
      key: 'username',
      fixed: 'left',
      sorter: true,
      sortOrder: getSortOrder(filterUsers.sortBy, 'username', filterUsers.sortOrder)
    },
    {
      title: 'Name',
      width: 150,
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      sortOrder: getSortOrder(filterUsers.sortBy, 'name', filterUsers.sortOrder)
    },
    {
      title: 'Tipe',
      dataIndex: 'type',
      key: 'type',
      width: 60,
      render: (value) => value === '1' ? 'Agent' : value === '0' ? 'Staff' : '-'
    },
    {
      title: 'Banned',
      dataIndex: 'bannedUntil',
      key: 'bannedUntil',
      width: 50,
      render: (value) => value ? moment(value).format('YYYY-MM-DD HH:mm') : '-'
    },
    {
      title: 'Aktif',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      align: 'center',
      render: (value) => value ? <CheckCircleFilled style={{ color: "#52c41a" }} /> : <CloseCircleFilled style={{ color: "#ff4d4f" }} />
    },
    {
      title: 'Updated By',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
      width: 100,
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 100,
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 100,
      render: (value) => value ? moment(value).format('YYYY-MM-DD HH:mm') : '-'
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
      render: (value) => moment(value).format('YYYY-MM-DD HH:mm')
    },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (values) => (
        <Space>
          <Tooltip title="Edit">
            <Button color='blue' variant='text' shape="circle" size='small' icon={<EditOutlined />} onClick={() => handleOpenFormEdit(values)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title={`Hapus Username ${values.username} ?`}
              placement='bottomRight'
              onConfirm={() => handleDeactivateUser(values.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger type="text" shape="circle" size='small' icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      <Flex justify='space-between' gap={32}>
        <Flex flex={1} gap={8} wrap style={{ marginBottom: 16 }}>
          <Input placeholder='Username' style={{ maxWidth: 120 }} name='username' allowClear onChange={handleChangeFilter} />
          <Input placeholder='Name' style={{ maxWidth: 120 }} name='name' allowClear onChange={handleChangeFilter} />
          <Select
            allowClear
            style={{ width: 120 }}
            onChange={handleChangeType}
            name='type'
            placeholder="Tipe"
            options={[
              { value: '1', label: 'Agent' },
              { value: '0', label: 'Staff' },
            ]}
          />
          <Select
            allowClear
            placeholder="Status"
            style={{ width: 120 }}
            onChange={handleChangeStatus}
            options={[
              { value: true, label: 'Aktif' },
              { value: false, label: 'Tidak Aktif' },
            ]}
          />

          <Button block type='primary' icon={<SearchOutlined />} style={{ maxWidth: 40 }} onClick={handleSubmit} />

        </Flex>
        <Button variant='solid' color='green' icon={<PlusOutlined />} onClick={() => setOpenForm(true)}  >
          New User
        </Button>
      </Flex>
      <Table
        rowKey='id'
        size='middle'
        columns={columns}
        dataSource={dataUsers?.data}
        scroll={{ x: 1500, y: `calc(100vh - 400px)` }}
        sticky={{ offsetHeader: 64 }}
        onChange={handleTableChange}
        pagination={{
          total: dataUsers?.paging?.total,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          pageSize: filterUsers.limit,
          showSizeChanger: true,
          pageSizeOptions: [10, 25, 50, 100],
        }}
      />
      <FormUser open={openForm} data={selectedUser} onCloseForm={handleCloseForm} onOpenResult={handleOpenResult} />
      <ResultSuccess
        open={openResult}
        onOpenResult={handleOpenResult}
        extra={openResult.extra ? (
          <Tag color="blue">
            <Typography.Paragraph style={{ margin: 8 }} copyable>{openResult.extra}</Typography.Paragraph>
          </Tag>
        ) : null}
      />
    </div>
  );
};

export default UserPage;