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

    public static getGames(type: GameType): Promise<Games>{
        return fetch('/services/racinginfo/v1/api/products/'+type)
            .then(response => response.json())
            //.then(data => {let games:Games ={betType:data.betType})})
            ;
    }

    public static getGame(id: string): Promise<Game>{
        return fetch('/services/racinginfo/v1/api/games/'+id)
            .then(response => response.json());
    }

}
