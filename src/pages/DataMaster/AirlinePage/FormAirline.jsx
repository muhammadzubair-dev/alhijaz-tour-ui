import queryClient from '@/lib/queryClient';
import { apiCreateAirline, apiEditAirline } from '@/services/masterService';
import { useMutation } from '@tanstack/react-query';
import { Button, Flex, Form, Input, Modal, Select } from 'antd';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

const defaultValues = {
  name: '',
  status: 'true'
}

const FormAirline = ({ open, onCloseForm, onOpenResult, data }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues
  });

  const createAirlineMutation = useMutation({
    mutationFn: apiCreateAirline,
    onSuccess: (data, variable) => {
      reset();
      onCloseForm();
      queryClient.invalidateQueries(['airlines']);
      onOpenResult({
        open: true,
        title: 'Airline Berhasil Ditambahkan',
        subtitle: `Airline baru dengan nama "${variable.name}" telah berhasil ditambahkan ke sistem.`,
      });
    },
  });

  const editAirlineMutation = useMutation({
    mutationFn: apiEditAirline,
    onSuccess: (data, variable) => {
      reset();
      onCloseForm();
      queryClient.invalidateQueries(['airlines']);
      onOpenResult({
        open: true,
        title: 'Airline Berhasil Diubah',
        subtitle: `Airline dengan nama "${variable.name}" telah berhasil diubah.`,
      });
    },
  });

  const isLoading = createAirlineMutation.isPending || editAirlineMutation.isPending

  const onSubmit = (values) => {
    const payload = {
      ...values,
      status: values.status === 'true' ? "1" : "0",
      ...(data?.id && { id: data.id }), // tambah id hanya jika ada
    };

    if (data) {
      editAirlineMutation.mutate(payload);
    } else {
      createAirlineMutation.mutate(payload);
    }
  };

  const onError = (formErrors) => {
    console.log('Error Form:', formErrors);
    // Anda bisa melakukan sesuatu dengan error form di sini jika perlu
  };

  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        status: data.status === '1' ? 'true' : 'false'
      });
    } else {
      reset(defaultValues);
    }
  }, [data, reset]);

  return (
    <Modal
      title={data ? "Ubah Data Airline" : "Tambahkan Data Airline"}
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
          label="Nama Airline"
          required
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            rules={{
              required: 'Nama Airline tidak boleh kosong',
              minLength: {
                value: 3,
                message: 'Nama Airline minimal 3 karakter',
              },
              maxLength: {
                value: 50,
                message: 'Nama Airline maksimal 50 karakter'
              }
            }}
            render={({ field }) => <Input {...field} placeholder="Masukkan Nama Airline" />}
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

export default FormAirline