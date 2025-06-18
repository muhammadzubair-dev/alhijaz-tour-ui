// src/utils/sse.js
let eventSource;

export function connectSSE(userId, onMessage, onError) {
  if (!userId) return;

  if (eventSource) {
    eventSource.close();
  }

  eventSource = new EventSource(`http://localhost:3000/sse`, {
    withCredentials: true, // jika pakai cookie
  });

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage?.(data);
    } catch (error) {
      console.error('Invalid SSE message:', error);
    }
  };

  eventSource.onerror = (error) => {
    console.error('SSE connection error:', error);
    onError?.(error);
  };
}

export function disconnectSSE() {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }
}
