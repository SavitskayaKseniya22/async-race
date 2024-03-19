import CarModel from "./car";
import ControlPanel from "./controlPanel";
import Garage from "./garage";
import Page from "./modules/Page";
import Settings from "./modules/Settings";
import Pagination from "./pagination";
import { PageType } from "./types";
import Winners from "./winners";

class App {
  static addListener() {
    Winners.initListener();
    Pagination.initListener();
    ControlPanel.initListener();
    CarModel.initListener();

    window.addEventListener("load", async () => {
      const location = window.location.hash.replace("#", "");
      if (location.length === 0) {
        window.location.href = "#garage";
      }
      if (location === PageType.GARAGE || location === PageType.WINNERS) {
        Settings.activePage = location;
        Page.toggleNavigationButtons(location);
        Page.updateTitle(location);
        ControlPanel.updateDisability(location);

        if (location === PageType.GARAGE) {
          await Garage.updateGaragePage();
        } else {
          await Winners.updateWinnersPage();
        }
      }
    });

    window.addEventListener("hashchange", async () => {
      const location = window.location.hash.replace("#", "");
      if (location === PageType.GARAGE || location === PageType.WINNERS) {
        Settings.activePage = location;
        Page.toggleNavigationButtons(location);
        Page.updateTitle(location);
        ControlPanel.updateDisability(location);

        if (location === PageType.GARAGE) {
          await Garage.updateGaragePage();
        } else {
          await Winners.updateWinnersPage();
        }
      }
    });
  }

  static content() {
    return `
    <header class="header">
    <h2><span class="page__title"></span><span class="page__cars-total"></span></h2>
    <h1>Async race</h1>
    ${ControlPanel.content()}
    <nav class="navigation buttons-container">
      <a href="./#garage" id="to-garage" class="to-garage button">to garage</a>
      <a href="./#winners" id="to-winners" class="to-winners button">to winners</a>
    </nav>
   
    <div class="race-result"></div>
    </header>
      <main>
      </main>
      <nav>
      ${Pagination.content()}
      <h3 class="page-number">Page: <span class="current"></span>/<span class="total"></span></h3>
      </nav>
       <footer class="footer">
    <div>
      <a href="https://rs.school/js/" target="_blank">
        <img src="./assets/images/rs-school-js.svg" alt="link" width="60" />
      </a>
    </div>
    <div>
      <a href="https://github.com/SavitskayaKseniya22" target="_blank"> made by Kseniya Savitskaya </a>
    </div>
    <div>© 2023</div>
  </footer>
    `;
  }

  static render() {
    const body = document.querySelector("body");
    if (body) {
      body.insertAdjacentHTML("afterbegin", App.content());
    }
    App.addListener();
  }
}
App.render();
