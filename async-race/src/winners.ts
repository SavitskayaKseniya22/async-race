import { Winner, Car, PageType, WinnersSortType, WinnersOrderType } from "./types";
import ApiService from "./api";
import Settings from "./modules/Settings";
import Page from "./modules/Page";

class Winners {
  static carCollection: Car[] = [];

  static allCars: Winner[] = [];

  static initListener() {
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.closest(".id") || target.closest(".wins") || target.closest(".time")) {
        if (target.tagName === "INPUT") {
          return;
        }
        Winners.changeSortType(target);
      }
    });
  }

  static async getCarsAndUpdateContainer() {
    await Winners.getCarsCollection();
    Page.updateMainContent(Winners.content());
  }

  static changeSortType(target: HTMLElement) {
    const { sort } = Settings;
    const targetSort = target.getAttribute("data-sort");
    if (sort === targetSort) {
      Winners.changeOrderType();
    } else if (
      targetSort === WinnersSortType.ID ||
      targetSort === WinnersSortType.TIME ||
      targetSort === WinnersSortType.WINS
    ) {
      Settings.sort = targetSort;
    }

    Winners.getCarsAndUpdateContainer();
  }

  static changeOrderType() {
    const { order } = Settings;
    Settings.order = order === WinnersOrderType.ASC ? WinnersOrderType.DESC : WinnersOrderType.ASC;
  }

  static content() {
    const tableRows = Winners.carCollection
      .map((car) => {
        return Winners.makeTableTr(car);
      })
      .join(" ");
    return Winners.makeTable(tableRows);
  }

  static async getCarsCollection() {
    const { activeWinnersPage, limit, sort, order } = Settings;
    const winners = await ApiService.getWinners(activeWinnersPage, limit.winners, sort, order);

    const winnersDetailedPromises = winners.map(async (winner: Winner) => {
      return ApiService.getCar(winner.id);
    });

    const winnersDetailedResponse = await Promise.allSettled(winnersDetailedPromises);

    Winners.carCollection = winnersDetailedResponse.map((winner, index) => {
      return winner.status === "fulfilled" && Object.assign(winner.value, winners[index]);
    });
  }

  static async getAllCars() {
    const allCars = await ApiService.getAllWinners();
    Winners.allCars = allCars;
    return allCars;
  }

  static makeTable(content: string) {
    return `<table class="winners-table">
  <tr>
    <th class="id" >
      <input type="radio" id="id" name="sort" value="id" ${
        Settings.sort === WinnersSortType.ID ? "checked" : ""
      } /> <label for="id" data-sort="id">Number</label>
    </th>
    <th>Car</th>
    <th>Name</th>
    <th class="wins" data-sort="wins">
      <input type="radio" id="wins" name="sort" value="wins" ${
        Settings.sort === WinnersSortType.WINS ? "checked" : ""
      } /> <label for="wins" data-sort="wins">Wins</label>
    </th>
    <th class="time" data-sort="time">
      <input type="radio" id="time" name="sort" value="time" ${
        Settings.sort === WinnersSortType.TIME ? "checked" : ""
      } /> <label for="time" data-sort="time">Best time (s)</label>
    </th>
  </tr>
  ${content}
</table>`;
  }

  static makeTableTr(car: Car) {
    const { time, id, name, wins, color } = car;
    const timeInSec = (time / 1000).toFixed(3);
    return `
  <tr>
    <td>${id}</td>
    <td>${Page.getCarImg(color, id)}</td>
    <td>${name}</td>
    <td>${wins}</td>
    <td>${timeInSec}</td>
  </tr>
`;
  }

  static async updateWinnersPage() {
    await Winners.getAllCars();
    const totalAmountOfPages = Settings.checkAmountOfPages(PageType.WINNERS, Winners.allCars);
    if (totalAmountOfPages < Settings.activeWinnersPage) {
      Settings.activeWinnersPage = totalAmountOfPages;
    }
    const { activeWinnersPage } = Settings;
    await Winners.getCarsAndUpdateContainer();
    Page.updateTotalCarsNumber(Winners.allCars);
    Page.updatePageNumber(activeWinnersPage, totalAmountOfPages);
    Page.togglePaginationButtons(activeWinnersPage === 1, activeWinnersPage === totalAmountOfPages);
  }
}

export default Winners;
