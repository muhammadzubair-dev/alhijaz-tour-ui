// hooks/usePermission.js
import useAuthStore from '@/store/authStore';

const useHasPermission = (menuCodes = []) => {
  const user = useAuthStore((state) => state.user);
  const userMenuIds = user?.menuIds || [];

  if (Array.isArray(menuCodes)) {
    return menuCodes.some((code) => userMenuIds.includes(code));
  }

  // fallback jika hanya satu string diberikan
  return userMenuIds.includes(menuCodes);
};

export default useHasPermission;
