import { ResultSuccess } from '@/components';
import queryClient from '@/lib/queryClient';
import { apiDeleteAgent, apiFetchUsersAgents } from '@/services/userService';
import getSortOrder from '@/utils/getSortOrder';
import { CheckCircleFilled, CloseCircleFilled, DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Avatar, Button, Flex, Input, notification, Popconfirm, Select, Space, Table, Tag, Tooltip, Typography } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import FormAgent from './FormAgent';

const AgentPage = () => {
  const [openForm, setOpenForm] = useState(false)
  const [openResult, setOpenResult] = useState({
    open: false,
    title: '',
    subtitle: '',
    extra: ''
  })
  const [filterAgents, setFilterAgents] = useState({
    page: 1,
    limit: 10,
    sortBy: null,
    sortOrder: null,
    agentCode: '',
    name: '',
    isActive: null,
  })
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [api, contextHolder] = notification.useNotification();
  const { data: dataAgents, refetch: refetchAgents } = useQuery({
    queryKey: ['agents', filterAgents.page, filterAgents.limit, filterAgents.sortBy, filterAgents.sortOrder],
    queryFn: () => apiFetchUsersAgents(filterAgents),
  });

  const deleteAgentMutation = useMutation({
    mutationFn: (data) => apiDeleteAgent(data),
    onSuccess: (data) => {
      api.open({
        message: 'Agent Berhasil Dihapus',
        description: `Agent ${data.data.username} telah berhasil dihapus dan tidak dapat lagi mengakses sistem.`,
        showProgress: true,
        pauseOnHover: true,
      });
      queryClient.invalidateQueries(['agents'])
    }
  })

  const handleCloseForm = () => {
    setSelectedAgent(null)
    setOpenForm(false)
  }

  const handleOpenFormEdit = (data) => {
    setSelectedAgent(data)
    setOpenForm(true)
  }

  const handleOpenResult = (values) => {
    setOpenResult((prevState) => ({
      ...prevState,
      ...values
    }))
  }

  const handleChangeFilter = (e) => {
    setFilterAgents((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const handleChangeStatus = (value) => {
    setFilterAgents((prevState) => ({
      ...prevState,
      isActive: value
    }))
  }

  const handleTableChange = (pagination, filters, sorter) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    setFilterAgents(prev => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
      sortBy: singleSorter?.field || null,
      sortOrder: singleSorter?.order ? (singleSorter.order === 'ascend' ? 'asc' : 'desc') : null,
    }));
  };

  const handleSubmit = () => {
    refetchAgents(filterAgents)
  }

  const handleDeleteAgent = ({ id, name }) => {
    deleteAgentMutation.mutate({ id, name })
  }

  const columns = [
    {
      title: '',
      width: 50,
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      render: (value) => <Avatar>{value?.[0].toUpperCase()}</Avatar>
    },
    {
      title: 'Nama Agent',
      width: 150,
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      sortOrder: getSortOrder(filterAgents.sortBy, 'name', filterAgents.sortOrder)
    },
    {
      title: 'Username',
      width: 120,
      dataIndex: 'username',
      key: 'username',
      sorter: true,
      sortOrder: getSortOrder(filterAgents.sortBy, 'username', filterAgents.sortOrder)
    },
     {
      title: 'Role',
      width: 100,
      dataIndex: 'role',
      key: 'role',
      render: (value) => value || '-'
      // sorter: true,
      // sortOrder: getSortOrder(filterUsers.sortBy, 'name', filterUsers.sortOrder)
    },
    {
      title: 'Handphone',
      width: 150,
      dataIndex: 'phone',
      key: 'phone',
      sorter: true,
      sortOrder: getSortOrder(filterAgents.sortBy, 'phone', filterAgents.sortOrder)
    },
    {
      title: 'Email',
      width: 250,
      dataIndex: 'email',
      key: 'email',
      sorter: true,
      sortOrder: getSortOrder(filterAgents.sortBy, 'email', filterAgents.sortOrder)
    },
    {
      title: 'Identitas',
      width: 100,
      dataIndex: 'identityType',
      key: 'identityType',
      render: (value) => value === '0' ? 'KTP' : '-'
    },
    {
      title: 'Bank',
      width: 150,
      dataIndex: 'bankName',
      key: 'bankName',
      sorter: true,
      sortOrder: getSortOrder(filterAgents.sortBy, 'bankName', filterAgents.sortOrder),
    },
    {
      title: 'No Rekening',
      width: 150,
      dataIndex: 'accountNumber',
      key: 'accountNumber',
      sorter: true,
      sortOrder: getSortOrder(filterAgents.sortBy, 'accountNumber', filterAgents.sortOrder),
    },
    {
      title: 'Aktif',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      align: 'center',
      render: (value) => value ? <CheckCircleFilled style={{ color: "#52c41a" }} /> : <CloseCircleFilled style={{ color: "#ff4d4f" }} />,
      sorter: true,
      sortOrder: getSortOrder(filterAgents.sortBy, 'isActive', filterAgents.sortOrder)
    },
    {
      title: 'Updated By',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
      width: 120,
      sorter: true,
      sortOrder: getSortOrder(filterAgents.sortBy, 'updatedBy', filterAgents.sortOrder),
      render: (value) => value || '-'
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 120,
      sorter: true,
      sortOrder: getSortOrder(filterAgents.sortBy, 'createdBy', filterAgents.sortOrder)
    },
    {
      title: 'Updated At',
      width: 150,
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (value) => value ? moment(value).format('YYYY-MM-DD HH:mm') : '-',
      sorter: true,
      sortOrder: getSortOrder(filterAgents.sortBy, 'updatedAt', filterAgents.sortOrder)
    },
    {
      title: 'Created At',
      width: 150,
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value) => moment(value).format('YYYY-MM-DD HH:mm'),
      sorter: true,
      sortOrder: getSortOrder(filterAgents.sortBy, 'createdAt', filterAgents.sortOrder)
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
              title={`Hapus agent ${values.name} ?`}
              placement='bottomRight'
              onConfirm={() => handleDeleteAgent(values)}
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
          {/* <Input placeholder='Kode Agent' style={{ maxWidth: 120 }} name='agent_code' allowClear onChange={handleChangeFilter} /> */}
          <Input placeholder='Agent' style={{ maxWidth: 120 }} name='name' allowClear onChange={handleChangeFilter} />
          <Select
            allowClear
            placeholder="Status"
            style={{ width: 120 }}
            onChange={handleChangeStatus}
            options={[
              { value: 'true', label: 'Aktif' },
              { value: 'false', label: 'Tidak Aktif' },
            ]}
          />
          <Button block type='primary' icon={<SearchOutlined />} style={{ maxWidth: 40 }} onClick={handleSubmit} />

        </Flex>
        <Button variant='solid' color='green' icon={<PlusOutlined />} onClick={() => setOpenForm(true)}  >
          New Agent
        </Button>
      </Flex>
      <Table
        rowKey='id'
        size='middle'
        columns={columns}
        dataSource={dataAgents?.data}
        scroll={{ x: 1500, y: `calc(100vh - 400px)` }}
        sticky={{ offsetHeader: 64 }}
        onChange={handleTableChange}
        pagination={{
          total: dataAgents?.paging?.total,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          pageSize: filterAgents.limit,
          showSizeChanger: true,
          pageSizeOptions: [10, 25, 50, 100],
        }}
      />
      <FormAgent open={openForm} data={selectedAgent} onCloseForm={handleCloseForm} onOpenResult={handleOpenResult} />
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

export default AgentPage;