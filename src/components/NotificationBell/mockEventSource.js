// mockEventSource.js
export class MockEventSource {
  constructor(url) {
    this.url = url;
    this.onmessage = null;
    this.onerror = null;

    this.startMocking();
  }

  startMocking() {
    let counter = 0;
    this.interval = setInterval(() => {
      counter++;
      const mockData = {
        title: 'Notifikasi Baru',
        message: `Pesan dummy ke-${counter}`
      };

      if (this.onmessage) {
        this.onmessage({ data: JSON.stringify(mockData) });
      }
    }, 4000); // setiap 4 detik kirim notifikasi
  }

  close() {
    clearInterval(this.interval);
  }
}
