import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from '@store/store';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="App">
          <h1>Sistema Inmobiliario</h1>
          <p>La aplicación se ha cargado correctamente.</p>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;