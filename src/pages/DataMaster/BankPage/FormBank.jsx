import queryClient from '@/lib/queryClient';
import { apiCreateMasterBank, apiEditMasterBank } from '@/services/masterService';
import { useMutation } from '@tanstack/react-query';
import { Button, Flex, Form, Input, Modal, Select } from 'antd';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

const defaultValues = {
  bankCode: '',
  name: '',
  isActive: 'true'
}

const FormBank = ({ open, onCloseForm, onOpenResult, data }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues
  });

  const createBankMutation = useMutation({
    mutationFn: apiCreateMasterBank,
    onSuccess: (data, variable) => {
      reset();
      onCloseForm();
      queryClient.invalidateQueries(['banks']);
      onOpenResult({
        open: true,
        title: 'Bank Berhasil Ditambahkan',
        subtitle: `Bank baru dengan nama "${variable.name}" telah berhasil ditambahkan ke sistem.`,
      });
    },
  });

  const editBankMutation = useMutation({
    mutationFn: apiEditMasterBank,
    onSuccess: (data, variable) => {
      reset();
      onCloseForm();
      queryClient.invalidateQueries(['banks']);
      onOpenResult({
        open: true,
        title: 'Bank Berhasil Diubah',
        subtitle: `Bank dengan nama "${variable.name}" telah berhasil diubah.`,
      });
    },
  });

  const isLoading = createBankMutation.isPending || editBankMutation.isPending

  const onSubmit = (values) => {
    const payload = {
      ...values,
      isActive: values?.isActive === 'true',
      ...(data?.id && { id: data.id }), // tambah id hanya jika ada
    };

    if (data) {
      editBankMutation.mutate(payload);
    } else {
      createBankMutation.mutate(payload);
    }
  };

  const onError = (formErrors) => {
    console.log('Error Form:', formErrors);
    // Anda bisa melakukan sesuatu dengan error form di sini jika perlu
  };

  useEffect(() => {
    if (data) {
      reset({
        bankCode: data.bankCode,
        name: data.name,
        isActive: data.isActive ? 'true' : 'false'
      });
    } else {
      reset(defaultValues);
    }
  }, [data, reset]);

  return (
    <Modal
      title="Add New Bank"
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
          label="Kode Bank"
          required
          validateStatus={errors.bankCode ? 'error' : ''}
          help={errors.bankCode?.message}
        >
          <Controller
            name="bankCode"
            control={control}
            rules={{
              required: 'kode Bank tidak boleh kosong',
              minLength: {
                value: 3,
                message: 'Kode Bank minimal 3 karakter'
              },
              maxLength: {
                value: 10,
                message: 'Description maksimal 10 karakter'
              },
              pattern: {
                value: /^[0-9]+$/,
                message: 'Kode Bank hanya boleh berisi angka',
              },
            }}
            render={({ field }) => <Input {...field} placeholder="Masukkan Kode Bank" />}
          />
        </Form.Item>

        <Form.Item
          label="Nama Bank"
          required
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            rules={{
              required: 'Nama Bank tidak boleh kosong',
              minLength: {
                value: 3,
                message: 'Nama Bank minimal 3 karakter',
              },
              maxLength: {
                value: 50,
                message: 'Nama Bank maksimal 50 karakter'
              }
            }}
            render={({ field }) => <Input {...field} placeholder="Masukkan Nama Bank" />}
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

export default FormBank