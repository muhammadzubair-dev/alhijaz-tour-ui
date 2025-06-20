import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Flex, Form, Input } from 'antd';
import logo from '@/assets/logo.png';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiUserLogin, apiFetchCurrentUser } from '@/services/userService';
import useAuthStore from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { passwordRules } from '@/utils/passwordRules';

const LoginPage = () => {
  const loginSuccess = useAuthStore((state) => state.loginSuccess);
  const setUserProfile = useAuthStore((state) => state.setUserProfile);
  const navigate = useNavigate()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      username: '',
      password: '',
      remember: true,
    },
  });

  const { refetch: refetchUser, isSuccess: isSuccessFetchUser, data: dataUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: apiFetchCurrentUser,
    enabled: false,
  });

  const loginUserMutation = useMutation({
    mutationFn: apiUserLogin,
    onSuccess: (response) => {
      loginSuccess(response.data.token)
      refetchUser();
    },
  });

  const onSubmit = (values) => {
    loginUserMutation.mutate({ username: values.username, password: values.password })
  };

  useEffect(() => {
    if (isSuccessFetchUser && dataUser?.data) {
      setUserProfile(dataUser.data);
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessFetchUser, dataUser?.data]);

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Flex vertical align="center" gap={16} style={{ maxWidth: 250, width: '100%' }}>
        <div>
          <img src={logo} height={50} />
        </div>
        <Form onFinish={handleSubmit(onSubmit)} style={{ width: '100%' }}>
          {/* Username */}
          <Form.Item
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
                  message: 'Username maksimal 20 karakter',
                },
              }}
              render={({ field }) => (
                <Input {...field} prefix={<UserOutlined />} placeholder="Username" />
              )}
            />
          </Form.Item>

          {/* Password */}
          <Form.Item
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              rules={passwordRules}
              render={({ field }) => (
                <Input
                  {...field}
                  type="password"
                  prefix={<LockOutlined />}
                  placeholder="Password"
                />
              )}
            />
          </Form.Item>

          {/* Remember Me */}
          <Form.Item>
            <Flex justify="space-between" align="center">
              <Form.Item noStyle>
                <Controller
                  name="remember"
                  control={control}
                  render={({ field }) => (
                    <Checkbox {...field} checked={field.value}>
                      Remember me
                    </Checkbox>
                  )}
                />
              </Form.Item>
              <a href="#">Forgot password</a>
            </Flex>
          </Form.Item>

          {/* Submit */}
          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    </div>
  );
};

export default LoginPage;
