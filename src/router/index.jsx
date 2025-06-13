import { PageLoader } from '@/components';
import DashboardLayout from '@/layouts/DashboardLayout';
import '@ant-design/v5-patch-for-react-19';
import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import GuestRoute from './GuestRoute';
import ProtectedRoute from './ProtectedRoute';

const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const UserPage = lazy(() => import('@/pages/UserManagement/UserPage'));
const AgentPage = lazy(() => import('@/pages/UserManagement/AgentPage'));
const UmrohPage = lazy(() => import('@/pages/Pendaftaran/Umroh'));
const NewUmrohPage = lazy(() => import('@/pages/Pendaftaran/Umroh/NewUmroh'));
const RolePage = lazy(() => import('@/pages/UserManagement/RolePage'));
const MenuPage = lazy(() => import('@/pages/UserManagement/MenuPage'));
const BankPage = lazy(() => import('@/pages/DataMaster/BankPage'));
const AirportPage = lazy(() => import('@/pages/DataMaster/AirportPage'));
const AirlinePage = lazy(() => import('@/pages/DataMaster/AirlinePage'));
const FeePage = lazy(() => import('@/pages/DataMaster/FeePage'));
const SocialMediaPage = lazy(() => import('@/pages/DataMaster/SosmedPage'));
const PackagePage = lazy(() => import('@/pages/DataMaster/Package'));
const NewPackagePage = lazy(() => import('@/pages/DataMaster/Package/NewPackagePage'));
const EditPackagePage = lazy(() => import('@/pages/DataMaster/Package/EditPackagePage'));
const TicketPage = lazy(() => import('@/pages/DataMaster/TicketPage'));
const NewTicketPage = lazy(() => import('@/pages/DataMaster/TicketPage/NewTicketPage'));
const EditTicketPage = lazy(() => import('@/pages/DataMaster/TicketPage/EditTicketPage'));

const AppRouter = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>

      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

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

          <Route path="pendaftaran">
            <Route path="umroh">
              <Route index element={<UmrohPage />} />
              <Route path="daftar-umroh" element={<NewUmrohPage />} />
              <Route path="daftar-umroh/:kodeUmroh" element={<NewUmrohPage />} />
            </Route>
          </Route>

          <Route path="data-master">
            <Route path="bank" element={<BankPage />} />
            <Route path="airport" element={<AirportPage />} />
            <Route path="airline" element={<AirlinePage />} />
            <Route path="fee" element={<FeePage />} />
            <Route path="social-media" element={<SocialMediaPage />} />
            <Route path="package" element={<PackagePage />} />
            <Route path="package/new-package" element={<NewPackagePage />} />
            <Route path="package/:idPackage" element={<EditPackagePage />} />
            <Route path="ticket" element={<TicketPage />} />
            <Route path="ticket/:idTicket" element={<EditTicketPage />} />
            <Route path="ticket/new-ticket" element={<NewTicketPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
)

export default AppRouter;