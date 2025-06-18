import queryClient from '@/lib/queryClient';
import { apiFetchLovAgents, apiFetchLovBanks, apiFetchLovUserAgent, apiFetchRolesByType } from '@/services/lovService';
import { apiCreateAgent, apiUpdateAgent } from '@/services/userService';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Flex, Form, Input, Modal, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

const defaultValues = {
  username: null,
  name: null,
  identityType: null,
  bankId: null,
  accountNumber: '',
  phone: '',
  email: '',
  address: '',
  leadId: null,
  coordinatorId: null,
  isActive: 'true',
  roleId: null
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

  // const { data: dataUsers } = useQuery({
  //   queryKey: ['lov-users-agent'],
  //   queryFn: apiFetchLovUserAgent,
  // });

  const { data: dataBanks } = useQuery({
    queryKey: ['lov-banks'],
    queryFn: apiFetchLovBanks,
  });

  const { data: dataAgents } = useQuery({
    queryKey: ['lov-agents'],
    queryFn: apiFetchLovAgents,
  });


  // const optionUser = (dataUsers?.data || [])?.map((user) => ({
  //   value: user.id,
  //   label: user.name
  // }))

  const { data: resRole } = useQuery({
    queryKey: ['lov-roles', '1'],
    queryFn: () => apiFetchRolesByType('1'),
  });

  const dataRole = resRole?.data;

  const optionBank = (dataBanks?.data || [])?.map((bank) => ({
    value: bank.id,
    label: bank.name
  }))

  const currentUser = data?.id || '';
  const optionAgent = (dataAgents?.data || [])?.filter((item) => item.id !== currentUser).map((agent) => ({
    value: agent.id,
    label: agent.name
  }))

  const createAgentMutation = useMutation({
    mutationFn: apiCreateAgent,
    onSuccess: (data) => {
      reset();
      onCloseForm();
      queryClient.invalidateQueries(['agents']);
      onOpenResult({
        extra: data.data.password,
        open: true,
        title: 'Agent Berhasil Ditambahkan',
        subtitle: `Agent dengan username "${data.data.username}" telah berhasil ditambahkan ke sistem. Berikut adalah kata sandi sementara yang dapat digunakan untuk login.`,
      });
    },
  });

  const editAgentMutation = useMutation({
    mutationFn: (body) => apiUpdateAgent(data?.id, body),
    onSuccess: (data, variable) => {
      reset();
      onCloseForm();
      queryClient.invalidateQueries(['agents']);
      onOpenResult({
        open: true,
        title: 'Agent Berhasil Diubah',
        subtitle: `Agent dengan username "${variable.username}" telah berhasil diubah.`,
      });
    },
  });

  const isLoading = createAgentMutation.isPending || editAgentMutation.isPending

  const onSubmit = (values) => {
    const { id: _id, userId: _userId, balance: _balance, targetRemaining: _targetRemaining, ...body } = values
    const payload = {
      ...body,
      isActive: values?.isActive === 'true',
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
        username: data.username,
        name: data.name,
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
        roleId: data.roleId,
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

        <Form.Item
          label="Role"
          required
          validateStatus={errors.roleId ? 'error' : ''}
          help={errors.roleId?.message}
        >
          <Controller
            name="roleId"
            control={control}
            rules={{
              required: 'Role tidak boleh kosong',
            }}
            render={({ field }) =>
              <Select
                {...field}
                allowClear
                optionFilterProp='label'
                placeholder="Pilih role untuk Staff"
                options={dataRole.map(item => ({
                  value: item.id,
                  label: item.name
                }))}
              />}
          />
        </Form.Item>

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
            render={({ field }) => <Select {...field} placeholder="Pilih Koordinator" showSearch allowClear optionFilterProp="label" options={optionAgent} />}
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
            render={({ field }) => <Select {...field} placeholder="Pilih Lead Koordinator" showSearch allowClear optionFilterProp="label" options={optionAgent} />}
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
              render={({ field }) => <Select {...field} options={[{ value: 'true', label: "Aktif" }, { value: 'false', label: "Tidak Aktif" }]} />}
            />
          </Form.Item>
        )}
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