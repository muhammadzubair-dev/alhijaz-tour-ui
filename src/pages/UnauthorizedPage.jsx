import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => (
  <Result
    status="403"
    title="403"
    subTitle="Maaf, Anda tidak memiliki akses ke halaman ini."
    extra={<Link to="/"><Button type="primary">Kembali ke Dashboard</Button></Link>}
  />
);

export default UnauthorizedPage;
