import { CarListType, PageType, WinnersOrderType, WinnersSortType } from "../types";

class Settings {
  static activePage: PageType = PageType.GARAGE;

  static activeGaragePage = 1;

  static activeWinnersPage = 1;

  static order: WinnersOrderType = WinnersOrderType.ASC;

  static sort: WinnersSortType = WinnersSortType.ID;

  static limit = {
    winners: 10,
    garage: 7,
  };

  static checkAmountOfPages(activePage: PageType, allCars: CarListType) {
    return Math.ceil(allCars.length / Settings.limit[activePage]) || 1;
  }
}

export default Settings;
