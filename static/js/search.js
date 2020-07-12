
document.addEventListener('DOMContentLoaded', function () {

  // Variables
  const searchForm = document.getElementById("search-form")
  const searchBox = document.getElementById("search")
  const cityCode = document.getElementById("city_code")
  const matchList = document.getElementById("match-list")
  const loadingIcon = document.getElementById("loading-icon")
  const token = document.getElementById("csrf_token")
  const filterModalBody = document.getElementById("filter-modal-body")
  const filterModalText = document.getElementById("filter-modal-text")
  const filterBtn = document.getElementById("filter-btn")

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

        const handler = e => handleClick(e, city)
        link.addEventListener("click", handler)
        matchList.appendChild(link)

      });

    } else {
      matches.forEach(city => {
        const link = document.createElement("a")
        link.href = "#"
        link.id = city.id
        link.innerText = `${city.name} - ${city.state}`
        link.className = "list-group-item list-group-item-action "

        const handler = e => handleClick(e, city)
        link.addEventListener("click", handler)
        matchList.appendChild(link)
      })
    }
  }
  // Event listeners

  searchBox.addEventListener("input", () => searchCity(searchBox.value))
  getResultsTable()

  // Functions

  function handleClick(e, city) {
    searchBox.value = `${city.name} - ${city.state}`
    cityCode.value = city.id
    matchList.innerHTML = ""

    const data = {
      search: searchBox.value,
      city_code: cityCode.value,
    }
    // searchBox.classList.toggle("hide")
    // loadingIcon.classList.toggle("hide")
    // searchForm.submit()
    filterModalText.classList.toggle("hide")
    filterBtn.click()
    getModel(data)

  }

  async function getModel(data) {

    axios.post('http://127.0.0.1:5000', data,
      {
        headers: {
          'X-CSRFToken': token.value
        }
      }).then((response) => {
        filterModalBody.innerHTML = response.data
      }, (error) => {
        console.log(error);
      });
  }

  async function getResultsTable() {




  }


});