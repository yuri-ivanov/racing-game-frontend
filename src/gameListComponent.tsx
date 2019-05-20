import React from 'react';
import {Games, GameType, GameDataSource, Game} from './GameDataSource';
import {GameComponent} from './game';
import { Route, Link } from 'react-router-dom';

interface GameListComponentState{
    gameType: GameType, 
    games: Games | null,
    currentGame: Game | null,
    isLoaded: boolean
}

class GameListComponent extends React.Component<{greeting: string}, GameListComponentState> {

    constructor(props: Readonly<any>){
        super(props);
        this.state = {
            gameType:GameType.V4, 
            games: {betType:"", upcoming:[], results:[]},
            isLoaded: true,
            currentGame: null
        };
    }

    componentDidMount() {
    }

    componentWillMount() {
        this.loadGames();
    }

    loadGames(gameType?:GameType){
        const gt = (gameType)?gameType:this.state.gameType;
        this.setState({isLoaded: false});
        GameDataSource.getGames(gt)
        .then(jsonData => {
            console.log('games', jsonData);
            this.setState({gameType:gt, games: jsonData, isLoaded: true})});
    }

    onGameTypeChange(e: React.FormEvent<HTMLSelectElement>) {
        this.loadGames(GameType[e.currentTarget.value as keyof typeof GameType]);
    }

    render() {
        const gameTypeOptions = Object.keys(GameType).map(key => <option key={key} value={key}>{key}</option>);

        let gameList = <p>Loading ... </p>;
        if(this.state.isLoaded && this.state.games){
            let upcomingGames = (this.state.games.upcoming)?this.state.games.upcoming.map(gameInfo => 
                <li key={gameInfo.id} className="game" >{gameInfo.id}: {gameInfo.startTime.toLocaleString()}</li>
                ):null;
            let gameResults = (this.state.games.results)?this.state.games.results.map(gameInfo => 
                <li key={gameInfo.id} className="game" >
                    <Link to={"/games/"+gameInfo.id}>{gameInfo.id}</Link>
                </li>
                ):null;
    
            gameList =<div><h3>upcoming games</h3><ul>{upcomingGames}</ul><h3>game results</h3><ul>{gameResults}</ul></div>;
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
