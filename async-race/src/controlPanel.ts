import ApiService from "./api";
import CarModel from "./car";
import Garage from "./garage";
import Settings from "./modules/Settings";
import { Car, Winner } from "./types";
import { getRandomName, getRandomColor } from "./utils";

class ControlPanel {
  static initListener() {
    document.addEventListener(
      "focus",
      async (event) => {
        const { target } = event;
        if (target instanceof HTMLInputElement) {
          if (target.classList.contains("create-name") && target.value === "") {
            target.value = await getRandomName();
          }
          if (target.classList.contains("create-color")) {
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
        if (target.classList.contains("create")) {
          CarModel.create();
        } else if (target.classList.contains("update")) {
          CarModel.update();
          document.querySelector(".update-confirm").setAttribute("disabled", "disabled");
        }
      }
    });

    document.addEventListener("click", (event) => {
      const { target } = event;
      if (target instanceof HTMLButtonElement) {
        if (target.closest(".create-color")) {
          target.value = getRandomColor();
        } else if (target.closest(".generate-cars")) {
          ControlPanel.generateCarView(target, 100);
        } else if (target.closest(".remove-all")) {
          ControlPanel.removeAllCar(target);
        } else if (target.closest(".race-all")) {
          // ControlPanel.race(target);
        } else if (target.closest(".reset-all")) {
          // ControlPanel.resetAllCar();
        }
      }
    });
  }

  static content() {
    return `<div class="control-panel">
    <form action="" class="create">
      <input class="create-name" type="text" required placeholder="Enter car name"   />
      <input class="create-color" type="color" />
      <button type="submit" value="Create" class="create-confirm">Create</button>
    </form>
    <form action="" class="update">
      <input class="update-name" type="text" required placeholder="Change car name"  />
      <input class="update-color" type="color" />
      <button type="submit" value="Update" class="update-confirm" disabled>Update</button>
    </form>
    <ul>
      <li><button class="race-all">Race</button></li>
      <li><button class="reset-all" disabled>Reset</button></li>
      <li><button class="remove-all">Remove cars</button></li>
      <li><button class="generate-cars">Generate cars</button></li>
    </ul>
  </div>`;
  }

  static updateDisability(activePage: "garage" | "winners") {
    const panel = document.querySelector(".control-panel");
    if (activePage === "garage") {
      panel.classList.remove("disabled");
    } else {
      panel.classList.add("disabled");
    }
  }

  static async generateCars(amount: number) {
    const arrayOfCars = new Array(amount).fill(undefined);
    await Promise.allSettled(
      arrayOfCars.map(async () => {
        const name = await getRandomName();
        const car = await ApiService.createCar({ name, color: getRandomColor() });
        return car;
      }),
    );
  }

  static async generateCarView(target: HTMLElement, amount: number) {
    target.classList.add("downloading");
    await ControlPanel.generateCars(amount);
    target.classList.remove("downloading");

    await Garage.updateGaragePage();
  }
  /*
  static printWinnerScreen(name: string, time: number) {
    const timeInSec = (time / 1000).toFixed(3);
    const raceResult = document.createElement("div");
    raceResult.className = "race-result active";
    raceResult.innerHTML =
      name !== "no one"
        ? `<h2>Race is over!</h2>
<p class="winner-message">&#9733;${name}&#9733;<br> finished first in ${timeInSec} seconds<p>`
        : `<h2>Race is over!</h2>
<p class="winner-message">No one finished first<p>`;
    document.querySelector(".header").append(raceResult);
  }

  static removeWinnerScreen() {
    const raceResult = document.querySelector(".race-result");
    raceResult.remove();
  }

  static async resetAllCar() {
    const cars = await ApiService.getCars(Settings.activeGaragePage, Settings.garageLimit);
    cars.items.map((car: Car) => {
      const index = cars.items.indexOf(car);
      return Garage.carCollection[index].stopCar(car.id);
    });
    document.querySelector(`.race-all`).removeAttribute("disabled");
    document.querySelector(`.reset-all`).setAttribute("disabled", "disabled");
    const stopEngines = document.querySelectorAll(".stopEngine");
    stopEngines.forEach((element) => {
      element.setAttribute("disabled", "disabled");
    });
  }

  static async race(target: HTMLElement) {
    const cars = await ApiService.getCars(Settings.activeGaragePage, Settings.garageLimit);

    if (cars.items.length >= 2) {
      blockButton("block", target);
      const promises = cars.items.map((car: Car) => {
        const index = cars.items.indexOf(car);
        return Garage.carCollection[index].drive(car.id);
      });
      await Promise.any(promises)
        .then((carResult: Winner) => {
          ControlPanel.updateWinner(carResult);
        })
        .catch(() => {
          ControlPanel.printWinnerScreen("no one", 0);
          document.addEventListener("click", ControlPanel.removeWinnerScreen, { once: true });
        });

      await Promise.allSettled(promises);
      blockButton("unblock", target);
    }
  }

  static async updateWinner(carResult: Winner) {
    const car = await ApiService.getCar(carResult.id);
    ControlPanel.printWinnerScreen(car.name, carResult.time);
    document.addEventListener("click", ControlPanel.removeWinnerScreen, { once: true });

    try {
      const winner = await ApiService.getWinner(carResult.id);
      const time = carResult.time < winner.time ? carResult.time : winner.time;

      const data = {
        wins: winner.wins + 1,
        time,
      };
      ApiService.updateWinner(carResult.id, data);
    } catch (error) {
      ApiService.createWinner({
        id: carResult.id,
        wins: 1,
        time: carResult.time,
      });
    }
  }

  */

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
