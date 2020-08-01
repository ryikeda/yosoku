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
export { LoginForm };
