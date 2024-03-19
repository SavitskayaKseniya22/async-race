import { ButtonActionType, CarListType, PageType } from "../types";

class Page {
  static updatePageNumber(pageNumber: number, totalAmountOfPages: number) {
    const current = document.querySelector(".current");
    current.textContent = String(pageNumber);
    const total = document.querySelector(".total");
    total.textContent = String(totalAmountOfPages);
  }

  static updateTitle(activePage: PageType) {
    const titleContainer = document.querySelector(".page__title");
    titleContainer.textContent = activePage;
  }

  static async updateTotalCarsNumber(allCars: CarListType) {
    const carsTotalContainer = document.querySelector(".page__cars-total");
    carsTotalContainer.textContent = `(${allCars.length})`;
  }

  static toggleNavigationButtons(activePage: PageType) {
    const navToGarage = document.querySelector(`.to-garage`);
    const navToWinners = document.querySelector(`.to-winners`);
    if (activePage === PageType.GARAGE) {
      navToGarage.classList.add("disabled");
      navToWinners.classList.remove("disabled");
    } else {
      navToGarage.classList.remove("disabled");
      navToWinners.classList.add("disabled");
    }
  }

  static togglePaginationButtons(isItFirst: boolean, isItLast: boolean) {
    const prev = document.querySelector(`.prev-page`);
    const next = document.querySelector(`.next-page`);
    if (isItFirst && isItLast) {
      prev.classList.add("disabled");
      next.classList.add("disabled");
    } else if (isItFirst) {
      prev.classList.add("disabled");
      next.classList.remove("disabled");
    } else if (isItLast) {
      prev.classList.remove("disabled");
      next.classList.add("disabled");
    } else if (!isItFirst && !isItLast) {
      next.classList.remove("disabled");
      prev.classList.remove("disabled");
    }
  }

  static updateMainContent(content: string) {
    const main = document.querySelector("main");
    if (main) {
      main.innerHTML = content;
    }
  }

  static getCarImg(color: string, id: number) {
    return `<i style="color:${color};" class="fa-solid fa-car-side car__pic car__pic${id}"></i>`;
  }

  static blockButton(action: ButtonActionType, target: HTMLElement) {
    const buttonsHead = document.querySelectorAll(".header button");
    const buttonsPag = document.querySelectorAll(".pagination button");
    const buttonsDel = document.querySelectorAll(".car__remove");

    const buttons = Array.from(buttonsHead).concat(Array.from(buttonsPag)).concat(Array.from(buttonsDel));

    if (action === ButtonActionType.BLOCK) {
      target.classList.add("downloading");
      document.querySelector(`.to-winners`).classList.add("disabled");

      buttons.forEach((button) => {
        button.setAttribute("disabled", "disabled");
      });
    } else {
      target.classList.remove("downloading");

      buttons.forEach((button) => {
        button.removeAttribute("disabled");
      });
      document.querySelector(`.to-winners`).classList.remove("disabled");
      target.setAttribute("disabled", "disabled");
      document.querySelector(`.control-panel__updating_confirm`).setAttribute("disabled", "disabled");
    }
  }

  static getID(target: HTMLElement) {
    const parent = target.closest(".car");
    const id = Number(parent.getAttribute("data-num"));
    return id;
  }
}

export default Page;
