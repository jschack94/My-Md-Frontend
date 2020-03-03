//  IMPORTANT COMMENTS ************
// in order to test the doctor homescreen, uncomment the fetchAppointments function call at bottom of file
//  IMPORTANT COMMENTS ************
// feel free to add more comments here!!! *****


//  defined variables

const APPOINTMENTS_ENDPOINT = "http://localhost:3000/appointments/"

const body = document.querySelector("body")
const appointmentList = document.querySelector(".appointment-list")
const appDetailPanel = document.querySelector(".appointment-detail-panel")




//  defined functions

const renderDoctorHomeScreen = (event) => {
  event.preventDefault()
  const clicked = event.target
  const doctorEmail = clicked.children[2].value
}

const loginScreen = () => {
  const loginDiv = document.createElement("div")

  body.innerHTML = `<h1 id="myMDLogo">myMD</h1><br><img style="float: right; margin-right: 100px;" class="medical-image" src="https://images.squarespace-cdn.com/content/v1/5908027c20099e374ad3d70e/1498497433363-9FIJ7FA1O2O1OMU760YE/ke17ZwdGBToddI8pDm48kEIuZxI6W46qNPE4tOwAgJl7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0k6sq9GEl9ZUDkp1sRKcAyLcGm_zFFSj8V81weFb6OmoAJ4fht0OgyKA20Hd2KoDYQ/symbol-of-caduceus.jpg?format=2500w" alt="medical-symbol"><div class="login" id="login">
    <form class="login-form" action="index.html" method="post">
      <label for="login-form">Please Enter Email to Login or Create New Account</label><br>
      <input class="login-email" type="text" name="email" value="">
      <input class="login-submit" type="submit" name="Submit" value="Submit">
    </form>
  </div>`

  const loginForm = document.querySelector(".login-form")

  loginForm.addEventListener('submit', renderDoctorHomeScreen)

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
    appLI = `<li data-id="${app.id}">${app.stringified_date} with ${app.patient.full_name} <button type="button" class="deletebtn">Delete Appointment</button></li>` // added delete button 
    appointmentList.innerHTML += appLI
  })
}

// delete appointment action
// function deleteAppointment(){

// }

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
      diagnosis: e.target[0].value,
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
