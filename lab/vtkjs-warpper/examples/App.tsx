import React from 'react';

import { BrowserRouter } from 'react-router-dom';
import Main from './components/Main';

const App = (): React.ReactElement => {
  return (
    <div className="App">
      <BrowserRouter>
        <Main />
      </BrowserRouter>
    </div>
  );
};

export default App;
