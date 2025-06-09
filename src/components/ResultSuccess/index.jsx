import { Modal, Result } from 'antd';

const ResultSuccess = ({ open, onOpenResult, extra }) => {

  const handleCloseResult = () => {
    onOpenResult({ open: false, title: '', subtitle: '' })
  }

  return (
    <Modal open={open.open} footer={null} onCancel={handleCloseResult}>
      <Result
        status="success"
        title={open.title}
        subTitle={open.subtitle}
        extra={extra}
      />
    </Modal>
  )
};

export default ResultSuccess;