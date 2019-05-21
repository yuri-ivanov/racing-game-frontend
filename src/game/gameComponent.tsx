import React from 'react';
import './game.css';
import GameDataSource from './gameDataSource';
import * as atg from './atgDomainObjects';

interface GameProps {
    gameId: string;
}

interface GameComponentState{
    loading: boolean;
    game: atg.Game | null;
    error?: string | null;
}

export class GameComponent extends React.Component<GameProps, GameComponentState> {

    constructor(props: GameProps){
        super(props);
        this.state = {game: null, loading: false, error: null}; 
    }

    componentDidMount(){
        this.loadGame(this.props.gameId);
    }

    componentWillReceiveProps(newProps: GameProps){
        this.loadGame(newProps.gameId);
    }

    loadGame(gameId:string) {
        console.log('loading game ', gameId);
        if(this.state.loading){
            console.log('loading game is in progress');
            return new Promise((resolve, reject) => {
                reject("loading game is in progress");
            });
        }
        this.setState({loading: true});
        return GameDataSource.getGame(gameId)
            .then(jsonData => {
                this.setState({game: jsonData, loading: false, error: null}); 
                return jsonData;})
            .catch(error => {
                this.setState({error: "can't looad game "+gameId, loading: false});
                return null;
            });
    }

    expandDetails(e: React.MouseEvent<HTMLSpanElement, MouseEvent>){
        console.log('click expand', e.currentTarget, e.currentTarget.nextSibling);
        const expDiv = e.currentTarget.nextSibling as HTMLDivElement;
        if(expDiv.style.display === 'block'){
            expDiv.style.display = 'none'
        } else {
            expDiv.style.display = 'block';
        }
    }

    renderRaceStarts(starts: Array<atg.RaceStart>){
        const displayNone = { display: 'none' };
        const horseDetails = (horse: atg.Horse) => (<div style={displayNone}><b>trainer:</b> {horse.trainer.firstName} {horse.trainer.lastName} <br></br> <b>horse father:</b>{horse.pedigree.father.name} </div>);

        const startsHtml = starts.map(raceStart => (<tr key={raceStart.number}>
                <th>{raceStart.number}</th><td><span className="expandable-content-link" onClick={e => this.expandDetails(e)}>{raceStart.horse.name}</span>{horseDetails(raceStart.horse)}</td><td>{raceStart.driver.firstName} {raceStart.driver.firstName}</td>
            </tr>));
        return (<table className="table race">
            <thead><tr><th scope="col">#</th><th scope="col">Horse</th><th scope="col">Rider</th></tr></thead>
            <tbody>{startsHtml}</tbody>
        </table>);
    }
    
    render() {
        console.log('render game', this.props);
        if(this.state.loading){
            return (<div>Loading...</div>);
        }
        if(this.state.error){
            return (<div>Error: {this.state.error}</div>);
        }

        if(!this.state || !this.state.game){
            return null;
        }
        const game = this.state.game;
        const races = game.races.map(r => 
            <div className="race-container" key={r.id}>
                <h4>{r.name}</h4>
                <div className="race-date">{r.scheduledStartTime.toLocaleString()}</div>
                {this.renderRaceStarts(r.starts)}
            </div>);

        return (
        <section className="game-container">
            <header><h3>{game.id} <i>{game.status}</i></h3></header>
            <main>{races}</main>
        </section>);
    }
}

export default GameComponent;
