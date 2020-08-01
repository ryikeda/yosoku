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
export { ResultsTable };
