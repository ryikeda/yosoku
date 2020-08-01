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

  submitForm(method, endpoint, data) {
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
export { UserForm };
