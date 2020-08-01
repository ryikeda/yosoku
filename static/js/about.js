class AboutModal {
  constructor() {
    this.navbar = document.getElementById("navbar");

    this.modal = document.getElementById("modal");
    this.modalTitle = document.getElementById("modal-title");
    this.modalBody = document.getElementById("modal-body");
    this.modalBtn = document.getElementById("modal-btn");

    this.aboutEndpoint = "/about";

    this.navbar.addEventListener("click", (e) => this.handleClick(e));
    this.modal.addEventListener("click", (e) => this.handleClick(e));
  }

  handleClick(e) {
    e.preventDefault();

    if (e.target.id === "nav-about") {
      this.modalBtn.click();
      this.modalTitle.innerText = "About";
      this.submitForm("get", this.aboutEndpoint);
    }

    if (e.target.className === "fab fa-github fa-2x") {
      window.open("https://github.com/ryikeda/yosoku", "_blank");
    }
    if (e.target.className === "fab fa-linkedin fa-2x") {
      window.open("https://www.linkedin.com/in/rafael-ikeda/", "_blank");
    }
    if (e.target.id === "api-img") {
      window.open("https://www.land.mlit.go.jp/webland/", "_blank");
    }
  }

  submitForm(method, endpoint) {
    axios({
      method: method,
      url: endpoint,
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
export { AboutModal };
