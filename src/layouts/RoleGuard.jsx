// components/RoleGuard.tsx
import { useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '@/store/authStore';

export const RoleGuard = ({ allowedMenu = [], children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  const hasAccess = useMemo(() => {
    if (!user?.menu || allowedMenu.length === 0) return false;
    return allowedMenu.some((roleId) => user.menu.includes(roleId));
  }, [user?.menu, allowedMenu]);

  useEffect(() => {
    if (user && !hasAccess) {
      navigate('/unauthorized', { replace: true, state: { from: location } });
    }
  }, [user, hasAccess, navigate, location]);

  if (!user || !hasAccess) return null;

  return <>{children}</>;
};
