import queryClient from '@/lib/queryClient';
import { apiFetchRolesByType } from '@/services/lovService';
import { apiEditTaskRole } from '@/services/TaskService';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Flex, Form, Modal, Radio, Select } from 'antd';
import { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

const defaultValues = {
  roleType: '0', // 0 = Staff, 1 = Agent
  roleId: null,
};

const FormAssignRoleToTaskType = ({ open, onCloseForm, onOpenResult, data }) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues,
  });

  const roleType = useWatch({ control, name: 'roleType' });

  const { data: resRole } = useQuery({
    queryKey: ['lov-roles', roleType],
    queryFn: () => apiFetchRolesByType(roleType),
    enabled: !!roleType,
  });

  const dataRole = resRole?.data || [];

  const editTaskRoleMutation = useMutation({
    mutationFn: (body) => apiEditTaskRole(data?.id, body),
    onSuccess: () => {
      reset();
      onCloseForm();
      queryClient.invalidateQueries(['task-types']);
      onOpenResult({
        open: true,
        title: 'Role Berhasil Diperbarui',
        subtitle: `Role untuk tipe task "${data?.name}" berhasil diperbarui.`,
      });
    },
  });

  const isLoading = editTaskRoleMutation.isPending;

  const onSubmit = (values) => {
    const payload = {
      roleId: values.roleId,
    };

    if (data?.id) {
      editTaskRoleMutation.mutate(payload);
    }
  };

  useEffect(() => {
    if (data) {
      reset({
        roleType: data.roleType ?? '0',
        roleId: data.roleId,
      });
    } else {
      reset(defaultValues);
    }
  }, [data, reset]);

  // useEffect(() => {
  //   setValue('roleId', null);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [roleType]);

  return (
    <Modal
      title="Assign task to Role"
      onCancel={onCloseForm}
      open={open}
      footer={null}
    >
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        onFinish={handleSubmit(onSubmit)}
      >
        <div style={{ height: 16 }} />

        <Form.Item
          label="Tipe Role"
          required
          validateStatus={errors.roleType ? 'error' : ''}
          help={errors.roleType?.message}
        >
          <Controller
            name="roleType"
            control={control}
            rules={{ required: 'Tipe role harus dipilih' }}
            render={({ field }) => (
              <Radio.Group
                {...field}
                onChange={(e) => {
                  field.onChange(e);       // update react-hook-form
                  setValue('roleId', null); // reset roleId setiap kali roleType berubah
                }}
              >
                <Radio value="0">Staff</Radio>
                <Radio value="1">Agent</Radio>
              </Radio.Group>
            )}
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
            rules={{ required: 'Role tidak boleh kosong' }}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Pilih Role"
                showSearch
                allowClear
                optionFilterProp="label"
                options={dataRole.map((role) => ({
                  value: role.id,
                  label: role.name,
                }))}
              />
            )}
          />
        </Form.Item>

        <Flex gap={16} justify="flex-end">
          <Button onClick={onCloseForm} loading={isLoading}>
            Batal
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Simpan
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
};

export default FormAssignRoleToTaskType;
