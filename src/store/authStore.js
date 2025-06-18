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
        document.cookie = `token=${token}; path=/; SameSite=Lax;`;
      },

      setUserProfile: (profile) => {
        set({ user: profile, isAuthenticated: true });
      },

      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
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
