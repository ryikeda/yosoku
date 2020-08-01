export {
  LoginForm,
  LogoutForm,
  SignupForm,
  SearchForm,
  ResultsTable,
  FilterForm,
  UserForm,
  AboutModal,
};

class SignupForm {
  constructor() {
    this.navbar = document.getElementById("navbar");

    this.modal = document.getElementById("modal");
    this.modalTitle = document.getElementById("modal-title");
    this.modalBody = document.getElementById("modal-body");
    this.modalBtn = document.getElementById("modal-btn");

    this.signupEndpoint = "/signup";

    this.token = document.getElementById("csrf_token").value;

    this.navbar.addEventListener("click", (e) => this.handleClick(e));
    this.modal.addEventListener("click", (e) => this.handleClick(e));
  }

  handleClick(e) {
    e.preventDefault();

    if (e.target.id === "nav-signup") {
      this.modalBtn.click();
      this.modalTitle.innerText = "Sign Up";
      this.submitForm("get", this.signupEndpoint);
    }

    if (e.target.id === "signup-btn") {
      const username = document.getElementById("username");
      const email = document.getElementById("email");
      const password = document.getElementById("password");

      const data = {
        username: username.value,
        email: email.value,
        password: password.value,
      };
      this.submitForm("post", this.signupEndpoint, data);
    }
  }

  async submitForm(method, endpoint, data) {
    axios({
      method: method,
      url: endpoint,
      data: data,
      headers: {
        "X-CSRFToken": this.token,
      },
    }).then(
      (response) => {
        this.modalBody.innerHTML = response.data;
      },
      (error) => {
        console.log(error.response.data);
      }
    );
  }
}

class LoginForm {
  constructor() {
    this.navbar = document.getElementById("navbar");

    this.modal = document.getElementById("modal");
    this.modalTitle = document.getElementById("modal-title");
    this.modalBody = document.getElementById("modal-body");
    this.modalBtn = document.getElementById("modal-btn");

    this.loginEndpoint = "/login";

    this.token = document.getElementById("csrf_token").value;

    this.navbar.addEventListener("click", (e) => this.handleClick(e));
    this.modal.addEventListener("click", (e) => this.handleClick(e));
  }

  handleClick(e) {
    e.preventDefault();

    if (e.target.id === "nav-login") {
      this.modalBtn.click();
      this.modalTitle.innerText = "Login";
      this.submitForm("get", this.loginEndpoint);
    }

    if (e.target.id === "login-btn") {
      const username = document.getElementById("username");
      const password = document.getElementById("password");

      const data = {
        username: username.value,
        password: password.value,
      };

      this.submitForm("post", this.loginEndpoint, data);
    }
  }

  async submitForm(method, endpoint, data) {
    axios({
      method: method,
      url: endpoint,
      data: data,
      headers: {
        "X-CSRFToken": this.token,
      },
    }).then(
      (response) => {
        this.modalBody.innerHTML = response.data;
        if (response.data.includes("Hello,")) {
          setTimeout(() => location.reload(), 1000);
        }
      },
      (error) => {
        console.log(error.response.data);
      }
    );
  }
}

class LogoutForm {
  constructor() {
    this.navbar = document.getElementById("navbar");

    this.modal = document.getElementById("modal");
    this.modalTitle = document.getElementById("modal-title");
    this.modalBody = document.getElementById("modal-body");
    this.modalBtn = document.getElementById("modal-btn");

    this.logoutEndpoint = "/logout";

    this.token = document.getElementById("csrf_token").value;

    this.navbar.addEventListener("click", (e) => this.handleClick(e));
    this.modal.addEventListener("click", (e) => this.handleClick(e));
  }

  handleClick(e) {
    e.preventDefault();

    if (e.target.id === "nav-logout") {
      this.modalBtn.click();
      this.modalTitle.innerText = "Logout";
      this.submitForm("get", this.logoutEndpoint);
    }

    if (e.target.id === "logout-btn") {
      this.submitForm("post", this.logoutEndpoint);
    }
  }

  async submitForm(method, endpoint, data) {
    axios({
      method: method,
      url: endpoint,
      data: data,
      headers: {
        "X-CSRFToken": this.token,
      },
    }).then(
      (response) => {
        this.modalBody.innerHTML = response.data;
        if (response.data.includes("You are logged out!")) {
          setTimeout(() => location.reload(), 1000);
        }
      },
      (error) => {
        console.log(error.response.data);
      }
    );
  }
}

class UserForm {
  constructor() {
    this.navbar = document.getElementById("navbar");

    this.modal = document.getElementById("modal");
    this.modalTitle = document.getElementById("modal-title");
    this.modalBody = document.getElementById("modal-body");
    this.modalBtn = document.getElementById("modal-btn");

    this.userEndpoint = "/user";

    this.token = document.getElementById("csrf_token").value;

    this.navbar.addEventListener("click", (e) => this.handleClick(e));
    this.modal.addEventListener("click", (e) => this.handleClick(e));
  }

  handleClick(e) {
    e.preventDefault();

    if (e.target.id === "nav-user") {
      this.modalBtn.click();
      this.modalTitle.innerText = "User Details";
      this.submitForm("get", this.userEndpoint);
    }

    if (e.target.id === "user-btn") {
      this.submitForm("post", this.userEndpoint);
    }
  }

  async submitForm(method, endpoint, data) {
    axios({
      method: method,
      url: endpoint,
      data: data,
      headers: {
        "X-CSRFToken": this.token,
      },
    }).then(
      (response) => {
        this.modalBody.innerHTML = response.data;
        if (response.data.includes("User Deleted")) {
          setTimeout(() => location.reload(), 1000);
        }
      },
      (error) => {
        console.log(error.response.data);
      }
    );
  }
}

class SearchForm {
  constructor() {
    this.searchBox = document.getElementById("search");
    this.matchList = document.getElementById("match-list");
    this.token = document.getElementById("csrf_token").value;

    this.filterBtn = document.getElementById("filter-btn");
    this.loadingModalBtn = document.getElementById("loading-modal-btn");

    this.map = document.getElementById("map");

    this.searchBox.addEventListener("input", () =>
      this.searchCity(this.searchBox.value)
    );
    this.matchList.addEventListener("click", (e) => this.handleClick(e));
  }

  async searchCity(cityName) {
    const res = await fetch("/static/resources/all_cities.json");
    const cities = await res.json();

    // get matches
    let matches = cities.filter((city) => {
      const regex = new RegExp(`^${cityName}`, "gi");
      return city.name.match(regex);
    });

    if (cityName.length === 0) {
      matches = [];
      this.matchList.innerHTML = "";
    }

    this.outputHtml(matches);
  }
  outputHtml(matches) {
    if (matches.length === 0) return;
    this.matchList.innerHTML = "";

    if (matches.length > 5) {
      const firstResults = matches.slice(0, 5);
      firstResults.forEach((city) => {
        this.createItem(city);
      });
    } else {
      matches.forEach((city) => {
        this.createItem(city);
      });
    }
  }

  createItem(city) {
    const item = document.createElement("a");
    item.id = city.id;
    item.href = "#";
    item.innerText = `${city.name} - ${city.state}`;
    item.dataset.cityName = city.name;
    item.className = "list-group-item list-group-item-action";
    this.matchList.appendChild(item);
  }

  handleClick(e) {
    if ((e.target.className = "list-group-item list-group-item-action")) {
      const cityName = e.target.dataset.cityName;
      const data = {
        city_code: e.target.id,
        city_name: cityName,
      };
      this.map.src = `https://www.google.com/maps/embed/v1/place?key=AIzaSyA0s1a7phLN0iaD6-UE7m4qP-z21pH0eSc&q=${cityName}`;
      this.searchBox.value = "";
      this.matchList.innerHTML = "";
      this.submitForm("post", "/", data);
      this.displayModal();
    }
  }
  displayModal() {
    this.loadingModalBtn.click();
    const timer = setInterval(() => {
      axios({
        method: "get",
        url: "/status",
      }).then(
        (response) => {
          if (response.data === "SUCCESS") {
            this.loadingModalBtn.click();
            this.filterBtn.click();
            clearInterval(timer);
          }
        },
        (error) => {
          console.log(error.response.data);
        }
      );
    }, 5000);
  }

  async submitForm(method, endpoint, data) {
    axios({
      method: method,
      url: endpoint,
      data: data,
      headers: {
        "X-CSRFToken": this.token,
      },
    }).then(
      (response) => {},
      (error) => {
        console.log(error.response.data);
      }
    );
  }
}

class ResultsTable {
  constructor() {
    this.resultsTable = document.getElementById("results-table");

    this.modal = document.getElementById("modal");
    this.modalTitle = document.getElementById("modal-title");
    this.modalBody = document.getElementById("modal-body");
    this.modalBtn = document.getElementById("modal-btn");

    this.deleteEndpoint = "/delete/query";
    this.editEndpoint = "/edit/query";

    this.token = document.getElementById("csrf_token").value;
    this.getTable();

    this.resultsTable.addEventListener("click", (e) => this.handleClick(e));
    this.modal.addEventListener("click", (e) => this.handleClick(e));
  }

  async getTable() {
    axios({
      method: "get",
      url: "/results",
      headers: {
        "X-CSRFToken": this.token,
      },
    }).then(
      (response) => {
        this.resultsTable.innerHTML = response.data;
      },
      (error) => {
        console.log(error.response.data);
      }
    );
  }

  handleClick(e) {
    e.preventDefault();

    // Delete query
    if (e.target.className === "fas fa-trash-alt") {
      this.tr = e.target.parentElement.parentElement;
      this.modalTitle.innerText = "Delete Query";
      this.modalBtn.click();

      this.submitForm("get", this.deleteEndpoint);
    }

    if (e.target.id === "delete-query-btn") {
      const data = { queryId: this.tr.dataset.queryId };
      this.submitForm("post", this.deleteEndpoint, data);
    }

    // Edit comment
    if (e.target.className === "fas fa-edit") {
      this.tr = e.target.parentElement.parentElement;
      this.modalTitle.innerText = "Edit Comment";
      this.modalBtn.click();
      this.submitForm("get", this.editEndpoint);
    }

    if (e.target.id === "edit-query-btn") {
      const commentBox = document.getElementById("comment");
      const data = {
        queryId: this.tr.dataset.queryId,
        comment: commentBox.value,
      };
      this.submitForm("post", this.editEndpoint, data);
    }
  }

  async submitForm(method, endpoint, data) {
    axios({
      method: method,
      url: endpoint,
      data: data,
      headers: {
        "X-CSRFToken": this.token,
      },
    }).then(
      (response) => {
        this.modalBody.innerHTML = response.data;
        if (method === "post") {
          this.getTable();
        }
      },
      (error) => {
        console.log(error.response.data);
      }
    );
  }
}

class FilterForm {
  constructor() {
    this.searchForm = document.getElementById("search-form");
    this.resultsTable = document.getElementById("results-table");

    this.modal = document.getElementById("modal");
    this.modalTitle = document.getElementById("modal-title");
    this.modalBody = document.getElementById("modal-body");
    this.modalBtn = document.getElementById("modal-btn");

    this.filtersEndpoint = "/filters";
    this.predictEndpoint = "/predict";
    this.resultsEndpoint = "/results";

    this.token = document.getElementById("csrf_token").value;

    this.searchForm.addEventListener("click", (e) => this.handleClick(e));
    this.modal.addEventListener("click", (e) => this.handleClick(e));
  }

  handleClick(e) {
    if (e.target.id === "filter-btn") {
      this.modalBtn.click();
      this.modalTitle.innerText = "Filters";
      this.submitForm("get", this.filtersEndpoint);
    }

    //Logic to hide floor area when necessary
    if (e.target.id === "type_") {
      const groupFloorPlan = document.getElementById("group-floor_plan");

      if (e.target.value.includes("Residential")) {
        groupFloorPlan.classList.add("hide");
      } else {
        groupFloorPlan.classList.remove("hide");
      }
    }

    if (e.target.id === "predict-btn") {
      const type_ = document.getElementById("type_");
      const area = document.getElementById("area");
      const floor_plan = document.getElementById("floor_plan");

      const data = {
        type_: type_.value,
        area: area.value,
        floor_plan: floor_plan.value,
      };

      this.submitForm("post", this.predictEndpoint, data);
    }
  }

  async submitForm(method, endpoint, data) {
    axios({
      method: method,
      url: endpoint,
      data: data,
      headers: {
        "X-CSRFToken": this.token,
      },
    }).then(
      (response) => {
        this.modalBody.innerHTML = response.data;
        this.displayFields();
        this.getTable("get", this.resultsEndpoint);
      },
      (error) => {
        console.log(error.response.data);
      }
    );
  }

  displayFields() {
    const type_ = document.getElementById("type_");
    const groupFloorPlan = document.getElementById("group-floor_plan");

    if (type_ && type_.value.includes("Residential")) {
      groupFloorPlan.classList.add("hide");
    }
  }

  async getTable(method, endpoint) {
    axios({
      method: method,
      url: endpoint,
      headers: {
        "X-CSRFToken": this.token,
      },
    }).then(
      (response) => {
        this.resultsTable.innerHTML = response.data;
      },
      (error) => {
        console.log(error.response.data);
      }
    );
  }
}

class AboutModal {
  constructor() {
    this.navbar = document.getElementById("navbar");

    this.modal = document.getElementById("modal");
    this.modalTitle = document.getElementById("modal-title");
    this.modalBody = document.getElementById("modal-body");
    this.modalBtn = document.getElementById("modal-btn");

    this.aboutEndpoint = "/about";

    this.navbar.addEventListener("click", (e) => this.handleClick(e));
    this.modal.addEventListener("click", (e) => this.handleClick(e));
  }

  handleClick(e) {
    e.preventDefault();

    if (e.target.id === "nav-about") {
      this.modalBtn.click();
      this.modalTitle.innerText = "About";
      this.submitForm("get", this.aboutEndpoint);
    }

    if (e.target.className === "fab fa-github fa-2x") {
      window.open("https://github.com/ryikeda/yosoku", "_blank");
    }
    if (e.target.className === "fab fa-linkedin fa-2x") {
      window.open("https://www.linkedin.com/in/rafael-ikeda/", "_blank");
    }
    if (e.target.id === "api-img") {
      window.open("https://www.land.mlit.go.jp/webland/", "_blank");
    }
  }

  async submitForm(method, endpoint) {
    axios({
      method: method,
      url: endpoint,
    }).then(
      (response) => {
        this.modalBody.innerHTML = response.data;
      },
      (error) => {
        console.log(error.response.data);
      }
    );
  }
}
