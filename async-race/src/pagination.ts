import Garage from "./garage";
import Settings from "./modules/Settings";
import Winners from "./winners";

class Pagination {
  static initListener() {
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.className === "prev-page") {
        Pagination.switchToDifferentPageNumber("decrease");
      } else if (target.className === "next-page") {
        Pagination.switchToDifferentPageNumber("increase");
      }
    });
  }

  static content() {
    return `<ul class="buttons-container">
    <li><button class="prev-page">Prev</button></li>
    <li><button class="next-page">Next</button></li> 
  </ul>`;
  }

  static updateCount(operation: string, prop: "activeGaragePage" | "activeWinnersPage", pageNumber: number) {
    Settings[prop] = operation === "decrease" ? pageNumber - 1 : pageNumber + 1;
    return Settings[prop];
  }

  static async switchToDifferentPageNumber(operation: string) {
    const { activeGaragePage, activeWinnersPage, activePage } = Settings;

    const totalAmountOfPages =
      activePage === "garage"
        ? Settings.checkAmountOfPages("garage", Garage.allCars)
        : Settings.checkAmountOfPages("winners", Winners.allCars);

    const pageNumber = activePage === "garage" ? activeGaragePage : activeWinnersPage;

    if ((pageNumber > 1 && operation === "decrease") || (operation === "increase" && pageNumber < totalAmountOfPages)) {
      if (activePage === "garage") {
        Pagination.updateCount(operation, "activeGaragePage", activeGaragePage);
        await Garage.updateGaragePage();
      } else {
        Pagination.updateCount(operation, "activeWinnersPage", activeWinnersPage);
        await Winners.updateWinnersPage();
      }
    }
  }
}

export default Pagination;
