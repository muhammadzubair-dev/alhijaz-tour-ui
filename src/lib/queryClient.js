import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data dianggap basi setelah 5 menit
      refetchOnWindowFocus: false, // Tidak otomatis refetch saat window kembali fokus
      retry: 1, // Coba lagi query 1 kali jika gagal
    },
    mutations: {
      // Anda bisa menambahkan opsi default untuk mutasi di sini jika perlu
      // contoh: onError: (error) => { console.error("Mutation error:", error); }
    },
  },
});

export default queryClient;