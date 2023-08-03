import { Car, Winner } from "../types";

class Settings {
  static activePage: "garage" | "winners" = "garage";

  static activeGaragePage = 1;

  static activeWinnersPage = 1;

  static order = "ASC";

  static sort = "id";

  static limit = {
    winners: 10,
    garage: 7,
  };

  static checkAmountOfPages(activePage: "garage" | "winners", allCars: Car[] | Winner[]) {
    return Math.ceil(allCars.length / Settings.limit[activePage]) || 1;
  }
}

export default Settings;
// static order: "DESC" | "ASC" = "ASC";
// static sort: "id" | "wins" | "time" = "id";
