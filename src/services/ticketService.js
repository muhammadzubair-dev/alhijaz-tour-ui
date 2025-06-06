import axiosInstance from '@/lib/axios'
import cleanObject from '@/utils/cleanObj';
import objToQueryString from '@/utils/objToQueryString';

// Ticket
export const apiFetchTickets = async (query) => {
  const response = await axiosInstance.get(`/tickets${objToQueryString(query)}`);
  return response.data;
};
