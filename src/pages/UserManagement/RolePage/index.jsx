import { ResultSuccess } from '@/components';
import queryClient from '@/lib/queryClient';
import { apiDeleteUserRole, apiFetchUsersRoles } from '@/services/userService';
import getSortOrder from '@/utils/getSortOrder';
import { CheckCircleFilled, CloseCircleFilled, DeleteOutlined, EditOutlined, MenuUnfoldOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Flex, Input, notification, Popconfirm, Select, Space, Table, Tooltip } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import FormRole from './FormRole';
import ListMenu from './ListMenu';

const RolePage = () => {
  const [openForm, setOpenForm] = useState(false)
  const [openFormMenu, setOpenFormMenu] = useState(false)
  const [openResult, setOpenResult] = useState({
    open: false,
    title: '',
    subtitle: ''
  })
  const [filterRoles, setFilterRoles] = useState({
    page: 1,
    limit: 10,
    sortBy: null,
    sortOrder: null,
    name: '',
    type: '',
    isActive: null,
    platform: null,
  })
  const [selectedRole, setSelectedRole] = useState(null);
  const [api, contextHolder] = notification.useNotification();
  const { data: dataRoles, refetch: refetchRoles } = useQuery({
    queryKey: ['roles', filterRoles.page, filterRoles.limit, filterRoles.sortBy, filterRoles.sortOrder],
    queryFn: () => apiFetchUsersRoles(filterRoles),
  });

  const deleteRoleMutation = useMutation({
    mutationFn: (data) => apiDeleteUserRole(data),
    onSuccess: (data, variable) => {
      api.open({
        message: 'Role Berhasil Dihapus',
        description: `Role ${variable.name} telah berhasil dihapus dan tidak dapat lagi mengakses sistem.`,
        showProgress: true,
        pauseOnHover: true,
      });
      queryClient.invalidateQueries(['roles'])
    }
  })

  const handleCloseForm = () => {
    setSelectedRole(null)
    setOpenForm(false)
  }

  const handleCloseFormMenu = () => {
    setSelectedRole(null)
    setOpenFormMenu(false)
  }

  const handleOpenFormEdit = (data) => {
    setSelectedRole(data)
    setOpenForm(true)
  }

  const handleOpenFormMenu = (data) => {
    setSelectedRole(data)
    setOpenFormMenu(true)
  }

  const handleOpenResult = (values) => {
    setOpenResult((prevState) => ({
      ...prevState,
      ...values
    }))
  }

  const handleChangeFilter = (e) => {
    setFilterRoles((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const handleChangeType = (value) => {
    setFilterRoles((prevState) => ({
      ...prevState,
      type: value
    }))
  }

  const handleChangeStatus = (value) => {
    setFilterRoles((prevState) => ({
      ...prevState,
      isActive: value
    }))
  }

  const handleChangePlatform = (value) => {
    setFilterRoles((prevState) => ({
      ...prevState,
      platform: value
    }))
  }

  const handleTableChange = (pagination, filters, sorter) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    setFilterRoles(prev => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
      sortBy: singleSorter?.field || null,
      sortOrder: singleSorter?.order ? (singleSorter.order === 'ascend' ? 'asc' : 'desc') : null,
    }));
  };

  const handleSubmit = () => {
    refetchRoles(filterRoles)
  }

  const handleDeleteRole = ({ id, name }) => {
    deleteRoleMutation.mutate({ id, name })
  }

  const columns = [
    {
      title: 'Role',
      width: 100,
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      sortOrder: getSortOrder(filterRoles.sortBy, 'name', filterRoles.sortOrder)
    },

    {
      title: 'Tipe',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (value) => value === '1' ? 'Agent' : 'Staff'
    },
    {
      title: 'Platform',
      width: 100,
      dataIndex: 'platform',
      key: 'platform',
      sorter: true,
      render: (value) => value === '0' ? 'Travel' : '-'
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
      title: 'Description',
      width: 150,
      dataIndex: 'description',
      key: 'description',
      sorter: true,
      sortOrder: getSortOrder(filterRoles.sortBy, 'description', filterRoles.sortOrder)
    },
    // {
    //   title: 'Updated By',
    //   dataIndex: 'updatedBy',
    //   key: 'updatedBy',
    //   width: 100,
    // },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 100,
    },
    // {
    //   title: 'Updated At',
    //   dataIndex: 'updatedAt',
    //   key: 'updatedAt',
    //   width: 100,
    //   render: (value) => moment(value).format('YYYY-MM-DD HH:mm')
    // },
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
          <Tooltip title="Menu">
            <Button color='blue' variant='text' shape="circle" size='small' icon={<MenuUnfoldOutlined />} onClick={() => handleOpenFormMenu(values)} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button color='blue' variant='text' shape="circle" size='small' icon={<EditOutlined />} onClick={() => handleOpenFormEdit(values)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title={`Hapus role ${values.name} ?`}
              placement='bottomRight'
              onConfirm={() => handleDeleteRole(values)}
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
          <Input placeholder='Role' style={{ maxWidth: 120 }} name='name' allowClear onChange={handleChangeFilter} />
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
            placeholder="Platform"
            style={{ width: 120 }}
            onChange={handleChangePlatform}
            options={[
              { value: '0', label: 'Travel' },
            ]}
          />
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
          New Role
        </Button>
      </Flex>
      <Table
        rowKey='id'
        size='middle'
        columns={columns}
        dataSource={dataRoles?.data}
        scroll={{ x: 1500, y: `calc(100vh - 400px)` }}
        sticky={{ offsetHeader: 64 }}
        onChange={handleTableChange}
        pagination={{
          total: dataRoles?.paging?.total,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          pageSize: filterRoles.limit,
          showSizeChanger: true,
          pageSizeOptions: [10, 25, 50, 100],
        }}
      />
      <FormRole
        open={openForm}
        data={selectedRole}
        onCloseForm={handleCloseForm}
        onOpenResult={handleOpenResult}
      />
      <ResultSuccess
        open={openResult}
        onOpenResult={handleOpenResult}
      />
      <ListMenu
        open={openFormMenu}
        data={selectedRole}
        onCloseForm={handleCloseFormMenu}
        onOpenResult={handleOpenResult}
      />
    </div>
  );
};

export default RolePage;