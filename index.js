//  IMPORTANT COMMENTS ************
// in order to test the doctor homescreen, uncomment the fetchAppointments function call at bottom of file
//  IMPORTANT COMMENTS ************
// feel free to add more comments here!!! *****


//  defined variables

const APPOINTMENTS_ENDPOINT = "http://localhost:3000/appointments/"

const appointmentList = document.querySelector(".appointment-list")
const appDetailPanel = document.querySelector(".appointment-detail-panel")




//  defined functions

const loginScreen = () => {
  const loginDiv = document.createElement("div")
  loginDiv.innerHTML = "TEST"
}

const fetchAppointments = () => {
    fetch(APPOINTMENTS_ENDPOINT)
        .then(resp => resp.json())
        .then(appointments => renderAppointments(appointments))
        .catch(err => renderErrors(err))
}

const renderErrors = (err) => {
  appointmentList.innerHTML = `<h1>The following errors prevented the data from fetching. ${err}. Make sure rails server is running.`
}

const renderAppointments = (appointments) => {
  console.log("HI", appointments)
  appointments.forEach(app => {
    appLI = `<li data-id="${app.id}">${app.stringified_date} with ${app.patient.full_name}</li>`
    appointmentList.innerHTML += appLI
  })
}

const renderDetailedAppointment = (event) => {

  if (event.target.tagName === "LI") {
    console.log("IM AN LI", event.target)
    clicked = event.target
    const appointmentId = event.target.dataset.id
    fetch(`${APPOINTMENTS_ENDPOINT}/${appointmentId}`)
      .then(resp => resp.json())
      .then(appointment => renderOneAppointment(appointment))
      .catch(err => console.log(err))
  }
}

const renderOneAppointment = (appointment) => {
  console.log("APPT", appointment)
  appDetailPanel.dataset.id = appointment.id
  const appt_detail = `<h1>${appointment.patient.full_name}</h1><img src="${appointment.patient.image}" alt="patient photo">
    <h2>Pre-existing Medical Conditions: ${appointment.patient.health_conditions}</h2>
    <h3>Age: ${appointment.patient.age} years</h3>
    <h3>Height: ${appointment.patient.height_string}</h3>
    <h3>Weight: ${appointment.patient.weight} pounds</h3>
    <h3>Email: ${appointment.patient.email}</h3>
    <form>
      <input type="text" rows="4" cols="50" name="diagnosis" placeholder="Enter Diagnosis" value="">
      <input type="text" rows="4" cols="50" name="directions" placeholder="Enter Directions For Patient" name="" value="">
      <input type="submit" name="Submit" value="Submit">
    </form>`
  appDetailPanel.innerHTML = appt_detail

  const formContainer = document.querySelector("form")

  formContainer.addEventListener('submit', function(e){
    e.preventDefault()
    const formData = {
      diagonsis: e.target[0].value,
      directions: e.target[1].value
    }
    
    console.log(formData)
    e.target.reset()

    const reqObj = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(formData)
    }

    const patientId = e.target.parentElement.dataset.id

    fetch(`${APPOINTMENTS_ENDPOINT}${patientId}`, reqObj)
    .then( resp => resp.json())
    .then( data => console.log(data))
    .catch( err => console.log(err))

  })
}












//  event listeners
appointmentList.addEventListener('click', renderDetailedAppointment)





//  invoked functions
fetchAppointments()
// loginScreen()
