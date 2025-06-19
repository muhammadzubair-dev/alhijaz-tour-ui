import { Button, Form, Input } from 'antd';
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';

const SearchNIK = ({ onSearchNIK, clearSearchNIK }) => {
  const { control, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = (data) => {
    onSearchNIK(data.nik);
  };

  useEffect(() => {
    if (clearSearchNIK) {
      reset()
    }
  }, [clearSearchNIK, reset])

  return (
    <Form layout="inline" onFinish={handleSubmit(onSubmit)} style={{ width: '100%' }}>
      <Form.Item
        validateStatus={errors.nik ? 'error' : ''}
        help={errors.nik?.message}
        style={{ flex: 1 }}
      >
        <Controller
          name="nik"
          control={control}
          rules={{
            required: 'Nomor KTP wajib diisi',
            pattern: {
              value: /^[0-9]{16}$/,
              message: 'Nomor KTP harus terdiri dari 16 digit angka',
            },
          }}
          render={({ field }) => (
            <Input {...field} placeholder="Masukkan Nomor KTP" />
          )}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Cari
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SearchNIK;
