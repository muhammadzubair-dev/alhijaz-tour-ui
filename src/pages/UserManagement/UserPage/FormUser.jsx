import queryClient from '@/lib/queryClient';
import { apiCreateUser, apiEditUser } from '@/services/userService';
import { useMutation } from '@tanstack/react-query';
import { Button, Flex, Form, Input, Modal, Radio } from 'antd';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

const FormUser = ({ open, onCloseForm, onOpenResult, data }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      username: '',
      name: '',
      type: '',
    },
  });

  const createUserMutation = useMutation({
    mutationFn: apiCreateUser,
    onSuccess: (data, variable) => {
      reset();
      onCloseForm();
      queryClient.invalidateQueries(['users']);
      onOpenResult({
        open: true,
        title: 'User Berhasil Ditambahkan',
        subtitle: `User baru dengan username "${variable.username}" telah berhasil ditambahkan ke sistem.`,
      });
    },
  });

  const editUserMutation = useMutation({
    mutationFn: apiEditUser,
    onSuccess: (data, variable) => {
      reset();
      onCloseForm();
      queryClient.invalidateQueries(['users']);
      onOpenResult({
        open: true,
        title: 'User Berhasil Diubah',
        subtitle: `User dengan username "${variable.username}" telah berhasil diubah.`,
      });
    },
  });

  const isLoading = createUserMutation.isPending || editUserMutation.isPending

  const onSubmit = (values) => {
    if (data) {
      editUserMutation.mutate({ ...values, id: data.id })
    } else {
      createUserMutation.mutate(values)
    }

  };

  const onError = (formErrors) => {
    console.log('Error Form:', formErrors);
    // Anda bisa melakukan sesuatu dengan error form di sini jika perlu
  };

  useEffect(() => {
    if (data) {
      reset({
        username: data.username,
        name: data.name,
        type: data.type,
      });
    } else {
      reset({
        username: '',
        name: '',
        type: '',
      });
    }
  }, [data, reset]);

  return (
    <Modal
      title="Add New User"
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
          label="Username"
          required
          validateStatus={errors.username ? 'error' : ''}
          help={errors.username?.message}
        >
          <Controller
            name="username"
            control={control}
            rules={{
              required: 'Username tidak boleh kosong',
              minLength: {
                value: 4,
                message: 'Username minimal 4 karakter',
              },
              maxLength: {
                value: 20,
                message: 'Username maksimal 20 karakter'
              }
            }}
            render={({ field }) => <Input {...field} placeholder="Masukkan Username" />}
          />
        </Form.Item>

        <Form.Item
          label="Name"
          required
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            rules={{
              required: 'Name tidak boleh kosong',
              minLength: {
                value: 4,
                message: 'Name minimal 4 karakter',
              },
              maxLength: {
                value: 50,
                message: 'Name maksimal 50 karakter'
              }
            }}
            render={({ field }) => <Input {...field} placeholder="Masukkan Nama" />}
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

export default FormUser