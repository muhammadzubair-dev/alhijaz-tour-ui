import { create } from 'zustand';

const useGlobalErrorStore = create((set) => ({
  errorInfo: null,
  setError: (details) => set({ errorInfo: { ...details, status: details.status || 'error' } }),
  clearError: () => set({ errorInfo: null }),
}));

export default useGlobalErrorStore;