/* eslint-disable consistent-return */
import { Car, Winner } from "./types";

class ApiService {
  static link = "http://127.0.0.1:3000";

  static async getCarsNames() {
    try {
      const response = await fetch(`./assets/jsons/carNames.json`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Something went wrong! ${response.status}: ${response.statusText}`);
      }
      const cars = await response.json();
      return cars as { [x: string]: string[] };
    } catch (error) {
      console.error(error);
    }
  }

  static async getAllCars() {
    try {
      const response = await fetch(`${ApiService.link}/garage`);
      if (!response.ok) {
        throw new Error(`Something went wrong! ${response.status}: ${response.statusText}`);
      }
      const cars = await response.json();
      return cars as Car[];
    } catch (error) {
      console.error(error);
    }
  }

  static async createCar(data: Car = {}) {
    try {
      const response = await fetch(`${ApiService.link}/garage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`Something went wrong! ${response.status}: ${response.statusText}`);
      }
      const car = await response.json();
      return car as Car;
    } catch (error) {
      console.error(error);
    }
  }

  static async deleteCar(id: number) {
    try {
      const response = await fetch(`${ApiService.link}/garage/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Something went wrong! ${response.status}: ${response.statusText}`);
      }
      const car = await response.json();
      return car;
    } catch (error) {
      console.error(error);
    }
  }

  static async deleteWinner(id: number) {
    try {
      const response = await fetch(`${ApiService.link}/winners/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Something went wrong! ${response.status}: ${response.statusText}`);
      }
      const car = await response.json();
      return car;
    } catch (error) {
      console.error(error);
    }
  }

  static async changeDriveMode(id: number, status: "started" | "stopped" | "drive") {
    const response = await fetch(`${ApiService.link}/engine?id=${id}&status=${status}`, {
      method: "PATCH",
    });
    if (response.status === 500) {
      throw new Error(`Car №${id} has been stopped suddenly. It's engine was broken down`);
    } else if (!response.ok) {
      throw new Error(`Something went wrong! ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  static async getCar(id: number) {
    try {
      const response = await fetch(`${ApiService.link}/garage/${id}`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(`Something went wrong! ${response.status}: ${response.statusText}`);
      }
      const car = await response.json();
      return car as Car;
    } catch (error) {
      console.error(error);
    }
  }

  static async updateCar(id: number, data: Car = {}) {
    try {
      const response = await fetch(`${ApiService.link}/garage/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`Something went wrong! ${response.status}: ${response.statusText}`);
      }
      const car = await response.json();
      return car as Car;
    } catch (error) {
      console.error(error);
    }
  }

  static async getCars(page = 1, limit = 7) {
    try {
      const response = await fetch(`${ApiService.link}/garage?_page=${page}&_limit=${limit}`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(`Something went wrong! ${response.status}: ${response.statusText}`);
      }
      const cars = await response.json();
      return cars as Car[];
    } catch (error) {
      console.error(error);
    }
  }

  static async getWinners(page = 1, limit = 10, sort = "id", order = "ASC") {
    try {
      const response = await fetch(
        `${ApiService.link}/winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`,
        {
          method: "GET",
        },
      );
      if (!response.ok) {
        throw new Error(`Something went wrong! ${response.status}: ${response.statusText}`);
      }
      const winners = await response.json();
      return winners as Winner[];
    } catch (error) {
      console.error(error);
    }
  }

  static async getAllWinners() {
    try {
      const response = await fetch(`${ApiService.link}/winners`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(`Something went wrong! ${response.status}: ${response.statusText}`);
      }
      const winners = await response.json();
      return winners as Winner[];
    } catch (error) {
      console.error(error);
    }
  }

  static async createWinner(data: Winner = {}) {
    try {
      const response = await fetch(`${ApiService.link}/winners`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`Something went wrong! ${response.status}: ${response.statusText}`);
      }
      const car = await response.json();
      return car as Winner;
    } catch (error) {
      console.error(error);
    }
  }

  static async updateWinner(id: number, data: Winner = {}) {
    try {
      const response = await fetch(`${ApiService.link}/winners/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`Something went wrong! ${response.status}: ${response.statusText}`);
      }
      const car = await response.json();
      return car as Winner;
    } catch (error) {
      console.error(error);
    }
  }

  static async getWinner(id: number) {
    try {
      const response = await fetch(`${ApiService.link}/winners/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Something went wrong! ${response.status}: ${response.statusText}`);
      }
      const car = await response.json();
      return car as Winner;
    } catch (error) {
      console.error(error);
    }
  }
}

export default ApiService;
