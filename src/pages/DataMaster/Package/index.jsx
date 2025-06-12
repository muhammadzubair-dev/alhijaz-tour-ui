import { ResultSuccess } from '@/components';
import queryClient from '@/lib/queryClient';
import { apiDeletePackage, apiFetchPackages } from '@/services/masterService';
import getSortOrder from '@/utils/getSortOrder';
import { CheckCircleFilled, CloseCircleFilled, DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Flex, Input, notification, Popconfirm, Select, Space, Table, Tooltip, Typography } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PackagePage = () => {
  const navigate = useNavigate()
  const [openResult, setOpenResult] = useState({
    open: false,
    title: '',
    subtitle: ''
  })
  const [filterPackages, setFilterPackages] = useState({
    page: 1,
    limit: 10,
    sortBy: null,
    sortOrder: null,
    bookingCode: '',
    partnerName: '',
    status: '',
  })
  const [api, contextHolder] = notification.useNotification();
  const { data: dataPackages, refetch: refetchPackages } = useQuery({
    queryKey: ['packages', filterPackages.page, filterPackages.limit, filterPackages.sortBy, filterPackages.sortOrder],
    queryFn: () => apiFetchPackages(filterPackages),
  });

  const deletePackageMutation = useMutation({
    mutationFn: (data) => apiDeletePackage(data),
    onSuccess: (data, variable) => {
      api.open({
        message: 'Paket Berhasil Dihapus',
        description: `Paket "${variable.name}" telah berhasil dihapus dan tidak akan lagi tersedia di dalam sistem.`,
        showProgress: true,
        pauseOnHover: true,
      });
      queryClient.invalidateQueries(['packages'])
    }
  })

  const handleOpenResult = (values) => {
    setOpenResult((prevState) => ({
      ...prevState,
      ...values
    }))
  }

  const handleChangeFilter = (e) => {
    setFilterPackages((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const handleChangeStatus = (value) => {
    setFilterPackages((prevState) => ({
      ...prevState,
      status: value
    }))
  }

  const handleTableChange = (pagination, filters, sorter) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    setFilterPackages(prev => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
      sortBy: singleSorter?.field || null,
      sortOrder: singleSorter?.order ? (singleSorter.order === 'ascend' ? 'asc' : 'desc') : null,
    }));
  };

  const handleSubmit = () => {
    refetchPackages(filterPackages)
  }

  const handleDeletePackage = ({ id, name }) => {
    deletePackageMutation.mutate({ id, name })
  }

  const columns = [
    {
      title: 'ID',
      width: 100,
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      sortOrder: getSortOrder(filterPackages.sortBy, 'id', filterPackages.sortOrder),
    },
    {
      title: 'Nama Paket',
      width: 150,
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      sortOrder: getSortOrder(filterPackages.sortBy, 'name', filterPackages.sortOrder)
    },
    {
      title: 'Kode Booking',
      width: 100,
      dataIndex: 'bookingCode',
      key: 'bookingCode',
      sorter: true,
      sortOrder: getSortOrder(filterPackages.sortBy, 'bookingCode', filterPackages.sortOrder),
      render: (value, values) =>
        <Typography.Link onClick={() => navigate(`/data-master/ticket/${values.bookingCodeId}`)}>
          {value}
        </Typography.Link>
    },
    {
      title: 'Tour Lead',
      width: 150,
      dataIndex: 'tourLead',
      key: 'tourLead',
    },
    {
      title: 'Promo ?',
      width: 100,
      dataIndex: 'isPromo',
      key: 'isPromo',
      sorter: true,
      sortOrder: getSortOrder(filterPackages.sortBy, 'isPromo', filterPackages.sortOrder),
      render: (value) => value ? 'Ya' : 'Tidak'
    },
    {
      title: 'Status',
      width: 100,
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      sortOrder: getSortOrder(filterPackages.sortBy, 'status', filterPackages.sortOrder),
      render: (value) => value === "1" ? <CheckCircleFilled style={{ color: "#52c41a" }} /> : <CloseCircleFilled style={{ color: "#ff4d4f" }} />,
    },
    {
      title: 'Updated By',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
      width: 100,
      sorter: true,
      sortOrder: getSortOrder(filterPackages.sortBy, 'updatedBy', filterPackages.sortOrder),
      render: (value) => value ?? '-'
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 100,
      sorter: true,
      sortOrder: getSortOrder(filterPackages.sortBy, 'createdBy', filterPackages.sortOrder)
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 100,
      render: (value) => value ? moment(value).format('YYYY-MM-DD HH:mm') : '-',
      sorter: true,
      sortOrder: getSortOrder(filterPackages.sortBy, 'updatedAt', filterPackages.sortOrder)
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
      render: (value) => moment(value).format('YYYY-MM-DD HH:mm'),
      sorter: true,
      sortOrder: getSortOrder(filterPackages.sortBy, 'createdAt', filterPackages.sortOrder)
    },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (values) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              color='blue'
              variant='text'
              shape="circle"
              size='small'
              icon={<EditOutlined />}
              onClick={() => navigate(`/data-master/package/${values.id}`)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title={`Hapus package ${values.name} ?`}
              placement='bottomRight'
              onConfirm={() => handleDeletePackage(values)}
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
          <Input placeholder='Cari ID' style={{ maxWidth: 150 }} name='id' allowClear onChange={handleChangeFilter} />
          <Input placeholder='Nama Paket' style={{ maxWidth: 150 }} name='name' allowClear onChange={handleChangeFilter} />
          <Input placeholder='Kode Booking' style={{ maxWidth: 150 }} name='bookingCode' allowClear onChange={handleChangeFilter} />
          <Select
            allowClear
            placeholder="Status"
            style={{ width: 120 }}
            onChange={handleChangeStatus}
            options={[
              { value: '1', label: 'Aktif' },
              { value: '0', label: 'Tidak Aktif' },
            ]}
          />
          <Button block type='primary' icon={<SearchOutlined />} style={{ maxWidth: 40 }} onClick={handleSubmit} />

        </Flex>
        <Button
          variant='solid'
          color='green'
          icon={<PlusOutlined />}
          onClick={() => navigate('/data-master/package/new-package')}
        >
          New Package
        </Button>
      </Flex>
      <Table
        rowKey='id'
        size='middle'
        columns={columns}
        dataSource={dataPackages?.data}
        scroll={{ x: 1500, y: `calc(100vh - 400px)` }}
        sticky={{ offsetHeader: 64 }}
        onChange={handleTableChange}
        pagination={{
          total: dataPackages?.paging?.total,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          pageSize: filterPackages.limit,
          showSizeChanger: true,
          pageSizeOptions: [10, 25, 50, 100],
        }}
      />
      <ResultSuccess open={openResult} onOpenResult={handleOpenResult} />
    </div>
  );
};

export default PackagePage;