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
export { LogoutForm };
