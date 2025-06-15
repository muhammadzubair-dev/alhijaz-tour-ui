import { RoleGuard } from '@/layouts/RoleGuard';

const RoleRoute = ({ menu, element }) => (
  <RoleGuard allowedMenu={menu}>{element}</RoleGuard>
);

export default RoleRoute;
