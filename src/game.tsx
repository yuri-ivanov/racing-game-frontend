import React from 'react';
import {Game, GameDataSource} from './GameDataSource';
import { RouteComponentProps } from 'react-router-dom';

interface GameProps extends RouteComponentProps<any> {
}

interface GameComponentState{
    game: Game | null
}

export class GameComponent extends React.Component<GameProps, GameComponentState> {

    constructor(props: GameProps){
        super(props);
        this.state = {game: null}; 
    }


    loadGame(gameId:string):Promise<Game> {
        return GameDataSource.getGame(gameId)
            .then(jsonData => {this.setState({game: jsonData}); return jsonData;});
    }

    render() {
        const {params} = this.props.match;
        if( params.id ){
            if(!this.state.game || (this.state.game.id !==params.id)) {
                this.loadGame(params.id);
            }
        }

        if(!this.state || !this.state.game){
            return null;
        }
        const game = this.state.game;
        const races = game.races.map(r => <div key={r.name+r.date}>{r.name}, {r.scheduledStartTime}</div>);
        return (
        <div>
            <div>game id:{game.id}</div>
            <div>status: {game.status}</div>
            <div>{races}</div>
        </div>);
    }
}

export default GameComponent;