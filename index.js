DOCTORS_ENDPOINT = "https://my-appointments-api.herokuapp.com/doctors"
PATIENTS_ENDPOINT = "https://my-appointments-api.herokuapp.com/patients"
APPOINTMENTS_ENDPOINT = "https://my-appointments-api.herokuapp.com/appointments"
const appointmentList = document.querySelector("#appointment-list")
const doctorContainer = document.querySelector(".doctor-container")
const body = document.querySelector("body")
const footer = document.querySelector(".footer")
let editDoctor = true
let signedInDoctor

//  defined functions

const fetchOneDoctor = (doctorEmail, doctors) => {
  console.log("FETCHONEDOCTOR")
  const matchingDoc = doctors.filter(doctor => doctor.email === doctorEmail)
  const docId = parseInt(matchingDoc[0].id)

  fetch(`${DOCTORS_ENDPOINT}/${docId}`)
    .then(resp => resp.json())
    .then(doctor => renderDoctorHomeScreen(doctor))
    .catch(err => renderErrors(err))
}

const fetchDoctorFromLogin = (event) => {
  console.log("FETCHDOCTORFROMLOGIN")
  event.preventDefault()
  const clicked = event.target
  const doctorEmail = clicked.children[2].value
    fetch(`${DOCTORS_ENDPOINT}`)
      .then(resp => resp.json())
      .then(doctors => fetchOneDoctor(doctorEmail, doctors))
    }

const loginScreen = () => {
  console.log("LOGINSCREEN")
  const loginDiv = document.createElement("div")
  body.innerHTML = `<div class="bg"></div> <h1 id="myMDLogo">myMD</h1><br><img style="float: right; margin-: 100px;" class="medical-image" src="https://www.vippng.com/png/detail/53-530236_caduceus-medical-symbol-png-medical-symbol.png" alt="medical-symbol"><div class="login" id="login">
    <form class="login-form" action="index.html" method="post">
      <label for="login-form">Please Enter Email to Login</label><br>
      <input class="login-email" type="text" name="email" value="">
      <input class="login-submit" type="submit" name="Submit" value="Submit">
      </form>
  </div>`
  const loginForm = document.querySelector(".login-form")
  loginForm.addEventListener('submit', fetchDoctorFromLogin)
}

const postAppObj = (patientId, date, doctorId) => {
  console.log("POSTAPPOBJ")
  return {
    method: "POST",
    headers: {
      "Content-Type":"application/json",
      "Accept":"application/json"
    },
    
    
    body: JSON.stringify({
      patient_id: patientId,
      doctor_id: doctorId,
      datetime: date
    })
  }
}

const postNewAppointment = (event) => {
  event.preventDefault()
  console.log("POST NEW APPOINTMENT", event.target)
  const dropDown = document.getElementById("patient-dropdown");
  const patientId = parseInt(dropDown.options[dropDown.selectedIndex].dataset.id)
  const date = event.target.children[2].value
  const doctorId = parseInt(event.target.dataset.id)

  fetch(APPOINTMENTS_ENDPOINT, postAppObj(patientId, date, doctorId))
    .then(resp => resp.json())
    .then(newApp => renderNewAppointment(newApp))
    .catch(err => renderErrors(err))
}

const renderNewAppointment = (newApp) => {
  console.log("RENDERNEWAPPOINTMENT", newApp)
  const appointments = document.querySelector('#appointment-list')
  const doctorId = parseInt(appointments.children[0].dataset.id)
  // doctor =
  appointments.innerHTML = ""
  const h1 = document.createElement('h1')
  h1.innerText = "My Appointments"
  appointments.append(h1)
  renderAppointments(signedInDoctor)
  // fetch(`${DOCTORS_ENDPOINT}/${doctorId}`)
  //   .then(resp => resp.json())
  //   .then(doctor => renderDocApps(appointments, doctor))
}

const renderDocApps = (appointments, doctor) => {
  console.log("RENDERDOCAPPS")
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

const createNewAppointment = (event) => {
  console.log("CREATENEWAPPOINTMENT")
  const clicked = event.target
  const doctorId = clicked.dataset.id
  fetch(`${DOCTORS_ENDPOINT}/${doctorId}`)
    .then(resp => resp.json())
    .then(doctor => populateAppointmentForm(clicked, doctor))
    .catch(err => renderErrors(err))
}

const renderDetailedAppointment = (event) => {
  console.log("RENDERDETAILEDAPPOINTMENT")
  if (event.target.tagName === "LI") {
    console.log("IM AN LI", event.target)
    clicked = event.target
    const appointmentId = event.target.dataset.id
    fetch(`${APPOINTMENTS_ENDPOINT}/${appointmentId}`)
      .then(resp => resp.json())
      .then(appointment => renderOneAppointment(appointment))
      .catch(err => renderErrors(err))
  }
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
    console.log('hfghghg', doctor.patients)
    doctor.patients.forEach(patient => {
      const patientOption = `<option data-id=${patient.id}" selected="" value="">${patient.full_name}</option>`
      select.innerHTML += patientOption
    })
    const date = document.createElement('input')
    const time = document.createElement('input')
    const submitButton = document.createElement('button')
    submitButton.type = "submit"
    submitButton.innerText = "Submit"
    // date.type = "date"
    time.type = "datetime-local"
    // createAppForm.append(date)
    createAppForm.append(time)
    createAppForm.append(submitButton)
    createAppForm.addEventListener('submit', postNewAppointment)
}

const renderAppointments = (signedInDoctor) => {
  console.log("RENDERAPPOINTMENTS")
  fetch(`${DOCTORS_ENDPOINT}/${signedInDoctor.id}`)
    .then(resp => resp.json())
    .then(doctor => {
      const appointments = document.querySelector('#appointment-list')
      appointments.innerHTML = ''
      const h1 = document.createElement('h1')
      h1.innerText = "My Appointments"
      appointments.append(h1)
      appointments.dataset.id = doctor.id
        doctor.appointments.forEach(app => {
          const appLI = `<li data-id="${app.id}">${app.stringified_date}<button type="button" name="button" data-id="${app.id}" class="delete-appointment" >Delete</button></li>`
          appointments.innerHTML += appLI
        })
        const createApp = `<button style="font-size:15px; type="button" name="button" data-id="${signedInDoctor.id}" class="create-appointment" >Create New Appointment</button>`
        appointments.innerHTML += createApp
        const createAppButton = document.querySelector(".create-appointment")
        createAppButton.addEventListener('click', createNewAppointment)
        appointments.addEventListener('click', renderDetailedAppointment)
    })
    .catch(err => renderErrors(err))
}



const editDoctorForm = (e) => {
  e.preventDefault();
  console.log("EDITDOCTORFORM")

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
          "Accept": "application/json"
        },
        body: JSON.stringify(formData)
      };
      
      fetch( DOCTORS_ENDPOINT + "/" + e.target.dataset.id, reqObj)
        .then((resp) => resp.json())
        .then((data) => {
          alert(`Success`);

        })
      }
}

const renderDoctorHomeScreen = (doctor) => {
  console.log("RENDERDOCTORHOMESCREEN")
  
  signedInDoctor = doctor
  var date = new Date();
  let d = (date.getMonth()+1)+'-'+date.getDate()+'-'+date.getFullYear()
  body.innerHTML =
  
  `<div class="container" id="${doctor.id}">
  <div class="alert alert-success alert-dismissible fade show">
  <button type="button" class="close" data-dismiss="alert">&times;</button>
  <strong>Login Successful!</strong>
  </div>



  <button class="openbtn" onclick="openNav()">☰ Open Doctor Profile</button>
  <div id="main"><div class="bg" id="time"><h1 id="rcorners1" class="display-1" style="font-size: 100px; text-align:right;">myMD</h1><h1>Welcome Dr. ${doctor.last_name}  <p> <h3> Date: ${d} </h3> <p> </p> </div>
<div id="mySidebar" class="sidebar" style="background-color:rgb(240, 240, 240); <img src="${doctor.image}" alt="doctor photo">

<h3> Dr. ${doctor.full_name}</h3><img src="${doctor.image}" alt="doctor photo">
<h3>Specialty: </h3> <p> ${doctor.specialty}</p>
<h3>Bio: </h3> <p> ${doctor.bio}</p>
<h3>Residency </h3> <p> ${doctor.residency}</p>
<h3>Email: </h3> <p> ${doctor.email}</p>
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
    <p>
    <br><button class="Close-Btn">Close Profile</button> </br>
    </p>
  </div>
</div>


</div>
<div class="containers"> <p>

    <div class="container">
    <h1 id="hold" class="display-1" style="font-size: 40px;"></h1>
  <div class="row" style="font-size:20px;">
    <div class="col-sm-4" id="appointment-list"><h1>My Appointments</h1></div>
    <div class="col-sm-4" id="patient-info"><h1>Patient Info</h1></div>
    <div class="col-sm-4" id="appointment-info"><h1>Appointment Info</h1></div>

  </div>
  <p>
  </p>
  <p>
  </p>

<div class="footer">
  <h1 style="font-size:20px; bottom: center; margin-: -100px;">Made by: Lindsay Mecher, Jonathan Schack, and John Leavell <img style="bottom: center; margin-: -100px; height: 50px; width: 50px;" class="flatiron-image" src="https://course_report_production.s3.amazonaws.com/rich/rich_files/rich_files/999/s300/flatironschool.png" alt="flatiron-school-logo"></h1>
</div>`



const closeButton = document.querySelector('.Close-Btn')


closeButton.addEventListener('click', closeNav)


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

  doctorContainer.addEventListener("submit", editDoctorForm)
  renderAppointments(signedInDoctor)
}



const renderErrors = (err) => {
  console.log("RENDERERRORS")
  body.innerHTML = `<h1>The following errors prevented the data from fetching. ${err}. Make sure rails server is running.`
}

const renderUpdatedAppt = (eventTarget, apptInfo) => {
    // debugger
    console.log("RENDERUPDATEDAPPT")

    const appointmentInfoPanel = document.querySelector("#appointment-info")
    appointmentInfoPanel.innerHTML = ""
    const apptDiagnosis = apptInfo.diagnosis
    const apptDirections = apptInfo.directions

    appointmentInfoPanel.dataset.id = apptInfo.id
    const apptDetail = `<h1>Appointment Info</h1>
      <h3 style="font-size:15px;">Date: ${apptInfo.stringified_date}</h3>
      <h3 style="font-size:15px;">Time: ${apptInfo.stringified_time}</h3>
      <h3 style="font-size:15px;">Diagnosis: ${apptInfo.diagnosis}</h3>
      <h3 style="font-size:15px;">Directions: ${apptInfo.directions}</h3><br>
      <button style="font-size:15px;" id="edit-appointment" data-id="${apptInfo.id}">Edit Appointment</button><br>
      <button style="font-size:15px;"><a href="mailto:someone@example.com?Subject=Hello%20again" target="_top">Send Follow Up Email</a></button>
      <br><a href="https://www.webmd.com/">Consult WebMD</a>`
    appointmentInfoPanel.innerHTML = apptDetail
    const editApptButton = document.querySelector('#edit-appointment')
    editApptButton.addEventListener('click', function(e){

        console.log("RENDERONEAPPOINTMENTAFTERUPDATED", apptInfo)
        const appointmentInfoPanel = document.querySelector("#appointment-info")
        appointmentInfoPanel.dataset.id = apptInfo.id
        const apptDetail = `<h1>Appointment Info</h1>
          <h3 style="font-size:15px;">Date: ${apptInfo.stringified_date}</h3>
          <h3 style="font-size:15px;">Time: ${apptInfo.stringified_time}</h3>
          <form class="appointment-details">
            <label>Diagnosis: </label><input style="font-size:15px;" type="text" rows="4" cols="50" name="diagnosis" placeholder="Enter Diagnosis" value="${apptInfo.diagnosis}">
            <label>Directions: </label><input style="font-size:15px;" type="text" rows="4" cols="50" name="directions" placeholder="Enter Directions For Patient" value="${apptInfo.directions}"><br>
            <input style="font-size:15px;" type="submit" name="Submit" value="Submit">
          </form><br>
          <button style="font-size:15px;"><a href="mailto:someone@example.com?Subject=Hello%20again" target="_top">Send Follow Up Email</a></button>
          <br><a href="https://www.webmd.com/">Consult WebMD</a>`
        appointmentInfoPanel.innerHTML = apptDetail
        // render one patient
        const patient = apptInfo.patient
        const patientInfoPanel = document.querySelector("#patient-info")
        const patientDetail = `<h1>Patient Info</h1><h1 style="font-size:15px;">Name: ${patient.full_name}</h1><img src="${patient.image}" alt="patient photo">
          <h2 style="font-size:15px;">Pre-existing Medical Conditions: ${patient.health_conditions}</h2>
          <h3 style="font-size:15px;">Age: ${patient.age} years</h3>
          <h3 style="font-size:15px;">Height: ${patient.height_string}</h3>
          <h3 style="font-size:15px;">Weight: ${patient.weight} pounds</h3>
          <h3 style="font-size:15px;">Email: ${patient.email}</h3><br>
          <button style="font-size:15px;" type="button" name="button" data-id="${patient.id}" class="update-patient-info">Update Patient Info</button>`
          patientInfoPanel.innerHTML = patientDetail


          // const updatePatient = document.querySelector(".update-patient-info")
          document.body.addEventListener('click', function(e){

            if(e.target.className === 'update-patient-info'){
            console.log(e.target.value, "button clicked")
            const patientID = e.target.dataset.id
            fetch(`${PATIENTS_ENDPOINT}/${patientID}`)
              .then(resp => resp.json())
              .then(patient => {
                const newPatientDetails = `<h1>Patient Info</h1><form class="update-patient-btn" data-id="${patient.id}">
                <label style="font-size:15px;">Age: </label><input style="font-size:15px;" type="text" rows="4" cols="50" name="age" placeholder="enter age" value="${patient.age}">
                <label style="font-size:15px;">Height: </label><input style="font-size:15px;" type="text" rows="4" cols="50" name="height" placeholder="enter height" name="" value="${patient.height}">
                <label style="font-size:15px;">Weight: </label><input style="font-size:15px;" type="text" rows="4" cols="50" name="weight" placeholder="enter weight" value="${patient.weight}">
                <label style="font-size:15px;">Email: </label><input style="font-size:15px;" type="text" rows="4" cols="50" name="email" placeholder="enter email" name="" value="${patient.email}">
                <input style="font-size:15px;" type="submit" name="Submit" value="Submit">
              </form>`

                patientInfoPanel.innerHTML = newPatientDetails

                const patientUpdateBtn = document.querySelector('.update-patient-btn')
                // add eventlistenr on form
                // update patient details
                patientUpdateBtn.addEventListener('submit', renderPatientUpdate)

              })
              

            }
          })


          

        const formContainer = document.querySelector(".appointment-details")
        formContainer.addEventListener('submit', updateDiagnosisDirections)


    })

    

    // appointmentInfoPanel.innerHTML = `<p>Diagnosis: ${apptDiagnosis}</p><p>Directions for patient: ${apptDirections}</p>`
  }

const renderUpdatedPatient = (patientInfo) => {
  console.log("RENDERUPDATEDPATIENT")
  const patientInfoPanel = document.querySelector("#patient-info")

  patientInfoPanel.innerHTML = `<h1>Patient Info</h1><h1 style="font-size:15px;">${patientInfo.full_name}</h1><img src="${patientInfo.image}" alt="patient photo">
  <h2 style="font-size:15px;">Pre-existing Medical Conditions: ${patientInfo.health_conditions}</h2>
  <h3 style="font-size:15px;">Age: ${patientInfo.age} years</h3>
  <h3 style="font-size:15px;">Height: ${patientInfo.height_string}</h3>
  <h3 style="font-size:15px;">Weight: ${patientInfo.weight} pounds</h3>
  <h3 style="font-size:15px;">Email: ${patientInfo.email}</h3><br>
  <button style="font-size:15px;" type="button" name="button" data-id="${patientInfo.id}" class="update-patient-info">Update Patient Info</button>`
}


const renderPatientUpdate = (e) => {
  e.preventDefault()
  console.log("RENDERPATIENTUPDATE")
  const patientID = e.target.dataset.id
  const eventTarget = e.target
  // debugger
  console.log(e)
  const formData = {
    age: e.target[0].value,
    height: e.target[1].value,
    weight: e.target[2].value,
    email: e.target[3].value
  }
  // debugger
  const reqObj = {
    method: "PATCH",
    headers: {
      'Content-Type': "application/json",
      'Accept': "application/json"
    },
    body: JSON.stringify(formData)
  }

  fetch(`${PATIENTS_ENDPOINT}/${patientID}`, reqObj)
    .then( resp => resp.json())
    .then( patientInfo => renderUpdatedPatient(patientInfo))
    .catch(err => console.log(err))
}


const updateDiagnosisDirections = (e) => {
  e.preventDefault()
  console.log("UPDATEDIAGNOSISDIRECTIONS")
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
  const eventTarget = e.target
  const patientId = e.target.parentElement.dataset.id
  fetch(`${APPOINTMENTS_ENDPOINT}/${patientId}`, reqObj)
  .then( resp => resp.json())
  .then( apptInfo => renderUpdatedAppt(eventTarget, apptInfo))
  .catch( err => renderErrors(err))
}



const renderOneAppointment = (appointment) => {
  console.log("RENDERONEAPPOINTMENT", appointment)
  const appointmentInfoPanel = document.querySelector("#appointment-info")
  appointmentInfoPanel.dataset.id = appointment.id
  const apptDetail = `<h1>Appointment Info</h1>
    <h3 style="font-size:15px;">Date: ${appointment.stringified_date}</h3>
    <h3 style="font-size:15px;">Time: ${appointment.stringified_time}</h3>
    <form style="font-size:15px;" class="appointment-details">
      <label>Diagnosis: </label><input style="font-size:15px;" type="textarea" rows="4" cols="50" name="diagnosis" placeholder="Enter Diagnosis" value="${appointment.diagnosis}"><br>
      <label>Directions: </label><input style="font-size:15px;" type="textarea" rows="4" cols="50" name="directions" placeholder="Enter Directions For Patient" value="${appointment.directions}"><br>
      <input style="font-size:15px; text-align: center;" type="submit" name="Submit" value="Submit">
    </form><br>
    <button style="font-size: 15px;"><a href="mailto:someone@example.com?Subject=Hello%20again" target="_top">Send Follow Up Email</a></button>`
  appointmentInfoPanel.innerHTML = apptDetail
  // render one patient
  const patient = appointment.patient
  const patientInfoPanel = document.querySelector("#patient-info")
  const patientDetail = `<h1>Patient Info</h1><h1 style="font-size:15px;">Name: ${patient.full_name}</h1><img src="${patient.image}" alt="patient photo">
    <h2 style="font-size:15px;">Pre-existing Medical Conditions: ${patient.health_conditions}</h2>
    <h3 style="font-size:15px;">Age: ${patient.age} years</h3>
    <h3 style="font-size:15px;">Height: ${patient.height_string}</h3>
    <h3 style="font-size:15px;">Weight: ${patient.weight} pounds</h3>
    <h3 style="font-size:15px;">Email: ${patient.email}</h3>
    <button style="font-size:15px; type="button" name="button" data-id="${patient.id}" class="update-patient-info">Update Patient Info</button>`
    patientInfoPanel.innerHTML = patientDetail


    // const updatePatient = document.querySelector(".update-patient-info")
    document.body.addEventListener('click', function(e){

      if(e.target.className === 'update-patient-info'){
      console.log(e.target.value, "button clicked")
      const patientID = e.target.dataset.id
      fetch(`${PATIENTS_ENDPOINT}/${patientID}`)
        .then(resp => resp.json())
        .then(patient => {
          const newPatientDetails = `<h1>Patient Info</h1><form class="update-patient-btn" data-id="${patient.id}">
          <label style="font-size:15px;">Age: </label><input style="font-size:15px;" type="text" rows="4" cols="50" name="age" placeholder="enter age" value="${patient.age}"><br>
          <label style="font-size:15px;">Height: </label><input style="font-size:15px;" type="text" rows="4" cols="50" name="height" placeholder="enter height" name="" value="${patient.height}"><br>
          <label style="font-size:15px;">Weight: </label><input style="font-size:15px;" type="text" rows="4" cols="50" name="weight" placeholder="enter weight" value="${patient.weight}"><br>
          <label style="font-size:15px;">Email: </label><input style="font-size:15px;" type="text" rows="4" cols="50" name="email" placeholder="enter email" name="" value="${patient.email}"><br>
          <input style="font-size:15px;" type="submit" name="Submit" value="Submit">
        </form>`

          patientInfoPanel.innerHTML = newPatientDetails

          const patientUpdateBtn = document.querySelector('.update-patient-btn')
          // add eventlistenr on form
          // update patient details
          patientUpdateBtn.addEventListener('submit', renderPatientUpdate)

        })

      }
    })

    debugger

  const formContainer = document.querySelector(".appointment-details")
  formContainer.addEventListener('submit', updateDiagnosisDirections)

}

const apptDeleteObj = () => {
  return {
    method: "DELETE",
    headers: {
      "Content-Type":"application/json",
      "Accept":"application/json"
    }
  }
}

const deleteAppointment = (eventTarget, appointmentId) => {
  console.log("DELETEAPPOINTMENT")
  fetch(`${APPOINTMENTS_ENDPOINT}/${appointmentId}`, apptDeleteObj())
    .then(resp => resp.json())
    .then(deletion => {
      console.log("server response", deletion)
      renderAppointments(signedInDoctor)
    })
    .catch(err => renderErrors(err))
}

const eventListeners = (event) => {
  console.log("EVENTLISTENERS")
  const eventTarget = event.target
  if (event.target.className === 'delete-appointment') {
    // const eventTarget = event.target
    const appointmentId = parseInt(eventTarget.dataset.id)
    deleteAppointment(eventTarget, appointmentId)
  }
  // else if (event.target.className === "create-appointment") {
  //   debugger
  //   createNewAppointment(eventTarget)
  //   // appointments.addEventListener('click', renderDetailedAppointment)
  // } else if (event.target.id === "appointment-list"){
  //   renderDetailedAppointment(eventTarget)
  // }
}

// event listeners
body.addEventListener('click', eventListeners)

//  invoked functions

loginScreen()

