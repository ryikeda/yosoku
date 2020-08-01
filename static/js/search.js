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

export { SearchForm };
