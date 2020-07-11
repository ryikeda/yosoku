document.addEventListener('DOMContentLoaded', function () {

  const filterForm = document.getElementById("filter-form")
  const token = document.getElementById("csrf_token")
  const type_ = document.getElementById("type_")
  const area = document.getElementById("area")
  const floorPlan = document.getElementById("floor_plan")


  filterForm.addEventListener("submit", e => handleForm(e))

  const handleForm = e => {
    e.preventDefault()

    const data = {
      type_: type_.value,
      area: area.value,
      floor_plan: floorPlan.value
    }

    predictPrice(data)
  }

  async function predictPrice(data) {

    axios.post('http://127.0.0.1:5000/predict', data,
      {
        headers: {
          'X-CSRFToken': token.value
        }
      }).then((response) => {
        console.log(response);
      }, (error) => {
        console.log(error);
      });
  }

});