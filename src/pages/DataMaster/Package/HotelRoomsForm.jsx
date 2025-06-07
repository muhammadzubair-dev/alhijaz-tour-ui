import { Button, Flex, Form, Input, InputNumber, Modal, Select, Space, Tag, Typography } from 'antd'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { FaMinimize } from 'react-icons/fa6';

const defaultValues = {
  packageTypeId: null,
  hotelId: null,
}

const cities = ['Madinah', 'Mekkah', 'Bursa', 'Istanbul', 'Dubai', 'Cappadocia', 'Ankara', 'Kairo']

const HotelRoomsForm = ({ onCloseForm, open }) => {
  const [hotelRoom, setHotelRoom] = useState(null)
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues
  });

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
        wrapperCol={{ span: 16 }}
        style={{ marginTop: 32 }}
        onFinish={handleSubmit(onSubmit, onError)}
      >
        <Form.Item
          required
          label="Nama Paket"
          validateStatus={errors.partnerId ? 'error' : ''}
          help={errors.partnerId?.message}
        >
          <Controller
            name="partnerId"
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
                  style={{ width: '100%' }} // ← penting
                  options={[
                    {
                      value: 'Standard',
                      label: 'Standard',
                    },
                    {
                      value: 'Rahmah',
                      label: 'Rahmah',
                    },
                    {
                      value: 'Uhud',
                      label: 'Uhud',
                    },
                    {
                      value: 'Hemat',
                      label: 'Hemat',
                    },
                  ]}
                />
              </div>
            )}
          />
        </Form.Item>

        <Form.Item required label="Hotel" style={{ margin: 0 }}>
          <Space.Compact style={{ width: '100%' }}>
            <Form.Item
              required
              name={['address', 'province']}
              noStyle
              rules={[{ required: true, message: 'Province is required' }]}
            >
              <Select placeholder="Pilih Kota" options={cities.map(city => ({ value: city, label: city }))} />
            </Form.Item>
            <Form.Item
              name={['address', 'street']}
              noStyle
              rules={[{ required: true, message: 'Street is required' }]}
            >
              <Select placeholder="Pilih Hotel" options={cities.map(city => ({ value: city, label: city }))} />
            </Form.Item>
            <Button
              variant='solid'
              color="green"
              // shape="circle"
              icon={<FaPlus />}
            />
          </Space.Compact>
        </Form.Item>

        <Form.Item name="null" label={null}>
          <Flex gap={2} wrap>
            <Tag color='green' style={{ marginRight: 0 }}><span style={{ fontWeight: 700 }}>Makkah</span>, Al-Munawaroh</Tag>
            <Tag color='green' style={{ marginRight: 0 }}><span style={{ fontWeight: 700 }}>Jeddah</span>, Mawarah</Tag>
            <Tag color='green' style={{ marginRight: 0 }}><span style={{ fontWeight: 700 }}>Istanbul</span>, Syafirul</Tag>
          </Flex>
        </Form.Item>

        <Form.Item required label="Kamar" style={{ margin: 0 }}>
          <Space.Compact style={{ width: '100%' }}>
            <Form.Item
              required
              name={['address', 'province']}
              noStyle
              rules={[{ required: true, message: 'Province is required' }]}
            >
              <Select placeholder="Pilih Tipe" options={cities.map(city => ({ value: city, label: city }))} />
            </Form.Item>
            <Form.Item
              name={['address', 'street']}
              noStyle
              rules={[{ required: true, message: 'Street is required' }]}
            >
              <InputNumber
                // {...field}
                // disabled
                // allowClear
                prefix="$"
                placeholder="Masukkan Harga"
                style={{ width: '100%' }}
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
            </Form.Item>
            <Button
              variant='solid'
              color="green"
              // shape="circle"
              icon={<FaPlus />}
            />
          </Space.Compact>
        </Form.Item>
        <Form.Item name="null2" label={null}>
          <Flex gap={2} wrap>
            <Tag color='green' style={{ marginRight: 0 }}>Single: <span style={{ fontWeight: 700 }}>$500</span></Tag>
            <Tag color='green' style={{ marginRight: 0 }}>Double: <span style={{ fontWeight: 700 }}>$700</span></Tag>
          </Flex>
        </Form.Item>

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