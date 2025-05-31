import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useUiStore = create(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
      setTheme: (newTheme) => {
        if (newTheme === 'light' || newTheme === 'dark') {
          set({ theme: newTheme });
        }
      },
    }),
    {
      name: 'ui-theme-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUiStore;