
const BASE_URL = "http://127.0.0.1:5000"

class SignupForm {
  constructor() {
    this.signupBtn = document.getElementById("signup-btn")
    this.navSignupBtn = document.getElementById("nav-signup")

    this.token = document.getElementById("csrf_token").value
    this.singupModal = document.getElementById("signup-modal")
    this.signupModalBody = document.getElementById("signup-modal-body")
    this.signupUsername = document.getElementById("signup_username")
    this.signupEmail = document.getElementById("signup_email")
    this.signupPassword = document.getElementById("signup_password")

    this.signupBtn.addEventListener("click", (e) => this.submitForm(e))
    this.navSignupBtn.addEventListener("click", () => this.loadForm())
  };

  async loadForm() {

    axios.get(BASE_URL.concat("/signup")).then((response) => {
      this.signupModalBody.innerHTML = response.data
      // this.handleResponse(response)
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
        this.handleResponse(response)

      }, (error) => {
        console.log(error);
      });
  }

  handleResponse(response) {
    if (response.status === 200) {
      this.signupModalBody.innerHTML = response.data
    } else {
      this.signupModalBody.innerHTML = "<p>User Created. Please login!</p>"

    }
  }
}

class LoginForm {
  constructor() {
    this.loginBtn = document.getElementById("login-btn")
    this.navLoginBtn = document.getElementById("nav-login")
    this.navSignupBtn = document.getElementById("nav-signup")
    this.navLogoutBtn = document.getElementById("nav-logout")

    this.loginModalBody = document.getElementById("login-modal-body")
    this.token = document.getElementById("csrf_token").value

    this.loginBtn.addEventListener("click", (e) => this.submitForm(e))
    this.navLoginBtn.addEventListener("click", () => this.loadForm())
  }

  async loadForm() {

    axios.get(BASE_URL.concat("/login")).then((response) => {
      this.loginModalBody.innerHTML = response.data

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
    this.token = document.getElementById("csrf_token")

    this.filterModalText = document.getElementById("filter-modal-text")
    this.filterModalBody = document.getElementById("filter-modal-body")
    this.filterBtn = document.getElementById("filter-btn")

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

  handleClick(e, city) {
    this.searchBox.value = `${city.name} - ${city.state}`;

    this.cityCode.value = city.id;
    this.cityName.value = `${city.name} - ${city.state}`;
    this.matchList.innerHTML = "";

    const data = {
      search: this.searchBox.value,
      city_code: this.cityCode.value,
      city_name: this.cityName.value
    }
    this.filterModalText = "";
    this.filterBtn.click()

    this.getFilterModal(data)
    this.searchBox.value = "";
  }

  async getFilterModal(data) {
    axios.post(BASE_URL, data,
      {
        headers: {
          'X-CSRFToken': this.token.value
        }
      }).then((response) => {
        this.filterModalBody.innerHTML = response.data
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


})