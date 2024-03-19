import ApiService from "./api";
import CarModel from "./car";
import Garage from "./garage";
import Page from "./modules/Page";
import Settings from "./modules/Settings";
import { ButtonActionType, Car, CarsNamesJSONType, PageType, Winner } from "./types";
import { getRandomName, getRandomColor } from "./utils";

class ControlPanel {
  static initListener() {
    document.addEventListener(
      "focus",
      async (event) => {
        const { target } = event;
        if (target instanceof HTMLInputElement) {
          if (target.classList.contains("control-panel__creating_name") && target.value === "") {
            let carNames: CarsNamesJSONType | undefined;
            try {
              carNames = await ApiService.getCarsNames();
            } catch (error) {
              console.error(error);
            } finally {
              target.value = getRandomName(carNames);
            }
          }
          if (target.classList.contains("control-panel__creating_color")) {
            target.value = getRandomColor();
          }
        }
      },
      true,
    );

    document.addEventListener("submit", (event) => {
      const { target } = event;
      event.preventDefault();
      if (target instanceof HTMLElement) {
        if (target.classList.contains("control-panel__creating")) {
          CarModel.create();
        } else if (target.classList.contains("update")) {
          CarModel.update();
          document.querySelector(".control-panel__updating_confirm").setAttribute("disabled", "disabled");
        }
      }
    });

    document.addEventListener("click", (event) => {
      const { target } = event;
      if (target instanceof HTMLButtonElement) {
        if (target.closest(".control-panel__creating_color")) {
          target.value = getRandomColor();
        } else if (target.closest(".generate-cars")) {
          ControlPanel.generateCarView(target, 100);
        } else if (target.closest(".remove-all")) {
          ControlPanel.removeAllCar(target);
        } else if (target.closest(".race-all")) {
          ControlPanel.race(target);
        } else if (target.closest(".reset-all")) {
          ControlPanel.resetAllCar();
        }
      }
    });
  }

  static content() {
    return `<div class="control-panel">
    <form action="" class="control-panel__creating buttons-container">
      <input class="control-panel__creating_name" type="text" required placeholder="Enter car name"   />
      <input class="control-panel__creating_color" type="color" />
      <button type="submit" value="Create" class="control-panel__creating_confirm">Create</button>
    </form>
    <form action="" class="update buttons-container">
      <input class="control-panel__updating_name" type="text" required placeholder="Change car name"  />
      <input class="control-panel__updating_color" type="color" />
      <button type="submit" value="Update" class="control-panel__updating_confirm" disabled>Update</button>
    </form>
    <ul class="buttons-container">
      <li><button class="race-all">Race</button></li>
      <li><button class="reset-all" disabled>Reset</button></li>
      <li><button class="remove-all">Remove cars</button></li>
      <li><button class="generate-cars">Generate cars</button></li>
    </ul>
  </div>`;
  }

  static updateDisability(activePage: PageType) {
    const panel = document.querySelector(".control-panel");
    if (activePage === PageType.GARAGE) {
      panel.classList.remove("disabled");
    } else {
      panel.classList.add("disabled");
    }
  }

  static async generateCars(amount: number) {
    const arrayOfCars = new Array(amount).fill(undefined);
    let carNames: CarsNamesJSONType | undefined;
    try {
      carNames = await ApiService.getCarsNames();
    } catch (error) {
      console.error(error);
    } finally {
      await Promise.allSettled(
        arrayOfCars.map(async () => {
          const car = await ApiService.createCar({ name: getRandomName(carNames), color: getRandomColor() });
          return car;
        }),
      );
    }
  }

  static async generateCarView(target: HTMLElement, amount: number) {
    target.classList.add("downloading");
    await ControlPanel.generateCars(amount);
    target.classList.remove("downloading");
    await Garage.updateGaragePage();
  }

  static async race(target: HTMLElement) {
    const cars = await ApiService.getCars(Settings.activeGaragePage, Settings.limit.garage);

    if (cars.length >= 2) {
      Page.blockButton(ButtonActionType.BLOCK, target);

      const promises = cars.map(async (car: Car) => {
        const data = await CarModel.drive(car.id);
        return Object.assign(car, data);
      });

      Promise.any(promises)
        .then((carResult) => {
          ControlPanel.updateWinner(carResult);
        })
        .catch((error) => {
          console.log(error);
          ControlPanel.printWinnerScreen("no one", 0);
          document.addEventListener("click", ControlPanel.removeWinnerScreen, { once: true });
        });

      Promise.allSettled(promises).then(() => {
        Page.blockButton(ButtonActionType.UNBLOCK, target);
        console.log("Race is over!");
      });
    }
  }

  static printWinnerScreen(name: string, time: number) {
    const timeInSec = (time / 1000).toFixed(3);
    const raceResult = document.querySelector(".race-result");
    raceResult.classList.add("active");

    raceResult.outerHTML = `<div class="race-result active">
    ${
      name !== "no one"
        ? `<h2>Race is over!</h2>
<p class="winner-message">&#9733;${name}&#9733;<br> finished first in ${timeInSec} seconds<p>`
        : `<h2>Race is over!</h2>
<p class="winner-message">No one finished first<p>`
    }
    </div>`;
  }

  static removeWinnerScreen() {
    const raceResult = document.querySelector(".race-result");
    raceResult.classList.remove("active");
  }

  static async resetAllCar() {
    const cars = await ApiService.getCars(Settings.activeGaragePage, Settings.limit.garage);
    cars.map((car: Car) => {
      return CarModel.stop(car.id);
    });

    document.querySelector(`.race-all`).removeAttribute("disabled");
    document.querySelector(`.reset-all`).setAttribute("disabled", "disabled");
    const stopEngines = document.querySelectorAll(".car__stop");
    stopEngines.forEach((element) => {
      element.setAttribute("disabled", "disabled");
    });
  }

  static async updateWinner(result: Car) {
    const { name, time, id } = result;
    ControlPanel.printWinnerScreen(name, time);
    document.addEventListener("click", ControlPanel.removeWinnerScreen, { once: true });

    try {
      const winners = await ApiService.getAllWinners();
      const winner = winners.filter((car: Winner) => {
        return car.id === id;
      });
      if (winner.length) {
        const updatedTime = time < winner[0].time ? time : winner[0].time;
        ApiService.updateWinner(id, { wins: winner[0].wins + 1, time: updatedTime });
      } else {
        ApiService.createWinner({ id, wins: 1, time });
      }
    } catch (error) {
      ApiService.createWinner({ id, wins: 1, time });
    }
  }

  static async removeAllCar(target: HTMLElement) {
    target.classList.add("downloading");
    const cars = await ApiService.getAllCars();

    const promises = cars.map((car: Car) => {
      return ApiService.deleteCar(car.id);
    });

    await Promise.allSettled(promises);
    Settings.activeGaragePage = 1;
    Settings.activeWinnersPage = 1;
    target.classList.remove("downloading");

    const winners = await ApiService.getAllWinners();

    winners.forEach(async (winner: Winner) => {
      await ApiService.deleteWinner(winner.id);
    });

    await Garage.updateGaragePage();
  }
}

export default ControlPanel;
