import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      user: null,

      loginSuccess: (token) => {
        set({ token, isAuthenticated: false });
      },

      setUserProfile: (profile) => {
        set({ user: profile, isAuthenticated: true });
      },

      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
        window.location.replace('/login');
      },
    }),
    {
      name: 'auth-storage', // nama key di localStorage
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
