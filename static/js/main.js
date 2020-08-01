import { AboutModal } from "./about.js";
import { LoginForm } from "./login.js";
import { LogoutForm } from "./logout.js";
import { SignupForm } from "./signup.js";
import { UserForm } from "./userform.js";
import { SearchForm } from "./search.js";
import { FilterForm } from "./filterForm.js";
import { ResultsTable } from "./results.js";

document.addEventListener("DOMContentLoaded", function () {
  new LoginForm();
  new LogoutForm();
  new SignupForm();
  new SearchForm();
  new ResultsTable();
  new FilterForm();
  new UserForm();
  new AboutModal();
});
