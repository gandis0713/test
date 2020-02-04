import React from 'react';
import logo from './logo.svg';
import './App.css';

function Header() {
  return (
    <header>
      <h1>
       Charles React!
      </h1>
    </header>
  );
}

function Navigator() {
  return (
    <nav>
      <ul>
        <li><a href="1.html">HTML</a></li>
        <li><a href="2.html">CSS</a></li>
        <li><a href="3.html">JavaScript</a></li>
      </ul>
    </nav>
  );
}

function App() {
  return (
    <div className="App">
      <Header></Header>
      <Navigator></Navigator>
    </div>
  );
}

export default App;
