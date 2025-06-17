import { Button, Result } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate()
  return (
    <Result
      status="404"
      title="404"
      subTitle="Maaf, halaman yang Anda kunjungi tidak ditemukan."
      extra={<Button onClick={() => navigate(-1)} type="primary">Kembali</Button>}
    />
  )
};

export default NotFoundPage;