export interface Winner {
  id?: number;
  wins?: number;
  time?: number;
}

export interface Car {
  name?: string;
  color?: string;
  id?: number;
  time?: 10;
  wins?: 1;
}

export interface Engine {
  velocity: number;
  distance: number;
}

export enum PageType {
  GARAGE = "garage",
  WINNERS = "winners",
}

export enum ButtonActionType {
  BLOCK = "block",
  UNBLOCK = "unblock",
}

export type CarListType = Car[] | Winner[];

export enum CarStatusType {
  STARTED = "started",
  STOPPED = "stopped",
  DRIVE = "drive",
}

export enum CarActionType {
  START = "start",
  STOP = "stop",
}

export type CarsNamesJSONType = { [x: string]: string[] };

export enum WinnersSortType {
  ID = "id",
  WINS = "wins",
  TIME = "time",
}

export enum WinnersOrderType {
  DESC = "desc",
  ASC = "ask",
}
