import { ResultSuccess } from '@/components';
import queryClient from '@/lib/queryClient';
import { apiDeleteUmroh, apiFetchUmroh } from '@/services/umrohService';
import getSortOrder from '@/utils/getSortOrder';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Flex, Input, message, Popconfirm, Space, Table, Tooltip, Typography } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { LuUserPlus } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import FormEditPackage from './components/FormEditPackage';
import HasPermission from '@/layouts/HasPermission';
import { MENU_IDS } from '@/constant/menu';
import useHasPermission from '@/hooks/useHasPermisson';

const UmrohPage = () => {
  const showAction = useHasPermission([
    MENU_IDS.RegisterUmrahAddByCode,
    MENU_IDS.RegisterUmrahDelete,
    MENU_IDS.RegisterUmrahEdit
  ])
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
    queryKey: ['umroh', filterUmrohs.page, filterUmrohs.limit, filterUmrohs.sortBy, filterUmrohs.sortOrder],
    queryFn: () => apiFetchUmroh(filterUmrohs),
  });

  const deleteUmrohMutation = useMutation({
    mutationFn: apiDeleteUmroh,
    onSuccess: (data) => {
      message.success(`Data Umroh ${data.data.umrohCode} telah berhasil dihapus`)
      queryClient.invalidateQueries(['umroh'])
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

  const handleDeleteUmroh = ({ id }) => {
    deleteUmrohMutation.mutate(id)
  }

  const columns = [
    {
      title: 'Kode Umroh',
      width: 100,
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      sortOrder: getSortOrder(filterUmrohs.sortBy, 'id', filterUmrohs.sortOrder),
      render: (value) =>
        <Typography.Link onClick={() => navigate(`/pendaftaran/umroh/${value}/jamaah`)}>
          {value}
        </Typography.Link>
    },
    {
      title: 'Paket Umroh',
      width: 120,
      // dataIndex: 'packageName',
      key: 'packageName',
      render: (value) =>
        <Typography.Link onClick={() => navigate(`/data-master/package/${value.packageId}`)}>
          {value.packageName}
        </Typography.Link>
    },
    {
      title: 'Jumlah Jamaah',
      width: 50,
      align: 'center',
      dataIndex: 'countRegister',
      key: 'countRegister',
    },
    {
      title: 'PIN',
      width: 80,
      align: 'center',
      dataIndex: 'pin',
      key: 'pin',
    },
    // {
    //   title: 'Tour Lead',
    //   width: 120,
    //   dataIndex: 'tourLead',
    //   key: 'tourLead',
    //   render: (value) => value || '-'
    // },
    {
      title: 'Tgl Keberangkatan',
      width: 100,
      dataIndex: 'departureDate',
      key: 'departureDate',
      render: (value) => moment(value).format('DD MMM YYYY')
    },
    // {
    //   title: 'Updated By',
    //   dataIndex: 'updatedBy',
    //   key: 'updatedBy',
    //   width: 100,
    //   sorter: true,
    //   sortOrder: getSortOrder(filterUmrohs.sortBy, 'updatedBy', filterUmrohs.sortOrder),
    //   render: (value) => value || '-'
    // },
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
    ...(showAction ? [
      {
        title: 'Action',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: (values) => (
          <Space>
            <HasPermission menu={MENU_IDS.RegisterUmrahAddByCode}>
              <Tooltip title="Tambah Jamaah">
                <Button
                  color='blue'
                  variant='text'
                  shape="circle"
                  size='small'
                  icon={<LuUserPlus size={17} />}
                  onClick={() => navigate(`/pendaftaran/umroh/daftar-umroh/${values.id}`)}
                />
              </Tooltip>
            </HasPermission>
            <HasPermission menu={MENU_IDS.RegisterUmrahEdit}>
              <Tooltip title="Edit">
                <Button color='blue' variant='text' shape="circle" size='small' icon={<EditOutlined />} onClick={() => handleOpenFormEdit(values)} />
              </Tooltip>
            </HasPermission>
            <HasPermission menu={MENU_IDS.RegisterUmrahDelete}>
              <Tooltip title="Delete">
                <Popconfirm
                  title={`Hapus umroh ${values.id} ?`}
                  placement='bottomRight'
                  onConfirm={() => handleDeleteUmroh(values)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger type="text" shape="circle" size='small' icon={<DeleteOutlined />} />
                </Popconfirm>
              </Tooltip>
            </HasPermission>
          </Space>
        ),
      }] : []
    ),
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
        <HasPermission menu={MENU_IDS.RegisterUmrahAdd}>
          <Button variant='solid' color='green' icon={<PlusOutlined />} onClick={() => navigate('/pendaftaran/umroh/daftar-umroh')}  >
            Daftar Umroh
          </Button>
        </HasPermission>
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
      <FormEditPackage open={openForm} data={selectedUmroh} onCloseForm={handleCloseForm} onOpenResult={handleOpenResult} />
      <ResultSuccess open={openResult} onOpenResult={handleOpenResult} />
    </div>
  );
};

export default UmrohPage;