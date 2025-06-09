import { apiFetchLovAirlines, apiFetchLovAirports } from '@/services/lovService';
import { useQuery } from '@tanstack/react-query';
import { Button, DatePicker, Flex, Form, Input, message, Modal, Popconfirm, Select, Space, theme, TimePicker } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

const defaultValues = {
  ticketDate: null,
  ticketAirline: null,
  flightNo: null,
  ticketFrom: null,
  ticketEtd: null,
  ticketTo: null,
  ticketEta: null
}

const FlightForm = ({ open = false, type = 'Departure', data, onClose, onSaveFlight }) => {
  const { token } = theme.useToken()
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues
  });
  const { data: dataLovAirlines } = useQuery({
    queryKey: ['lov-airlines'],
    queryFn: apiFetchLovAirlines,
  });
  const { data: dataLovAirports } = useQuery({
    queryKey: ['lov-airports'],
    queryFn: apiFetchLovAirports,
  });

  const optionAirlines = dataLovAirlines?.data || [];
  const optionAirports = dataLovAirports?.data || [];

  const handleClose = () => {
    onClose();
    reset()
  }

  const onSubmit = (values) => {
    const formatted = {
      ...values,
      ...(data?.id ? { id: data.id } : { id: Date.now() }),
      type: type === 'Departure' ? 0 : 1,
      ticketAirlineName: optionAirlines.find(item => item.id === values.ticketAirline)?.name,
      ticketFromName: optionAirports.find(item => item.code === values.ticketFrom)?.name,
      ticketToName: optionAirports.find(item => item.code === values.ticketTo)?.name,
      ticketDate: values.ticketDate ? moment(values.ticketDate.toDate()).format('YYYY-MM-DD') : null,
      ticketEtd: values.ticketEtd ? moment(values.ticketEtd.toDate()).format('HH:mm') : null,
      ticketEta: values.ticketEta ? moment(values.ticketEta.toDate()).format('HH:mm') : null,
    };
    console.log('values ====> ', formatted)
    reset()
    onSaveFlight(formatted)
    message.success('Berhasil menambahkan data Departure baru')
  };

  const onError = (formErrors) => {
    console.log('Error Form:', formErrors);
    // Anda bisa melakukan sesuatu dengan error form di sini jika perlu
  };

  useEffect(() => {
    if (data) {
      reset({
        ticketDate: data.ticketDate ? moment(data.ticketDate, 'YYYY-MM-DD') : null,
        ticketAirline: data.ticketAirline ?? null,
        flightNo: data.flightNo ?? null,
        ticketFrom: data.ticketFrom ?? null,
        ticketEtd: data.ticketEtd ? moment(data.ticketEtd, 'HH:mm') : null,
        ticketTo: data.ticketTo ?? null,
        ticketEta: data.ticketEta ? moment(data.ticketEta, 'HH:mm') : null,
      });
    } else {
      reset(defaultValues);
    }
  }, [data, reset]);

  return (
    <Modal
      open={open}
      title={`${data ? 'Ubah' : 'Tambah'} ${type}`}
      onCancel={handleClose}
      footer={null}
    >
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600, marginTop: 32 }}
        onFinish={handleSubmit(onSubmit, onError)}
      >
        <Form.Item
          required
          label="Tanggal"
          validateStatus={errors.ticketDate ? 'error' : ''}
          help={errors.ticketDate?.message}
        >
          <Controller
            name="ticketDate"
            control={control}
            rules={{
              required: 'Transaction Date tidak boleh kosong',
            }}
            render={({ field }) => (
              <div style={{ width: '100%' }}>
                <DatePicker
                  {...field}
                  placeholder="Pilih Tanggal Penerbangan"
                  style={{ width: '100%' }}
                />
              </div>
            )}
          />
        </Form.Item>

        <Form.Item
          required
          label="Airlines"
          validateStatus={errors.ticketAirline ? 'error' : ''}
          help={errors.ticketAirline?.message}
        >
          <Controller
            name="ticketAirline"
            control={control}
            rules={{
              required: 'Airlines tidak boleh kosong',
            }}
            render={({ field }) => (
              <div style={{ width: '100%' }}>
                <Select
                  {...field}
                  showSearch
                  allowClear
                  placeholder="Pilih Airlines"
                  style={{ width: '100%' }}
                  options={optionAirlines.map(item => ({
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
          label="Flight No."
          validateStatus={errors.flightNo ? 'error' : ''}
          help={errors.flightNo?.message}
        >
          <Controller
            name="flightNo"
            control={control}
            rules={{
              required: 'Flight No. tidak boleh kosong',
              minLength: {
                value: 3,
                message: 'Flight No. minimal 3 karakter'
              },
              maxLength: {
                value: 10,
                message: 'Flight No. maksimal 10 karakter'
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                allowClear
                placeholder="Masukkan Flight No."
              />
            )}
          />
        </Form.Item>

        <Form.Item
          required
          label="From"
          style={{
            height: 32
          }}
        >
          <Form.Item
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
            validateStatus={errors.ticketFrom ? 'error' : ''}
            help={errors.ticketFrom?.message}
          >
            <Controller
              name="ticketFrom"
              control={control}
              rules={{
                required: 'Bandara tidak boleh kosong',
              }}
              render={({ field }) => (
                <div style={{ width: '100%' }}>
                  <Select
                    {...field}
                    showSearch
                    allowClear
                    placeholder="Pilih Bandara"
                    style={{ width: '100%' }} // ← penting
                    options={optionAirports.map(item => ({
                      value: item.code,
                      label: item.code,
                      description: item.name
                    }))}
                    optionRender={(option) => (
                      <div>
                        <div>{option.data.label}</div>
                        <div style={{ fontSize: 12, color: token.colorTextTertiary }}>{option.data.description}</div>
                      </div>
                    )}
                  />
                </div>
              )}
            />
          </Form.Item>
          <Form.Item
            style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginLeft: 8 }}
            validateStatus={errors.ticketEtd ? 'error' : ''}
            help={errors.ticketEtd?.message}
          >
            <Controller
              name="ticketEtd"
              control={control}
              rules={{
                required: 'ETD (HH:mm) tidak boleh kosong',
              }}
              render={({ field }) => (
                <TimePicker
                  {...field}
                  format="HH:mm"
                  placeholder="ETD (HH:mm)"
                />
              )}
            />
          </Form.Item>
        </Form.Item>

        <Form.Item
          required
          label="To"
        >
          <Form.Item
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
            validateStatus={errors.ticketTo ? 'error' : ''}
            help={errors.ticketTo?.message}
          >
            <Controller
              name="ticketTo"
              control={control}
              rules={{
                required: 'Bandara tidak boleh kosong',
              }}
              render={({ field }) => (
                <div style={{ width: '100%' }}>
                  <Select
                    {...field}
                    showSearch
                    allowClear
                    placeholder="Pilih Bandara"
                    style={{ width: '100%' }} // ← penting
                    options={optionAirports.map(item => ({
                      value: item.code,
                      label: item.code,
                      description: item.name
                    }))}
                    optionRender={(option) => (
                      <div>
                        <div>{option.data.label}</div>
                        <div style={{ fontSize: 12, color: token.colorTextTertiary }}>{option.data.description}</div>
                      </div>
                    )}
                  />
                </div>
              )}
            />
          </Form.Item>
          <Form.Item
            style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginLeft: 8 }}
            validateStatus={errors.ticketEta ? 'error' : ''}
            help={errors.ticketEta?.message}
          >
            <Controller
              name="ticketEta"
              control={control}
              rules={{
                required: 'ETA (HH:mm) tidak boleh kosong',
              }}
              render={({ field }) => (
                <TimePicker
                  {...field}
                  format="HH:mm"
                  placeholder="ETA (HH:mm)"
                />
              )}
            />
          </Form.Item>
        </Form.Item>

        <Flex gap={16} justify='space-between'>
          <Popconfirm
            title="Hapus Departure"
            description="Anda yakin untuk menghapus departure ini?"
            // onConfirm={confirm}
            // onCancel={cancel}
            placement='bottom'
            okText="Yes"
            cancelText="No"
          >
            <Button color="danger" variant="outlined">
              Hapus
            </Button>
          </Popconfirm>
          <Space>
            <Button color="default" variant="filled" onClick={handleClose}>
              Close
            </Button>
            <Button type="primary" htmlType="submit">
              Simpan
            </Button>
          </Space>
        </Flex>
      </Form>
    </Modal>
  )
}

export default FlightForm