import useGlobalErrorStore from '@/store/errorStore';
import { Button, Modal, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const GlobalErrorDisplay = () => {
  const { errorInfo, clearError } = useGlobalErrorStore();
  const navigate = useNavigate();

  const handleGoHome = () => {
    clearError();
    navigate('/');
  };

  const handleClose = () => {
    clearError();
  };

  if (!errorInfo) {
    return null;
  }

  return (
    <Modal
      open={!!errorInfo}
      centered
      closable={false}
      keyboard={false}
      footer={null}
    // width={600}
    // onCancel={handleClose} // Bisa juga tutup dari onCancel jika closable true
    >
      <Result
        status={errorInfo.status || 'error'}
        title={errorInfo.title || 'Terjadi Kesalahan'}
        subTitle={errorInfo.subTitle || 'Maaf, terjadi kesalahan yang tidak terduga.'}
        extra={[
          <Button type="primary" key="gohome" onClick={handleGoHome}>
            Kembali ke Beranda
          </Button>,
          <Button key="close" onClick={handleClose}>
            Tutup
          </Button>,
        ]}
      />
    </Modal>
  );
};

export default GlobalErrorDisplay;