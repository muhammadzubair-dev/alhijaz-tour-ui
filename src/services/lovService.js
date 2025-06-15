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

export const apiFetchLovUserAgent = async () => {
  const response = await axiosInstance.get(`/lov/user-agent`);
  return response.data;
};

export const apiFetchLovBanks = async () => {
  const response = await axiosInstance.get(`/lov/banks`);
  return response.data;
};

export const apiFetchLovAgents = async () => {
  const response = await axiosInstance.get(`/lov/agents`);
  return response.data;
};

export const apiFetchLovProvinces = async () => {
  const response = await axiosInstance.get(`/lov/provinces`);
  return response.data;
};

export const apiFetchLovDistricts = async (provinceId) => {
  const response = await axiosInstance.get(`/lov/provinces/${provinceId}/districts`);
  return response.data;
};

export const apiFetchLovSubDistricts = async (provinceId, districtId) => {
  const response = await axiosInstance.get(
    `/lov/provinces/${provinceId}/districts/${districtId}/sub-districts`
  );
  return response.data;
};

export const apiFetchLovNeighborhoods = async (
  provinceId,
  districtId,
  subDistrictId
) => {
  const response = await axiosInstance.get(
    `/lov/provinces/${provinceId}/districts/${districtId}/sub-districts/${subDistrictId}/neighborhoods`
  );
  return response.data;
};

export const apiFetchUmrohPackage = async () => {
  const response = await axiosInstance.get(`/lov/umroh-package`);
  return response.data;
};

export const apiFetchUmrohPackageRooms = async (packageId) => {
  const response = await axiosInstance.get(`/lov/umroh-package/${packageId}/rooms`);
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
