import PRODUCTS_V4 from './json-mock/products-v4';
import GAME_V75_2018_05_12_6_5 from './json-mock/game';

export enum GameType{
    V75 = "V75", 
    V65 = "V65", 
    V64 = "V64", 
    V4  = "V4"
}

export interface Games{
    betType: string,
    upcoming: Array<GameInfo>,
    results: Array<GameInfo>
}

export interface GameInfo{
    id: string,
    startTime: Date
}

export interface Game{
    id: string, 
    races: Array<Race>,
    status: string
}

export interface Race{
    date: Date, 
    name: string, 
    scheduledStartTime: Date,
    starts: Array<RaceStart>
}

export interface RaceStart {
    number: number,
    driver: PersonName,
    horse: Horse
}

export interface Horse {
    name: string,
    trainer: PersonName,
    pedigree: {
        father: {
            name: string
        }
    }
}

export interface PersonName {
    firstName: string,
    lastName: string
}

export class GameDataSource{

    static useMock: boolean = true;


    static jsonToGames(jsonObj: any): Games {
        const upcoming = (jsonObj.upcoming)? jsonObj.upcoming.map((gameInfo:any) => this.jsonToGameInfo(gameInfo)): [];
        const results  = (jsonObj.results )? jsonObj.results.map( (gameInfo:any) => this.jsonToGameInfo(gameInfo)): [];
        let obj = Object.assign({}, jsonObj, {upcoming: upcoming, results: results}) as Games;
        return obj;
    }

    static jsonToGameInfo(jsonObj: any): GameInfo {
        return Object.assign({}, jsonObj, {startTime: (jsonObj.startTime)?new Date(jsonObj.startTime):null}) as GameInfo;
    }

    static jsonToGame(jsonObj: any): Game {
        const races = (jsonObj.races)? jsonObj.races.map((race:any) => this.jsonToRace(race)): [];
        return Object.assign({}, jsonObj, {races: races});
    }

    static jsonToRace(jsonObj: any): Race {
        return Object.assign({}, jsonObj, 
            {date: new Date(jsonObj.date), scheduledStartTime: new Date(jsonObj.scheduledStartTime)});
    }

    public static getGames(type: GameType): Promise<Games>{
        if(this.useMock){
            return new Promise<Games>((resolve, reject) => {
                console.log('get mock games for ', type, PRODUCTS_V4);
                resolve(this.jsonToGames(PRODUCTS_V4));
            });
        }
        return fetch('/services/racinginfo/v1/api/products/'+type)
            .then(response => this.jsonToGames(response.json()) );
    }

    public static getGame(id: string): Promise<Game>{
        if(this.useMock){
            return new Promise<Game>((resolve, reject) => {
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
