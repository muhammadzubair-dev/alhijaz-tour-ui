import axiosInstance from '@/lib/axios'
import cleanObject from '@/utils/cleanObj';
import objToQueryString from '@/utils/objToQueryString';

// Login
export const apiUserLogin = async (payload) => {
  const response = await axiosInstance.post('/users/login', cleanObject(payload));
  return response.data;
};

export const apiUserLogout = async () => {
  const response = await axiosInstance.post('/users/logout');
  return response.data;
};

export const apiUserChangePassword = async (payload) => {
  const response = await axiosInstance.post('/users/change-password', cleanObject(payload));
  return response.data;
};

// User
export const apiFetchUsers = async (query) => {
  const response = await axiosInstance.get(`/users${objToQueryString(query)}`);
  return response.data;
};

export const apiFetchCurrentUser = async () => {
  const response = await axiosInstance.get(`/users/current`);
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

export const apiDeleteUser = async ({ id }) => {
  const response = await axiosInstance.delete(`/users/${id}`);
  return response.data;
};

export const apiEditUser = async (payload) => {
  const { id, ...data } = payload
  const response = await axiosInstance.patch(`/users/${id}`, cleanObject(data));
  return response.data;
};

// Role
export const apiFetchUsersRoles = async (query) => {
  const response = await axiosInstance.get(`/users/roles${objToQueryString(query)}`);
  return response.data;
};

export const apiCreateRole = async (payload) => {
  const response = await axiosInstance.post('/users/role', cleanObject(payload));
  return response.data;
};

export const apiCreateRoleMenu = async (idRole, payload) => {
  const response = await axiosInstance.post(`/users/role/${idRole}/menu`, cleanObject(payload));
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

// Agent
export const apiFetchUsersAgents = async (query) => {
  const response = await axiosInstance.get(`/users/agents${objToQueryString(query)}`);
  return response.data;
};

export const apiCreateAgent = async (payload) => {
  const response = await axiosInstance.post('/users/agent', cleanObject(payload));
  return response.data;
};

export const apiUpdateAgent = async (id, payload) => {
  const { username: _, ...payloadWithoutUsername } = payload
  const response = await axiosInstance.put(`/users/agent/${id}`, cleanObject(payloadWithoutUsername));
  return response.data;
};

export const apiDeleteAgent = async ({ id }) => {
  const response = await axiosInstance.delete(`/users/agent/${id}`);
  return response.data;
};