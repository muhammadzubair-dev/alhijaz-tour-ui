import { ResultSuccess } from '@/components';
import queryClient from '@/lib/queryClient';
import { apiDeleteMasterSosmed, apiFetchMasterSosmeds } from '@/services/masterService';
import getSortOrder from '@/utils/getSortOrder';
import { CheckCircleFilled, CloseCircleFilled, DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Flex, Input, notification, Popconfirm, Select, Space, Table, Tooltip } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import FormSosmed from './FormSosmed';

const SosmedPage = () => {
  const [openForm, setOpenForm] = useState(false)
  const [openResult, setOpenResult] = useState({
    open: false,
    title: '',
    subtitle: ''
  })
  const [filterSosmeds, setFilterSosmeds] = useState({
    page: 1,
    limit: 10,
    sortBy: null,
    sortOrder: null,
    name: '',
    isActive: null,
  })
  const [selectedSosmed, setSelectedSosmed] = useState(null);
  const [api, contextHolder] = notification.useNotification();
  const { data: dataSosmeds, refetch: refetchSosmeds } = useQuery({
    queryKey: ['sosmeds', filterSosmeds.page, filterSosmeds.limit, filterSosmeds.sortBy, filterSosmeds.sortOrder],
    queryFn: () => apiFetchMasterSosmeds(filterSosmeds),
  });

  const deleteSosmedMutation = useMutation({
    mutationFn: (data) => apiDeleteMasterSosmed(data),
    onSuccess: (data, variable) => {
      api.open({
        message: 'Social Media Berhasil Dihapus',
        description: `Social Media ${variable.name} telah berhasil dihapus dan tidak dapat lagi mengakses sistem.`,
        showProgress: true,
        pauseOnHover: true,
      });
      queryClient.invalidateQueries(['sosmeds'])
    }
  })

  const handleCloseForm = () => {
    setSelectedSosmed(null)
    setOpenForm(false)
  }

  const handleOpenFormEdit = (data) => {
    setSelectedSosmed(data)
    setOpenForm(true)
  }

  const handleOpenResult = (values) => {
    setOpenResult((prevState) => ({
      ...prevState,
      ...values
    }))
  }

  const handleChangeFilter = (e) => {
    setFilterSosmeds((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const handleChangeStatus = (value) => {
    setFilterSosmeds((prevState) => ({
      ...prevState,
      isActive: value
    }))
  }

  const handleTableChange = (pagination, filters, sorter) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    setFilterSosmeds(prev => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
      sortBy: singleSorter?.field || null,
      sortOrder: singleSorter?.order ? (singleSorter.order === 'ascend' ? 'asc' : 'desc') : null,
    }));
  };

  const handleSubmit = () => {
    refetchSosmeds(filterSosmeds)
  }

  const handleDeleteSosmed = ({ id, name }) => {
    deleteSosmedMutation.mutate({ id, name })
  }

  const columns = [
    {
      title: 'Social Media',
      width: 100,
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      sortOrder: getSortOrder(filterSosmeds.sortBy, 'name', filterSosmeds.sortOrder)
    },
    {
      title: 'Aktif',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      align: 'center',
      render: (value) => value ? <CheckCircleFilled style={{ color: "#52c41a" }} /> : <CloseCircleFilled style={{ color: "#ff4d4f" }} />,
      sorter: true,
      sortOrder: getSortOrder(filterSosmeds.sortBy, 'isActive', filterSosmeds.sortOrder)
    },
    {
      title: 'Updated By',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
      width: 100,
      sorter: true,
      sortOrder: getSortOrder(filterSosmeds.sortBy, 'updatedBy', filterSosmeds.sortOrder)
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 100,
      sorter: true,
      sortOrder: getSortOrder(filterSosmeds.sortBy, 'createdBy', filterSosmeds.sortOrder)
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 100,
      render: (value) => moment(value).format('YYYY-MM-DD HH:mm'),
      sorter: true,
      sortOrder: getSortOrder(filterSosmeds.sortBy, 'updatedAt', filterSosmeds.sortOrder)
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
      render: (value) => moment(value).format('YYYY-MM-DD HH:mm'),
      sorter: true,
      sortOrder: getSortOrder(filterSosmeds.sortBy, 'createdAt', filterSosmeds.sortOrder)
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
              title={`Hapus Social Media ${values.name} ?`}
              placement='bottomRight'
              onConfirm={() => handleDeleteSosmed(values)}
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
          <Input placeholder='Sosmed' style={{ maxWidth: 120 }} name='name' allowClear onChange={handleChangeFilter} />
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
          New Social Media
        </Button>
      </Flex>
      <Table
        rowKey='id'
        size='middle'
        columns={columns}
        dataSource={dataSosmeds?.data}
        scroll={{ x: 1500, y: `calc(100vh - 380px)` }}
        sticky={{ offsetHeader: 64 }}
        onChange={handleTableChange}
        pagination={{
          total: dataSosmeds?.paging?.total,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          pageSize: filterSosmeds.limit,
          showSizeChanger: true,
          pageSizeOptions: [10, 25, 50, 100],
        }}
      />
      <FormSosmed open={openForm} data={selectedSosmed} onCloseForm={handleCloseForm} onOpenResult={handleOpenResult} />
      <ResultSuccess open={openResult} onOpenResult={handleOpenResult} />
    </div>
  );
};

export default SosmedPage;