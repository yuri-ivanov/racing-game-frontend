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
