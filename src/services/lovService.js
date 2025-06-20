import axiosInstance from '@/lib/axios';
import objToQueryString from '@/utils/objToQueryString';


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

export const apiFetchPackageRooms = async (packageId) => {
  const response = await axiosInstance.get(`/lov/package/${packageId}/rooms`);
  return response.data;
};

export const apiFetchJamaah = async () => {
  const response = await axiosInstance.get(`/lov/jamaah`);
  return response.data;
};

export const apiFetchJamaahByIdentity = async (identityNumber) => {
  const response = await axiosInstance.get(`/lov/jamaah/${identityNumber}`);
  return response.data;
};

export const apiFetchJamaahUmroh = async (umrohCode) => {
  const response = await axiosInstance.get(`/lov/jamaah/umroh/${umrohCode}`);
  return response.data;
};

export const apiFetchLovTickets = async () => {
  const response = await axiosInstance.get(`/lov/tickets`);
  return response.data;
};

export const apiFetchLovAirports = async () => {
  const response = await axiosInstance.get(`/lov/airports`);
  return response.data;
};

export const apiFetchLovAirlines = async () => {
  const response = await axiosInstance.get(`/lov/airlines`);
  return response.data;
};

export const apiFetchLovPartners = async () => {
  const response = await axiosInstance.get(`/lov/partners`);
  return response.data;
};

export const apiFetchLovStaff = async (query) => {
  const response = await axiosInstance.get(`/lov/staff${objToQueryString(query)}`);
  return response.data;
};

export const apiFetchLovBanks = async () => {
  const response = await axiosInstance.get(`/lov/banks`);
  return response.data;
};

export const apiFetchLovAgents = async (query) => {
  const response = await axiosInstance.get(`/lov/agents${objToQueryString(query)}`);
  return response.data;
};

export const apiFetchLovProvinces = async (query) => {
  const response = await axiosInstance.get(`/lov/provinces${objToQueryString(query)}`);
  return response.data;
};

export const apiFetchLovDistricts = async (provinceId, query) => {
  const response = await axiosInstance.get(`/lov/provinces/${provinceId}/districts${objToQueryString(query)}`);
  return response.data;
};

export const apiFetchLovSubDistricts = async (provinceId, districtId, query) => {
  const response = await axiosInstance.get(
    `/lov/provinces/${provinceId}/districts/${districtId}/sub-districts${objToQueryString(query)}`
  );
  return response.data;
};

export const apiFetchLovNeighborhoods = async (
  provinceId,
  districtId,
  subDistrictId,
  query
) => {
  const response = await axiosInstance.get(
    `/lov/provinces/${provinceId}/districts/${districtId}/sub-districts/${subDistrictId}/neighborhoods${objToQueryString(query)}`
  );
  return response.data;
};

export const apiFetchUmrohPackage = async (query) => {
  const response = await axiosInstance.get(`/lov/umroh-package${objToQueryString(query)}`);
  return response.data;
};

export const apiFetchUmrohPackageRooms = async (packageId, query) => {
  const response = await axiosInstance.get(`/lov/umroh-package/${packageId}/rooms${objToQueryString(query)}`);
  return response.data;
};

export const apiFetchUmrohByCode = async (umrohCode) => {
  const response = await axiosInstance.get(`/lov/umroh/${umrohCode}`);
  return response.data;
};

export const apiFetchRolesByType = async (userType) => {
  const response = await axiosInstance.get(`/lov/role/${userType}`);
  return response.data;
};

export const apiFetchMenu = async () => {
  const response = await axiosInstance.get(`/lov/menu`);
  return response.data;
};
