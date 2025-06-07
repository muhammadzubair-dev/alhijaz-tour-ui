import { apiFetchCities, apiFetchCityHotels, apiFetchPackageTypes, apiFetchRoomTypes } from '@/services/lovService';
import { CloseCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Flex, Form, Input, InputNumber, Modal, Select, Space, Tag, Typography } from 'antd'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { FaMinimize } from 'react-icons/fa6';
import { IoIosRemoveCircle } from "react-icons/io";

const defaultValues = {
  packageTypeId: null,
  cityId: null,
  hotelId: null,
  roomId: null,
  roomPrice: null
}

const HotelRoomsForm = ({ onCloseForm, open }) => {
  const [hotels, setHotels] = useState([])
  const [rooms, setRooms] = useState([])
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    resetField,
    watch
  } = useForm({
    mode: 'onChange',
    defaultValues
  });
  const cityId = watch('cityId');

  const { data: dataPackageTypes } = useQuery({
    queryKey: ['lov-package-types'],
    queryFn: apiFetchPackageTypes,
  });
  const { data: dataRoomTypes } = useQuery({
    queryKey: ['lov-room-types'],
    queryFn: apiFetchRoomTypes,
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

  const optionPackageTypes = dataPackageTypes ? dataPackageTypes.data : []
  const optionRoomTypes = dataRoomTypes ? dataRoomTypes.data : []
  const optionCities = dataCities ? dataCities.data.filter(city => !hotels.some((hotel) => hotel.cityId === city.id)) : []
  const optionCityHotels = dataCityHotels ? dataCityHotels.data : []

  const handleAddHotel = (hotel) => {
    setHotels((prevState) => ([
      ...prevState,
      hotel
    ]))
    resetField('cityId');
    resetField('hotelId');
  }

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

  const onSubmit = (values) => {
    console.log('values: ========> ', values)
    // const payload = {
    //   ...values,
    //   isActive: values?.isActive === 'true',
    //   ...(data?.id && { id: data.id }), // tambah id hanya jika ada
    // };

    // if (data) {
    //   editBankMutation.mutate(payload);
    // } else {
    //   createBankMutation.mutate(payload);
    // }
  };

  const onError = (formErrors) => {
    console.log('Error Form:', formErrors);
    // Anda bisa melakukan sesuatu dengan error form di sini jika perlu
  };

  console.log('1 ===========> ', dataRoomTypes?.data)
  console.log('2 ===========> ', rooms)

  return (
    <Modal
      title="Tambahkan Paket Hotel Rooms"
      closable={{ 'aria-label': 'Custom Close Button' }}
      onCancel={onCloseForm}
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
          required
          validateStatus={errors.cityId || errors.hotelId ? 'error' : ''}
          help={`${errors.cityId?.message || ''} ${errors.hotelId?.message || ''}`}
          style={{ marginBottom: hotels.length === 0 ? 24 : 0 }}
          label="Hotel"
        >
          <Space.Compact style={{ width: '100%' }}>
            <Controller
              name="cityId"
              control={control}
              rules={{ required: 'Kota wajib diisi' }}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Pilih Kota"
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
              rules={{ required: 'Hotel wajib diisi' }}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Pilih Hotel"
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
                    color='green'
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
              rules={{ required: 'Tipe kamar wajib dipilih' }}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Pilih Tipe"
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
              rules={{ required: 'Harga kamar wajib diisi' }}
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
                      color='cyan'
                      style={{ marginRight: 0 }}
                      closable
                      onClose={(e) => {
                        e.preventDefault()
                        handleRemoveRoom(room.roomId)
                      }}
                    >
                      {dataRoomTypes.data.find(item => item.id === room.roomId)?.name}:
                      <span style={{ fontWeight: 700 }}>
                        {' '} {room.roomPrice}
                      </span>
                    </Tag>
                  ))
                }
              </Flex>
            </Form.Item>
          )
        }

        <Flex justify='flex-end' style={{ marginTop: 16 }}>
          <Button type="primary" htmlType="submit">
            Simpan
          </Button>
        </Flex>
      </Form>

    </Modal>
  )
}

export default HotelRoomsForm