import { Car } from "../types";

class Track {
  static content(car: Car) {
    const { id, name, color } = car;
    return `<div class="car" data-num=${id}>
    <h3>${name}</h3>
    <ul class="buttons-container">
      <li><button class="car__select">Select</button></li>
      <li><button class="car__remove">Remove</button></li>
      <li><button id="car__start_${id}" class="car__start">Start</button></li>
      <li><button id="car__stop_${id}" class="car__stop" disabled>Reset</button></li>
    </ul>
    <div class="car__track">
    <i style="color:${color};" class="fa-solid fa-car-side car__pic car__pic${id}"></i>
    <i class="fa-solid fa-flag"></i>
    </div>
  </div>`;
  }
}

export default Track;
