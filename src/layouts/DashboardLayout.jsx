import logo from '@/assets/logo.png';
import { connectSSE, disconnectSSE } from '@/utils/sse';
import { ResultSuccess, SearchPages, SwitchTheme, ChangePassword, NotificationBell } from '@/components';
import { MENU_IDS } from '@/constant/menu';
import { apiUserLogout } from '@/services/userService';
import useAuthStore from '@/store/authStore';
import convertPathToBreadcrumb from '@/utils/convertPathToBreadcrumb';
import {
  DatabaseOutlined,
  HomeOutlined,
  LogoutOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Avatar, Breadcrumb, Button, Divider, Flex, Layout, Menu, Space, theme, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { FaTasks } from 'react-icons/fa';
import { FaWpforms } from 'react-icons/fa6';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;
const { useToken } = theme;

function getItem(label, key, icon, children, permissionKey) {
  return {
    key,
    icon,
    children,
    label,
    permissionKey
  };
}
const items = [
  getItem('Dashboard', '/dashboard', <HomeOutlined />, null, MENU_IDS.Dashboard),
  getItem('Task', '/task', <FaTasks />),
  getItem('Pendatftaran', 'sub_pendaftaran', <FaWpforms />, [
    getItem('Umroh', '/pendaftaran/umroh', null, null, MENU_IDS.RegisterUmrahList),
    // getItem('Agent', '/user-management/agent'),
    // getItem('Role', '/user-management/role'),
    // getItem('Menu', '/user-management/menu'),
  ]),
  getItem('User Management', 'sub_user_management', <UserOutlined />, [
    getItem('Staff', '/user-management', null, null, MENU_IDS.StaffList),
    getItem('Agent', '/user-management/agent', null, null, MENU_IDS.AgentList),
    getItem('Role', '/user-management/role', null, null, MENU_IDS.RoleList),
    // getItem('Menu', '/user-management/menu'),
  ]),
  getItem('Data Master', 'sub_data_master', <DatabaseOutlined />, [
    getItem('Package', '/data-master/package', null, null, MENU_IDS.PackageList),
    getItem('Ticket', '/data-master/ticket', null, null, MENU_IDS.TicketList),
    getItem('Bank', '/data-master/bank', null, null, MENU_IDS.BankList),
    getItem('Airport', '/data-master/airport', null, null, MENU_IDS.AirportList),
    getItem('Airline', '/data-master/airline', null, null, MENU_IDS.AirlineList),
    // getItem('Social Media', '/data-master/social-media'),
    // getItem('Fee', '/data-master/fee'),
    // getItem('Jamaah', '/data-master/jamaah'),
    // getItem('Region', '/data-master/region'),
    // getItem('Hotel', '/data-master/hotel'),
    // getItem('Partner', '/data-master/partner'),
    // getItem('Document', '/data-master/document'),
    // getItem('Product Type', '/data-master/product-type'),
    // getItem('Transportasi', '/data-master/transportasi'),
    // getItem('Zona', '/data-master/zona'),
  ]),
];

const DashboardLayout = () => {
  const { token } = useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const [openForm, setOpenForm] = useState(false)
  const [openResult, setOpenResult] = useState({
    open: false,
    title: '',
    subtitle: ''
  })
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const logoutUserMutation = useMutation({
    mutationFn: apiUserLogout,
    onSuccess: () => {
      logout()
    },
  });

  const handleMenuItemClick = (e) => {
    if (e.key) {
      navigate(e.key);
    }
  }

  const handleLogout = (e) => {
    e.preventDefault()
    logoutUserMutation.mutate()
  }

  const handleCloseForm = () => {
    setOpenForm(false)
  }

  const handleOpenResult = (values) => {
    setOpenResult((prevState) => ({
      ...prevState,
      ...values
    }))
  }

  const hasPermission = (menuId) => user?.menuIds?.includes(menuId);

  const filterMenuItems = (items) => {
    return items
      .map(item => {
        if (item.children) {
          const filteredChildren = filterMenuItems(item.children);
          if (filteredChildren.length > 0) {
            return { ...item, children: filteredChildren };
          }
          return null;
        }

        if (!item.permissionKey || hasPermission(item.permissionKey)) {
          return item;
        }

        return null;
      })
      .filter(Boolean);
  };

  const selectedKeys = [location.pathname];

  useEffect(() => {
    if (user?.isDefaultPassword) {
      setOpenForm(true)
    }
  }, [user?.isDefaultPassword])

  // ⬇️ Tambahkan ini untuk koneksi SSE
  useEffect(() => {
    if (user?.id) {
      connectSSE(user.id, (data) => {
        console.log('📩 SSE message received:', data);
        // 👉 Bisa trigger store, toast, notifikasi, dll.
      });

      return () => {
        disconnectSSE();
      };
    }
  }, [user?.id]);

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider
        width={230}
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={broken => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <Flex vertical justify='space-between' style={{ height: '100%' }}>
          <div style={{
            flex: 1, overflow: 'auto', scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}>
            <div style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: token.colorPrimary, paddingTop: 10 }}>
              <Flex style={{ margin: 20 }} align='center' gap={16}>
                <Avatar size={48} src='https://api.dicebear.com/9.x/adventurer/svg?seed=Liam&backgroundColor=b6e3f4' style={{ flexShrink: 0 }} />
                <Space direction='vertical' size={0} style={{ flex: 1 }}>
                  <Typography.Text ellipsis={true} style={{ width: 125, color: 'rgb(255,255,255)' }}>{user.name}</Typography.Text>
                  <Typography.Text ellipsis={true} style={{ width: 125, color: 'rgba(255, 255, 255, 0.80)' }}>{user.type === '1' ? 'Agent' : user.type === '0' ? 'Staff' : '-'}</Typography.Text>
                </Space>
              </Flex>
              <div style={{ padding: '0 20px' }}>
                <Divider style={{ backgroundColor: 'rgba(255, 255, 255, 0.20)' }} />
              </div>
            </div>
            <div >
              <Menu selectedKeys={selectedKeys} onClick={handleMenuItemClick} theme='dark' mode="inline" defaultSelectedKeys={['/dashboard']} items={filterMenuItems(items)} />
            </div>
          </div>
          <Flex vertical style={{ padding: '0 16px 16px', flexShrink: 0 }}>
            <Divider style={{ backgroundColor: 'rgba(255, 255, 255, 0.20)' }} />
            <Button color="default" variant="solid" icon={<LogoutOutlined />} onClick={handleLogout} block>
              Logout
            </Button>
          </Flex>
        </Flex>
      </Sider>
      <Layout>
        <Header style={{ background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
          <img src={logo} height={35} />
          <Flex align='center' gap={20}>
            {/* <SearchPages /> */}
            <NotificationBell />
            <SwitchTheme />
          </Flex>
        </Header>
        <Breadcrumb
          items={
            convertPathToBreadcrumb(location.pathname).map(item => ({
              title: item
            }))
          }
          style={{ margin: '16px' }}
        />
        <Content style={{ margin: '0 32px 0', overflow: 'auto' }}>
          <div
            style={{
              padding: 28,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
      <ChangePassword open={openForm} onCloseForm={handleCloseForm} onOpenResult={handleOpenResult} />
      <ResultSuccess open={openResult} onOpenResult={handleOpenResult} />
    </Layout >
  );
};

export default DashboardLayout;
