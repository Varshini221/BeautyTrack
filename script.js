const dialog = document.getElementById("formDialog");
const API = "http://127.0.0.1:5001"; 

// Function to open the pop-up form as a modal
function openForm() {
  dialog.showModal(); 
}

// Function to close the pop-up form
function closeForm() {
  dialog.close();
}

async function submitForm() {
    const name = document.getElementById("name").value.trim();
    const date = document.getElementById("event-date").value;
    const category = document.getElementById("category").value;
    const cost = document.getElementById("cost").value;
    const time = document.getElementById("appt-time").value;

    if (!name || !date || !category || !cost || !time) {
        alert("please fill in all fields")
        return;
    }

    try {
      const response = await fetch(`${API}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          name: name, 
          category: category, 
          time: time, 
          cost: cost, 
          date: date
        })
      });
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
    
      closeForm()
      alert("appointment saved");
      loadAppointments()

    } catch (error) {
      console.error(error);
      alert("could not save appointmnt" + error.message)
    }

    

}

async function loadAppointments() {
  try {
    const response = await fetch(`${API}/appointments`);

    if (!response.ok) {
      throw new Error("Failed to get appointments")
    }

    const appointments = await response.json();


    const container = document.getElementById("upcoming-appointments");

    container.innerHTML = "";

    appointments.forEach(appointment => {
      const appointmentElement = document.createElement("div");
      appointmentElement.className = "appointment-card";

      appointmentElement.innerHTML = `
      <div>
        <h3>${appointment.name}</h3>
        <p>${appointment.date} at ${appointment.time}</p>
        <p>${appointment.category} &nbsp;|&nbsp;  $${appointment.cost}</p>
      </div>
      <button class="delete-btn" onclick="deleteAppointment(${appointment.id})"> X </button>
      `;

      container.appendChild(appointmentElement);
    });

  } catch (error) {
    console.error(error);
  }

}


async function deleteAppointment(id) {
  await fetch(`${API}/appointments/${id}`, {
    method: "DELETE"
  });
  loadAppointments();

}
loadAppointments();



