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
    date: string, 
    name: string, 
    scheduledStartTime: string,
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


    static jsonToGamesFrom(jsonObj: any): Games{
        const upcoming = (jsonObj.upcoming)? jsonObj.upcoming.map((gameInfo:any) => this.jsonToGameInfo(gameInfo)): [];
        const results  = (jsonObj.results )? jsonObj.results.map( (gameInfo:any) => this.jsonToGameInfo(gameInfo)): [];
        let obj = Object.assign({}, jsonObj, {upcoming: upcoming, results: results}) as Games;
        return obj;
    }

    static jsonToGameInfo(jsonObj: any): GameInfo {
        return Object.assign({}, jsonObj, {startTime: (jsonObj.startTime)?new Date(jsonObj.startTime):null}) as GameInfo;
    }

    public static getGames(type: GameType): Promise<Games>{
        if(this.useMock){
            return new Promise<Games>((resolve, reject) => {
                console.log('get mock games for ', type);
                resolve(this.jsonToGamesFrom(PRODUCTS_V4));
            });
        }
        return fetch('/services/racinginfo/v1/api/products/'+type)
            .then(response => response.json())
            //.then(data => {let games:Games ={betType:data.betType})})
            ;
    }

    public static getGame(id: string): Promise<Game>{
        if(this.useMock){
            return new Promise<Game>((resolve, reject) => {
                console.log('get mock game for ', id);
                resolve(GAME_V75_2018_05_12_6_5);
            });
        }
        return fetch('/services/racinginfo/v1/api/games/'+id)
            .then(response => response.json());
    }

}
