import React from 'react';

function SimpleTest() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: 'red' }}>🎉 React funciona correctamente!</h1>
      <p>Si ves este mensaje, React está renderizando bien.</p>
      <p>Fecha: {new Date().toLocaleString()}</p>
    </div>
  );
}

export default SimpleTest;