import { ResultSuccess } from '@/components';
import queryClient from '@/lib/queryClient';
import { apiDeleteUmrohJamaah, apiFetchJamaahUmroh } from '@/services/umrohService';
import getSortOrder from '@/utils/getSortOrder';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Flex, Input, message, Popconfirm, Space, Table, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EditUmroh from './components/FormEditPackage';

const JamaahUmrohPage = () => {
  const { kodeUmroh } = useParams()
  const navigate = useNavigate()
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
    queryKey: ['umroh-jamaah', kodeUmroh, filterUmrohs.page, filterUmrohs.limit, filterUmrohs.sortBy, filterUmrohs.sortOrder],
    queryFn: () => apiFetchJamaahUmroh(kodeUmroh, filterUmrohs),
  });

  const deleteUmrohMutation = useMutation({
    mutationFn: apiDeleteUmrohJamaah,
    onSuccess: (data) => {
      message.success(`Data Jamaah Umroh ${data.data.registerId} telah berhasil dihapus`)
      queryClient.invalidateQueries(['umroh'])
    }
  })

  const handleCloseForm = () => {
    setSelectedUmroh(null)
    setOpenForm(false)
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

  const handleDeleteUmroh = ({ registerId }) => {
    deleteUmrohMutation.mutate(registerId)
  }

  const columns = [
    {
      title: 'Nama Jamaah',
      width: 120,
      dataIndex: 'jamaahName',
      key: 'jamaahName',
      sorter: true,
      sortOrder: getSortOrder(filterUmrohs.sortBy, 'jamaahName', filterUmrohs.sortOrder),
    },
    {
      title: 'Tipe Paket',
      width: 100,
      dataIndex: 'typePackage',
      key: 'typePackage',
    },
    {
      title: 'Tipe Kamar',
      width: 80,
      dataIndex: 'roomPackage',
      key: 'roomPackage',
    },
    {
      title: 'Status Pembayaran',
      width: 80,
      dataIndex: 'roomPackage',
      key: 'roomPackage',
      render: () => <Tag color='red'>Belum Bayar</Tag>
    },
    {
      title: 'Nama Pendaftar',
      width: 100,
      dataIndex: 'registerName',
      key: 'registerName',
    },
    {
      title: 'Hp/Tlp',
      width: 80,
      dataIndex: 'registerPhone',
      key: 'registerPhone',
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
    // {
    //   title: 'Updated At',
    //   dataIndex: 'updatedAt',
    //   key: 'updatedAt',
    //   width: 100,
    //   render: (value) => value ? moment(value).format('YYYY-MM-DD HH:mm') : '-',
    //   sorter: true,
    //   sortOrder: getSortOrder(filterUmrohs.sortBy, 'updatedAt', filterUmrohs.sortOrder)
    // },
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
          {/* <Tooltip title="Tambah Jamaah">
            <Button
              color='blue'
              variant='text'
              shape="circle"
              size='small'
              icon={<LuUserPlus size={17} />}
              onClick={() => navigate(`/pendaftaran/umroh/daftar-umroh/${values.id}`)}
            />
          </Tooltip> */}
          <Tooltip title="Detail">
            <Button
              color='blue'
              variant='text'
              shape="circle"
              size='small'
              icon={<EyeOutlined />}
              onClick={() => navigate(`/pendaftaran/umroh/${kodeUmroh}/jamaah/${values.registerId}/detail`)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              color='blue'
              variant='text'
              shape="circle"
              size='small'
              icon={<EditOutlined />}
              onClick={() => navigate(`/pendaftaran/umroh/${kodeUmroh}/jamaah/${values.registerId}`)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title={`Hapus Jamaah umroh ${values.jamaahName} ?`}
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
          <Input placeholder='kode Umroh' style={{ maxWidth: 150 }} name='registerName' allowClear onChange={handleChangeFilter} />
          {/* <Input placeholder='No. Hp/Tlp' style={{ maxWidth: 150 }} name='registerPhone' allowClear onChange={handleChangeFilter} /> */}
          {/* <Select
            allowClear
            placeholder="Status"
            style={{ width: 120 }}
            onChange={handleChangeStatus}
            options={[
              { value: '1', label: 'Aktif' },
              { value: '0', label: 'Tidak Aktif' },
            ]}
          /> */}
          <Button block type='primary' icon={<SearchOutlined />} style={{ maxWidth: 40 }} onClick={handleSubmit} />

        </Flex>
        <Button variant='solid' color='green' icon={<PlusOutlined />} onClick={() => navigate('/pendaftaran/umroh/daftar-umroh')}  >
          Daftar Umroh
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
      <EditUmroh open={openForm} data={selectedUmroh} onCloseForm={handleCloseForm} onOpenResult={handleOpenResult} />
      <ResultSuccess open={openResult} onOpenResult={handleOpenResult} />
    </div>
  );
};

export default JamaahUmrohPage;