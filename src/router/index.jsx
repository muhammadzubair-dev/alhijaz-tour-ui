import { PageLoader } from '@/components';
import DashboardLayout from '@/layouts/DashboardLayout';
import '@ant-design/v5-patch-for-react-19';
import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const UserPage = lazy(() => import('@/pages/UserManagement/UserPage'));
const AgentPage = lazy(() => import('@/pages/UserManagement/AgentPage'));
const RolePage = lazy(() => import('@/pages/UserManagement/RolePage'));
const MenuPage = lazy(() => import('@/pages/UserManagement/MenuPage'));
const BankPage = lazy(() => import('@/pages/DataMaster/BankPage'));
const FeePage = lazy(() => import('@/pages/DataMaster/FeePage'));
const SocialMediaPage = lazy(() => import('@/pages/DataMaster/SosmedPage'));

const AppRouter = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />

          <Route path="user-management">
            <Route index element={<UserPage />} />
            <Route path="agent" element={<AgentPage />} />
            <Route path="role" element={<RolePage />} />
            <Route path="menu" element={<MenuPage />} />
          </Route>

          <Route path="data-master">
            <Route path="bank" element={<BankPage />} />
            <Route path="fee" element={<FeePage />} />
            <Route path="social-media" element={<SocialMediaPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
)

export default AppRouter;