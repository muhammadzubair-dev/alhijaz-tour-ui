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

export const apiCreateUmroh = async (body) => {
  const formData = buildMultipartFormData(body, ['photoIdentity', 'selfPhoto']);

  const response = await axiosInstance.post('/umroh', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

export const apiFetchUmroh = async (query) => {
  const response = await axiosInstance.get(`/umroh${objToQueryString(query)}`);
  return response.data;
};

export const apiDeleteUmroh = async (umrohCode) => {
  const response = await axiosInstance.delete(`/umroh/${umrohCode}`);
  return response.data;
};

export const apiEditUmroh = async (umrohCode, payload) => {
  const response = await axiosInstance.patch(`/umroh/${umrohCode}`, cleanObject(payload));
  return response.data;
};

export const apiFetchJamaahUmroh = async (umrohCode, query) => {
  const response = await axiosInstance.get(`/umroh/${umrohCode}/jamaah/${objToQueryString(query)}`);
  return response.data;
};