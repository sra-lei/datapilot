import { useState, useEffect } from 'react';

interface HealthResponse {
  status: string;
}

function App() {
  const [ status, setStatus ] = useState<string>('checking...');

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data: HealthResponse) => setStatus(data.status))
      .catch(() => setStatus('offline'));
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <h1>Trae Project</h1>
      <p>Backend Status: {status}</p>
    </div>
  );
}

export default App;
