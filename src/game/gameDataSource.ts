import PRODUCTS_V4 from '../json-mock/products-v4';
import GAME_V75_2018_05_12_6_5 from '../json-mock/game';
import * as atg from './atgDomainObjects';


function makeHeaders(): Headers{
    var origin = window.location.protocol + '//' + window.location.host;
    return new Headers({"Origin": origin});
}

export default class GameDataSource{
    static baseAPI_URL: string ="https://cors-anywhere.herokuapp.com/atg.se"
    //static baseAPI_URL: string ="" //local proxy for testing
    static useMock: boolean = false;

    static jsonToGames(jsonObj: any): atg.Games {
        console.log('json orig', jsonObj);
        const upcoming = (jsonObj.upcoming)? jsonObj.upcoming.map((gameInfo:any) => this.jsonToGameInfo(gameInfo)): [];
        const results  = (jsonObj.results )? jsonObj.results.map( (gameInfo:any) => this.jsonToGameInfo(gameInfo)): [];
        let obj = Object.assign({}, jsonObj, {upcoming: upcoming, results: results}) as atg.Games;
        return obj;
    }

    static jsonToGameInfo(jsonObj: any): atg.GameInfo {
        return Object.assign({}, jsonObj, {startTime: (jsonObj.startTime)?new Date(jsonObj.startTime):null}) as atg.GameInfo;
    }

    static jsonToGame(jsonObj: any): atg.Game {
        const races = (jsonObj.races)? jsonObj.races.map((race:any) => this.jsonToRace(race)): [];
        return Object.assign({}, jsonObj, {races: races});
    }

    static jsonToRace(jsonObj: any): atg.Race {
        return Object.assign({}, jsonObj, 
            {date: new Date(jsonObj.date), scheduledStartTime: new Date(jsonObj.scheduledStartTime)});
    }

    public static getGames(type: atg.GameType): Promise<atg.Games>{
        if(this.useMock){
            return new Promise<atg.Games>((resolve, reject) => {
                console.log('get mock games for ', type, PRODUCTS_V4);
                resolve(this.jsonToGames(PRODUCTS_V4));
            });
        }
        return fetch(GameDataSource.baseAPI_URL+'/services/racinginfo/v1/api/products/'+type, {headers: makeHeaders()})
            .then(response => response.json() ).then(json => this.jsonToGames(json));
    }

    public static getGame(id: string): Promise<atg.Game>{
        if(this.useMock){
            return new Promise<atg.Game>((resolve, reject) => {
                console.log('get mock game for ', id, GAME_V75_2018_05_12_6_5);
                const game = this.jsonToGame(GAME_V75_2018_05_12_6_5)
                game.id = id;
                resolve( game );
            });
        }
        return fetch(GameDataSource.baseAPI_URL + '/services/racinginfo/v1/api/games/'+id, {headers: makeHeaders()})
            .then(response => response.json() ).then(json => this.jsonToGame(json));
    }

}
