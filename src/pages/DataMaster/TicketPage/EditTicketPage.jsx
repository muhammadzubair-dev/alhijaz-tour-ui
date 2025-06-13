import { Label, ResultSuccess } from '@/components';
import queryClient from '@/lib/queryClient';
import { apiFetchLovPartners } from '@/services/lovService';
import { apiFetchDetailTicket, apiUpdateTicket } from '@/services/ticketService';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Card, Col, DatePicker, Empty, Flex, Form, Input, InputNumber, Row, Select, Space } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa6';
import { useNavigate, useParams } from 'react-router-dom';
import FlightForm from './components/FlightForm';
import FlightItem from './components/FlightItem';

const defaultValues = {
  transactionDate: null,
  partnerId: null,
  bookingCode: null,
  dayPack: null,
  seatPack: null
}

const EditTicketPage = () => {
  const navigate = useNavigate()
  const { idTicket } = useParams();
  const [flight, setFlight] = useState([])
  const [flightForm, setFlightForm] = useState({
    open: false,
    type: '',
    flight: null
  })
  const [openResult, setOpenResult] = useState({
    open: false,
    title: '',
    subtitle: ''
  })
  const { data: dataTicketDetail } = useQuery({
    queryKey: ['ticket-detail', idTicket],
    queryFn: () => apiFetchDetailTicket(idTicket),
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues
  });
  const { data: dataLovPartners } = useQuery({
    queryKey: ['lov-partners'],
    queryFn: apiFetchLovPartners,
  });
  const updateTicketMutation = useMutation({
    mutationFn: (data) => apiUpdateTicket(idTicket, data),
    onSuccess: (data, variable) => {
      reset();
      setFlight([])
      queryClient.invalidateQueries(['tickets']);
      setOpenResult({
        open: true,
        title: 'Ticket Berhasil Diubah',
        subtitle: `Tiket dengan kode booking "${variable.bookingCode}" telah berhasil diperbarui di dalam sistem.`,
      });
    },
  });

  const optionPartners = dataLovPartners?.data || [];

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

  const handleEditFlight = (updated) => {
    setFlight((prevState) =>
      prevState.map(item =>
        item.id === updated.id ? { ...item, ...updated } : item
      )
    );
  };

  const handleDeleteFlight = (id) => {
    setFlight((prevState) => prevState.filter((item) => item.id !== id));
  };

  const handleOpenResult = (values) => {
    setOpenResult((prevState) => ({
      ...prevState,
      ...values
    }))
  }

  const onSubmit = (values) => {
    const { id: _, ...valuesWithoutId } = values
    const newData = {
      ...valuesWithoutId,
      flight
    }
    updateTicketMutation.mutate(newData)
  };

  const onError = (formErrors) => {
    console.log('Error Form:', formErrors);
    // Anda bisa melakukan sesuatu dengan error form di sini jika perlu
  };

  useEffect(() => {
    if (dataTicketDetail?.data) {
      const {
        flight,
        transactionDate,
        ...remainingValues
      } = dataTicketDetail.data
      reset({
        ...defaultValues,
        ...remainingValues,
        transactionDate: dayjs(transactionDate),
      });
      setFlight(flight)
    }
  }, [dataTicketDetail, reset]);

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
                      minDate={dayjs()}
                      placeholder="Pilih Tanggal"
                      style={{ width: '100%' }}
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
                      style={{ width: '100%' }}
                      options={optionPartners.map(item => ({
                        value: item.id,
                        label: item.name
                      }))}
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
              label={<Label text="Materialisasi" extraText="Pax" />}
              validateStatus={errors.materialisasi ? 'error' : ''}
              help={errors.materialisasi?.message}
            >
              <Controller
                name="materialisasi"
                control={control}
                rules={{
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
              label={<Label text="Cancel" extraText="Pax" />}
              validateStatus={errors.cancel ? 'error' : ''}
              help={errors.cancel?.message}
            >
              <Controller
                name="cancel"
                control={control}
                rules={{
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
              <Button color="primary" variant="outlined" icon={<FaPlus />} onClick={() => handleOpenFormFlight('Departure')}>
                Departure
              </Button>
              <Button color="primary" variant="outlined" icon={<FaPlus />} onClick={() => handleOpenFormFlight('Return')}>
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
                <div key={item.id} onClick={() => handleOpenFormFlight('Departure', item)}>
                  <FlightItem key={item.id} data={item} isArrival={item.type === 1} />
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
        onEditFlight={handleEditFlight}
        onDeleteFlight={handleDeleteFlight}
      />
      <ResultSuccess
        open={openResult}
        onOpenResult={handleOpenResult}
        extra={
          <Button type="primary" key="console" onClick={() => navigate('/data-master/ticket')}>
            List Ticket
          </Button>
        }
      />
    </div >
  )
}

export default EditTicketPage