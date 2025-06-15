import queryClient from '@/lib/queryClient';
import { apiFetchMenu } from '@/services/lovService';
import { apiCreateRole, apiEditUserRole } from '@/services/userService';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Flex, Form, Input, Modal, Radio, Select } from 'antd';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

const defaultValues = {
  name: '',
  description: '',
  type: '',
  platform: '',
  isActive: 'true'
}

const FormRole = ({ open, onCloseForm, onOpenResult, data }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues
  });

  const createRoleMutation = useMutation({
    mutationFn: apiCreateRole,
    onSuccess: (data, variable) => {
      reset();
      onCloseForm();
      queryClient.invalidateQueries(['roles']);
      onOpenResult({
        open: true,
        title: 'Role Berhasil Ditambahkan',
        subtitle: `Role baru dengan nama "${variable.name}" telah berhasil ditambahkan ke sistem.`,
      });
    },
  });

  const editRoleMutation = useMutation({
    mutationFn: apiEditUserRole,
    onSuccess: (data, variable) => {
      reset();
      onCloseForm();
      queryClient.invalidateQueries(['roles']);
      onOpenResult({
        open: true,
        title: 'Role Berhasil Diubah',
        subtitle: `Role dengan nama "${variable.name}" telah berhasil diubah.`,
      });
    },
  });

  const isLoading = createRoleMutation.isPending || editRoleMutation.isPending

  const onSubmit = (values) => {
    const isActive = values?.isActive === 'true';

    const payload = {
      ...values,
      isActive,
      ...(data?.id && { id: data.id }), // tambah id hanya jika ada
    };

    if (data) {
      editRoleMutation.mutate(payload);
    } else {
      createRoleMutation.mutate(payload);
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
        description: data.description,
        type: data.type,
        platform: data.platform,
        isActive: data.isActive ? 'true' : 'false'
      });
    } else {
      reset(defaultValues);
    }
  }, [data, reset]);

  return (
    <Modal
      title="Add New Role"
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
          label="Nama Role"
          required
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            rules={{
              required: 'Nama Role tidak boleh kosong',
              minLength: {
                value: 4,
                message: 'Nama Role minimal 4 karakter',
              },
              maxLength: {
                value: 50,
                message: 'Nama Role maksimal 50 karakter'
              }
            }}
            render={({ field }) => <Input {...field} placeholder="Masukkan Nama Role" />}
          />
        </Form.Item>

        <Form.Item
          label="Deskripsi"
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name?.message}
        >
          <Controller
            name="description"
            control={control}
            rules={{
              maxLength: {
                value: 50,
                message: 'Description maksimal 50 karakter'
              }
            }}
            render={({ field }) => <Input {...field} placeholder="Masukkan Deskripsi" />}
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
            render={({ field }) => <Select {...field} options={[{ value: 'true', label: "Aktif" }, { value: 'false', label: "Tidak Aktif" }]} allowClear />}
          />
        </Form.Item>

        <Form.Item
          label="Platform"
          required
          validateStatus={errors.platform ? 'error' : ''}
          help={errors.platform?.message}
        >
          <Controller
            name="platform"
            control={control}
            rules={{
              required: 'Platform tidak boleh kosong',
            }}
            render={({ field }) => <Radio.Group {...field} options={[{ value: '0', label: "Travel" }]} />}
          />
        </Form.Item>

        <Form.Item
          label="Tipe"
          required
          validateStatus={errors.type ? 'error' : ''}
          help={errors.type?.message}
        >
          <Controller
            name="type"
            control={control}
            rules={{
              required: 'Tipe tidak boleh kosong',
            }}
            render={({ field }) => <Radio.Group {...field} options={[{ value: '0', label: "Staff" }, { value: '1', label: "Agent" }]} />}
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

export default FormRole