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
      },
      (error) => {
        console.log(error.response.data);
      }
    );
  }
}
export { SignupForm };
