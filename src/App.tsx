import React from 'react';
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Link, Route, RouteComponentProps } from 'react-router-dom'
import logo from './atg.svg';
import './App.css';
import './game/gameListComponent';
import GameListComponent from './game/gameListComponent';

type TParams = { id: string };

function about(){
  return (<div><h2>about component</h2></div>);
}

function AboutParams ({match}: RouteComponentProps<TParams>) {
  return (<div>about with params {match.params.id}</div>);
} 

function App() {
  
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} alt="logo" className="logo"/>
          <span className="title">ATG Games</span>
        </header>
        <main>
          <GameListComponent  greeting="test" />
        </main>
      </div>
    </Router>
  );
}

export default App;
