import { Car } from "../types";

class Track {
  static content(car: Car) {
    const { id, name, color } = car;
    return `<div class="car" data-num=${id}>
    <h3>${name}</h3>
    <ul class="buttons-container">
      <li><button class="selectCar">Select</button></li>
      <li><button class="removeCar">Remove</button></li>
      <li><button id="start-engine${id}" class="startEngine">Start</button></li>
      <li><button id="stop-engine${id}" class="stopEngine" disabled>Reset</button></li>
    </ul>
    <div class="track">
    <i style="color:${color};" class="fa-solid fa-car-side car-pic car-pic${id}"></i>
    <i class="fa-solid fa-flag"></i>
    </div>
  </div>`;
  }
}

export default Track;
