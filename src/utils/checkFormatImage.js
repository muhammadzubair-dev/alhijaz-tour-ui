import { message } from "antd";

const checkFormatImage = (file) => {
  const isValidType =
    file.type === 'image/jpeg' ||
    file.type === 'image/png' ||
    file.type === 'image/jpg';
  const isValidSize = file.size / 1024 / 1024 < 1; // 1MB

  if (!isValidType) {
    message.error('File harus berupa gambar JPG, JPEG, atau PNG!');
  }
  if (!isValidSize) {
    message.error('Ukuran file tidak boleh lebih dari 1MB!');
  }

  return isValidType && isValidSize;
};

export default checkFormatImage