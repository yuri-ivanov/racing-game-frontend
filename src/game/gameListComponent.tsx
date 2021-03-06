import React from 'react';
import GameDataSource from './gameDataSource';
import * as atg from './atgDomainObjects';
import {GameComponent} from './gameComponent';
import { Route, Link, RouteComponentProps } from 'react-router-dom';

type TParams = { gameType: string, id: string };

interface GameListComponentState{
    gameType: atg.GameType, 
    games: atg.Games | null,
    currentGame: atg.Game | null,
    isLoaded: boolean
}

class GameListComponent extends React.Component<RouteComponentProps<TParams>, GameListComponentState> {

    constructor(props: Readonly<any>){
        super(props);
        const urlParams = this.props.match.params;
        const urlGameType = atg.GameType[urlParams.gameType as keyof typeof atg.GameType];
        this.state = {
            gameType: (urlGameType)?urlGameType:atg.GameType.V4, 
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
                this.setState({gameType:gt, games: jsonData, isLoaded: true});
                console.log('load games', jsonData);
            });
    }

    onGameTypeChange(e: React.FormEvent<HTMLSelectElement>) {
        this.loadGames(atg.GameType[e.currentTarget.value as keyof typeof atg.GameType]);
        this.props.history.push('/games/'+e.currentTarget.value);
    }

    renderGameInfo(gameInfoArray: Array<atg.GameInfo>){
        if(!gameInfoArray) return null;
        return gameInfoArray.map( gameInfo => 
                <div key={gameInfo.id} className="game col" >
                    <Link to={"/games/"+this.state.gameType+"/"+gameInfo.id}>{gameInfo.startTime.toLocaleString()}</Link>
                </div>);
    }

    renderGames(games: atg.Games){
        let upcomingGames = this.renderGameInfo(games.upcoming);
        let gameResults = this.renderGameInfo(games.upcoming);
        return (<div>
                <section>
                    <h2>upcoming games</h2>
                    <div className="container"><div className="row">{upcomingGames}</div></div>
                </section>
                <hr></hr>
                <section>
                    <h2>game results</h2>
                    <div className="container"><div className="row">{gameResults}</div></div>
                </section>
                <hr></hr>
            </div>);
    }

    renderGameById ({match}: RouteComponentProps<TParams>) {
        console.log('render game', match.params.id);
        return (<div><GameComponent gameId={match.params.id}></GameComponent></div>);
    } 
    
    render() {
        const gameTypeOptions = Object.keys(atg.GameType).map(key => <option key={key} value={key}>{key}</option>);

        let gameList = <p>Loading ... </p>;
        if(this.state.isLoaded && this.state.games){
            gameList = this.renderGames(this.state.games);
        }

        return (
            <div>
                <label >Select game type
                    <select id="gameTypeSelectControl" onChange={ e => this.onGameTypeChange(e)} value={this.state.gameType}>
                        {gameTypeOptions}
                    </select>
                </label>
                {gameList}
                <Route path="/games/:gameType/:id" component={this.renderGameById} />
            </div>
        );
    }
}

export default GameListComponent;
