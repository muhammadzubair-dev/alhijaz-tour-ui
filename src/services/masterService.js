import axiosInstance from '@/lib/axios'
import cleanObject from '@/utils/cleanObj';
import objToQueryString from '@/utils/objToQueryString';

const buildMultipartFormData = (body, fileFields = [], jsonFields = []) => {
  const formData = new FormData();

  // Lewatkan key yang perlu di-handle khusus (file dan JSON)
  const skipKeys = [...fileFields, ...jsonFields];

  Object.entries(body).forEach(([key, value]) => {
    if (skipKeys.includes(key)) return;
    if (value === null || value === undefined || value === 'null') return;

    formData.append(key, value);
  });

  // File fields (mengambil originFileObj)
  fileFields.forEach(field => {
    const fileArr = body[field];
    if (fileArr?.[0]?.originFileObj) {
      formData.append(field, fileArr[0].originFileObj);
    }
  });

  // JSON fields (seperti array hotelRooms)
  jsonFields.forEach(field => {
    const val = body[field];
    if (Array.isArray(val) && val.length > 0) {
      formData.append(field, JSON.stringify(val));
    }
  });

  return formData;
};

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

// Package
export const apiCreatePackage = async (body) => {
  const formData = buildMultipartFormData(body,
    ['itinerary', 'brochure', 'manasikInvitation', 'departureInfo'],
    ['hotelRooms']
  );

  const response = await axiosInstance.post('/master/package', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

export const apiUpdatePackage = async (id, body) => {
  const formData = buildMultipartFormData(body,
    ['itinerary', 'brochure', 'manasikInvitation', 'departureInfo'],
    ['hotelRooms']
  );

  const response = await axiosInstance.put(`/master/package/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

export const apiFetchPackages = async (query) => {
  const response = await axiosInstance.get(`/master/packages${objToQueryString(query)}`);
  return response.data;
};

export const apiDeletePackage = async ({ id }) => {
  const response = await axiosInstance.delete(`/master/package/${id}`);
  return response.data;
};

export const apiFetchPackageDetail = async (packageId) => {
  const response = await axiosInstance.get(`/master/packages/${packageId}`);
  return response.data;
};

// Airport
export const apiFetchAirports = async (query) => {
  const response = await axiosInstance.get(`/master/airports${objToQueryString(query)}`);
  return response.data;
};

export const apiCreateAirport = async (body) => {
  const response = await axiosInstance.post('/master/airport', cleanObject(body));
  return response.data;
};

export const apiEditAirport = async (payload) => {
  const { code, ...data } = payload
  const response = await axiosInstance.patch(`/master/airport/${code}`, cleanObject(data));
  return response.data;
};

export const apiDeleteAirport = async ({ code }) => {
  const response = await axiosInstance.delete(`/master/airport/${code}`);
  return response.data;
};

// Airline
export const apiFetchAirlines = async (query) => {
  const response = await axiosInstance.get(`/master/airlines${objToQueryString(query)}`);
  return response.data;
};

export const apiCreateAirline = async (body) => {
  const response = await axiosInstance.post('/master/airline', cleanObject(body));
  return response.data;
};

export const apiEditAirline = async (payload) => {
  const { id, ...data } = payload
  const response = await axiosInstance.patch(`/master/airline/${id}`, cleanObject(data));
  return response.data;
};

export const apiDeleteAirline = async ({ id }) => {
  const response = await axiosInstance.delete(`/master/airline/${id}`);
  return response.data;
};

// Umroh
export const apiCreateUmroh = async (body) => {
  const formData = buildMultipartFormData(body, ['photoIdentity', 'selfPhoto']);

  const response = await axiosInstance.post('/master/umroh', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

export const apiFetchUmroh = async (query) => {
  const response = await axiosInstance.get(`/master/umroh${objToQueryString(query)}`);
  return response.data;
};

export const apiDeleteUmroh = async ({ id }) => {
  const response = await axiosInstance.delete(`/master/umroh/${id}`);
  return response.data;
};