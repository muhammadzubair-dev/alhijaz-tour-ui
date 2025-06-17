import { Button, Flex, Form, Input, Modal } from 'antd';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { apiUserChangePassword } from '@/services/userService';
import { passwordRules } from '@/utils/passwordRules'; // Pastikan path sesuai

const defaultValues = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
};

const ChangePassword = ({ open, onCloseForm, onOpenResult }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    mode: 'onChange',
    defaultValues
  });

  const changePasswordMutation = useMutation({
    mutationFn: apiUserChangePassword,
    onSuccess: () => {
      reset();
      onCloseForm();
      onOpenResult({
        open: true,
        title: 'Password Berhasil Diubah',
        subtitle: 'Password Anda telah berhasil diperbarui demi keamanan akun Anda.',
      });
    },
  });

  const isLoading = changePasswordMutation.isPending;

  const onSubmit = (values) => {
    const payload = {
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    };
    changePasswordMutation.mutate(payload);
  };

  const onError = (formErrors) => {
    console.log('Error Form:', formErrors);
  };

  useEffect(() => {
    if (open) reset(defaultValues);
  }, [open, reset]);

  return (
    <Modal
      title="Ubah Password"
      closeIcon={false}
      open={open}
      footer={null}
    >
      <div style={{ marginBottom: 16, marginTop: 8, color: '#888' }}>
        Anda masih menggunakan password default sistem. Demi keamanan akun Anda, mohon segera ubah password.
      </div>

      <Form
        labelCol={{ span: 9 }}
        wrapperCol={{ span: 12 }}
        style={{ maxWidth: 600 }}
        onFinish={handleSubmit(onSubmit, onError)}
      >
        <Form.Item
          label="Password Lama"
          required
          validateStatus={errors.currentPassword ? 'error' : ''}
          help={errors.currentPassword?.message}
        >
          <Controller
            name="currentPassword"
            control={control}
            rules={passwordRules}
            render={({ field }) => (
              <Input.Password {...field} placeholder="Masukkan password lama" />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Password Baru"
          required
          validateStatus={errors.newPassword ? 'error' : ''}
          help={errors.newPassword?.message}
        >
          <Controller
            name="newPassword"
            control={control}
            rules={passwordRules}
            render={({ field }) => (
              <Input.Password {...field} placeholder="Masukkan password baru" />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Konfirmasi Password"
          required
          validateStatus={errors.confirmPassword ? 'error' : ''}
          help={errors.confirmPassword?.message}
        >
          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              ...passwordRules,
              validate: value =>
                value === watch('newPassword') || 'Password Baru anda tidak sama',
            }}
            render={({ field }) => (
              <Input.Password {...field} placeholder="Ulangi password baru" />
            )}
          />
        </Form.Item>

        <Flex gap={16} justify="flex-end">
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Submit
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
};

export default ChangePassword;
