import { ResultSuccess } from '@/components';
import queryClient from '@/lib/queryClient';
import { apiDeleteAirport, apiFetchAirports } from '@/services/masterService';
import getSortOrder from '@/utils/getSortOrder';
import { CheckCircleFilled, CloseCircleFilled, DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Flex, Input, message, Popconfirm, Select, Space, Table, Tooltip } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import FormAirport from './FormAirport';

const AirportPage = () => {
  const [openForm, setOpenForm] = useState(false)
  const [openResult, setOpenResult] = useState({
    open: false,
    title: '',
    subtitle: ''
  })
  const [filterAirports, setFilterAirports] = useState({
    page: 1,
    limit: 10,
    sortBy: null,
    sortOrder: null,
    code: '',
    name: '',
    status: null,
  })
  const [selectedAirport, setSelectedAirport] = useState(null);
  const { data: dataAirports, refetch: refetchAirports } = useQuery({
    queryKey: ['airports', filterAirports.page, filterAirports.limit, filterAirports.sortBy, filterAirports.sortOrder],
    queryFn: () => apiFetchAirports(filterAirports),
  });

  const deleteAirportMutation = useMutation({
    mutationFn: (data) => apiDeleteAirport(data),
    onSuccess: (data, variable) => {
      message.success(`Airport ${variable.name} telah berhasil dihapus`)
      queryClient.invalidateQueries(['airports'])
    }
  })

  const handleCloseForm = () => {
    setSelectedAirport(null)
    setOpenForm(false)
  }

  const handleOpenFormEdit = (data) => {
    setSelectedAirport(data)
    setOpenForm(true)
  }

  const handleOpenResult = (values) => {
    setOpenResult((prevState) => ({
      ...prevState,
      ...values
    }))
  }

  const handleChangeFilter = (e) => {
    setFilterAirports((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const handleChangeStatus = (value) => {
    setFilterAirports((prevState) => ({
      ...prevState,
      status: value
    }))
  }

  const handleTableChange = (pagination, filters, sorter) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    setFilterAirports(prev => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
      sortBy: singleSorter?.field || null,
      sortOrder: singleSorter?.order ? (singleSorter.order === 'ascend' ? 'asc' : 'desc') : null,
    }));
  };

  const handleSubmit = () => {
    refetchAirports(filterAirports)
  }

  const handleDeleteAirport = ({ code, name }) => {
    deleteAirportMutation.mutate({ code, name })
  }

  const columns = [
    {
      title: 'Kode',
      width: 70,
      dataIndex: 'code',
      key: 'code',
      sorter: true,
      sortOrder: getSortOrder(filterAirports.sortBy, 'code', filterAirports.sortOrder)
    },
    {
      title: 'Nama Airport',
      width: 100,
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      sortOrder: getSortOrder(filterAirports.sortBy, 'name', filterAirports.sortOrder)
    },
    {
      title: 'Aktif',
      dataIndex: 'status',
      key: 'status',
      width: 70,
      align: 'center',
      render: (value) => value === '1' ? <CheckCircleFilled style={{ color: "#52c41a" }} /> : <CloseCircleFilled style={{ color: "#ff4d4f" }} />,
      sorter: true,
      sortOrder: getSortOrder(filterAirports.sortBy, 'status', filterAirports.sortOrder)
    },
    {
      title: 'Updated By',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
      width: 100,
      sorter: true,
      sortOrder: getSortOrder(filterAirports.sortBy, 'updatedBy', filterAirports.sortOrder),
      render: (value) => value || '-'
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 100,
      sorter: true,
      sortOrder: getSortOrder(filterAirports.sortBy, 'createdBy', filterAirports.sortOrder),
      render: (value) => value || '-'
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 100,
      render: (value) => value ? moment(value).format('YYYY-MM-DD HH:mm') : '-',
      sorter: true,
      sortOrder: getSortOrder(filterAirports.sortBy, 'updatedAt', filterAirports.sortOrder)
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
      render: (value) => moment(value).format('YYYY-MM-DD HH:mm'),
      sorter: true,
      sortOrder: getSortOrder(filterAirports.sortBy, 'createdAt', filterAirports.sortOrder)
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
              title={`Hapus airport ${values.name} ?`}
              placement='bottomRight'
              onConfirm={() => handleDeleteAirport(values)}
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
      <Flex justify='space-between' gap={32}>
        <Flex flex={1} gap={8} wrap style={{ marginBottom: 16 }}>
          <Input placeholder='Kode' style={{ maxWidth: 120 }} name='code' allowClear onChange={handleChangeFilter} />
          <Input placeholder='Nama Airport' style={{ maxWidth: 150 }} name='name' allowClear onChange={handleChangeFilter} />
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
        <Button variant='solid' color='green' icon={<PlusOutlined />} onClick={() => setOpenForm(true)}  >
          New Airport
        </Button>
      </Flex>
      <Table
        rowKey='code'
        size='middle'
        columns={columns}
        dataSource={dataAirports?.data}
        scroll={{ x: 1500, y: `calc(100vh - 400px)` }}
        sticky={{ offsetHeader: 64 }}
        onChange={handleTableChange}
        pagination={{
          total: dataAirports?.paging?.total,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          pageSize: filterAirports.limit,
          showSizeChanger: true,
          pageSizeOptions: [10, 25, 50, 100],
        }}
      />
      <FormAirport open={openForm} data={selectedAirport} onCloseForm={handleCloseForm} onOpenResult={handleOpenResult} />
      <ResultSuccess open={openResult} onOpenResult={handleOpenResult} />
    </div>
  );
};

export default AirportPage;