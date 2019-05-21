import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import logo from './atg.svg';
import './App.css';
import './game/gameListComponent';
import GameListComponent from './game/gameListComponent';
import GameDataSource from './game/gameDataSource';

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
          <Route path="/" exact component={GameListComponent} />
          <Route path="/games/:gameType" component={GameListComponent} />
          </main>
        </div>
      </Router>
    );
  }

}

export default App;
