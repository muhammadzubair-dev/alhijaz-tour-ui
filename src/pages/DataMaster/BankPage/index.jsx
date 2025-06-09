import { ResultSuccess } from '@/components';
import queryClient from '@/lib/queryClient';
import { apiDeleteMasterBank, apiFetchMasterBanks } from '@/services/masterService';
import getSortOrder from '@/utils/getSortOrder';
import { CheckCircleFilled, CloseCircleFilled, DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Flex, Input, notification, Popconfirm, Select, Space, Table, Tooltip } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import FormBank from './FormBank';

const BankPage = () => {
  const [openForm, setOpenForm] = useState(false)
  const [openResult, setOpenResult] = useState({
    open: false,
    title: '',
    subtitle: ''
  })
  const [filterBanks, setFilterBanks] = useState({
    page: 1,
    limit: 10,
    sortBy: null,
    sortOrder: null,
    bankCode: '',
    name: '',
    isActive: null,
  })
  const [selectedBank, setSelectedBank] = useState(null);
  const [api, contextHolder] = notification.useNotification();
  const { data: dataBanks, refetch: refetchBanks } = useQuery({
    queryKey: ['banks', filterBanks.page, filterBanks.limit, filterBanks.sortBy, filterBanks.sortOrder],
    queryFn: () => apiFetchMasterBanks(filterBanks),
  });

  const deleteBankMutation = useMutation({
    mutationFn: (data) => apiDeleteMasterBank(data),
    onSuccess: (data, variable) => {
      api.open({
        message: 'Bank Berhasil Dihapus',
        description: `Bank ${variable.name} telah berhasil dihapus dan tidak dapat lagi mengakses sistem.`,
        showProgress: true,
        pauseOnHover: true,
      });
      queryClient.invalidateQueries(['banks'])
    }
  })

  const handleCloseForm = () => {
    setSelectedBank(null)
    setOpenForm(false)
  }

  const handleOpenFormEdit = (data) => {
    setSelectedBank(data)
    setOpenForm(true)
  }

  const handleOpenResult = (values) => {
    setOpenResult((prevState) => ({
      ...prevState,
      ...values
    }))
  }

  const handleChangeFilter = (e) => {
    setFilterBanks((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const handleChangeStatus = (value) => {
    setFilterBanks((prevState) => ({
      ...prevState,
      isActive: value
    }))
  }

  const handleTableChange = (pagination, filters, sorter) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    setFilterBanks(prev => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
      sortBy: singleSorter?.field || null,
      sortOrder: singleSorter?.order ? (singleSorter.order === 'ascend' ? 'asc' : 'desc') : null,
    }));
  };

  const handleSubmit = () => {
    refetchBanks(filterBanks)
  }

  const handleDeleteBank = ({ id, name }) => {
    deleteBankMutation.mutate({ id, name })
  }

  const columns = [
    {
      title: 'Kode Bank',
      width: 100,
      dataIndex: 'bankCode',
      key: 'bankCode',
      sorter: true,
      sortOrder: getSortOrder(filterBanks.sortBy, 'bankCode', filterBanks.sortOrder)
    },
    {
      title: 'Bank',
      width: 100,
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      sortOrder: getSortOrder(filterBanks.sortBy, 'name', filterBanks.sortOrder)
    },
    {
      title: 'Aktif',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      align: 'center',
      render: (value) => value ? <CheckCircleFilled style={{ color: "#52c41a" }} /> : <CloseCircleFilled style={{ color: "#ff4d4f" }} />,
      sorter: true,
      sortOrder: getSortOrder(filterBanks.sortBy, 'isActive', filterBanks.sortOrder)
    },
    {
      title: 'Updated By',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
      width: 100,
      sorter: true,
      sortOrder: getSortOrder(filterBanks.sortBy, 'updatedBy', filterBanks.sortOrder)
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 100,
      sorter: true,
      sortOrder: getSortOrder(filterBanks.sortBy, 'createdBy', filterBanks.sortOrder)
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 100,
      render: (value) => moment(value).format('YYYY-MM-DD HH:mm'),
      sorter: true,
      sortOrder: getSortOrder(filterBanks.sortBy, 'updatedAt', filterBanks.sortOrder)
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
      render: (value) => moment(value).format('YYYY-MM-DD HH:mm'),
      sorter: true,
      sortOrder: getSortOrder(filterBanks.sortBy, 'createdAt', filterBanks.sortOrder)
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
              title={`Hapus bank ${values.name} ?`}
              placement='bottomRight'
              onConfirm={() => handleDeleteBank(values)}
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
          <Input placeholder='Kode Bank' style={{ maxWidth: 120 }} name='bank_code' allowClear onChange={handleChangeFilter} />
          <Input placeholder='Bank' style={{ maxWidth: 120 }} name='name' allowClear onChange={handleChangeFilter} />
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
          New Bank
        </Button>
      </Flex>
      <Table
        rowKey='id'
        size='middle'
        columns={columns}
        dataSource={dataBanks?.data}
        scroll={{ x: 1500, y: `calc(100vh - 400px)` }}
        sticky={{ offsetHeader: 64 }}
        onChange={handleTableChange}
        pagination={{
          total: dataBanks?.paging?.total,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          pageSize: filterBanks.limit,
          showSizeChanger: true,
          pageSizeOptions: [10, 25, 50, 100],
        }}
      />
      <FormBank open={openForm} data={selectedBank} onCloseForm={handleCloseForm} onOpenResult={handleOpenResult} />
      <ResultSuccess open={openResult} onOpenResult={handleOpenResult} />
    </div>
  );
};

export default BankPage;