import React from 'react';
import logo from './logo.svg';
import './App.css';
import './games';
import GameListComponent from './games';

function App() {
  var game = (
    <h1>test</h1>
  );
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      {game}
      <GameListComponent  greeting="test" />
    </div>
  );
}

export default App;
