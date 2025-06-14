import queryClient from '@/lib/queryClient';
import { apiCreateUser, apiEditUser } from '@/services/userService';
import { useMutation } from '@tanstack/react-query';
import { Button, Flex, Form, Input, Modal, Radio, Select } from 'antd';
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
      isActive: 'true'
    },
  });

  const createUserMutation = useMutation({
    mutationFn: apiCreateUser,
    onSuccess: (data, variable) => {
      reset();
      onCloseForm();
      queryClient.invalidateQueries(['users']);
      onOpenResult({
        extra: data.data.password,
        title: 'User Berhasil Ditambahkan',
        subtitle: `Pengguna baru dengan username "${variable.username}" telah berhasil ditambahkan ke sistem. Berikut adalah kata sandi sementara yang dapat digunakan untuk login.`,
        open: true,
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
    const { name, username, isActive: isActiveRaw } = values;
    const isActive = String(isActiveRaw).toLowerCase() === 'true';
    if (data?.id) {
      // Edit user
      editUserMutation.mutate({
        id: data.id,
        name,
        username,
        isActive,
        type: '0'
      });
    } else {
      // Create new user
      createUserMutation.mutate({
        name,
        username,
        isActive,
        type: '0'
      });
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
        type: data.type === '0' ? 'Y' : 'N',
        isActive: data.isActive ? 'true' : 'false'
      });
    } else {
      reset({
        username: '',
        name: '',
        type: 'N',
        isActive: 'true'
      });
    }
  }, [data, reset]);

  return (
    <Modal
      title={data ? 'Ubah data User' : 'Tambahkan User Baru'}
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
              },
              pattern: {
                value: /^[a-z0-9]+$/, // hanya huruf kecil dan angka
                message: 'Username hanya boleh huruf kecil dan angka, tanpa spasi atau karakter khusus',
              },
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

        {data && (
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
        )}

        {/* <Form.Item
          label="Staff ?"
          required
          validateStatus={errors.type ? 'error' : ''}
          help={errors.type?.message}
        >
          <Controller
            name="type"
            disabled={data?.type === '1' || data?.type === '0'}
            control={control}
            rules={{
              required: 'Pilihan Staff tidak boleh kosong',
            }}
            render={({ field }) => <Radio.Group {...field} options={[{ value: 'N', label: "Tidak" }, { value: 'Y', label: "Ya" }]} />}
          />
        </Form.Item> */}

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