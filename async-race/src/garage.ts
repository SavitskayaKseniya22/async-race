import { Car } from "./types";
import ApiService from "./api";
import Settings from "./modules/Settings";
import Track from "./modules/Track";
import Page from "./modules/Page";

class Garage {
  static carCollection: Car[] = [];

  static allCars: Car[] = [];

  static async getCarsAndUpdateContainer() {
    await Garage.getCarsCollection();
    Page.updateMainContent(Garage.content());
  }

  static content() {
    return Garage.carCollection
      .map((car) => {
        return Track.content(car);
      })
      .join(" ");
  }

  static async getCarsCollection() {
    const { limit, activeGaragePage } = Settings;
    const response = await ApiService.getCars(activeGaragePage, limit.garage);
    Garage.carCollection = response;
  }

  static async getAllCars() {
    const allCars = await ApiService.getAllCars();
    Garage.allCars = allCars;
    return allCars;
  }

  static async updateGaragePage() {
    await Garage.getAllCars();
    const totalAmountOfPages = Settings.checkAmountOfPages("garage", Garage.allCars);
    if (totalAmountOfPages < Settings.activeGaragePage) {
      Settings.activeGaragePage = totalAmountOfPages;
    }
    const { activeGaragePage } = Settings;
    await Garage.getCarsAndUpdateContainer();
    Page.updateTotalCarsNumber(Garage.allCars);
    Page.updatePageNumber(activeGaragePage, totalAmountOfPages);
    Page.togglePaginationButtons(activeGaragePage === 1, activeGaragePage === totalAmountOfPages);
  }
}

export default Garage;
