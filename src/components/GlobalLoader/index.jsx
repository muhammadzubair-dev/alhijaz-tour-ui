import { Spin } from 'antd';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';

const GlobalLoader = () => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isLoading = isFetching > 0 || isMutating > 0;

  if (!isLoading) {
    return null;
  }

  return (
    <Spin
      spinning={true} // Selalu true saat komponen ini dirender (karena dikontrol oleh isLoading)
      // tip="Loading ..."
      size="large" // Ukuran spinner: 'small', 'default', atau 'large'
      fullscreen     // Ini adalah prop kunci untuk mode layar penuh
    // Anda juga bisa menambahkan wrapperClassName atau style jika perlu kustomisasi lebih lanjut
    // pada container yang dibuat oleh prop fullscreen.
    // style={{ background: 'rgba(0, 0, 0, 0.3)' }} // Contoh mengubah background overlay
    />
  )
}

export default GlobalLoader