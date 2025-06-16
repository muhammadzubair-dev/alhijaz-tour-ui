import { ResultSuccess } from '@/components';
import { MENU_IDS } from '@/constant/menu';
import useHasPermission from '@/hooks/useHasPermisson';
import HasPermission from '@/layouts/HasPermission';
import queryClient from '@/lib/queryClient';
import { apiDeleteTicket, apiFetchTickets } from '@/services/ticketService';
import getSortOrder from '@/utils/getSortOrder';
import { CheckCircleFilled, CloseCircleFilled, DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Flex, Input, notification, Popconfirm, Select, Space, Table, Tooltip } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TicketPage = () => {
  const showAction = useHasPermission([
    MENU_IDS.TicketEdit,
    MENU_IDS.TicketDelete,
  ])
  const navigate = useNavigate()
  const [openResult, setOpenResult] = useState({
    open: false,
    title: '',
    subtitle: ''
  })
  const [filterTickets, setFilterTickets] = useState({
    page: 1,
    limit: 10,
    sortBy: null,
    sortOrder: null,
    bookingCode: '',
    partnerName: '',
    status: '',
  })
  const [api, contextHolder] = notification.useNotification();
  const { data: dataTickets, refetch: refetchTickets } = useQuery({
    queryKey: ['tickets', filterTickets.page, filterTickets.limit, filterTickets.sortBy, filterTickets.sortOrder],
    queryFn: () => apiFetchTickets(filterTickets),
  });

  const deleteTicketMutation = useMutation({
    mutationFn: (data) => apiDeleteTicket(data),
    onSuccess: (data, variable) => {
      api.open({
        message: 'Tiket Berhasil Dihapus',
        description: `Tiket dengan kode booking "${variable.bookingCode}" telah berhasil dihapus dari sistem dan tidak dapat digunakan kembali.`,
        showProgress: true,
        pauseOnHover: true,
      });
      queryClient.invalidateQueries(['tickets'])
    }
  })

  const handleOpenResult = (values) => {
    setOpenResult((prevState) => ({
      ...prevState,
      ...values
    }))
  }

  const handleChangeFilter = (e) => {
    setFilterTickets((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const handleChangeStatus = (value) => {
    setFilterTickets((prevState) => ({
      ...prevState,
      status: value
    }))
  }

  const handleTableChange = (pagination, filters, sorter) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    setFilterTickets(prev => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
      sortBy: singleSorter?.field || null,
      sortOrder: singleSorter?.order ? (singleSorter.order === 'ascend' ? 'asc' : 'desc') : null,
    }));
  };

  const handleSubmit = () => {
    refetchTickets(filterTickets)
  }

  const handleDeleteTicket = ({ id, bookingCode }) => {
    deleteTicketMutation.mutate({ id, bookingCode })
  }

  const columns = [
    {
      title: 'Tanggal',
      width: 100,
      dataIndex: 'transactionDate',
      key: 'transactionDate',
      sorter: true,
      sortOrder: getSortOrder(filterTickets.sortBy, 'transactionDate', filterTickets.sortOrder),
      render: (value) => moment(value).format('YYYY-MM-DD'),
    },
    {
      title: 'Kode Booking',
      width: 100,
      dataIndex: 'bookingCode',
      key: 'bookingCode',
      sorter: true,
      sortOrder: getSortOrder(filterTickets.sortBy, 'bookingCode', filterTickets.sortOrder)
    },
    {
      title: 'Supplier',
      width: 100,
      dataIndex: 'partnerName',
      key: 'partnerName',
      sorter: true,
      sortOrder: getSortOrder(filterTickets.sortBy, 'partnerName', filterTickets.sortOrder)
    },
    {
      title: 'Paket Hari',
      width: 100,
      dataIndex: 'dayPack',
      key: 'dayPack',
      sorter: true,
      sortOrder: getSortOrder(filterTickets.sortBy, 'dayPack', filterTickets.sortOrder)
    },
    {
      title: 'Total Seat',
      width: 100,
      dataIndex: 'seatPack',
      key: 'seatPack',
      sorter: true,
      sortOrder: getSortOrder(filterTickets.sortBy, 'seatPack', filterTickets.sortOrder),
    },
    {
      title: 'Status',
      width: 100,
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      sortOrder: getSortOrder(filterTickets.sortBy, 'status', filterTickets.sortOrder),
      render: (value) => value === "1" ? <CheckCircleFilled style={{ color: "#52c41a" }} /> : <CloseCircleFilled style={{ color: "#ff4d4f" }} />,
    },
    // {
    //   title: 'Updated By',
    //   dataIndex: 'updatedBy',
    //   key: 'updatedBy',
    //   width: 100,
    //   sorter: true,
    //   sortOrder: getSortOrder(filterTickets.sortBy, 'updatedBy', filterTickets.sortOrder),
    //   render: (value) => value || '-'
    // },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 100,
      sorter: true,
      sortOrder: getSortOrder(filterTickets.sortBy, 'createdBy', filterTickets.sortOrder)
    },
    // {
    //   title: 'Updated At',
    //   dataIndex: 'updatedAt',
    //   key: 'updatedAt',
    //   width: 100,
    //   render: (value) => value ? moment(value).format('YYYY-MM-DD HH:mm') : '-',
    //   sorter: true,
    //   sortOrder: getSortOrder(filterTickets.sortBy, 'updatedAt', filterTickets.sortOrder)
    // },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
      render: (value) => moment(value).format('YYYY-MM-DD HH:mm'),
      sorter: true,
      sortOrder: getSortOrder(filterTickets.sortBy, 'createdAt', filterTickets.sortOrder)
    },
    ...(showAction ? [{
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (values) => (
        <Space>
          <HasPermission menu={MENU_IDS.TicketEdit}>
            <Tooltip title="Edit">
              <Button
                color='blue'
                variant='text'
                shape="circle"
                size='small'
                icon={<EditOutlined />}
                onClick={() => navigate(`/data-master/ticket/${values.id}`)}
              />
            </Tooltip>
          </HasPermission>
          <HasPermission menu={MENU_IDS.TicketDelete}>
            <Tooltip title="Delete">
              <Popconfirm
                title={`Hapus ticket ${values.bookingCode} ?`}
                placement='bottomRight'
                onConfirm={() => handleDeleteTicket(values)}
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
      {contextHolder}
      <Flex justify='space-between' gap={32}>
        <Flex flex={1} gap={8} wrap style={{ marginBottom: 16 }}>
          <Input placeholder='Kode Booking' style={{ maxWidth: 150 }} name='bookingCode' allowClear onChange={handleChangeFilter} />
          <Input placeholder='Supplier' style={{ maxWidth: 120 }} name='partnerName' allowClear onChange={handleChangeFilter} />
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
        <HasPermission menu={MENU_IDS.TicketAdd}>
          <Button
            variant='solid'
            color='green'
            icon={<PlusOutlined />}
            onClick={() => navigate('/data-master/ticket/new-ticket')}
          >
            Tiket Baru
          </Button>
        </HasPermission>
      </Flex>
      <Table
        rowKey='id'
        size='middle'
        columns={columns}
        dataSource={dataTickets?.data}
        scroll={{ x: 1500, y: `calc(100vh - 400px)` }}
        sticky={{ offsetHeader: 64 }}
        onChange={handleTableChange}
        pagination={{
          total: dataTickets?.paging?.total,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          pageSize: filterTickets.limit,
          showSizeChanger: true,
          pageSizeOptions: [10, 25, 50, 100],
        }}
      />
      <ResultSuccess open={openResult} onOpenResult={handleOpenResult} />
    </div>
  );
};

export default TicketPage;