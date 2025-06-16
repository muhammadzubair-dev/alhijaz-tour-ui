import { ResultSuccess } from '@/components';
import queryClient from '@/lib/queryClient';
import { apiDeleteAirline, apiFetchAirlines } from '@/services/masterService';
import getSortOrder from '@/utils/getSortOrder';
import { CheckCircleFilled, CloseCircleFilled, DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Flex, Input, message, Popconfirm, Select, Space, Table, Tooltip } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import FormAirline from './FormAirline';
import useHasPermission from '@/hooks/useHasPermisson';
import { MENU_IDS } from '@/constant/menu';
import HasPermission from '@/layouts/HasPermission';

const AirlinePage = () => {
  const showAction = useHasPermission([
    MENU_IDS.AirlineEdit,
    MENU_IDS.AirlineDelete,
  ])
  const [openForm, setOpenForm] = useState(false)
  const [openResult, setOpenResult] = useState({
    open: false,
    title: '',
    subtitle: ''
  })
  const [filterAirlines, setFilterAirlines] = useState({
    page: 1,
    limit: 10,
    sortBy: null,
    sortOrder: null,
    name: '',
    status: null,
  })
  const [selectedAirline, setSelectedAirline] = useState(null);
  const { data: dataAirlines, refetch: refetchAirlines } = useQuery({
    queryKey: ['airlines', filterAirlines.page, filterAirlines.limit, filterAirlines.sortBy, filterAirlines.sortOrder],
    queryFn: () => apiFetchAirlines(filterAirlines),
  });

  const deleteAirlineMutation = useMutation({
    mutationFn: (data) => apiDeleteAirline(data),
    onSuccess: (data, variable) => {
      message.success(`Airline ${variable.name} telah berhasil dihapus`)
      queryClient.invalidateQueries(['airlines'])
    }
  })

  const handleCloseForm = () => {
    setSelectedAirline(null)
    setOpenForm(false)
  }

  const handleOpenFormEdit = (data) => {
    setSelectedAirline(data)
    setOpenForm(true)
  }

  const handleOpenResult = (values) => {
    setOpenResult((prevState) => ({
      ...prevState,
      ...values
    }))
  }

  const handleChangeFilter = (e) => {
    setFilterAirlines((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const handleChangeStatus = (value) => {
    setFilterAirlines((prevState) => ({
      ...prevState,
      status: value
    }))
  }

  const handleTableChange = (pagination, filters, sorter) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    setFilterAirlines(prev => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
      sortBy: singleSorter?.field || null,
      sortOrder: singleSorter?.order ? (singleSorter.order === 'ascend' ? 'asc' : 'desc') : null,
    }));
  };

  const handleSubmit = () => {
    refetchAirlines(filterAirlines)
  }

  const handleDeleteAirline = ({ id, name }) => {
    deleteAirlineMutation.mutate({ id, name })
  }

  const columns = [
    {
      title: 'Nama Airline',
      width: 150,
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      sortOrder: getSortOrder(filterAirlines.sortBy, 'name', filterAirlines.sortOrder)
    },
    {
      title: 'Aktif',
      dataIndex: 'status',
      key: 'status',
      width: 70,
      align: 'center',
      render: (value) => value === '1' ? <CheckCircleFilled style={{ color: "#52c41a" }} /> : <CloseCircleFilled style={{ color: "#ff4d4f" }} />,
      sorter: true,
      sortOrder: getSortOrder(filterAirlines.sortBy, 'status', filterAirlines.sortOrder)
    },
    // {
    //   title: 'Updated By',
    //   dataIndex: 'updatedBy',
    //   key: 'updatedBy',
    //   width: 100,
    //   sorter: true,
    //   sortOrder: getSortOrder(filterAirlines.sortBy, 'updatedBy', filterAirlines.sortOrder),
    //   render: (value) => value || '-'
    // },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 100,
      sorter: true,
      sortOrder: getSortOrder(filterAirlines.sortBy, 'createdBy', filterAirlines.sortOrder),
      render: (value) => value || '-'
    },
    // {
    //   title: 'Updated At',
    //   dataIndex: 'updatedAt',
    //   key: 'updatedAt',
    //   width: 100,
    //   render: (value) => value ? moment(value).format('YYYY-MM-DD HH:mm') : '-',
    //   sorter: true,
    //   sortOrder: getSortOrder(filterAirlines.sortBy, 'updatedAt', filterAirlines.sortOrder)
    // },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
      render: (value) => moment(value).format('YYYY-MM-DD HH:mm'),
      sorter: true,
      sortOrder: getSortOrder(filterAirlines.sortBy, 'createdAt', filterAirlines.sortOrder)
    },
    ...(showAction ? [{
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (values) => (
        <Space>
          <HasPermission menu={MENU_IDS.AirlineEdit}> <Tooltip title="Edit">
            <Button color='blue' variant='text' shape="circle" size='small' icon={<EditOutlined />} onClick={() => handleOpenFormEdit(values)} />
          </Tooltip></HasPermission>
          <HasPermission menu={MENU_IDS.AirlineDelete}><Tooltip title="Delete">
            <Popconfirm
              title={`Hapus airline ${values.name} ?`}
              placement='bottomRight'
              onConfirm={() => handleDeleteAirline(values)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger type="text" shape="circle" size='small' icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
          </HasPermission>
        </Space>
      ),
    }] : []),
  ];

  return (
    <div>
      <Flex justify='space-between' gap={32}>
        <Flex flex={1} gap={8} wrap style={{ marginBottom: 16 }}>
          <Input placeholder='Nama Airline' style={{ maxWidth: 150 }} name='name' allowClear onChange={handleChangeFilter} />
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
        <HasPermission menu={MENU_IDS.AirlineAdd}>
          <Button variant='solid' color='green' icon={<PlusOutlined />} onClick={() => setOpenForm(true)}  >
            Airline Baru
          </Button>
        </HasPermission>
      </Flex>
      <Table
        rowKey='id'
        size='middle'
        columns={columns}
        dataSource={dataAirlines?.data}
        scroll={{ x: 1500, y: `calc(100vh - 400px)` }}
        sticky={{ offsetHeader: 64 }}
        onChange={handleTableChange}
        pagination={{
          total: dataAirlines?.paging?.total,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          pageSize: filterAirlines.limit,
          showSizeChanger: true,
          pageSizeOptions: [10, 25, 50, 100],
        }}
      />
      <FormAirline open={openForm} data={selectedAirline} onCloseForm={handleCloseForm} onOpenResult={handleOpenResult} />
      <ResultSuccess open={openResult} onOpenResult={handleOpenResult} />
    </div>
  );
};

export default AirlinePage;