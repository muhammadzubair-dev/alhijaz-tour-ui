import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAuthStore = create()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      loginSuccess: (userData, authToken) => {
        set({
          user: userData,
          token: authToken,
          isAuthenticated: true,
        });
      },

      logoutUser: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      setUserProfile: (profileData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...profileData } : null,
        })),
    }),
    {
      name: 'auth-storage-ts',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;