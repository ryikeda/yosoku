
document.addEventListener('DOMContentLoaded', function () {

  // Variables
  const searchForm = document.getElementById("search-form")
  const searchBox = document.getElementById("search")
  const cityCode = document.getElementById("city_code")
  const matchList = document.getElementById("match-list")
  const loadingIcon = document.getElementById("loading-icon")

  const filterForm = document.getElementById("filter-form")
  const filterFormSubmit = document.getElementById("filter-form-submit")
  const pricePrediction = document.getElementById("price-prediction")

  // Search cities and states json file
  const searchCity = async searchText => {
    const res = await fetch("/static/resources/all_cities.json")
    const cities = await res.json()

    // Get matches 
    let matches = cities.filter(city => {

      const regex = new RegExp(`^${searchText}`, "gi")
      return city.name.match(regex)
    })

    if (searchText.length === 0) {
      matches = [];
      matchList.innerHTML = ""
    }

    outputHtml(matches);
  }

  const outputHtml = matches => {
    if (matches.length === 0) return
    matchList.innerHTML = ""

    if (matches.length > 5) {
      const firstResults = matches.slice(0, 5)
      firstResults.forEach(city => {
        const link = document.createElement("a")
        link.href = "#"
        link.id = city.id
        link.innerText = `${city.name} - ${city.state}`
        link.className = "list-group-item list-group-item-action"

        const handler = e => handleClick(e, link, city)
        link.addEventListener("click", handler)
        matchList.appendChild(link)

      });

    } else {
      matches.forEach(city => {
        const link = document.createElement("a")
        link.href = "#"
        link.id = city.id
        link.innerText = `${city.name} - ${city.state}`
        link.className = "list-group-item list-group-item-action"

        const handler = e => handleClick(e, link, city)
        link.addEventListener("click", handler)
        matchList.appendChild(link)
      })
    }
  }
  // Event listeners

  searchBox.addEventListener("input", () => searchCity(searchBox.value))
  filterFormSubmit.addEventListener("submit", () => predictPrice(e))



  // Functions

  function handleClick(e, button, city) {
    searchBox.value = `${city.name} - ${city.state}`
    cityCode.value = city.id
    matchList.innerHTML = ""
    searchBox.classList.toggle("hide")
    loadingIcon.classList.toggle("hide")

    searchForm.submit()
  }

  function predictPrice() {
    e.preventDefault()
    console.dir(filterForm)

  }




});