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
      console.log(error);
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
        console.log(error);
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
      console.log(error);
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
        this.loginBtn = document.getElementById("login-btn")
        this.loginBtn.addEventListener("click", (e) => this.submitForm(e))
        this.navLoginBtn.classList.toggle("hide")
        this.navSignupBtn.classList.toggle("hide")
        this.navLogoutBtn.classList.toggle("hide")
        // this.handleResponse(response)

      }, (error) => {
        console.log(error);
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

    this.logoutBtn.addEventListener("click", () => this.submitForm())

  }

  async submitForm() {

    axios.get(BASE_URL.concat("/logout")).then((response) => {
      this.logoutModalBody.innerHTML = response.data
      this.navLoginBtn.classList.toggle("hide")
      this.navSignupBtn.classList.toggle("hide")
      this.navLogoutBtn.classList.toggle("hide")
    }, (error) => {
      console.log(error);
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
        console.log(error);
      });
  }

}

class ResultsTable {
  constructor() {
    this.resultsTable = document.getElementById("results-table")
    this.getTable()
  }

  async getTable() {

    await axios.get(BASE_URL.concat("/results")).then((response) => {
      this.resultsTable.innerHTML = response.data

    }, (error) => {
      console.log(error);
    });
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
      this.predictBtn.addEventListener("click", (e) => this.submitForm(e))

    }, (error) => {
      console.log(error);
    });

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
        console.log(response)


      }, (error) => {
        console.log(error);
      });
  }

}




document.addEventListener('DOMContentLoaded', function () {

  new SignupForm
  new LoginForm
  new SearchForm
  new LogoutForm
  new ResultsTable
  new FilterForm

})