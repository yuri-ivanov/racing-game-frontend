import React from 'react';
import {Game, GameDataSource} from './GameDataSource';
import { RouteComponentProps } from 'react-router-dom';
import { resolve } from 'dns';
import { reject } from 'q';

interface GameProps extends RouteComponentProps<any> {
}

interface GameComponentState{
    loading: boolean;
    game: Game | null
}

export class GameComponent extends React.Component<GameProps, GameComponentState> {

    constructor(props: GameProps){
        super(props);
        this.state = {game: null, loading: false}; 
    }


    loadGame(gameId:string):Promise<Game> {
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

    render() {
        const {params} = this.props.match;
        if(this.state.loading){
            return (<div>Loading...</div>);
        }

        if(!this.state || !this.state.game){
            return null;
        }
        const game = this.state.game;
        const races = game.races.map(r => <div key={r.name+r.date.toLocaleDateString()}>{r.name}, {r.scheduledStartTime.toLocaleString()}</div>);
        return (
        <div>
            <div>game id:{game.id}</div>
            <div>status: {game.status}</div>
            <div>{races}</div>
        </div>);
    }
}

export default GameComponent;
