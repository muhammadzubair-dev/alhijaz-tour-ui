import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '@/store/authStore';

const GuestRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default GuestRoute;
