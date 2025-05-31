import { Modal, Result } from 'antd';

const ResultSuccess = ({ open, onOpenResult }) => {

  const handleCloseResult = () => {
    onOpenResult({ open: false, title: '', subtitle: '' })
  }

  return (
    <Modal open={open.open} footer={null} onCancel={handleCloseResult}>
      <Result
        status="success"
        title={open.title}
        subTitle={open.subtitle}
      />
    </Modal>
  )
};

export default ResultSuccess;