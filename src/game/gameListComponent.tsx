import React from 'react';
import GameDataSource from './gameDataSource';
import * as atg from './atgDomainObjects';
import {GameComponent} from './gameComponent';
import { Route, Link } from 'react-router-dom';

interface GameListComponentState{
    gameType: atg.GameType, 
    games: atg.Games | null,
    currentGame: atg.Game | null,
    isLoaded: boolean
}

class GameListComponent extends React.Component<{greeting: string}, GameListComponentState> {

    constructor(props: Readonly<any>){
        super(props);
        this.state = {
            gameType:atg.GameType.V4, 
            games: {betType:"", upcoming:[], results:[]},
            isLoaded: true,
            currentGame: null
        };
    }

    componentDidMount() {
        this.loadGames();
    }

    loadGames(gameType?:atg.GameType){
        const gt = (gameType)?gameType:this.state.gameType;
        this.setState({isLoaded: false});
        GameDataSource.getGames(gt)
        .then(jsonData => {
            console.log('games', jsonData);
            this.setState({gameType:gt, games: jsonData, isLoaded: true})});
    }

    onGameTypeChange(e: React.FormEvent<HTMLSelectElement>) {
        this.loadGames(atg.GameType[e.currentTarget.value as keyof typeof atg.GameType]);
    }

    renderGameInfo(gameInfoArray: Array<atg.GameInfo>){
        if(!gameInfoArray) return null;
        return gameInfoArray.map( gameInfo => 
                <div key={gameInfo.id} className="game col" >
                    <Link to={"/games/"+gameInfo.id}>{gameInfo.startTime.toLocaleString()}</Link>
                </div>);
    }

    renderGames(games: atg.Games){
        let upcomingGames = this.renderGameInfo(games.upcoming);
        let gameResults = this.renderGameInfo(games.upcoming);
        return (<div>
                <h3>upcoming games</h3><div className="container"><div className="row">{upcomingGames}</div></div>
                <h3>game results</h3><div className="container"><div className="row">{gameResults}</div></div>
            </div>);
    }

    render() {
        const gameTypeOptions = Object.keys(atg.GameType).map(key => <option key={key} value={key}>{key}</option>);

        let gameList = <p>Loading ... </p>;
        if(this.state.isLoaded && this.state.games){
            gameList = this.renderGames(this.state.games);
        }

        return (
            <div>
                <select onChange={ e => this.onGameTypeChange(e)} value={this.state.gameType}>
                    {gameTypeOptions}
                </select>
                {gameList}
                <Route path="/games/:id" component={GameComponent} />
            </div>
        );
    }
}

export default GameListComponent;
