import { CarsPage, Car, WinnersPage, Winner } from "./types";

export class ApiService {
  link: string;
  constructor() {
    this.link = "https://async-race-api-seven.vercel.app";
  }

  async getAllCars() {
    const response = await fetch(`${this.link}/garage`);
    const allCars = (await response.json()) as Car[];
    return allCars;
  }

  async createCar(data: Car = {}) {
    const response = await fetch(`${this.link}/garage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const car = (await response.json()) as Car;
    return car;
  }

  async deleteCar(id: number) {
    const response = await fetch(`${this.link}/garage/${id}`, {
      method: "DELETE",
    });
    return await response.json();
  }

  async deleteWinner(id: number) {
    const response = await fetch(`${this.link}/winners/${id}`, {
      method: "DELETE",
    });
    return await response.json();
  }

  async changeDriveMode(id: number, status: "started" | "stopped" | "drive") {
    const response = await fetch(`${this.link}/engine?id=${id}&status=${status}`, {
      method: "PATCH",
    });
    const car = await response.json();
    return car;
  }

  async getCar(id: number) {
    const response = await fetch(`${this.link}/garage/${id}`, {
      method: "GET",
    });
    const car = (await response.json()) as Car;
    return car;
  }

  async updateCar(id: number, data: Car = {}) {
    const response = await fetch(`${this.link}/garage/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const car = (await response.json()) as Car;
    return car;
  }

  async getCars(page = 1, limit = 7) {
    const response = await fetch(`${this.link}/garage?_page=${page}&_limit=${limit}`, {
      method: "GET",
    });
    return {
      items: await response.json(),
      count: response.headers.get("X-Total-Count"),
      pageNumber: page,
      pageLimit: Math.ceil(+response.headers.get("X-Total-Count") / limit),
    } as CarsPage;
  }

  async getWinners(page = 1, limit = 10, sort = "id", order = "ASC") {
    const response = await fetch(`${this.link}/winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`, {
      method: "GET",
    });

    return {
      items: await response.json(),
      count: response.headers.get("X-Total-Count"),
      pageNumber: page,
      sort: sort,
      order: order,
      pageLimit: Math.ceil(+response.headers.get("X-Total-Count") / limit),
    } as WinnersPage;
  }

  async createWinner(data: Winner = {}) {
    const response = await fetch(`${this.link}/winners`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const car = (await response.json()) as Winner;
    return car;
  }

  async updateWinner(id: number, data: Winner = {}) {
    const response = await fetch(`${this.link}/winners/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const car = (await response.json()) as Winner;
    return car;
  }

  async getWinner(id: number) {
    const response = await fetch(`${this.link}/winners/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      const car = (await response.json()) as Winner;
      return car;
    } else {
      return undefined;
    }
  }
}

export const apiService = new ApiService();
