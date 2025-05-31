import axios from 'axios';
import useGlobalErrorStore from '@/store/errorStore';
import useAuthStore from '@/store/authStore'; // Untuk contoh logout pada 401

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api', // JSONPlaceholder untuk posts
  // baseURL: 'https://fakestoreapi.com', // Untuk auth (perlu disesuaikan servicenya)
});

// Request Interceptor (mis. untuk token)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response, // Semua status 2xx akan lewat sini
  (error) => {
    const { setError } = useGlobalErrorStore.getState();
    const { logoutUser } = useAuthStore.getState(); // Contoh untuk 401

    if (error.response) {
      const status = error.response.status;
      const dataMessage = error.response.data?.message || error.response.data?.error || error.message;
      const errorTitle = `Error ${status}`;

      console.error(`HTTP Error ${status}:`, dataMessage, error.response);

      if (status === 401) {
        // Penanganan khusus 401 (Unauthorized)
        logoutUser(); // Logout pengguna
        // setError({ // Bisa juga tampilkan pesan custom sebelum redirect
        //   status: 401,
        //   title: 'Sesi Berakhir',
        //   subTitle: 'Silakan login kembali untuk melanjutkan.',
        // });
        // Redirect ke login akan dihandle oleh ProtectedRoute atau listener di UI
      } else if (status === 403) {
        setError({ status: 403, title: 'Akses Ditolak (403)', subTitle: dataMessage || 'Anda tidak memiliki izin.' });
      } else if (status === 404) {
        // Kita bisa biarkan komponen/halaman yang menangani 404 sendiri,
        // atau tampilkan pesan global jika itu adalah API call yang tidak terduga.
        // Untuk contoh ini, kita set global.
        setError({ status: 404, title: 'Tidak Ditemukan (404)', subTitle: dataMessage || 'Sumber daya tidak ditemukan.' });
      } else if (status >= 500) {
        setError({ status: 500, title: errorTitle, subTitle: dataMessage || 'Terjadi kesalahan pada server.' });
      } else if (status >= 400) { // Error klien lainnya
        setError({ status: 'error', title: errorTitle, subTitle: dataMessage || 'Permintaan tidak valid.' });
      }
    } else if (error.request) {
      // Request dibuat tapi tidak ada respons
      console.error('Network Error:', error.request);
      setError({ status: 'error', title: 'Kesalahan Jaringan', subTitle: 'Tidak dapat terhubung ke server.' });
    } else {
      // Error lain saat setting up request
      console.error('Request Setup Error:', error.message);
      setError({ status: 'error', title: 'Kesalahan Aplikasi', subTitle: error.message });
    }
    return Promise.reject(error); // Penting agar React Query juga menangkap error
  }
);

export default axiosInstance;