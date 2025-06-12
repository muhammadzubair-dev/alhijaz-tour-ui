import { ResultSuccess } from '@/components';
import queryClient from '@/lib/queryClient';
import { apiDeleteUmroh, apiFetchUmrohs } from '@/services/masterService';
import getSortOrder from '@/utils/getSortOrder';
import { CheckCircleFilled, CloseCircleFilled, DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Flex, Input, message, Popconfirm, Select, Space, Table, Tooltip } from 'antd';
import moment from 'moment';
import { useState } from 'react';
// import FormUmroh from './FormUmroh';

const UmrohPage = () => {
  const [openForm, setOpenForm] = useState(false)
  const [openResult, setOpenResult] = useState({
    open: false,
    title: '',
    subtitle: ''
  })
  const [filterUmrohs, setFilterUmrohs] = useState({
    page: 1,
    limit: 10,
    sortBy: null,
    sortOrder: null,
    name: '',
    status: null,
  })
  const [selectedUmroh, setSelectedUmroh] = useState(null);
  const { data: dataUmrohs, refetch: refetchUmrohs } = useQuery({
    queryKey: ['register-umroh', filterUmrohs.page, filterUmrohs.limit, filterUmrohs.sortBy, filterUmrohs.sortOrder],
    queryFn: () => apiFetchUmrohs(filterUmrohs),
  });

  const deleteUmrohMutation = useMutation({
    mutationFn: (data) => apiDeleteUmroh(data),
    onSuccess: (data, variable) => {
      message.success(`Data Umroh ${variable.name} telah berhasil dihapus`)
      queryClient.invalidateQueries(['umrohs'])
    }
  })

  const handleCloseForm = () => {
    setSelectedUmroh(null)
    setOpenForm(false)
  }

  const handleOpenFormEdit = (data) => {
    setSelectedUmroh(data)
    setOpenForm(true)
  }

  const handleOpenResult = (values) => {
    setOpenResult((prevState) => ({
      ...prevState,
      ...values
    }))
  }

  const handleChangeFilter = (e) => {
    setFilterUmrohs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const handleChangeStatus = (value) => {
    setFilterUmrohs((prevState) => ({
      ...prevState,
      status: value
    }))
  }

  const handleTableChange = (pagination, filters, sorter) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    setFilterUmrohs(prev => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
      sortBy: singleSorter?.field || null,
      sortOrder: singleSorter?.order ? (singleSorter.order === 'ascend' ? 'asc' : 'desc') : null,
    }));
  };

  const handleSubmit = () => {
    refetchUmrohs(filterUmrohs)
  }

  const handleDeleteUmroh = ({ id, name }) => {
    deleteUmrohMutation.mutate({ id, name })
  }

  const columns = [
    {
      title: 'Nama Umroh',
      width: 150,
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      sortOrder: getSortOrder(filterUmrohs.sortBy, 'name', filterUmrohs.sortOrder)
    },
    {
      title: 'Aktif',
      dataIndex: 'status',
      key: 'status',
      width: 70,
      align: 'center',
      render: (value) => value === '1' ? <CheckCircleFilled style={{ color: "#52c41a" }} /> : <CloseCircleFilled style={{ color: "#ff4d4f" }} />,
      sorter: true,
      sortOrder: getSortOrder(filterUmrohs.sortBy, 'status', filterUmrohs.sortOrder)
    },
    {
      title: 'Updated By',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
      width: 100,
      sorter: true,
      sortOrder: getSortOrder(filterUmrohs.sortBy, 'updatedBy', filterUmrohs.sortOrder),
      render: (value) => value || '-'
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 100,
      sorter: true,
      sortOrder: getSortOrder(filterUmrohs.sortBy, 'createdBy', filterUmrohs.sortOrder),
      render: (value) => value || '-'
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 100,
      render: (value) => value ? moment(value).format('YYYY-MM-DD HH:mm') : '-',
      sorter: true,
      sortOrder: getSortOrder(filterUmrohs.sortBy, 'updatedAt', filterUmrohs.sortOrder)
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
      render: (value) => moment(value).format('YYYY-MM-DD HH:mm'),
      sorter: true,
      sortOrder: getSortOrder(filterUmrohs.sortBy, 'createdAt', filterUmrohs.sortOrder)
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
              title={`Hapus umroh ${values.name} ?`}
              placement='bottomRight'
              onConfirm={() => handleDeleteUmroh(values)}
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
          <Input placeholder='Nama Umroh' style={{ maxWidth: 150 }} name='name' allowClear onChange={handleChangeFilter} />
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
          New Umroh
        </Button>
      </Flex>
      <Table
        rowKey='id'
        size='middle'
        columns={columns}
        dataSource={dataUmrohs?.data}
        scroll={{ x: 1500, y: `calc(100vh - 400px)` }}
        sticky={{ offsetHeader: 64 }}
        onChange={handleTableChange}
        pagination={{
          total: dataUmrohs?.paging?.total,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          pageSize: filterUmrohs.limit,
          showSizeChanger: true,
          pageSizeOptions: [10, 25, 50, 100],
        }}
      />
      {/* <FormUmroh open={openForm} data={selectedUmroh} onCloseForm={handleCloseForm} onOpenResult={handleOpenResult} /> */}
      <ResultSuccess open={openResult} onOpenResult={handleOpenResult} />
    </div>
  );
};

export default UmrohPage;