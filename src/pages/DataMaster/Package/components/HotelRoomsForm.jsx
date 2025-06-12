import { apiFetchCities, apiFetchCityHotels, apiFetchPackageRooms, apiFetchPackageTypes } from '@/services/lovService';
import numberId from '@/utils/numberId';
import { useQuery } from '@tanstack/react-query';
import { Button, Flex, Form, InputNumber, message, Modal, Select, Space, Tag } from 'antd';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa';

const defaultValues = {
  packageTypeId: null,
  cityId: null,
  hotelId: null,
  roomId: null,
  roomPrice: null
}

const HotelRoomsForm = ({ onCloseForm, open, hotelRooms, onUpdateHotelRooms }) => {
  const [hotels, setHotels] = useState([])
  const [rooms, setRooms] = useState([])
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
    resetField,
    watch
  } = useForm({
    mode: 'onChange',
    defaultValues
  });
  const cityId = watch('cityId');
  const packageId = watch('packageTypeId');

  const { data: dataPackageTypes } = useQuery({
    queryKey: ['lov-package-types'],
    queryFn: apiFetchPackageTypes,
  });
  const { data: dataRoomTypes } = useQuery({
    queryKey: ['lov-room-types', packageId],
    queryFn: () => apiFetchPackageRooms(packageId),
    enabled: !!packageId,
  });
  const { data: dataCities } = useQuery({
    queryKey: ['lov-cities'],
    queryFn: apiFetchCities,
  });
  const { data: dataCityHotels } = useQuery({
    queryKey: ['lov-city-hotels', cityId],
    queryFn: () => apiFetchCityHotels(cityId),
    enabled: !!cityId,
  });

  const optionPackageTypes = dataPackageTypes ? dataPackageTypes.data.filter(item => !hotelRooms.some(item2 => item.id === item2.packageTypeId)) : []
  const optionRoomTypes = dataRoomTypes ? dataRoomTypes.data : []
  const optionCities = dataCities ? dataCities.data.filter(city => !hotels.some((hotel) => hotel.cityId === city.id)) : []
  const optionCityHotels = dataCityHotels ? dataCityHotels.data : []

  const handleAddHotel = (hotel) => {
    if (!hotel.cityId || !hotel.hotelId) return;

    setHotels((prevState) => [...prevState, hotel]);
    resetField('cityId');
    resetField('hotelId');
  };

  const handleRemoveHotel = (cityId) => {
    setHotels((prevState) => prevState.filter((state) => state.cityId !== cityId))
  }

  const handleAddRoom = (room) => {
    setRooms((prevState) => ([
      ...prevState,
      room
    ]))
    resetField('roomId');
    resetField('roomPrice');
  }

  const handleRemoveRoom = (roomId) => {
    setRooms((prevState) => prevState.filter((state) => state.roomId !== roomId))
  }

  const handleCloseForm = () => {
    onCloseForm()
    setHotels([])
    setRooms([])
    reset();
  }

  const onSubmit = (values) => {
    if (hotels.length === 0) {
      setError('cityId', {
        type: 'manual',
        message: 'Silakan tambahkan minimal 1 hotel',
      });
      return;
    }
    if (rooms.length === 0) {
      setError('roomId', {
        type: 'manual',
        message: 'Silakan tambahkan minimal 1 tipe kamar',
      });
      return;
    }
    clearErrors(['cityId', 'roomId']);

    const newData = {
      packageTypeId: values.packageTypeId,
      packageTypeName: dataPackageTypes?.data.find(item => item.id === values.packageTypeId)?.name,
      hotels: hotels.map((item) => ({
        cityId: item.cityId,
        cityName: dataCities?.data.find(item2 => item2.id === item.cityId)?.name,
        hotelId: item.hotelId.split('|')?.[0],
        hotelName: item.hotelId.split('|')?.[1],
      })),
      rooms: rooms.map(item => ({
        ...item,
        roomName: dataRoomTypes?.data.find(item2 => item2.id === item.roomId)?.name
      }))
    }

    onUpdateHotelRooms(newData);
    setHotels([])
    setRooms([])
    reset();
    message.success('Sukses menambahkan Jenis Paket baru')
  };

  const onError = (formErrors) => {
    console.log('Error Form:', formErrors);
    // Anda bisa melakukan sesuatu dengan error form di sini jika perlu
  };

  return (
    <Modal
      title="Tambahkan Paket Hotel Rooms"
      closable={{ 'aria-label': 'Custom Close Button' }}
      onCancel={handleCloseForm}
      open={open}
      footer={null}
    >
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ marginTop: 32 }}
        onFinish={handleSubmit(onSubmit, onError)}
      >
        <Form.Item
          required
          label="Nama Paket"
          validateStatus={errors.packageTypeId ? 'error' : ''}
          help={errors.packageTypeId?.message}
        >
          <Controller
            name="packageTypeId"
            control={control}
            rules={{
              required: 'Nama Paket tidak boleh kosong',
            }}
            render={({ field }) => (
              <div style={{ width: '100%' }}>
                <Select
                  {...field}
                  showSearch
                  allowClear
                  optionFilterProp='label'
                  placeholder="Pilih Nama Paket"
                  style={{ width: '100%' }}
                  options={optionPackageTypes.map(item => ({
                    value: item.id,
                    label: item.name
                  }))}
                />
              </div>
            )}
          />
        </Form.Item>

        <Form.Item
          validateStatus={errors.cityId || errors.hotelId ? 'error' : ''}
          help={`${errors.cityId?.message || ''} ${errors.hotelId?.message || ''}`}
          style={{ marginBottom: hotels.length === 0 ? 24 : 0 }}
          label="Hotel"
          required
        >
          <Space.Compact style={{ width: '100%' }}>
            <Controller
              name="cityId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Pilih Kota"
                  optionFilterProp='label'
                  allowClear
                  showSearch
                  style={{ width: '40%' }}
                  options={optionCities.map(item => ({
                    value: item.id,
                    label: item.name,
                  }))}
                />
              )}
            />
            <Controller
              name="hotelId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Pilih Hotel"
                  optionFilterProp='label'
                  allowClear
                  showSearch
                  style={{ width: '60%' }}
                  options={optionCityHotels.map(item => ({
                    value: `${item.id}|${item.name}`,
                    label: item.name,
                  }))}
                  disabled={!cityId}
                />
              )}
            />
            <Button
              type="primary"
              icon={<FaPlus />}
              onClick={() => handleAddHotel({ cityId: watch('cityId'), hotelId: watch('hotelId') })}
            />
          </Space.Compact>
        </Form.Item>

        {
          hotels.length !== 0 && (
            <Form.Item name="null" label={null}>
              <Flex gap={2} wrap>
                {hotels.map(hotel => (
                  <Tag
                    color='cyan'
                    style={{ marginRight: 0 }}
                    closable
                    onClose={(e) => {
                      e.preventDefault()
                      handleRemoveHotel(hotel.cityId)
                    }}
                  >
                    <span style={{ fontWeight: 700 }}>
                      {dataCities.data.find(city => city.id === hotel.cityId)?.name}
                    </span>,  {hotel.hotelId?.split?.('|')?.[1]}
                  </Tag>
                ))}
              </Flex>
            </Form.Item>
          )
        }

        <Form.Item
          required
          label="Kamar"
          validateStatus={errors.roomId || errors.roomPrice ? 'error' : ''}
          help={`${errors.roomId?.message || ''} ${errors.roomPrice?.message || ''}`}
          style={{ marginBottom: rooms.length === 0 ? 24 : 0 }}
        >
          <Space.Compact style={{ width: '100%' }}>
            <Controller
              name="roomId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Pilih Tipe"
                  optionFilterProp='label'
                  allowClear
                  showSearch
                  style={{ width: '50%' }}
                  options={optionRoomTypes.map(room => ({
                    value: room.id,
                    label: room.name,
                  }))}
                />
              )}
            />
            <Controller
              name="roomPrice"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  prefix="Rp"
                  placeholder="Masukkan Harga"
                  style={{ width: '50%' }}
                  formatter={(value) =>
                    value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                  }
                  parser={(value) => value?.replace(/\./g, '')}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              )}
            />
            <Button
              type="primary"
              icon={<FaPlus />}
              onClick={() => handleAddRoom({ roomId: watch('roomId'), roomPrice: watch('roomPrice') })}
            />
          </Space.Compact>
        </Form.Item>

        {
          rooms.length !== 0 && (
            <Form.Item name="null2" label={null}>
              <Flex gap={2} wrap>
                {
                  rooms.map((room) => (
                    <Tag
                      color='green'
                      style={{ marginRight: 0 }}
                      closable
                      onClose={(e) => {
                        e.preventDefault()
                        handleRemoveRoom(room.roomId)
                      }}
                    >
                      {dataRoomTypes.data.find(item => item.id === room.roomId)?.name}:
                      <span style={{ fontWeight: 700 }}>
                        {' '} {numberId(room.roomPrice || 0)}
                      </span>
                    </Tag>
                  ))
                }
              </Flex>
            </Form.Item>
          )
        }

        <Flex justify='flex-end' gap={16} style={{ marginTop: 16 }}>
          <Button onClick={handleCloseForm}>
            Close
          </Button>
          <Button type="primary" htmlType="submit">
            Simpan
          </Button>
        </Flex>
      </Form>

    </Modal>
  )
}

export default HotelRoomsForm