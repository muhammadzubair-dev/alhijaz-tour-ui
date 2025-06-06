import { Label } from '@/components';
import { PlusCircleFilled } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Empty, Flex, Form, Input, InputNumber, Row, Select, Space } from 'antd';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import FlightForm from './components/FlightForm';
import FlightItem from './components/FlightItem';

const defaultValues = {
  transactionDate: null,
  partnerId: null,
  bookingCode: null,
  dayPack: null,
  seatPack: null
}

const NewTicketPage = () => {
  const [flight, setFlight] = useState([])
  const [flightForm, setFlightForm] = useState({
    open: false,
    type: '',
    flight: null
  })
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues
  });

  const handleOpenFormFlight = (type, flight = null) => {
    setFlightForm({
      open: true,
      type,
      flight
    })
  }

  const handleCloseFormFlight = () => {
    setFlightForm({
      open: false,
      type: ''
    })
  }

  const handleSaveFlight = (values) => {
    setFlight((prevState) => ([
      ...prevState,
      values
    ]))
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

  console.log('flight ============> ', flight)

  return (
    <div>
      <Form
        layout='vertical'
        onFinish={handleSubmit(onSubmit, onError)}
      >
        <Row gutter={16}>
          <Col lg={6}>
            <Form.Item
              required
              label="Tanggal Transaksi"
              validateStatus={errors.transactionDate ? 'error' : ''}
              help={errors.transactionDate?.message}
            >
              <Controller
                name="transactionDate"
                control={control}
                rules={{
                  required: 'Transaction Date tidak boleh kosong',
                }}
                render={({ field }) => (
                  <div style={{ width: '100%' }}>
                    <DatePicker
                      {...field}
                      placeholder="Pilih Tanggal"
                      style={{ width: '100%' }} // ← penting
                    />
                  </div>
                )}
              />
            </Form.Item>
          </Col>
          <Col lg={6}>
            <Form.Item
              required
              label="Supplier"
              validateStatus={errors.partnerId ? 'error' : ''}
              help={errors.partnerId?.message}
            >
              <Controller
                name="partnerId"
                control={control}
                rules={{
                  required: 'Supplier tidak boleh kosong',
                }}
                render={({ field }) => (
                  <div style={{ width: '100%' }}>
                    <Select
                      {...field}
                      showSearch
                      allowClear
                      placeholder="Pilih Supplier"
                      style={{ width: '100%' }} // ← penting
                      options={[
                        {
                          value: 'jack',
                          label: 'Jack',
                        },
                        {
                          value: 'lucy',
                          label: 'Lucy',
                        },
                        {
                          value: 'tom',
                          label: 'Tom',
                        },
                      ]}
                    />
                  </div>
                )}
              />
            </Form.Item>
          </Col>
          <Col lg={6}>
            <Form.Item
              required
              label="Kode Booking"
              validateStatus={errors.bookingCode ? 'error' : ''}
              help={errors.bookingCode?.message}
            >
              <Controller
                name="bookingCode"
                control={control}
                rules={{
                  required: 'Kode Booking tidak boleh kosong',
                  minLength: {
                    value: 3,
                    message: 'Kode Booking minimal 3 karakter'
                  },
                  maxLength: {
                    value: 10,
                    message: 'Kode Booking maksimal 10 karakter'
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    allowClear
                    placeholder="Masukkan Kode Booking"
                  />
                )}
              />
            </Form.Item>
          </Col>
          <Col lg={6}>
            <Form.Item
              required
              label={<Label text="Paket" extraText="Hari" />}
              validateStatus={errors.dayPack ? 'error' : ''}
              help={errors.dayPack?.message}
            >
              <Controller
                name="dayPack"
                control={control}
                rules={{
                  required: 'Paket hari tidak boleh kosong',
                  min: {
                    value: 1,
                    message: 'Minimal 1 hari'
                  },
                  max: {
                    value: 100,
                    message: 'Maksimal 100 hari'
                  },
                }}
                render={({ field }) => (
                  <div style={{ width: '100%' }}>
                    <InputNumber
                      {...field}
                      // allowClear
                      suffix="Hari"
                      placeholder="Masukkan Jumlah Hari"
                      style={{ width: '100%' }}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                )}
              />
            </Form.Item>
          </Col>

          <Col lg={6}>
            <Form.Item
              required
              label={<Label text="Total Seat" extraText="Pax" />}
              validateStatus={errors.seatPack ? 'error' : ''}
              help={errors.seatPack?.message}
            >
              <Controller
                name="seatPack"
                control={control}
                rules={{
                  required: 'Total Seat tidak boleh kosong',
                  min: {
                    value: 1,
                    message: 'Minimal 1 Seat'
                  },
                  max: {
                    value: 10000,
                    message: 'Maksimal 10.000 Seat'
                  },
                }}
                render={({ field }) => (
                  <div style={{ width: '100%' }}>
                    <InputNumber
                      {...field}
                      // allowClear
                      suffix="Pax"
                      placeholder="Masukkan Total Seat"
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
                  </div>
                )}
              />
            </Form.Item>
          </Col>
          <Col lg={6}>
            <Form.Item
              // required
              label={<Label text="Materialisasi" extraText="Pax" />}
              validateStatus={errors.materialisasi ? 'error' : ''}
              help={errors.materialisasi?.message}
            >
              <Controller
                name="materialisasi"
                control={control}
                rules={{
                  // required: 'Materialisasi tidak boleh kosong',
                  min: {
                    value: 1,
                    message: 'Minimal 1 Seat'
                  },
                  max: {
                    value: 10000,
                    message: 'Maksimal 10.000 Seat'
                  },
                }}
                render={({ field }) => (
                  <div style={{ width: '100%' }}>
                    <InputNumber
                      {...field}
                      disabled
                      // allowClear
                      suffix="Pax"
                      placeholder="Masukkan Jumlah Materialisasi"
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
                  </div>
                )}
              />
            </Form.Item>
          </Col>
          <Col lg={6}>
            <Form.Item
              // required
              label={<Label text="Cancel" extraText="Pax" />}
              validateStatus={errors.cancel ? 'error' : ''}
              help={errors.cancel?.message}
            >
              <Controller
                name="cancel"
                control={control}
                rules={{
                  // required: 'Cancel tidak boleh kosong',
                  min: {
                    value: 1,
                    message: 'Minimal 1 Pax'
                  },
                  max: {
                    value: 10000,
                    message: 'Maksimal 10.000 Pax'
                  },
                }}
                render={({ field }) => (
                  <div style={{ width: '100%' }}>
                    <InputNumber
                      {...field}
                      disabled
                      // allowClear
                      suffix="Pax"
                      placeholder="Masukkan Jumlah Cancel"
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
                  </div>
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        <Card
          title="Penerbangan"
          extra={
            <Space>
              <Button color="primary" variant="outlined" icon={<PlusCircleFilled />} onClick={() => handleOpenFormFlight('Departure')}>
                Departure
              </Button>
              <Button color="primary" variant="outlined" icon={<PlusCircleFilled />} onClick={() => handleOpenFormFlight('Return')}>
                Return
              </Button>
            </Space>}>
          {/* <Empty description="Tidak ada Penerbangan" /> */}
          <Flex vertical gap={8}>
            {/* <FlightItem />
            <FlightItem /> */}
            {flight.length === 0 ? (
              <Empty description="Tidak ada Penerbangan" />
            ) : (
              flight.map((item) => (
                <div onClick={() => handleOpenFormFlight('Departure', item)}>
                  <FlightItem key={item.id} data={item} />
                </div>
              ))
            )}
          </Flex>
        </Card >
        <Flex justify='flex-end' style={{ marginTop: 16 }}>
          <Button type="primary" htmlType="submit">
            Simpan
          </Button>
        </Flex>


      </Form>
      <FlightForm
        open={flightForm.open}
        type={flightForm.type}
        data={flightForm.flight}
        onClose={handleCloseFormFlight}
        onSaveFlight={handleSaveFlight}
      />
    </div >
  )
}

export default NewTicketPage