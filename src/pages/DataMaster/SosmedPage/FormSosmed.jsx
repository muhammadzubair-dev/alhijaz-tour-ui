import queryClient from '@/lib/queryClient';
import { apiCreateMasterSosmed, apiEditMasterSosmed } from '@/services/masterService';
import { useMutation } from '@tanstack/react-query';
import { Button, Flex, Form, Input, Modal, Select } from 'antd';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

const defaultValues = {
  name: '',
  isActive: 'true'
}

const FormSosmed = ({ open, onCloseForm, onOpenResult, data }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues
  });

  const createSosmedMutation = useMutation({
    mutationFn: apiCreateMasterSosmed,
    onSuccess: (data, variable) => {
      reset();
      onCloseForm();
      queryClient.invalidateQueries(['sosmeds']);
      onOpenResult({
        open: true,
        title: 'Social Media Berhasil Ditambahkan',
        subtitle: `Social Media baru dengan nama "${variable.name}" telah berhasil ditambahkan ke sistem.`,
      });
    },
  });

  const editSosmedMutation = useMutation({
    mutationFn: apiEditMasterSosmed,
    onSuccess: (data, variable) => {
      reset();
      onCloseForm();
      queryClient.invalidateQueries(['sosmeds']);
      onOpenResult({
        open: true,
        title: 'Social Media Berhasil Diubah',
        subtitle: `Social Media "${variable.name}" telah berhasil diubah.`,
      });
    },
  });

  const isLoading = createSosmedMutation.isPending || editSosmedMutation.isPending

  const onSubmit = (values) => {
    const payload = {
      ...values,
      isActive: values?.isActive === 'true',
      ...(data?.id && { id: data.id }), // tambah id hanya jika ada
    };

    if (data) {
      editSosmedMutation.mutate(payload);
    } else {
      createSosmedMutation.mutate(payload);
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
        isActive: data.isActive ? 'true' : 'false'
      });
    } else {
      reset(defaultValues);
    }
  }, [data, reset]);

  return (
    <Modal
      title="Tambahkan Social Media"
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
          label="Social Media"
          required
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            rules={{
              required: 'Social Media tidak boleh kosong',
              minLength: {
                value: 3,
                message: 'Social Media minimal 3 karakter',
              },
              maxLength: {
                value: 20,
                message: 'Social Media maksimal 20 karakter'
              }
            }}
            render={({ field }) => <Input {...field} placeholder="Masukkan Social Media" />}
          />
        </Form.Item>

        <Form.Item
          label="Status"
          required
          validateStatus={errors.isActive ? 'error' : ''}
          help={errors.isActive?.message}
        >
          <Controller
            name="isActive"
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

export default FormSosmed