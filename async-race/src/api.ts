import { CarsPage, Car, WinnersPage, Winner } from "./types";

class ApiService {
  static link = "http://127.0.0.1:3000";

  static async getAllCars() {
    const response = await fetch(`${ApiService.link}/garage`);
    const allCars = (await response.json()) as Car[];
    return allCars;
  }

  static async createCar(data: Car = {}) {
    const response = await fetch(`${ApiService.link}/garage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const car = (await response.json()) as Car;
    return car;
  }

  static async deleteCar(id: number) {
    const response = await fetch(`${ApiService.link}/garage/${id}`, {
      method: "DELETE",
    });
    return response.json();
  }

  static async deleteWinner(id: number) {
    const response = await fetch(`${ApiService.link}/winners/${id}`, {
      method: "DELETE",
    });
    return response.json();
  }

  static async changeDriveMode(id: number, status: "started" | "stopped" | "drive") {
    const response = await fetch(`${ApiService.link}/engine?id=${id}&status=${status}`, {
      method: "PATCH",
    });
    const car = await response.json();
    return car;
  }

  static async getCar(id: number) {
    const response = await fetch(`${ApiService.link}/garage/${id}`, {
      method: "GET",
    });
    const car = (await response.json()) as Car;
    return car;
  }

  static async updateCar(id: number, data: Car = {}) {
    const response = await fetch(`${ApiService.link}/garage/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const car = (await response.json()) as Car;
    return car;
  }

  static async getCars(page = 1, limit = 7) {
    const response = await fetch(`${ApiService.link}/garage?_page=${page}&_limit=${limit}`, {
      method: "GET",
    });
    return {
      items: await response.json(),
      count: response.headers.get("X-Total-Count"),
      pageNumber: page,
      pageLimit: Math.ceil(+response.headers.get("X-Total-Count") / limit),
    } as CarsPage;
  }

  static async getWinners(page = 1, limit = 10, sort = "id", order = "ASC") {
    const response = await fetch(
      `${ApiService.link}/winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`,
      {
        method: "GET",
      },
    );

    return {
      items: await response.json(),
      count: response.headers.get("X-Total-Count"),
      pageNumber: page,
      sort,
      order,
      pageLimit: Math.ceil(+response.headers.get("X-Total-Count") / limit),
    } as WinnersPage;
  }

  static async createWinner(data: Winner = {}) {
    const response = await fetch(`${ApiService.link}/winners`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const car = (await response.json()) as Winner;
    return car;
  }

  static async updateWinner(id: number, data: Winner = {}) {
    const response = await fetch(`${ApiService.link}/winners/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const car = (await response.json()) as Winner;
    return car;
  }

  static async getWinner(id: number) {
    const response = await fetch(`${ApiService.link}/winners/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      const car = (await response.json()) as Winner;
      return car;
    }
    return undefined;
  }
}

export default ApiService;
