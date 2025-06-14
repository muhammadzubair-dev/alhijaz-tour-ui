import queryClient from '@/lib/queryClient';
import { apiFetchJamaahUmroh, apiFetchUmrohPackage } from '@/services/lovService';
import { apiEditUmroh } from '@/services/masterService';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Flex, Form, Modal, Select } from 'antd';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

const defaultValues = {
  tourLead: null,
  packageId: null,
  // status: 'true'
}

const EditUmroh = ({ open, onCloseForm, onOpenResult, data }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues
  });

  const editUmrohMutation = useMutation({
    mutationFn: (payload) => apiEditUmroh(data?.id, payload),
    onSuccess: (data) => {
      reset();
      onCloseForm();
      queryClient.invalidateQueries(['umroh']);
      onOpenResult({
        open: true,
        title: 'Data Umroh Berhasil Diubah',
        subtitle: `Data Umroh dengan kode "${data.data.umrohCode}" telah berhasil diubah.`,
      });
    },
  });

  const { data: resUmrohPackage } = useQuery({
    queryKey: ['lov-umroh-package'],
    queryFn: apiFetchUmrohPackage,
  });

  const { data: dataLovJamaah } = useQuery({
    queryKey: ['lov-jamaah-umroh', data?.id],
    queryFn: () => apiFetchJamaahUmroh(data?.id),
    enabled: !!data?.id
  });

  const dataUmrohPackage = resUmrohPackage?.data || [];
  const optionJamaah = dataLovJamaah?.data || [];

  const isLoading = editUmrohMutation.isPending

  const onSubmit = (values) => {
    editUmrohMutation.mutate(values);
  };

  const onError = (formErrors) => {
    console.log('Error Form:', formErrors);
    // Anda bisa melakukan sesuatu dengan error form di sini jika perlu
  };

  useEffect(() => {
    if (data) {
      reset({
        tourLead: data.tourLead,
        packageId: data.packageId,
        // status: data.status === '1' ? 'true' : 'false'
      });
    } else {
      reset(defaultValues);
    }
  }, [data, reset]);

  return (
    <Modal
      title={data ? "Ubah Data Umroh" : "Tambahkan Data Umroh"}
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

        {/* <Col lg={8}> */}
        <Form.Item
          required
          label="Paket Umroh"
          validateStatus={errors.packageId ? 'error' : ''}
          help={errors.packageId?.message}

        >
          <Controller
            name="packageId"
            control={control}
            // disabled={!!kodeUmroh}
            rules={{
              required: 'Paket Umroh tidak boleh kosong',
            }}
            render={({ field }) => (
              <div style={{ width: '100%' }}>
                <Select
                  {...field}
                  showSearch
                  allowClear
                  optionFilterProp='label'
                  placeholder="Pilih Paket Umroh"
                  style={{ width: '100%' }}
                  // onChange={(value) => {
                  //   setPriceState(0)
                  //   setEquipmentPriceState(0)
                  //   field.onChange(value);
                  //   setValue('packageRoomPrice', null);
                  // }}
                  options={dataUmrohPackage.map(item => ({
                    value: item.id,
                    label: item.name
                  }))}
                />
              </div>
            )}
          />
        </Form.Item>
        {/* </Col> */}

        <Form.Item
          required
          label="Tour Leader"
          validateStatus={errors.tourLead ? 'error' : ''}
          help={errors.tourLead?.message}
        >
          <Controller
            rules={{
              required: 'Tour Leader tidak boleh kosong',
            }}
            name="tourLead"
            control={control}
            render={({ field }) => (
              <div style={{ width: '100%' }}>
                <Select
                  {...field}
                  showSearch
                  allowClear
                  optionFilterProp='label'
                  placeholder="Pilih Tour Leader"
                  style={{ width: '100%' }}
                  options={optionJamaah.map((item) => ({ value: item.jamaahCode, label: item.jamaahName }))}
                />
              </div>
            )}
          />
        </Form.Item>

        {/* <Form.Item
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

export default EditUmroh