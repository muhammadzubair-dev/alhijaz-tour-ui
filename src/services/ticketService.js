import axiosInstance from '@/lib/axios';
import objToQueryString from '@/utils/objToQueryString';

export const apiFetchTickets = async (query) => {
  const response = await axiosInstance.get(`/tickets${objToQueryString(query)}`);
  return response.data;
};
