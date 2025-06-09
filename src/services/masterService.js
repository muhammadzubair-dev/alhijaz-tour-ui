import axiosInstance from '@/lib/axios'
import cleanObject from '@/utils/cleanObj';
import objToQueryString from '@/utils/objToQueryString';

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
  const formData = new FormData();

  // Append all scalar fields
  Object.entries(body).forEach(([key, value]) => {
    // Lewatkan file & array khusus
    if (
      ['itinerary', 'brochure', 'manasikInvitation', 'departureInfo', 'hotelRooms'].includes(key)
    )
      return;

    formData.append(key, value);
  });

  // Append file fields (ambil file asli dari `originFileObj`)
  const appendFile = (fieldName, fileArr) => {
    if (fileArr && fileArr.length > 0 && fileArr[0].originFileObj) {
      formData.append(fieldName, fileArr[0].originFileObj);
    }
  };

  appendFile('itinerary', body.itinerary);
  appendFile('brochure', body.brochure);
  appendFile('manasikInvitation', body.manasikInvitation);
  appendFile('departureInfo', body.departureInfo);

  // Append hotelRooms as JSON string
  formData.append('hotelRooms', JSON.stringify(body.hotelRooms));

  const response = await axiosInstance.post('/master/package', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const apiUpdatePackage = async (id, body) => {
  const formData = new FormData();

  // Append all scalar fields
  Object.entries(body).forEach(([key, value]) => {
    // Lewatkan file & array khusus
    if (
      ['itinerary', 'brochure', 'manasikInvitation', 'departureInfo', 'hotelRooms'].includes(key)
    )
      return;

    formData.append(key, value);
  });

  // Append file fields (ambil file asli dari `originFileObj`)
  const appendFile = (fieldName, fileArr) => {
    if (fileArr && fileArr.length > 0 && fileArr[0].originFileObj) {
      formData.append(fieldName, fileArr[0].originFileObj);
    }
  };

  appendFile('itinerary', body.itinerary);
  appendFile('brochure', body.brochure);
  appendFile('manasikInvitation', body.manasikInvitation);
  appendFile('departureInfo', body.departureInfo);

  // Append hotelRooms as JSON string
  formData.append('hotelRooms', JSON.stringify(body.hotelRooms));

  const response = await axiosInstance.put(`/master/package/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const apiFetchPackages = async (query) => {
  const response = await axiosInstance.get(`/master/packages${objToQueryString(query)}`);
  return response.data;
};

export const apiFetchPackageDetail = async (packageId) => {
  const response = await axiosInstance.get(`/master/packages/${packageId}`);
  return response.data;
};