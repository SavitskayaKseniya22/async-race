import { getTime } from "./utils";
import { Engine } from "./types";
import ApiService from "./api";
import Garage from "./garage";
import Page from "./modules/Page";

class CarModel {
  /*
  static async drive(id: number) {
    return new Promise(async (resolve, reject) => {
      CarModel.unsetAnimation(id);
      const car = await ApiService.changeDriveMode(id, "started");
      CarModel.updateEngineButton("start", id);
      CarModel.setAnimation(id, car);
      try {
        await ApiService.changeDriveMode(id, "drive");
        resolve({ id, time: getTime(car.velocity, car.distance) });
      } catch (error) {
        CarModel.pauseCar(id);
        reject(`Car number ${id} stopped! Сar engine broken!`);
        console.log(`Car number ${id} stopped! Сar engine broken!`);
      }
    });
  } */

  static async pauseCar(id: number) {
    await ApiService.changeDriveMode(id, "stopped");
    const carImg = document.querySelector(`.car-pic.car-pic${id}`) as HTMLImageElement;
    if (carImg) {
      carImg.style.animationPlayState = "paused";
    }
  }

  static async stopCar(id: number) {
    await ApiService.changeDriveMode(id, "stopped");
    CarModel.updateEngineButton("stop", id);
    CarModel.unsetAnimation(id);
  }

  static unsetAnimation(id: number) {
    const carImg = document.querySelector(`.car-pic.car-pic${id}`) as HTMLImageElement;
    if (carImg) {
      carImg.classList.remove("car-pic-animation");
      carImg.style.animationDuration = "unset";
      carImg.style.animationPlayState = "unset";
    }
  }

  static setAnimation(id: number, car: Engine) {
    const carImg = document.querySelector(`.car-pic.car-pic${id}`) as HTMLImageElement;
    if (carImg) {
      const time = getTime(car.velocity, car.distance);
      carImg.classList.add("car-pic-animation");
      carImg.style.animationDuration = `${time}ms`;
      carImg.style.animationPlayState = "running";
    }
  }

  static updateEngineButton(button: "start" | "stop", id: number) {
    const start = document.querySelector(`#start-engine${id}`) as HTMLInputElement;
    const stop = document.querySelector(`#stop-engine${id}`) as HTMLInputElement;
    if (start && stop) {
      if (button === "start") {
        start.disabled = true;
        stop.disabled = false;
      } else {
        start.disabled = false;
      }
    }
  }

  static async create() {
    const name = (document.querySelector(".create-name") as HTMLInputElement).value;
    const color = (document.querySelector(".create-color") as HTMLInputElement).value;
    await ApiService.createCar({ name, color });
    await Garage.updateGaragePage();
  }

  static async remove(target: HTMLElement) {
    const removeId = Page.getID(target);
    await ApiService.deleteCar(removeId);

    const winners = await ApiService.getAllWinners();
    const isItInWinners = winners.some((car) => {
      return car.id === removeId;
    });
    if (isItInWinners) {
      await ApiService.deleteWinner(removeId);
    }

    await Garage.updateGaragePage();
  }

  static async select(target: HTMLElement) {
    const nameInput = document.querySelector(".update-name");
    const colorInput = document.querySelector(".update-color");
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
      document.querySelector(".update-confirm").removeAttribute("disabled");
    }
  }

  static async update() {
    const element = document.querySelector(`.active`);
    const nameInput = document.querySelector(".update-name");
    const colorInput = document.querySelector(".update-color");
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
      const img = element.querySelector(".car-pic");
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
        if (target.closest(".removeCar")) {
          CarModel.remove(target);
        } else if (target.closest(".startEngine")) {
          // await this.drive(getID(target));
        } else if (target.closest(".stopEngine")) {
          // this.stopCar(getID(target));
          // target.disabled = true;
        } else if (target.closest(".selectCar")) {
          CarModel.select(target);
        }
      }
    });
  }
}

export default CarModel;
