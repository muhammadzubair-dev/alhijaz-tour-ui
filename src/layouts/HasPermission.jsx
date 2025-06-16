// components/HasPermission.js
import useAuthStore from '@/store/authStore';

const HasPermission = ({ menu, children }) => {
  const user = useAuthStore((state) => state.user);

  if (!user?.menuIds?.includes(menu)) return null;

  return <>{children}</>;
};

export default HasPermission;
