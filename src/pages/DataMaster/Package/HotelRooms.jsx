import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Table, Tooltip, Typography } from 'antd';
import { useState } from 'react';
import { FaPlus } from "react-icons/fa";
import HotelRoomsForm from './HotelRoomsForm';



const HotelRooms = () => {
  const [openFormHotelRooms, setOpenHotelRooms] = useState({
    open: false,
    data: null
  })

  const columns = [
    {
      title: 'Paket Kamar Hotel',
      dataIndex: 'paket',
      key: 'paket',
    },
    {
      title: 'Hotels',
      dataIndex: 'hotels',
      key: 'hotels',
      render: (values) => (
        <>
          {values.map(value => (
            <div>
              <Typography.Text style={{ fontWeight: 700 }}>{value.city}</Typography.Text>, {value.name}
            </div>
          ))}
        </>
      )
    },
    {
      title: 'Rooms',
      dataIndex: 'rooms',
      key: 'rooms',
      render: (values) => (
        <>
          {values.map(value => (
            <div>
              {value.type}, <Typography.Text style={{ fontWeight: 700, color: 'green' }}>{value.name}</Typography.Text>,
            </div>
          ))}
        </>
      )
    },
    {
      title: () => <Button color='primary' variant='outlined' icon={<FaPlus />}>Paket Kamar Hotel</Button>,
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (values) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              color='blue' variant='text' shape="circle" size='small' icon={<EditOutlined />}
            // onClick={() => handleOpenFormEdit(values)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title={`Hapus paket ${values.name} ?`}
              placement='bottomRight'
              // onConfirm={() => handleDeleteSosmed(values)}
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
  const data = [
    {
      key: '1',
      paket: 'Standard',
      hotels: [{ id: 1, city: 'Madinah', name: 'California' }, { id: 2, city: 'Cairo', name: 'Messiah' }],
      rooms: [{ id: 1, type: 'Single', name: '$2.000' }, { id: 1, type: 'Double', name: '$3.000' }, { id: 1, type: 'Triple', name: '$ 5.000' }],
    },
    {
      key: '2',
      paket: 'Uhud',
      hotels: [{ id: 1, city: 'Madinah', name: 'California' }],
      rooms: [{ id: 1, type: 'Single', name: '$2.000' }],
    },
  ];
  return (
    <>
      <Table
        pagination={false}
        columns={columns}
        dataSource={data}
      />
      <HotelRoomsForm onCloseForm={() => { }} open={true} />
    </>
  )
}

export default HotelRooms