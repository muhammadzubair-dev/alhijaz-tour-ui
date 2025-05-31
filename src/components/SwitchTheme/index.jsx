import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import useUiStore from '@/store/uiStore';

const items = [
  {
    label: 'Light',
    key: 'light',
    icon: <SunOutlined />,
  },
  {
    label: 'Dark',
    key: 'dark',
    icon: <MoonOutlined />,
  },
];



const SwitchTheme = () => {
  const currentTheme = useUiStore((state) => state.theme);
  const setTheme = useUiStore((state) => state.setTheme);

  const handleMenuClick = (e) => {
    setTheme(e.key)
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <Dropdown
      menu={menuProps}
      trigger={['click']}
    >
      <Button icon={<SunOutlined />}>{currentTheme === 'dark' ? 'Dark' : 'Light'}</Button>
    </Dropdown>
  )
};

export default SwitchTheme;