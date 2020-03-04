// //variables
//
// DOCTORS_ENDPOINT = "http://localhost:3000/doctors"
// PATIENTS_ENDPOINT = "http://localhost:3000/patients"
// APPOINTMENTS_ENDPOINT = "http://localhost:3000/appointments"
//
// const appointmentList = document.querySelector(".appointment-list")
// const appDetailPanel = document.querySelector(".appointment-detail-panel")
// const doctorContainer = document.querySelector(".doctor-container")
// const body = document.querySelector("body")
// let doctorsData
//
//
// //  defined functions
//
// const fetchDoctorFromLogin = (event) => {
//   event.preventDefault()
//
//   const clicked = event.target
//   const doctorEmail = clicked.children[2].value
//     fetch(`${DOCTORS_ENDPOINT}`)
//       .then(resp => resp.json())
//       .then(doctors => {
//         doctorsData = doctors
//         doctorEmail
//         const matchingDoc = doctorsData.filter(doctor => doctor.email === doctorEmail)
//         const docId = parseInt(matchingDoc[0].id)
//         fetch(`${DOCTORS_ENDPOINT}/${docId}`)
//           .then(resp => resp.json())
//           .then(doctor => renderDoctorHomeScreen(doctor))
//           .catch(err => renderErrors(err))
//       })
//     }
//
//
//
//
// const loginScreen = () => {
//   const loginDiv = document.createElement("div")
//   body.innerHTML = `<div class="bg"></div> <h1 id="myMDLogo">myMD</h1><br><img style="float: right; margin-: 100px;" class="medical-image" src="https://lh3.googleusercontent.com/proxy/PX0WUR0sjR0yStrVaTa_rkeNzrhePCccKGyIyUjX9TNRhxkAqbF4AQMD5t_fAWAPs99F8W2kQKmj3Th8pshCvF53uU1tOngQVOQldgvxt-rsn3Ukc_GAeR8ZB1uNZfs37Zs_hRUJ3vW35-4nte4WHQlI8jk0" alt="medical-symbol"><div class="login" id="login">
//     <form class="login-form" action="index.html" method="post">
//       <label for="login-form">Please Enter Email to Login</label><br>
//       <input class="login-email" type="text" name="email" value="">
//       <input class="login-submit" type="submit" name="Submit" value="Submit">
//       </form>
//   </div>`
//   const loginForm = document.querySelector(".login-form")
//   loginForm.addEventListener('submit', fetchDoctorFromLogin)
// }
//
// const createNewAppointment = (event) => {
//   const clicked = event.target
//   const doctorId = clicked.dataset.id
//   fetch(`${DOCTORS_ENDPOINT}/${doctorId}`)
//     .then(resp => resp.json())
//     .then(doctor => populateAppointmentForm(clicked, doctor))
//     .catch(err => renderErrors(err))
// }
//
// const postNewAppointment = (event) => {
//   event.preventDefault()
//   console.log("POST NEW APP", event.target)
//   const dropDown = document.getElementById("patient-dropdown");
//   const patientId = parseInt(dropDown.options[dropDown.selectedIndex].dataset.id)
//
//   const date = event.target.children[2].value
//   const time = event.target.children[3].value
//   const doctorId = parseInt(event.target.dataset.id)
//   debugger
//   fetch(APPOINTMENTS_ENDPOINT, postAppObj())
// }
//
// const populateAppointmentForm = (clicked, doctor) => {
//   console.log("POPULATE APPOINTMENT FORM", clicked)
//     const appointments = document.querySelector('#appointment-list')
//     appointments.innerHTML = ""
//     const createAppForm = document.createElement('form')
//     const label = document.createElement('label')
//     const select = document.createElement('select')
//     select.id = "patient-dropdown"
//     label.innerText = "Create New Appointment"
//     appointments.appendChild(createAppForm)
//     createAppForm.className = "create-appointment"
//     createAppForm.dataset.id = doctor.id
//     createAppForm.append(label)
//     createAppForm.append(select)
//
//     doctor.patients.forEach(patient => {
//       const patientOption = `<option data-id=${patient.id}" selected="" value="">${patient.full_name}</option>`
//       select.innerHTML += patientOption
//     })
//     const date = document.createElement('input')
//     const time = document.createElement('input')
//     const submitButton = document.createElement('button')
//     submitButton.type = "submit"
//     submitButton.innerText = "Submit"
//     date.type = "date"
//     time.type = "time"
//     createAppForm.append(date)
//     createAppForm.append(time)
//     createAppForm.append(submitButton)
//     createAppForm.addEventListener('submit', postNewAppointment)
// }
//
// const renderDoctorHomeScreen = (doctor) => {
//   console.log(doctor.appointments)
//   body.innerHTML = ""
//   const doctorDiv = document.createElement('div')
//   doctorDiv.dataset.id = doctor.id
//   var d = new Date();
//   doctorDiv.innerHTML =
//   `<div id="mySidebar" class="sidebar" style="background-color:rgb(240, 240, 240);>
//   <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">×</a>
//   <h2>Dr. ${doctor.full_name} </h2> <p> <img src="${doctor.image}" alt="doctor photo" > </p>
//   <h3>Specialty: </h3> <p> ${doctor.specialty}</p>
//   <h3>Bio: </h3> <p> ${doctor.bio}</p>
//   <h3>Residency </h3> <p> ${doctor.residency}</p>
//   <h3>Email: </h3> <p> ${doctor.email}</p>
// </div>
// <div class="bg" id="time"><h1><h1>Welcome Dr. ${doctor.last_name} </h1><h4> Today is: ${d} </h4></div>
// <div id="main">
//   <button class="openbtn" onclick="openNav()">☰ Open Doctor Profile</button>
// </div>
// <div class="container">
// <div class="alert alert-success alert-dismissible fade show">
//   <button type="button" class="close" data-dismiss="alert">&times;</button>
//   <strong>Success!</strong> You have successfully logged in.
// </div>`
// body.append(doctorDiv)
// const welcomeDiv = document.createElement('div')
// welcomeDiv.innerHTML =
// `<h2> </h2>
// </div>`
// body.append(welcomeDiv)
//   body.append(appointmentList)
//     doctor.appointments.forEach(app => {
//       appLI = `<li data-id="${app.id}">${app.stringified_date}</li>`
//       appointmentList.innerHTML += appLI
//     })
// }
// const renderErrors = (err) => {
//   appointmentList.innerHTML = `<h1>The following errors prevented the data from fetching. ${err}. Make sure rails server is running.`
// }
//
// const renderDetailedAppointment = (event) => {
//   if (event.target.tagName === "LI") {
//     console.log("IM AN LI", event.target)
//     clicked = event.target
//     const appointmentId = event.target.dataset.id
//     fetch(`${APPOINTMENTS_ENDPOINT}/${appointmentId}`)
//       .then(resp => resp.json())
//       .then(appointment => renderOneAppointment(appointment))
//       .catch(err => console.log(err))
//   }
// }
//
// const renderOneAppointment = (appointment) => {
//   console.log("APPT", appointment)
//   body.append(appDetailPanel)
//   appDetailPanel.dataset.id = appointment.id
//   const appt_detail = `<h1>${appointment.patient.full_name}</h1><img src="${appointment.patient.image}" alt="patient photo">
//     <h2>Pre-existing Medical Conditions: ${appointment.patient.health_conditions}</h2>
//     <h3>Age: ${appointment.patient.age} years</h3>
//     <h3>Height: ${appointment.patient.height_string}</h3>
//     <h3>Weight: ${appointment.patient.weight} pounds</h3>
//     <h3>Email: ${appointment.patient.email}</h3>
//     <form>
//       <input type="text" rows="4" cols="50" name="diagnosis" placeholder="Enter Diagnosis" value="">
//       <input type="text" rows="4" cols="50" name="directions" placeholder="Enter Directions For Patient" name="" value="">
//       <input type="submit" name="Submit" value="Submit">
//     </form>`
//   appDetailPanel.innerHTML = appt_detail
//   const formContainer = document.querySelector("form")
//   formContainer.addEventListener('submit', function(e){
//     e.preventDefault()
//     const formData = {
//       diagnosis: e.target[0].value,
//       directions: e.target[1].value
//     }
//     console.log(formData)
//     e.target.reset()
//     const reqObj = {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//         "Accept": "application/json"
//       },
//       body: JSON.stringify(formData)
//     }
//     const patientId = e.target.parentElement.dataset.id
//     fetch(`${APPOINTMENTS_ENDPOINT}${patientId}`, reqObj)
//     .then( resp => resp.json())
//     .then( data => console.log(data))
//     .catch( err => console.log(err))
//   })
// }
// //  event listeners
// appointmentList.addEventListener('click', renderDetailedAppointment)
// //  invoked functions
// loginScreen()
