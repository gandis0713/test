import React, { useState } from 'react';
// import logo from './logo.svg';
// import './App.css';

import Header from './component/header';
import Content from './component/content';

function App() {

  const [contents, setContents] = useState([
    {
      id: 1,
      value: "HTML"
    },
    {
      id: 2,
      value: "CSS"
    },
    {
      id: 3,
      value: "JavaScript"
    }
  ]);

  return (
    <div className="App">
        <Header name="Welcome to React Application"></Header>
        <Content list={contents}></Content>
    </div>
  );
}

export default App;
