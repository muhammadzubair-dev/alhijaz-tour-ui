import axiosInstance from '@/lib/axios'
import cleanObject from '@/utils/cleanObj';
import objToQueryString from '@/utils/objToQueryString';

// MASTER BANK
export const apiFetchMasterBanks = async (query) => {
  const response = await axiosInstance.get(`/master/banks${objToQueryString(query)}`);
  return response.data;
};

export const apiCreateMasterBank = async (body) => {
  const response = await axiosInstance.post('/master/bank', cleanObject(body));
  return response.data;
};

export const apiEditMasterBank = async (payload) => {
  const { id, ...data } = payload
  const response = await axiosInstance.patch(`/master/bank/${id}`, cleanObject(data));
  return response.data;
};

export const apiDeleteMasterBank = async ({ id }) => {
  const response = await axiosInstance.delete(`/master/bank/${id}`);
  return response.data;
};

// MASTER SOSMED
export const apiFetchMasterSosmeds = async (query) => {
  const response = await axiosInstance.get(`/master/sosmeds${objToQueryString(query)}`);
  return response.data;
};

export const apiCreateMasterSosmed = async (body) => {
  const response = await axiosInstance.post('/master/sosmed', cleanObject(body));
  return response.data;
};

export const apiEditMasterSosmed = async (payload) => {
  const { id, ...data } = payload
  const response = await axiosInstance.patch(`/master/sosmed/${id}`, cleanObject(data));
  return response.data;
};

export const apiDeleteMasterSosmed = async ({ id }) => {
  const response = await axiosInstance.delete(`/master/sosmed/${id}`);
  return response.data;
};