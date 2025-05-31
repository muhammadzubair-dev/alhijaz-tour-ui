import useAuthStore from '@/store/authStore';
import { Navigate, Outlet, useLocation, } from 'react-router-dom';

function ProtectedRoute() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const location = useLocation();

  // if (!isAuthenticated) {
  //   // state={{ from: location }} akan dilewatkan ke halaman login
  //   return <Navigate to="/login" state={{ from: location }} replace />;
  // }
  return <Outlet />;
}
export default ProtectedRoute;