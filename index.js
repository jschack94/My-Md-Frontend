//  defined variables

APPOINTMENTS_ENDPOINT = "http://localhost:3000/appointments/"

const appointmentList = document.querySelector(".appointment-list")





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












//  event listeners







//  invoked functions
fetchAppointments()
