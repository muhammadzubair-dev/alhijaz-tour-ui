import queryClient from '@/lib/queryClient';
import { apiEditMasterBank, apiFetchMasterBanks } from '@/services/masterService';
import { apiCreateAgent, apiFetchUsers } from '@/services/userService';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Flex, Form, Input, Modal, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

const defaultValues = {
  userId: null,
  identityType: null,
  bankId: null,
  accountNumber: '',
  phone: '',
  email: '',
  address: '',
  leadId: null,
  coordinatorId: null,
  isActive: 'true'
}

const FormAgent = ({ open, onCloseForm, onOpenResult, data }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues
  });

  const { data: dataUsers } = useQuery({
    queryKey: ['users', '1000'],
    queryFn: () => apiFetchUsers({ limit: 1000 }),
  });

  const { data: dataBanks } = useQuery({
    queryKey: ['banks', '1000'],
    queryFn: () => apiFetchMasterBanks({ limit: 1000 }),
  });

  const optionUser = dataUsers?.data?.map((user) => ({
    value: user.id,
    label: user.name
  }))

  const optionBank = dataBanks?.data?.map((bank) => ({
    value: bank.id,
    label: bank.name
  }))

  const createAgentMutation = useMutation({
    mutationFn: apiCreateAgent,
    onSuccess: (data, variable) => {
      reset();
      onCloseForm();
      queryClient.invalidateQueries(['banks']);
      onOpenResult({
        open: true,
        title: 'Agent Berhasil Ditambahkan',
        subtitle: `Agent dengan email "${variable.email}" telah berhasil ditambahkan ke sistem.`,
      });
    },
  });

  const editAgentMutation = useMutation({
    mutationFn: apiEditMasterBank,
    onSuccess: (data, variable) => {
      reset();
      onCloseForm();
      queryClient.invalidateQueries(['banks']);
      onOpenResult({
        open: true,
        title: 'Agent Berhasil Diubah',
        subtitle: `Agent dengan email "${variable.email}" telah berhasil diubah.`,
      });
    },
  });

  const isLoading = createAgentMutation.isPending || editAgentMutation.isPending

  const onSubmit = (values) => {
    const payload = {
      ...values,
      isActive: values?.isActive === 'true',
      ...(data?.id && { id: data.id }), // tambah id hanya jika ada
    };

    if (data) {
      editAgentMutation.mutate(payload);
    } else {
      createAgentMutation.mutate(payload);
    }
  };

  const onError = (formErrors) => {
    console.log('Error Form:', formErrors);
    // Anda bisa melakukan sesuatu dengan error form di sini jika perlu
  };

  useEffect(() => {
    if (data) {
      reset({
        userId: data.userId,
        identityType: data.identityType,
        bankId: data.bankId,
        accountNumber: data.accountNumber,
        phone: data.phone,
        email: data.email,
        balance: data.balance,
        address: data.address,
        leadId: data.leadId,
        coordinatorId: data.coordinatorId,
        targetRemaining: data.targetRemaining,
        isActive: data.isActive ? 'true' : 'false'
      });
    } else {
      reset(defaultValues);
    }
  }, [data, reset]);

  return (
    <Modal
      title="Add New Agent"
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
          label="Tipe Identitas"
          required
          validateStatus={errors.identityType ? 'error' : ''}
          help={errors.identityType?.message}
        >
          <Controller
            name="identityType"
            control={control}
            rules={{
              required: 'Tipe Identitas tidak boleh kosong',
            }}
            render={({ field }) => <Select placeholder="Pilih Tipe Identitas"  {...field} options={[{ value: '0', label: "KTP" }]} />}
          />
        </Form.Item>

        <Form.Item
          label="Nama User"
          required
          validateStatus={errors.userId ? 'error' : ''}
          help={errors.userId?.message}
        >
          <Controller
            name="userId"
            control={control}
            rules={{
              required: 'Nama User tidak boleh kosong',
            }}
            render={({ field }) => <Select placeholder="Pilih User"  {...field} showSearch allowClear optionFilterProp="label" options={optionUser} />}
          />
        </Form.Item>

        <Form.Item
          label="Bank"
          required
          validateStatus={errors.bankId ? 'error' : ''}
          help={errors.bankId?.message}
        >
          <Controller
            name="bankId"
            control={control}
            rules={{
              required: 'Bank tidak boleh kosong',
            }}
            render={({ field }) => <Select placeholder="Pilih Bank"  {...field} showSearch allowClear optionFilterProp="label" options={optionBank} />}
          />
        </Form.Item>

        <Form.Item
          label="No Rekening"
          required
          validateStatus={errors.accountNumber ? 'error' : ''}
          help={errors.accountNumber?.message}
        >
          <Controller
            name="accountNumber"
            control={control}
            rules={{
              required: 'No rekening tidak boleh kosong',
              minLength: {
                value: 7,
                message: 'No rekening minimal 7 karakter'
              },
              maxLength: {
                value: 18,
                message: 'No rekening maksimal 18 karakter'
              },
              pattern: {
                value: /^[0-9]+$/,
                message: 'Kode Bank hanya boleh berisi angka',
              },
            }}
            render={({ field }) => <Input {...field} placeholder="Masukkan No Rekening" />}
          />
        </Form.Item>

        <Form.Item
          label="No Handphone"
          required
          validateStatus={errors.phone ? 'error' : ''}
          help={errors.phone?.message}
        >
          <Controller
            name="phone"
            control={control}
            rules={{
              required: 'No Handphone tidak boleh kosong',
              minLength: {
                value: 9,
                message: 'No Handphone minimal 9 karakter'
              },
              maxLength: {
                value: 13,
                message: 'No Handphone maksimal 13 karakter'
              },
              pattern: {
                value: /^[0-9]+$/,
                message: 'No Handphone hanya boleh berisi angka',
              },
            }}
            render={({ field }) => <Input {...field} placeholder="Masukkan No Handphone" />}
          />
        </Form.Item>

        <Form.Item
          label="Email"
          required
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email?.message}
        >
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Email tidak boleh kosong',
              minLength: {
                value: 5,
                message: 'Email minimal 10 karakter'
              },
              maxLength: {
                value: 100,
                message: 'Email maksimal 64 karakter'
              },
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Format email tidak valid',
              },
            }}
            render={({ field }) => <Input {...field} placeholder="Masukkan Email" />}
          />
        </Form.Item>

        <Form.Item
          label="Alamat"
          required
          validateStatus={errors.address ? 'error' : ''}
          help={errors.address?.message}
        >
          <Controller
            name="address"
            control={control}
            rules={{
              required: 'Alamat tidak boleh kosong',
              minLength: {
                value: 5,
                message: 'Alamat minimal 5 karakter'
              },
              maxLength: {
                value: 200,
                message: 'Alamat maksimal 200 karakter'
              },
            }}
            render={({ field }) => <TextArea {...field} placeholder="Masukkan No Alamat" />}
          />
        </Form.Item>

        <Form.Item
          label="Koordinator"
          validateStatus={errors.coordinatorId ? 'error' : ''}
          help={errors.coordinatorId?.message}

        >
          <Controller
            name="coordinatorId"
            control={control}
            render={({ field }) => <Select {...field} placeholder="Pilih Koordinator" showSearch allowClear optionFilterProp="label" options={optionUser} />}
          />
        </Form.Item>

        <Form.Item
          label="Lead Koordinator"
          validateStatus={errors.leadId ? 'error' : ''}
          help={errors.leadId?.message}
        >
          <Controller
            name="leadId"
            control={control}
            render={({ field }) => <Select {...field} placeholder="Pilih Lead Koordinator" showSearch allowClear optionFilterProp="label" options={optionUser} />}
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

    </Modal >
  )
}

export default FormAgent