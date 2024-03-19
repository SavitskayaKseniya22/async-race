import { getTime } from "./utils";
import { CarActionType, CarStatusType, Engine, Winner } from "./types";
import ApiService from "./api";
import Garage from "./garage";
import Page from "./modules/Page";

class CarModel {
  static async drive(id: number) {
    CarModel.unsetAnimation(id);
    const car = await ApiService.changeDriveMode(id, CarStatusType.STARTED);
    CarModel.toggleEngineButtons(CarActionType.START, id);
    CarModel.setAnimation(id, car);

    try {
      await ApiService.changeDriveMode(id, CarStatusType.DRIVE);
      return { id, time: getTime(car.velocity, car.distance) };
    } catch (error) {
      console.log(error);
      CarModel.pause(id);
      throw new Error(error as string);
    }
  }

  static async pause(id: number) {
    await ApiService.changeDriveMode(id, CarStatusType.STOPPED);
    const carImg = document.querySelector(`.car__pic.car__pic${id}`) as HTMLElement;
    if (carImg) {
      carImg.style.animationPlayState = "paused";
    }
  }

  static async stop(id: number) {
    CarModel.unsetAnimation(id);
    CarModel.toggleEngineButtons(CarActionType.STOP, id);
    await ApiService.changeDriveMode(id, CarStatusType.STOPPED);
  }

  static unsetAnimation(id: number) {
    const carImg = document.querySelector(`.car__pic.car__pic${id}`) as HTMLElement;
    if (carImg) {
      carImg.classList.remove("car__pic-animation");
      carImg.style.animationDuration = "unset";
      carImg.style.animationPlayState = "unset";
    }
  }

  static setAnimation(id: number, car: Engine) {
    const carImg = document.querySelector(`.car__pic.car__pic${id}`) as HTMLElement;
    if (carImg) {
      const time = getTime(car.velocity, car.distance);
      carImg.classList.add("car__pic-animation");
      carImg.style.animationDuration = `${time}ms`;
      carImg.style.animationPlayState = "running";
    }
  }

  static toggleEngineButtons(action: CarActionType, id: number) {
    const start = document.querySelector(`#car__start_${id}`) as HTMLInputElement;
    const stop = document.querySelector(`#car__stop_${id}`) as HTMLInputElement;
    if (start && stop) {
      if (action === CarActionType.START) {
        start.disabled = true;
        stop.disabled = false;
      } else {
        start.disabled = false;
      }
    }
  }

  static async create() {
    const name = (document.querySelector(".control-panel__creating_name") as HTMLInputElement).value;
    const color = (document.querySelector(".control-panel__creating_color") as HTMLInputElement).value;
    await ApiService.createCar({ name, color });
    await Garage.updateGaragePage();
  }

  static async remove(target: HTMLElement) {
    const removeId = Page.getID(target);
    await ApiService.deleteCar(removeId);

    const winners = await ApiService.getAllWinners();
    const isItInWinners = winners.some((car: Winner) => {
      return car.id === removeId;
    });
    if (isItInWinners) {
      await ApiService.deleteWinner(removeId);
    }

    await Garage.updateGaragePage();
  }

  static async select(target: HTMLElement) {
    const nameInput = document.querySelector(".control-panel__updating_name");
    const colorInput = document.querySelector(".control-panel__updating_color");
    const selectId = Page.getID(target);
    if (
      selectId &&
      nameInput &&
      colorInput &&
      nameInput instanceof HTMLInputElement &&
      colorInput instanceof HTMLInputElement
    ) {
      const car = await ApiService.getCar(selectId);
      const { name, color } = car;
      nameInput.value = name;
      colorInput.value = color;
      const element = target.closest(`.car`);
      document.querySelectorAll(".active").forEach((activeElement) => {
        activeElement.classList.remove("active");
      });
      element.classList.add("active");
      document.querySelector(".control-panel__updating_confirm").removeAttribute("disabled");
    }
  }

  static async update() {
    const element = document.querySelector(`.active`);
    const nameInput = document.querySelector(".control-panel__updating_name");
    const colorInput = document.querySelector(".control-panel__updating_color");
    if (
      element &&
      nameInput &&
      colorInput &&
      nameInput instanceof HTMLInputElement &&
      colorInput instanceof HTMLInputElement
    ) {
      const nameValue = nameInput.value;
      const colorValue = colorInput.value;
      const id = element.getAttribute("data-num");

      await ApiService.updateCar(Number(id), {
        name: nameValue,
        color: colorValue,
      });
      const title = element.querySelector("h3");
      title.textContent = nameValue;
      const img = element.querySelector(".car__pic");
      img.setAttribute("style", `color:${colorValue}`);
      element.classList.remove("active");
      nameInput.value = "";
      colorInput.value = "#000000";
    }
  }

  static initListener() {
    document.addEventListener("click", async (event) => {
      const { target } = event;

      if (target instanceof HTMLElement) {
        if (target.closest(".car__remove")) {
          CarModel.remove(target);
        } else if (target.closest(".car__start")) {
          const id = Page.getID(target);
          CarModel.drive(id)
            .then(() => {
              console.log(`The car №${id} has reached the finish line.`);
            })
            .catch(() => {
              console.log(`The car №${id} broke down`);
            });
        } else if (target.closest(".car__stop")) {
          const id = Page.getID(target);
          CarModel.stop(id);
          target.setAttribute("disabled", "true");
          CarModel.toggleEngineButtons(CarActionType.STOP, id);
        } else if (target.closest(".car__select")) {
          CarModel.select(target);
        }
      }
    });
  }
}

export default CarModel;
