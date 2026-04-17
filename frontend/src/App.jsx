// frontend/src/App.jsx
import { useState } from 'react';
import Form from './components/Form';
import History from './components/History';

function App() {
  const [activePage, setActivePage] = useState('form');

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      
      {/* SIDEBAR */}
      <div style={{
        width: '250px',
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '20px',
        minHeight: '100vh'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
          Heart Disease
        </h2>
        
        <nav>
          <button
            onClick={() => setActivePage('form')}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '10px',
              backgroundColor: activePage === 'form' ? '#007bff' : 'transparent',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '16px'
            }}
          >
            🏠 Parashiko
          </button>
          
          <button
            onClick={() => setActivePage('history')}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '10px',
              backgroundColor: activePage === 'history' ? '#007bff' : 'transparent',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '16px'
            }}
          >
            📋 Historiku
          </button>
        </nav>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, padding: '20px', backgroundColor: '#f5f5f5' }}>
        {activePage === 'form' ? <Form /> : <History />}
      </div>
    </div>
  );
}

export default App;