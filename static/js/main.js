import {
  LoginForm, LogoutForm, SignupForm, SearchForm, ResultsTable, FilterForm, UserForm
} from "./classes.js"

document.addEventListener('DOMContentLoaded', function () {

  new LoginForm()
  new LogoutForm()
  new SignupForm()
  new SearchForm()
  new ResultsTable()
  new FilterForm()
  new UserForm()

})

