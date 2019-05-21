import React, { ChangeEvent } from 'react';
import ReactDOM, { render } from 'react-dom'
import { BrowserRouter as Router, Link, Route, RouteComponentProps } from 'react-router-dom'
import logo from './atg.svg';
import './App.css';
import './game/gameListComponent';
import GameListComponent from './game/gameListComponent';
import GameDataSource from './game/gameDataSource';

type TParams = { id: string };

function about(){
  return (<div><h2>about component</h2></div>);
}

function AboutParams ({match}: RouteComponentProps<TParams>) {
  return (<div>about with params {match.params.id}</div>);
} 


class App extends React.Component<{}, {useMock: boolean}>{

  constructor(props: any){
    super(props);
    this.state={useMock: GameDataSource.useMock};
  }

  toggleMock(e: React.ChangeEvent<HTMLInputElement>){
    GameDataSource.useMock = e.currentTarget.checked;
    this.setState({useMock: GameDataSource.useMock});
  }
  
  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <img src={logo} alt="logo" className="logo"/>
            <span className="title">ATG Games</span>
            <div >
              <input type="checkbox" id="mockSwitchControl" checked={GameDataSource.useMock} onChange={e => this.toggleMock(e)} ></input>
              <label htmlFor="mockSwitchControl">Mock data - on(off)</label>
            </div>
          </header>
          <main className="container">
            <GameListComponent  />
          </main>
        </div>
      </Router>
    );
  }

}

export default App;
