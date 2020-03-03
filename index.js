//variables

DOCTORS_ENDPOINT = "http://localhost:3000/doctors"
PATIENTS_ENDPOINT = "http://localhost:3000/patients"
APPOINTMENTS_ENDPOINT = "http://localhost:3000/appointments"

const appointmentList = document.querySelector(".appointment-list")
const appDetailPanel = document.querySelector(".appointment-detail-panel")
const doctorContainer = document.querySelector(".doctor-container")



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
        const docId = matchingDoc[0].id
        fetch(`${DOCTORS_ENDPOINT}/${docId}`)
          .then(resp => resp.json())
          .then(doctor => renderDoctorHomeScreen(doctor))
          .catch(err => renderErrors(err))
      })
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

  loginForm.addEventListener('submit', fetchDoctorFromLogin)

}

const renderDoctorHomeScreen = (doctor) => {
  console.log(doctor.appointments)
  body.innerHTML = ""
  body.append(appointmentList)
    doctor.appointments.forEach(app => {
      appLI = `<li data-id="${app.id}">${app.stringified_date}</li>`
      appointmentList.innerHTML += appLI
    })
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
  body.append(appDetailPanel)
  appDetailPanel.dataset.id = appointment.id
  const appt_detail = `<h1>${appointment.patient.full_name}</h1><img src="${appointment.patient.image}" alt="patient photo">
    <h2>Pre-existing Medical Conditions: ${appointment.patient.health_conditions}</h2>
    <h3>Age: ${appointment.patient.age} years</h3>
    <h3>Height: ${appointment.patient.height_string}</h3>
    <h3>Weight: ${appointment.patient.weight} pounds</h3>
    <h3>Email: ${appointment.patient.email}</h3>
    <form>
      <input type="textarea" rows="4" cols="50" name="diagnosis" placeholder="Enter Diagnosis" value="">
      <input type="textarea" rows="4" cols="50" name="directions" placeholder="Enter Directions For Patient" name="" value="">
      <input type="submit" name="Submit" value="Submit">
    </form>`
  appDetailPanel.innerHTML = appt_detail
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
appointmentList.addEventListener('click', renderDetailedAppointment)






//  invoked functions
//loginScreen()
fetchDoctors()
