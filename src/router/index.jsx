import { PageLoader } from '@/components';
import DashboardLayout from '@/layouts/DashboardLayout';
import '@ant-design/v5-patch-for-react-19';
import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import GuestRoute from './GuestRoute';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import { MENU_IDS } from '@/constant/menu';

const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const UserPage = lazy(() => import('@/pages/UserManagement/UserPage'));
const AgentPage = lazy(() => import('@/pages/UserManagement/AgentPage'));
const UmrohPage = lazy(() => import('@/pages/Pendaftaran/Umroh'));
const NewUmrohPage = lazy(() => import('@/pages/Pendaftaran/Umroh/NewUmroh'));
const JamaahUmrohPage = lazy(() => import('@/pages/Pendaftaran/Umroh/JamaahUmroh'));
const RolePage = lazy(() => import('@/pages/UserManagement/RolePage'));
const MenuPage = lazy(() => import('@/pages/UserManagement/MenuPage'));
const UnauthorizedPage = lazy(() => import('@/pages/UnauthorizedPage'));
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

      {/* Guest Routes */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardLayout />}>

          {/* Redirect to dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* Dashboard */}
          <Route path="dashboard" element={<RoleRoute menu={[MENU_IDS.Dashboard]} element={<DashboardPage />} />} />

          {/* User Management */}
          <Route path="user-management">
            <Route index element={<RoleRoute menu={[MENU_IDS.UserManagement]} element={<UserPage />} />} />
            <Route path="agent" element={<RoleRoute menu={[MENU_IDS.Agent]} element={<AgentPage />} />} />
            <Route path="role" element={<RoleRoute menu={[MENU_IDS.Role]} element={<RolePage />} />} />
            {/* <Route path="menu" element={<RoleRoute menu={[MENU_IDS.Me]} element={<MenuPage />} />} /> */}
          </Route>

          {/* Pendaftaran - Umroh */}
          <Route path="pendaftaran">
            <Route path="umroh">
              <Route index element={<RoleRoute menu={[MENU_IDS.RegisterUmrahList]} element={<UmrohPage />} />} />
              <Route path="daftar-umroh" element={<RoleRoute menu={[MENU_IDS.RegisterUmrahAdd]} element={<NewUmrohPage />} />} />
              <Route path="daftar-umroh/:kodeUmroh" element={<RoleRoute menu={[MENU_IDS.RegisterUmrahEdit]} element={<NewUmrohPage />} />} />
              <Route path=":kodeUmroh/jamaah" element={<RoleRoute menu={[MENU_IDS.RegisterUmrahAddByCode]} element={<JamaahUmrohPage />} />} />
            </Route>
          </Route>

          {/* Data Master */}
          <Route path="data-master">
            <Route path="bank" element={<RoleRoute menu={[MENU_IDS.BankList]} element={<BankPage />} />} />
            <Route path="airport" element={<RoleRoute menu={[MENU_IDS.AirportList]} element={<AirportPage />} />} />
            <Route path="airline" element={<RoleRoute menu={[MENU_IDS.AirlineList]} element={<AirlinePage />} />} />
            {/* <Route path="fee" element={<RoleRoute menu={[MENU_IDS.DataMaster]} element={<FeePage />} />} /> */}
            {/* <Route path="social-media" element={<RoleRoute menu={[MENU_IDS.DataMaster]} element={<SocialMediaPage />} />} /> */}

            {/* Package */}
            <Route path="package" element={<RoleRoute menu={[MENU_IDS.PackageList]} element={<PackagePage />} />} />
            <Route path="package/new-package" element={<RoleRoute menu={[MENU_IDS.PackageAdd]} element={<NewPackagePage />} />} />
            <Route path="package/:idPackage" element={<RoleRoute menu={[MENU_IDS.PackageEdit]} element={<EditPackagePage />} />} />

            {/* Ticket */}
            <Route path="ticket" element={<RoleRoute menu={[MENU_IDS.TicketList]} element={<TicketPage />} />} />
            <Route path="ticket/:idTicket" element={<RoleRoute menu={[MENU_IDS.TicketEdit]} element={<EditTicketPage />} />} />
            <Route path="ticket/new-ticket" element={<RoleRoute menu={[MENU_IDS.TicketAdd]} element={<NewTicketPage />} />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback Not Found */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
)

export default AppRouter;