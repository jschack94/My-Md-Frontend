DOCTORS_ENDPOINT = "http://localhost:3000/doctors"
PATIENTS_ENDPOINT = "http://localhost:3000/patients"
APPOINTMENTS_ENDPOINT = "http://localhost:3000/appointments"
const appointmentList = document.querySelector(".appointment-list")
const appDetailPanel = document.querySelector(".appointment-detail-panel")
const doctorContainer = document.querySelector(".doctor-container")
const body = document.querySelector("body")
const footer = document.querySelector(".footer")
let doctorsData
let editDoctor = true

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
  body.innerHTML = `<div class="bg"></div> <h1 id="myMDLogo">myMD</h1><br><img style="float: right; margin-: 100px;" class="medical-image" src="https://lh3.googleusercontent.com/proxy/BxPHZgDtikExm_mDhA3yCuDIH3htNAm633lxZ35G4DqNiNhyM-9Wve7A4DmojwBRqLwSUXJ57HQM9Y22OHfEPhfSOSy-pn0" alt="medical-symbol"><div class="login" id="login">
    <form class="login-form" action="index.html" method="post">
      <label for="login-form"> <strong> <p> Manage Your Appointments </p> <p> Find Your Patients </p> <p> Access Your Results  </p>  </strong> <p> Please Enter Email to Login </p> </label><br>
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

const postAppObj = (patientId, date, time, doctorId) => {
  return {
    method: "POST",
    headers: {
      "Content-Type":"application/json",
      "Accept":"application/json"
    },
    body: JSON.stringify({
      patient_id: patientId,
      doctor_id: doctorId,
      date: date,
      time: time
    })
  }
}

const postNewAppointment = (event) => {
  event.preventDefault()
  console.log("POST NEW APP", event.target)
  const dropDown = document.getElementById("patient-dropdown");
  const patientId = parseInt(dropDown.options[dropDown.selectedIndex].dataset.id)
  const date = event.target.children[2].value
  const time = event.target.children[3].value
  const doctorId = parseInt(event.target.dataset.id)
  // make time string the right format to send to back end.
  //  double check the format for the request object.
  fetch(APPOINTMENTS_ENDPOINT, postAppObj(patientId, date, time, doctorId))
    .then(resp => resp.json())
    .then(newApp => renderNewAppointment(newApp))
    .catch(err => renderErrors(err))
}

const renderNewAppointment = (newApp) => {
  console.log("NEWAPP", newApp)
}

const populateAppointmentForm = (clicked, doctor) => {
  console.log("POPULATE APPOINTMENT FORM", clicked)
    const appointments = document.querySelector('#appointment-list')
    appointments.innerHTML = ""
    const createAppForm = document.createElement('form')
    const label = document.createElement('label')
    const select = document.createElement('select')
    select.id = "patient-dropdown"
    label.innerText = "Create New Appointment"
    appointments.appendChild(createAppForm)
    createAppForm.className = "create-appointment"
    createAppForm.dataset.id = doctor.id
    createAppForm.append(label)
    createAppForm.append(select)
    doctor.patients.forEach(patient => {
      const patientOption = `<option data-id=${patient.id}" selected="" value="">${patient.full_name}</option>`
      select.innerHTML += patientOption
    })
    const date = document.createElement('input')
    const time = document.createElement('input')
    const submitButton = document.createElement('button')
    submitButton.type = "submit"
    submitButton.innerText = "Submit"
    date.type = "date"
    time.type = "time"
    createAppForm.append(date)
    createAppForm.append(time)
    createAppForm.append(submitButton)
    createAppForm.addEventListener('submit', postNewAppointment)
}
const renderDoctorHomeScreen = (doctor) => {
  var d = new Date();
  console.log("RENDERHOMESCREEN", doctor)
  body.innerHTML =
  `<div class="container" id="${doctor.id}">
  <div class="alert alert-success alert-dismissible fade show">
  <button type="button" class="close" data-dismiss="alert">&times;</button>
  <strong>Success!</strong> You have successfully logged in.
  </div>
  <div id="main">
  <h1 id="rcorners1" class="display-1" style="font-size: 100px; text-align:right;">myMD</h1>
  <div class="bg" id="time"><h1><h1>Welcome Dr. ${doctor.last_name} <p> <h3> Todays date is: ${d} </h3> </div>
<button class="openbtn" onclick="openNav()">☰ Open Doctor Profile</button>
<div id="mySidebar" class="sidebar" style="background-color:rgb(240, 240, 240);>
<a href="javascript:void(0)" class="closebtn" onclick="closeNav()">×</a>
<h2>Dr. ${doctor.full_name} </h2> <p> <img src="${doctor.image}" alt="doctor photo" > </p>
<h3>Specialty: </h3> <p> ${doctor.specialty}</p>
<h3>Bio: </h3> <p> ${doctor.bio}</p>
<h3>Residency </h3> <p> ${doctor.residency}</p>
<h3>Email: </h3> <p> ${doctor.email}</p>
</div>

</div>
<div class="containers"> <p>
<div> <button class="Edit-Btn">Edit Profile</button> </div>
    <form class="edit-doctor-form" data-id="${doctor.id}">
    <p>
      <h3>Edit Your Personal Information:</h3>
      <input
        type="text"
        name="bio"
        value=""
        placeholder="Edit Bio"
        class="input-text"
      />
     
      <input
        type="text"
        name="email"
        value=""
        placeholder="Edit Email"
        class="input-text"
      />
     
      <input
        type="text"
        name="image"
        value=""
        placeholder="Edit Image"
        class="input-text"
      />
      <input
        type="submit"
        name="submit"
        value="Submit Changes"
        class="submit"
      />
    </form>
  </div>  
    <div class="container">
    <h1 id="hold" class="display-1" style="font-size: 40px;"></h1>
  <div class="row" style="font-size:20px;">
    <div class="col-sm-4" id="appointment-list"><h1>My Appointments</h1></div>
    <div class="col-sm-4" id="patient-info"><h1>Patient Info</h1></div>
    <div class="col-sm-4" id="appointment-info"><h1>Appointment Info</h1></div>
  </div>
</div>`

const doctorDiv = document.createElement('div')
doctorDiv.dataset.id = doctor.id


//const welcomePanel = body.children[0].children[1]


const doctorContainer = document.querySelector('.edit-doctor-form');
const editBtn = document.querySelector('.Edit-Btn')

editBtn.addEventListener('click', () => { // hide & seek with the form
  editDoctor = !editDoctor
  if (editDoctor) {
    doctorContainer.style.display = 'block'
  } else {
    doctorContainer.style.display = 'none'
  }
})

doctorContainer.addEventListener("submit", (e) => {
   
  e.preventDefault();
  
  if (e.target.className === "edit-doctor-form") {

    
      
      const formData = {
        bio: e.target[0].value,
        email: e.target[1].value,
        image: e.target[2].value
      };

      e.target.reset()
  
      const reqObj = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(formData)
      };
      
      fetch( DOCTORS_ENDPOINT + "/" + e.target.dataset.id, reqObj)
        .then((resp) => resp.json())
        .then((data) => {
          alert(`Success`);
        
          
         
        })
      }
    })  



const appointments = document.querySelector('#appointment-list')
doctor.appointments.forEach(app => {
    const appLI = `<li data-id="${app.id}">${app.stringified_date}</li>`
    appointments.innerHTML += appLI
  })
  const createApp = `<button type="button" name="button" data-id="${doctor.id}" class="create-appointment" >+</button>`
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




//  event listeners
// appointments.addEventListener('click', renderDetailedAppointment)
  
//  invoked functions
loginScreen()