import { message } from "antd";

const checkFormatImage = (file) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/pdf', // ✅ tambahkan PDF
  ];

  const isValidType = allowedTypes.includes(file.type);
  const isValidSize = file.size / 1024 / 1024 < 1; // 1MB

  if (!isValidType) {
    message.error('File harus berupa JPG, JPEG, PNG, atau PDF!');
  }
  if (!isValidSize) {
    message.error('Ukuran file tidak boleh lebih dari 1MB!');
  }

  return isValidType && isValidSize;
};

export default checkFormatImage;
