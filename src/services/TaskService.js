import axiosInstance from '@/lib/axios';
import cleanObject from '@/utils/cleanObj';
import objToQueryString from '@/utils/objToQueryString';

export const apiFetchTasks = async (query) => {
  const response = await axiosInstance.get(`/tasks${objToQueryString(query)}`);
  return response.data;
};

export const apiFetchTasksAssigned = async (query) => {
  const response = await axiosInstance.get(`/tasks/assigned${objToQueryString(query)}`);
  return response.data;
};

export const apiFetchTaskDetail = async (taskId) => {
  const response = await axiosInstance.get(`/tasks/${taskId}`);
  return response.data;
};

export const apiFetchTaskRole = async () => {
  const response = await axiosInstance.get(`/tasks/role`);
  return response.data;
};

export const apiEditTaskRole = async (taskTypeId, payload) => {
  const response = await axiosInstance.patch(`/tasks/role/${taskTypeId}`, cleanObject(payload));
  return response.data;
};

export const apiEditTaskStatus = async (taskId, payload) => {
  const response = await axiosInstance.patch(`/tasks/${taskId}`, cleanObject(payload));
  return response.data;
};

export const apiEditTaskAssignedStatus = async (taskId, payload) => {
  const response = await axiosInstance.patch(`/tasks/assigned/${taskId}`, cleanObject(payload));
  return response.data;
};

export const apiTasksRead = async (payload) => {
  const response = await axiosInstance.patch(`/tasks/read`, cleanObject(payload));
  return response.data;
};