function convertPathToBreadcrumb(path) {
  // Hapus '/' di awal dan akhir, lalu pisahkan berdasarkan '/'
  const parts = path.replace(/^\/|\/$/g, '').split('/');

  // Ubah setiap bagian menjadi Title Case dan ganti '-' atau '_' dengan spasi
  const formattedParts = parts.map(part =>
    part
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase())
  );

  return formattedParts;
}

export default convertPathToBreadcrumb