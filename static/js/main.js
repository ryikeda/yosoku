const BASE_URL = "http://127.0.0.1:5000"

class SignupForm {
  constructor() {
    this.navSignupBtn = document.getElementById("nav-signup")

    this.token = document.getElementById("csrf_token").value
    this.singupModal = document.getElementById("signup-modal")
    this.signupModalBody = document.getElementById("signup-modal-body")
    this.signupUsername = document.getElementById("signup_username")
    this.signupEmail = document.getElementById("signup_email")
    this.signupPassword = document.getElementById("signup_password")


    this.navSignupBtn.addEventListener("click", () => this.loadForm())
  };

  async loadForm() {

    axios.get(BASE_URL.concat("/signup")).then((response) => {
      this.signupModalBody.innerHTML = response.data
      this.signupBtn = document.getElementById("signup-btn")
      this.signupBtn.addEventListener("click", (e) => this.submitForm(e))
    }, (error) => {
      console.log(error.response.data);
    });


  }

  async submitForm(e) {
    e.preventDefault();

    const data = {
      signup_username: signup_username.value,
      signup_email: signup_email.value,
      signup_password: signup_password.value
    }

    axios.post(BASE_URL.concat("/signup"), data,
      {
        headers: {
          'X-CSRFToken': this.token
        }
      }).then((response) => {
        this.signupModalBody.innerHTML = response.data
        this.signupBtn = document.getElementById("signup-btn")
        this.signupBtn.addEventListener("click", (e) => this.submitForm(e))

      }, (error) => {
        console.log(error.response.data);
      });
  }


}

class LoginForm {
  constructor() {

    this.navLoginBtn = document.getElementById("nav-login")
    this.navSignupBtn = document.getElementById("nav-signup")
    this.navLogoutBtn = document.getElementById("nav-logout")

    this.loginModalBody = document.getElementById("login-modal-body")
    this.token = document.getElementById("csrf_token").value

    this.navLoginBtn.addEventListener("click", () => this.loadForm())
  }

  async loadForm() {

    axios.get(BASE_URL.concat("/login")).then((response) => {
      this.loginModalBody.innerHTML = response.data
      this.loginBtn = document.getElementById("login-btn")
      this.loginBtn.addEventListener("click", (e) => this.submitForm(e))

    }, (error) => {
      console.log(error.response.data);
    });
  }
  async submitForm(e) {
    e.preventDefault();

    const data = {
      login_username: login_username.value,
      login_password: login_password.value
    }

    axios.post(BASE_URL.concat("/login"), data,
      {
        headers: {
          'X-CSRFToken': this.token
        }
      }).then((response) => {
        this.loginModalBody.innerHTML = response.data

        if (response.data.includes("Hello,")) {
          setTimeout(() => location.reload(), 1000);
        } else {
          this.loginBtn = document.getElementById("login-btn")
          this.loginBtn.addEventListener("click", (e) => this.submitForm(e))
        }

      }, (error) => {
        console.log(error.response.data);
      });
  }

}

class LogoutForm {
  constructor() {
    this.logoutBtn = document.getElementById("logout-btn")
    this.navLoginBtn = document.getElementById("nav-login")
    this.navSignupBtn = document.getElementById("nav-signup")
    this.navLogoutBtn = document.getElementById("nav-logout")
    this.logoutModalBody = document.getElementById("logout-modal-body")
    this.token = document.getElementById("csrf_token").value

    this.navLogoutBtn.addEventListener("click", () => this.loadForm())

  }

  async loadForm() {

    axios.get(BASE_URL.concat("/logout")).then((response) => {
      this.logoutModalBody.innerHTML = response.data
      this.logoutBtn = document.getElementById("logout-btn")

      this.logoutBtn.addEventListener("click", (e) => this.submitForm(e))

    }, (error) => {
      console.log(error.response.data);
    });
  }

  async submitForm(e) {
    e.preventDefault();

    const data = ""

    axios.post(BASE_URL.concat("/logout"), data,
      {
        headers: {
          'X-CSRFToken': this.token
        }
      }).then((response) => {
        this.logoutModalBody.innerHTML = response.data
        setTimeout(() => location.reload(), 1000);

      }, (error) => {
        console.log(error.response.data);
      });
  }

}


class SearchForm {
  constructor() {
    this.searchForm = document.getElementById("search-form")
    this.searchBox = document.getElementById("search")
    this.cityCode = document.getElementById("city_code")
    this.cityName = document.getElementById("city_name")
    this.matchList = document.getElementById("match-list")
    this.token = document.getElementById("csrf_token").value

    this.filterBtn = document.getElementById("filter-btn")
    this.loadingModalBtn = document.getElementById("loading-modal-btn")
    this.loadingModal = document.getElementById("loading-modal")

    this.map = document.getElementById("map")

    this.searchBox.addEventListener("input", () => this.searchCity(this.searchBox.value))
  }


  async searchCity(cityName) {
    const res = await fetch("/static/resources/all_cities.json")
    const cities = await res.json()

    // get matches

    let matches = cities.filter(city => {

      const regex = new RegExp(`^${cityName}`, "gi")
      return city.name.match(regex)
    })

    if (cityName.length === 0) {
      matches = [];
      this.matchList.innerHTML = ""
    }

    this.outputHtml(matches);

  }
  outputHtml(matches) {
    if (matches.length === 0) return
    this.matchList.innerHTML = ""



    if (matches.length > 5) {
      const firstResults = matches.slice(0, 5)
      firstResults.forEach(city => {
        const link = document.createElement("a")
        link.href = "#"
        link.id = city.id
        link.innerText = `${city.name} - ${city.state}`
        link.className = "list-group-item list-group-item-action"

        const handler = e => this.handleClick(e, city)
        link.addEventListener("click", handler)
        this.matchList.appendChild(link)

      });

    } else {
      matches.forEach(city => {
        const link = document.createElement("a")
        link.href = "#"
        link.id = city.id
        link.innerText = `${city.name} - ${city.state}`
        link.className = "list-group-item list-group-item-action "

        const handler = e => this.handleClick(e, city)
        link.addEventListener("click", handler)
        this.matchList.appendChild(link)
      })
    }
  }

  async handleClick(e, city) {
    e.preventDefault()
    this.searchBox.value = `${city.name} - ${city.state}`;

    this.cityCode.value = city.id;
    this.cityName.value = `${city.name} - ${city.state}`;
    this.matchList.innerHTML = "";
    this.map.src = `https://www.google.com/maps/embed/v1/place?key=AIzaSyA0s1a7phLN0iaD6-UE7m4qP-z21pH0eSc&q=${city.name}`

    const data = {
      search: this.searchBox.value,
      city_code: this.cityCode.value,
      city_name: this.cityName.value
    }
    this.loadingModalBtn.click()
    this.searchBox.value = "";
    setTimeout(() => this.submitForm(data), 3000);

  }

  async submitForm(data) {

    axios.post(BASE_URL, data,
      {
        headers: {
          'X-CSRFToken': this.token
        }
      }).then((response) => {
        this.loadingModalBtn.click()
        this.filterBtn.click()
      }, (error) => {
        console.log(error.response.data);
      });
  }

}

class ResultsTable {
  constructor() {
    this.resultsTable = document.getElementById("results-table")

    this.modal = document.getElementById("modal")
    this.modalTitle = document.getElementById("modal-title")
    this.modalBody = document.getElementById("modal-body")
    this.modalBtn = document.getElementById("modal-btn")

    this.deleteEndPoint = "/delete/query"
    this.editEndPoint = "/edit/query"

    this.token = document.getElementById("csrf_token").value
    this.getTable()


    this.resultsTable.addEventListener("click", (e) => this.handleClick(e))
    this.modal.addEventListener("click", (e) => this.handleClick(e))
  }

  async getTable() {

    axios({
      method: "get",
      url: BASE_URL.concat("/results"),
      headers: {
        'X-CSRFToken': this.token
      }
    }).then((response) => {
      this.resultsTable.innerHTML = response.data
    }, (error) => {
      console.log(error.response.data);
    })
  }

  async handleClick(e) {
    e.preventDefault()

    // Delete query
    if (e.target.className === "fas fa-trash-alt") {
      this.tr = e.target.parentElement.parentElement
      console.dir(this.modal)
      this.modalTitle.innerText = "Delete Query"
      this.modalBtn.click()

      this.submitForm("get", this.deleteEndPoint)
    }

    if (e.target.id === "delete-query-btn") {
      const data = { queryId: this.tr.dataset.queryId }
      this.submitForm("post", this.deleteEndPoint, data)
    }

    // Edit comment
    if (e.target.className === "fas fa-edit") {
      this.tr = e.target.parentElement.parentElement
      this.modalTitle.innerText = "Edit Comment"
      this.modalBtn.click()
      this.submitForm("get", this.editEndPoint)
    }

    if (e.target.id === "edit-query-btn") {
      const commentBox = document.getElementById("comment")
      const data = { queryId: this.tr.dataset.queryId, comment: commentBox.value }
      this.submitForm("post", this.editEndPoint, data)
    }

  }


  async submitForm(method, endpoint, data) {

    axios({
      method: method,
      url: BASE_URL.concat(endpoint),
      data: data,
      headers: {
        'X-CSRFToken': this.token
      }
    }).then((response) => {
      this.modalBody.innerHTML = response.data
      if (method === "post") {
        this.getTable()
      }
    }, (error) => {
      console.log(error.response.data);
    })
  }
}

class FilterForm {
  constructor() {
    this.filterBtn = document.getElementById("filter-btn")
    this.filterModalBody = document.getElementById("filter-modal-body")

    this.type_ = document.getElementById("type_")
    this.area = document.getElementById("area")
    this.floor_plan = document.getElementById("floor_plan")
    this.token = document.getElementById("csrf_token").value

    this.filterBtn.addEventListener("click", () => this.loadForm())

  }

  async loadForm() {

    axios.get(BASE_URL.concat("/filters")).then((response) => {

      this.filterModalBody.innerHTML = response.data

      this.predictBtn = document.getElementById("predict-btn")
      this.type_ = document.getElementById("type_")
      this.displayFields()
      this.predictBtn.addEventListener("click", (e) => this.submitForm(e))
      this.type_.addEventListener("click", () => this.displayFields())

    }, (error) => {
      console.log(error);
    });

  }

  displayFields() {
    const groupFloorPlan = document.getElementById("group-floor_plan")

    if (this.type_.value.includes("Residential")) {
      groupFloorPlan.classList.add("hide")
    } else {
      groupFloorPlan.classList.remove("hide")
    }

  }

  async submitForm(e) {
    e.preventDefault();

    const data = {
      type_: type_.value,
      area: area.value,
      floor_plan: floor_plan.value,
    }

    axios.post(BASE_URL.concat("/predict"), data,
      {
        headers: {
          'X-CSRFToken': this.token
        }
      }).then((response) => {
        this.filterModalBody.innerHTML = response.data
        this.predictBtn = document.getElementById("predict-btn")
        this.displayFields()
        this.type_ = document.getElementById("type_")
        this.type_.addEventListener("click", () => this.displayFields())



        if (this.predictBtn) {
          this.predictBtn.addEventListener("click", (e) => this.submitForm(e))
        }

      }, (error) => {
        console.log(error);
      });
  }

}

document.addEventListener('DOMContentLoaded', function () {

  const logout = document.getElementById("nav-logout")
  if (logout) {
    new LogoutForm()
  } else {
    new SignupForm()
    new LoginForm()
  }

  new SearchForm()
  new ResultsTable()
  new FilterForm()

})

