import axiosInstance from '@/lib/axios';


export const apiFetchPackageTypes = async () => {
  const response = await axiosInstance.get(`/lov/package-types`);
  return response.data;
};

export const apiFetchRoomTypes = async () => {
  const response = await axiosInstance.get(`/lov/room-types`);
  return response.data;
};

export const apiFetchCities = async () => {
  const response = await axiosInstance.get(`/lov/cities`);
  return response.data;
};

export const apiFetchCityHotels = async (cityId) => {
  const response = await axiosInstance.get(`/lov/cities/${cityId}/hotels`);
  return response.data;
};
