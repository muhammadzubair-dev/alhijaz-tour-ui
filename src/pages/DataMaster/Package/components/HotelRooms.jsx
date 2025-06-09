import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Table, Tooltip, Typography } from 'antd';
import { useState } from 'react';
import { FaPlus } from "react-icons/fa";
import HotelRoomsForm from './HotelRoomsForm';
import toRupiah from '@/utils/toRupiah';

const HotelRooms = ({ hotelRooms, onUpdateHotelRoom, onDeleteHotelRoom }) => {
  const [openFormHotelRooms, setOpenHotelRooms] = useState({
    open: false,
    data: null
  })
  // const [hotelRooms, setHotelRooms] = useState([])

  const handleOpenForm = () => {
    setOpenHotelRooms({
      ...openFormHotelRooms,
      open: true
    })
  }

  const handleCloseForm = () => {
    setOpenHotelRooms({
      ...openFormHotelRooms,
      open: false
    })
  }

  // const handleUpdateHotelRooms = (values) => {
  //   setHotelRooms(prevState => ([
  //     ...prevState,
  //     values
  //   ]))
  // }

  // const handleDeleteHotelRoom = (id) => {
  //   setHotelRooms(prevState => (prevState.filter(item => item.packageTypeId !== id)))
  // }

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
            <div key={value.hotelId}>
              <Typography.Text style={{ fontWeight: 700 }}>{value.cityName}</Typography.Text>, {value.hotelName}
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
            <div key={value.roomId}>
              {value.roomName} = <Typography.Text style={{ fontWeight: 700, color: 'green' }}>Rp{toRupiah(value.roomPrice)}</Typography.Text>
            </div>
          ))}
        </>
      )
    },
    {
      title: () => <Button color='primary' variant='outlined' onClick={handleOpenForm} icon={<FaPlus />}>Paket Kamar Hotel</Button>,
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (values) => (
        <Space>
          <Tooltip title="Delete">
            <Popconfirm
              title={`Hapus paket ${values.paket} ?`}
              placement='bottomRight'
              onConfirm={() => onDeleteHotelRoom(values.key)}
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

  const dataForTable = hotelRooms.map(item => ({
    key: item.packageTypeId,
    paket: item.packageTypeName,
    hotels: item.hotels,
    rooms: item.rooms
  }))

  return (
    <>
      <Table
        pagination={false}
        columns={columns}
        dataSource={dataForTable}
      />
      <HotelRoomsForm
        onCloseForm={handleCloseForm}
        hotelRooms={hotelRooms}
        onUpdateHotelRooms={onUpdateHotelRoom}
        open={openFormHotelRooms.open}
      />
    </>
  )
}

export default HotelRooms