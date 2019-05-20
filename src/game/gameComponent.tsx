import React from 'react';
import './game.css';
import GameDataSource from './gameDataSource';
import * as atg from './atgDomainObjects';
import { RouteComponentProps } from 'react-router-dom';
import { resolve } from 'dns';
import { reject, race } from 'q';

interface GameProps extends RouteComponentProps<any> {
}

interface GameComponentState{
    loading: boolean;
    game: atg.Game | null
}

export class GameComponent extends React.Component<GameProps, GameComponentState> {

    constructor(props: GameProps){
        super(props);
        this.state = {game: null, loading: false}; 
    }

    componentDidMount(){
        const {params} = this.props.match;
        this.loadGame(params.id);
    }

    loadGame(gameId:string):Promise<atg.Game> {
        if(this.state.loading){
            console.log('loading game is in progress');
            return new Promise((resolve, reject) => {
                reject("loading game is in progress");
            });
        }
        this.setState({loading: true});
        return GameDataSource.getGame(gameId)
            .then(jsonData => {
                this.setState({game: jsonData, loading: false}); 
                return jsonData;});
    }

    renderRaceStarts(starts: Array<atg.RaceStart>){
        let startsHtml = starts.map(raceStart => (<tr key={raceStart.number}><th>{raceStart.number}</th><td>{raceStart.horse.name}</td><td>{raceStart.driver.firstName} {raceStart.driver.firstName}</td></tr>));
        return (<table className="table race">
            <thead><tr><th scope="col">#</th><th scope="col">Horse</th><th scope="col">Rider</th></tr></thead>
            <tbody>{startsHtml}</tbody>
        </table>);
    }
    
    render() {
        if(this.state.loading){
            return (<div>Loading...</div>);
        }

        if(!this.state || !this.state.game){
            return null;
        }
        const game = this.state.game;
        const races = game.races.map(r => 
            <div key={r.name+r.date.toLocaleDateString()}>
                <h3>{r.name}, {r.scheduledStartTime.toLocaleString()}</h3>
                {this.renderRaceStarts(r.starts)}
            </div>);
        return (
        <div>
            <div>game id:{game.id}</div>
            <div>status: {game.status}</div>
            <div>{races}</div>
        </div>);
    }
}

export default GameComponent;
