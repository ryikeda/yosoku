const search = document.getElementById("search")
const matchList = document.getElementById("match-list")

// Search cities and states json file
const searchCity = async searchText => {
  const res = await fetch("/static/resources/states_and_cities.json")
  const cities = await res.json()
  console.log(cities.json)

  // Get matches 
  let matches = cities.filter(city => {

    const regex = new RegExp(`^${searchText}`, "gi")
    return
  })

}

search.addEventListener("input", () => searchCity(search.value))