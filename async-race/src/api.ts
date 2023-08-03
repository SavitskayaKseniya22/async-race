import { Car, Winner } from "./types";

class ApiService {
  static link = "http://127.0.0.1:3000";

  static async getCarsNames() {
    const response = await fetch(`./assets/jsons/carNames.json`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const cars = await response.json();
      return cars as { [x: string]: string[] };
    }
    throw new Error(`Something went wrong! ${response.status}: ${response.statusText}`);
  }

  static async getAllCars() {
    const response = await fetch(`${ApiService.link}/garage`);
    if (response.ok) {
      const allCars = await response.json();
      return allCars as Car[];
    }
    throw new Error(`Something went wrong! ${response.status}: ${response.statusText}`);
  }

  static async createCar(data: Car = {}) {
    const response = await fetch(`${ApiService.link}/garage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const car = (await response.json()) as Car;
      return car;
    }
    throw new Error(`Something went wrong! ${response.status}: ${response.statusText}`);
  }

  static async deleteCar(id: number) {
    const response = await fetch(`${ApiService.link}/garage/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      return response.json();
    }
    throw new Error(`Something went wrong! ${response.status}: ${response.statusText}`);
  }

  static async deleteWinner(id: number) {
    const response = await fetch(`${ApiService.link}/winners/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      return response.json();
    }
    throw new Error(`Something went wrong! ${response.status}: ${response.statusText}`);
  }

  static async changeDriveMode(id: number, status: "started" | "stopped" | "drive") {
    const response = await fetch(`${ApiService.link}/engine?id=${id}&status=${status}`, {
      method: "PATCH",
    });

    if (response.ok) {
      return response.json();
    }
    throw new Error(`Something went wrong! ${response.status}: ${response.statusText}`);
  }

  static async getCar(id: number) {
    const response = await fetch(`${ApiService.link}/garage/${id}`, {
      method: "GET",
    });

    if (response.ok) {
      const car = await response.json();
      return car as Car;
    }
    throw new Error(`Something went wrong! ${response.status}: ${response.statusText}`);
  }

  static async updateCar(id: number, data: Car = {}) {
    const response = await fetch(`${ApiService.link}/garage/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const car = await response.json();
      return car as Car;
    }
    throw new Error(`Something went wrong! ${response.status}: ${response.statusText}`);
  }

  static async getCars(page = 1, limit = 7) {
    const response = await fetch(`${ApiService.link}/garage?_page=${page}&_limit=${limit}`, {
      method: "GET",
    });
    if (response.ok) {
      const cars = await response.json();
      return cars as Car[];
    }
    throw new Error(`Something went wrong! ${response.status}: ${response.statusText}`);
  }

  static async getWinners(page = 1, limit = 10, sort = "id", order = "ASC") {
    const response = await fetch(
      `${ApiService.link}/winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`,
      {
        method: "GET",
      },
    );

    if (response.ok) {
      const winners = await response.json();
      return winners as Winner[];
    }
    throw new Error(`Something went wrong! ${response.status}: ${response.statusText}`);
  }

  static async getAllWinners() {
    const response = await fetch(`${ApiService.link}/winners`, {
      method: "GET",
    });

    if (response.ok) {
      const winners = await response.json();
      return winners as Winner[];
    }
    throw new Error(`Something went wrong! ${response.status}: ${response.statusText}`);
  }

  static async createWinner(data: Winner = {}) {
    const response = await fetch(`${ApiService.link}/winners`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const car = await response.json();
      return car as Winner;
    }
    throw new Error(`Something went wrong! ${response.status}: ${response.statusText}`);
  }

  static async updateWinner(id: number, data: Winner = {}) {
    const response = await fetch(`${ApiService.link}/winners/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const car = await response.json();
      return car as Winner;
    }
    throw new Error(`Something went wrong! ${response.status}: ${response.statusText}`);
  }

  static async getWinner(id: number) {
    const response = await fetch(`${ApiService.link}/winners/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const car = await response.json();
      return car as Winner;
    }
    throw new Error(`Something went wrong! ${response.status}: ${response.statusText}`);
  }
}

export default ApiService;
