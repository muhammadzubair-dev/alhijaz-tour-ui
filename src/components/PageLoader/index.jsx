import { Layout, Spin } from 'antd';

const PageLoader = () => {
  return (
    <Layout
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--ant-color-bg-layout)',
      }}
    >
      <Spin size="large" />
    </Layout>
  );
};

export default PageLoader;