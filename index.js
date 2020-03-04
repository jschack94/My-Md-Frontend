//variables

DOCTORS_ENDPOINT = "http://localhost:3000/doctors"
PATIENTS_ENDPOINT = "http://localhost:3000/patients"
APPOINTMENTS_ENDPOINT = "http://localhost:3000/appointments"

const appointmentList = document.querySelector(".appointment-list")
const appDetailPanel = document.querySelector(".appointment-detail-panel")
const doctorContainer = document.querySelector(".doctor-container")
const body = document.querySelector("body")
let doctorsData


//  defined functions

const fetchDoctorFromLogin = (event) => {
  event.preventDefault()

  const clicked = event.target
  const doctorEmail = clicked.children[2].value
    fetch(`${DOCTORS_ENDPOINT}`)
      .then(resp => resp.json())
      .then(doctors => {
        doctorsData = doctors
        doctorEmail
        const matchingDoc = doctorsData.filter(doctor => doctor.email === doctorEmail)
        const docId = parseInt(matchingDoc[0].id)
        fetch(`${DOCTORS_ENDPOINT}/${docId}`)
          .then(resp => resp.json())
          .then(doctor => renderDoctorHomeScreen(doctor))
          .catch(err => renderErrors(err))
      })
    }




const loginScreen = () => {
  const loginDiv = document.createElement("div")

  body.innerHTML = `<h1 class="display-1" style="font-size: 100px;" id="myMDLogo">myMD</h1><br><img style="float: right; margin-right: 100px;" class="medical-image" src="https://images.squarespace-cdn.com/content/v1/5908027c20099e374ad3d70e/1498497433363-9FIJ7FA1O2O1OMU760YE/ke17ZwdGBToddI8pDm48kEIuZxI6W46qNPE4tOwAgJl7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0k6sq9GEl9ZUDkp1sRKcAyLcGm_zFFSj8V81weFb6OmoAJ4fht0OgyKA20Hd2KoDYQ/symbol-of-caduceus.jpg?format=2500w" alt="medical-symbol"><div class="login" id="login">
    <form class="login-form" action="index.html" method="post">
      <label class="display-1" style="font-size: 50px;" for="login-form">Please Enter Email to Login</label><br>
      <input class="login-email" type="text" name="email" value="">
      <input class="login-submit" type="submit" name="Submit" value="Submit">
    </form>
  </div>`

  const loginForm = document.querySelector(".login-form")

  loginForm.addEventListener('submit', fetchDoctorFromLogin)

}

const createNewAppointment = (event) => {
  const clicked = event.target
  const doctorId = clicked.dataset.id
  fetch(`${DOCTORS_ENDPOINT}/${doctorId}`)
    .then(resp => resp.json())
    .then(doctor => populateAppointmentForm(clicked, doctor))
    .catch(err => renderErrors(err))
}

const populateAppointmentForm = (clicked, doctor) => {
  console.log(clicked)
    const appointments = document.querySelector('#appointment-list')
    const createAppForm = `<form class="create-appointment" action="index.html" method="post">
    </form>`
    // const patientSelect = document.createElement('select')
    // createAppForm.appendChild(patientSelect)
    // debugger
    // doctor.patients.forEach(patient => {
    //   const patientOption = `<option value="">${patient.full_name}</option>`
    // })
    // patientSelect.innerHTML += patientOption
    // appointments.innerHTML += createAppForm
}

const renderDoctorHomeScreen = (doctor) => {
  // console.log(doctor.appointments)
  // body.innerHTML = ""
  // const doctorDiv = document.createElement('div')
  // body.append(doctorDiv)
  // doctorDiv.dataset.id = doctor.id
  // doctorDiv.innerHTML = `<h1>Welcome Dr. ${doctor.last_name}</h1><img src="${doctor.image}" alt="doctor photo">
  //   <h3>Email: ${doctor.email}</h3>`
  // body.append(appointmentList)
  //   doctor.appointments.forEach(app => {
  //     appLI = `<li data-id="${app.id}">${app.stringified_date}</li>`
  //     appointmentList.innerHTML += appLI
  //   })
  body.innerHTML =
  `<div class="container" id="${doctor.id}">
    <h1 class="display-1" style="font-size: 100px; text-align:right;">myMD</h1>
    <h1 class="display-1" style="font-size: 40px;">Welcome Dr. ${doctor.last_name}</h1>

  <div class="row" style="font-size:20px;">
    <div class="col-sm-4" id="appointment-list"><h1>My Appointments</h1></div>
    <div class="col-sm-4" id="patient-info"><h1>Patient Info</h1></div>
    <div class="col-sm-4" id="appointment-info"><h1>Appointment Info</h1></div>
  </div>
</div>`

const appointments = document.querySelector('#appointment-list')
doctor.appointments.forEach(app => {
    const appLI = `<li data-id="${app.id}">${app.stringified_date}</li>`
    appointments.innerHTML += appLI
  })
  const createApp = `<button type="button" name="button" data-id="${doctor.id}" class="create-appointment">Create New Appointment</button>`
  appointments.innerHTML += createApp
  const createAppButton = document.querySelector(".create-appointment")

  createAppButton.addEventListener('click', createNewAppointment)

  appointments.addEventListener('click', renderDetailedAppointment)
}

const renderErrors = (err) => {
  appointmentList.innerHTML = `<h1>The following errors prevented the data from fetching. ${err}. Make sure rails server is running.`
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
  const appointmentInfoPanel = document.querySelector("#appointment-info")
  appointmentInfoPanel.dataset.id = appointment.id
  const apptDetail = `<h1>Appointment Details</h1>
    <h3>Date: ${appointment.stringified_date}</h3>
    <h3>Time: ${appointment.stringified_time}</h3>
    <form>
      <input type="text" rows="4" cols="50" name="diagnosis" placeholder="Enter Diagnosis" value="">
      <input type="text" rows="4" cols="50" name="directions" placeholder="Enter Directions For Patient" name="" value="">
      <input type="submit" name="Submit" value="Submit">
    </form>`

  appointmentInfoPanel.innerHTML = apptDetail

  // render one patient
  const patient = appointment.patient
  const patientInfoPanel = document.querySelector("#patient-info")


  const patientDetail = `<h1>Patient Details</h1><h1>${patient.full_name}</h1><img src="${patient.image}" alt="patient photo">
    <h2>Pre-existing Medical Conditions: ${patient.health_conditions}</h2>
    <h3>Age: ${patient.age} years</h3>
    <h3>Height: ${patient.height_string}</h3>
    <h3>Weight: ${patient.weight} pounds</h3>
    <h3>Email: ${patient.email}</h3>`
    patientInfoPanel.innerHTML = patientDetail

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

    fetch(`${APPOINTMENTS_ENDPOINT}/${patientId}`, reqObj)
    .then( resp => resp.json())
    .then( data => console.log(data))
    .catch( err => console.log(err))

  })
}

const fetchDoctors = () => {
  fetch(DOCTORS_ENDPOINT)
      .then(resp => resp.json())
      .then(doctors => renderDoctors(doctors))

}

const renderDoctors = (doctors) => {
  doctors.forEach(doctor => {

    const doctor_detail = `<div><h1><strong><span style="text-decoration: underline;">${doctor.full_name}</span></strong></span></h1><img src="${doctor.image}" alt="doctor photo">
    <h2>Specialty: ${doctor.specialty}</h2>
    <h3>Residency: ${doctor.residency}</h3>
    <h3>Bio: ${doctor.bio}</h3>
    <h3>Email: ${doctor.email}</h3>
    <button data-doctor-id="${doctor.id}" id="edit-bio">Edit Doctor Bio</button>
    </div>`



    doctorContainer.innerHTML += doctor_detail

  })


    doctorContainer.addEventListener("click", (e) => {
      if (e.target.innerText === "Edit Doctor Bio") {

      };
    })
  }
























//  event listeners
// appointments.addEventListener('click', renderDetailedAppointment)





//  invoked functions
loginScreen()
// fetchDoctors()
