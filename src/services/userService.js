import axiosInstance from '@/lib/axios'
import cleanObject from '@/utils/cleanObj';
import objToQueryString from '@/utils/objToQueryString';

// User
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

// User Role
export const apiFetchUsersRoles = async (query) => {
  const response = await axiosInstance.get(`/users/roles${objToQueryString(query)}`);
  return response.data;
};

export const apiCreateRole = async (payload) => {
  const response = await axiosInstance.post('/users/role', cleanObject(payload));
  return response.data;
};

export const apiEditUserRole = async (payload) => {
  const { id, ...data } = payload
  const response = await axiosInstance.patch(`/users/role/${id}`, cleanObject(data));
  return response.data;
};

export const apiDeleteUserRole = async ({ id }) => {
  const response = await axiosInstance.delete(`/users/role/${id}`);
  return response.data;
};

// User Agent
export const apiFetchUsersAgents = async (query) => {
  const response = await axiosInstance.get(`/users/agents${objToQueryString(query)}`);
  return response.data;
};

export const apiCreateAgent = async (payload) => {
  const response = await axiosInstance.post('/users/agent', cleanObject(payload));
  return response.data;
};