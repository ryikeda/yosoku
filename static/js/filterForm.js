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
export { FilterForm };
