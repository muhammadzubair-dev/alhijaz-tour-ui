import axiosInstance from '@/lib/axios'
import cleanObject from '@/utils/cleanObj';
import objToQueryString from '@/utils/objToQueryString';

export const apiFetchUsers = async (query) => {
  const response = await axiosInstance.get(`/users${objToQueryString(query)}`);
  return response.data;
};

export const apiCreateUser = async (payload) => {
  const response = await axiosInstance.post('/users', cleanObject(payload));
  return response.data;
};

export const apiDeactivateUser = async ({ id }) => {
  const response = await axiosInstance.patch(`/users/${id}/deactivate`);
  return response.data;
};

export const apiEditUser = async (payload) => {
  const { id, ...data } = payload
  const response = await axiosInstance.patch(`/users/${id}`, cleanObject(data));
  return response.data;
};

