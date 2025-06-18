import axiosInstance from '@/lib/axios'
import cleanObject from '@/utils/cleanObj';
import objToQueryString from '@/utils/objToQueryString';

export const apiFetchTasks = async (query) => {
  const response = await axiosInstance.get(`/tasks${objToQueryString(query)}`);
  return response.data;
};