import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <Result
    status="404"
    title="404"
    subTitle="Maaf, halaman yang Anda kunjungi tidak ditemukan."
    extra={<Link to="/"><Button type="primary">Kembali ke Dashboard</Button></Link>}
  />
);

export default NotFoundPage;