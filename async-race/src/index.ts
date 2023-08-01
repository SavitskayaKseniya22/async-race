import Settings from "./modules/Settings";
import Pagination from "./pagination";

class App {
  static addListener() {
    window.addEventListener("hashchange", async () => {
      const location = window.location.hash.replace("#", "");
      if (location === "garage" || location === "winners") {
        Settings.activePage = location;
      }
    });
  }

  static content() {
    return `
    <header class="header">
    <h1>Async race</h1>
    <ul class="navigation">
      <a href="./#garage" id="to-garage" class="to-garage button">to garage</a>
      <a href="./#winners" id="to-winners" class="to-winners button" >to winners</a>
    </ul>
    <h2 class="count">${Settings.activePage}<span>(${1})</span></h2>
    </header>
      <main>

      </main>
      <nav>
      ${Pagination.content()}
      <h3 class="page-number">Page: <span>${Settings.checkActivePage()}</span></h3>
      </nav>
       <footer class="footer">
    <div>
      <a href="https://rs.school/js/" target="_blank">
        <img src="./assets/images/rs-school-js.svg" alt="link" width="100" />
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
