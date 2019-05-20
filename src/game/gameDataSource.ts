import PRODUCTS_V4 from '../json-mock/products-v4';
import GAME_V75_2018_05_12_6_5 from '../json-mock/game';
import * as atg from './atgDomainObjects';

export default class GameDataSource{

    static useMock: boolean = true;

    static jsonToGames(jsonObj: any): atg.Games {
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
        return fetch('/services/racinginfo/v1/api/products/'+type)
            .then(response => this.jsonToGames(response.json()) );
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
        return fetch('/services/racinginfo/v1/api/games/'+id)
            .then(response => this.jsonToGame(response.json()) );
    }

}
