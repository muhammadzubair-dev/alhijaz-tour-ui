import logo from '@/assets/logo.png';
import { SearchPages, SwitchTheme } from '@/components';
import convertPathToBreadcrumb from '@/utils/convertPathToBreadcrumb';
import {
  DatabaseOutlined,
  HomeOutlined,
  LogoutOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Avatar, Breadcrumb, Button, Divider, Flex, Layout, Menu, Space, theme, Typography } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;
const { useToken } = theme;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem('Dashboard', '/dashboard', <HomeOutlined />),
  getItem('User Management', 'sub_user_management', <UserOutlined />, [
    getItem('User', '/user-management'),
    getItem('Agent', '/user-management/agent'),
    getItem('Role', '/user-management/role'),
    getItem('Menu', '/user-management/menu'),
  ]),
  getItem('Data Master', 'sub_data_master', <DatabaseOutlined />, [
    getItem('Bank', '/data-master/bank'),
    getItem('Social Media', '/data-master/social-media'),
    getItem('Fee', '/data-master/fee'),
    getItem('Jamaah', '/data-master/jamaah'),
    getItem('Region', '/data-master/region'),
    getItem('Hotel', '/data-master/hotel'),
    getItem('Package', '/data-master/package'),
    getItem('Ticket', '/data-master/ticket'),
    getItem('Airlines', '/data-master/airlines'),
    getItem('Partner', '/data-master/partner'),
    getItem('Document', '/data-master/document'),
    getItem('Product Type', '/data-master/product-type'),
    getItem('Transportasi', '/data-master/transportasi'),
    getItem('Zona', '/data-master/zona'),
  ]),
];

const DashboardLayout = () => {
  const { token } = useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuItemClick = (e) => {
    if (e.key) {
      navigate(e.key);
    }
  }

  const selectedKeys = [location.pathname];

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
                  <Typography.Text ellipsis={true} style={{ width: 125, color: 'rgb(255,255,255)' }}>Muhammad Zubair Xamrun</Typography.Text>
                  <Typography.Text ellipsis={true} style={{ width: 125, color: 'rgba(255, 255, 255, 0.80)' }}>Admin</Typography.Text>
                </Space>
              </Flex>
              <div style={{ padding: '0 20px' }}>
                <Divider style={{ backgroundColor: 'rgba(255, 255, 255, 0.20)' }} />
              </div>
            </div>
            <div >
              <Menu selectedKeys={selectedKeys} onClick={handleMenuItemClick} theme='dark' mode="inline" defaultSelectedKeys={['/dashboard']} items={items} />
            </div>
          </div>
          <Flex vertical style={{ padding: '0 16px 16px', flexShrink: 0 }}>
            <Divider style={{ backgroundColor: 'rgba(255, 255, 255, 0.20)' }} />
            <Button color="default" variant="solid" icon={<LogoutOutlined />} block>
              Logout
            </Button>
          </Flex>
        </Flex>
      </Sider>
      <Layout>
        <Header style={{ background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
          <img src={logo} height={35} />
          <Flex align='center' gap={16}>
            <SearchPages />
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
        <Content style={{ margin: '0 16px 0' }}>
          <div
            style={{
              padding: 24,
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
    </Layout >
  );
};
export default DashboardLayout;