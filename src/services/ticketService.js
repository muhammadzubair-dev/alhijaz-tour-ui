import axiosInstance from '@/lib/axios';
import cleanObject from '@/utils/cleanObj';
import objToQueryString from '@/utils/objToQueryString';

export const apiFetchTickets = async (query) => {
  const response = await axiosInstance.get(`/tickets${objToQueryString(query)}`);
  return response.data;
};

export const apiCreateTicket = async (payload) => {
  const response = await axiosInstance.post('/tickets', cleanObject(payload));
  return response.data;
};

export const apiFetchDetailTicket = async (id) => {
  const response = await axiosInstance.get(`/tickets/${id}`);
  return response.data;
};
