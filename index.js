//  defined variables

APPOINTMENTS_ENDPOINT = "http://localhost:3000/appointments/"

const appointmentList = document.querySelector(".appointment-list")
const appDetailPanel = document.querySelector(".appointment-detail-panel")




//  defined functions

const fetchAppointments = () => {
    fetch(APPOINTMENTS_ENDPOINT)
        .then(resp => resp.json())
        .then(appointments => renderAppointments(appointments))
        .catch(err => renderErrors(err))
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
  const appt_detail = `<h1>${appointment.patient.full_name}</h1>`
  appDetailPanel.innerHTML = appt_detail
}










//  event listeners
appointmentList.addEventListener('click', renderDetailedAppointment)






//  invoked functions
fetchAppointments()
