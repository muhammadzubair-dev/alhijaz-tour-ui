import queryClient from '@/lib/queryClient';
import { apiCreateAirport, apiEditAirport } from '@/services/masterService';
import { useMutation } from '@tanstack/react-query';
import { Button, Flex, Form, Input, Modal, Select } from 'antd';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

const defaultValues = {
  code: '',
  name: '',
  status: 'true'
}

const FormAirport = ({ open, onCloseForm, onOpenResult, data }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues
  });

  const createAirportMutation = useMutation({
    mutationFn: apiCreateAirport,
    onSuccess: (data, variable) => {
      reset();
      onCloseForm();
      queryClient.invalidateQueries(['airports']);
      onOpenResult({
        open: true,
        title: 'Airport Berhasil Ditambahkan',
        subtitle: `Airport baru dengan nama "${variable.name}" telah berhasil ditambahkan ke sistem.`,
      });
    },
  });

  const editAirportMutation = useMutation({
    mutationFn: apiEditAirport,
    onSuccess: (data, variable) => {
      reset();
      onCloseForm();
      queryClient.invalidateQueries(['airports']);
      onOpenResult({
        open: true,
        title: 'Airport Berhasil Diubah',
        subtitle: `Airport dengan nama "${variable.name}" telah berhasil diubah.`,
      });
    },
  });

  const isLoading = createAirportMutation.isPending || editAirportMutation.isPending

  const onSubmit = (values) => {
    const payload = {
      ...values,
      status: values.status === 'true' ? "1" : "0",
      ...(data?.code && { code: data.code }), // tambah id hanya jika ada
    };

    if (data) {
      editAirportMutation.mutate(payload);
    } else {
      createAirportMutation.mutate(payload);
    }
  };

  const onError = (formErrors) => {
    console.log('Error Form:', formErrors);
    // Anda bisa melakukan sesuatu dengan error form di sini jika perlu
  };

  useEffect(() => {
    if (data) {
      reset({
        code: data.code,
        name: data.name,
        status: data.status === '1' ? 'true' : 'false'
      });
    } else {
      reset(defaultValues);
    }
  }, [data, reset]);

  return (
    <Modal
      title={data ? "Ubah Data Airport" : "Tambahkan Data Airport"}
      closable={{ 'aria-label': 'Custom Close Button' }}
      onCancel={onCloseForm}
      open={open}
      footer={null}
    >
      <div style={{ height: 16 }} />
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={handleSubmit(onSubmit, onError)}
      >

        <Form.Item
          label="Kode Airport"
          required
          validateStatus={errors.code ? 'error' : ''}
          help={errors.code?.message}
        >
          <Controller
            name="code"
            control={control}
            rules={{
              required: 'kode Airport tidak boleh kosong',

              pattern: {
                value: /^[A-Z]{3}$/,
                message: 'Kode Airport harus 3 huruf kapital',
              }
            }}
            render={({ field }) => <Input {...field} placeholder="Masukkan Kode Airport (Contoh: CGK)" />}
          />
        </Form.Item>

        <Form.Item
          label="Nama Airport"
          required
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            rules={{
              required: 'Nama Airport tidak boleh kosong',
              minLength: {
                value: 3,
                message: 'Nama Airport minimal 3 karakter',
              },
              maxLength: {
                value: 50,
                message: 'Nama Airport maksimal 50 karakter'
              }
            }}
            render={({ field }) => <Input {...field} placeholder="Masukkan Nama Airport" />}
          />
        </Form.Item>

        <Form.Item
          label="Status"
          required
          validateStatus={errors.status ? 'error' : ''}
          help={errors.status?.message}
        >
          <Controller
            name="status"
            control={control}
            rules={{
              required: 'Status tidak boleh kosong',
            }}
            render={({ field }) => <Select {...field} options={[{ value: 'true', label: "Aktif" }, { value: 'false', label: "Tidak Aktif" }]} />}
          />
        </Form.Item>
        <Flex gap={16} justify='flex-end'>
          <Button color="default" variant="filled" onClick={onCloseForm} loading={isLoading}>
            Batal
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {data ? 'Ubah' : 'Daftar'}
          </Button>
        </Flex>
      </Form>

    </Modal>
  )
}

export default FormAirport