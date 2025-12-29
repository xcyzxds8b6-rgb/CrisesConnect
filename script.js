const form = document.getElementById("volunteerForm");
const volunteerList = document.getElementById("volunteerList");
const taskList = document.getElementById("taskList");
const successMsg = document.getElementById("successMsg");

const emergencyBtn = document.getElementById("emergencyBtn");
const emergencyStatus = document.getElementById("emergencyStatus");
const emergencyText = document.getElementById("emergencyText");
const emergencyContainer = document.getElementById("emergencyContainer");
const taskCount = document.getElementById("taskCount");
const skillFilter = document.getElementById("skillFilter");

let volunteers = [];
let emergencyOn = false;

/* REGISTER */
form.addEventListener("submit", e => {
  e.preventDefault();

  const v = {
    name: document.getElementById("name").value,
    skill: document.getElementById("skill").value,
    location: document.getElementById("location").value,
    availability: document.getElementById("availability").value
  };

  volunteers.push(v);
  renderVolunteers();
  successMsg.style.display = "block";
  setTimeout(() => successMsg.style.display = "none", 2500);
  form.reset();
});

/* EMERGENCY MODE */
emergencyBtn.onclick = () => {
  emergencyOn = !emergencyOn;

  if (emergencyOn) {
    emergencyStatus.textContent = "ON";
    emergencyStatus.className = "pill on";
    emergencyText.textContent = "ACTIVE";
    emergencyContainer.style.display = "block";
  } else {
    emergencyStatus.textContent = "OFF";
    emergencyStatus.className = "pill off";
    emergencyText.textContent = "inactive";
    emergencyContainer.style.display = "none";
  }
};

/* TASK */
addTaskBtn.onclick = () => {
  if (!taskInput.value) return;

  const li = document.createElement("li");
  li.textContent = `${taskInput.value} (${priority.value})`;
  taskList.appendChild(li);

  taskCount.textContent = taskList.children.length;
  taskInput.value = "";
};

/* FILTER */
skillFilter.onchange = renderVolunteers;

function renderVolunteers() {
  volunteerList.innerHTML = "";
  volunteers
    .filter(v => !skillFilter.value || v.skill === skillFilter.value)
    .forEach(v => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${v.name}</strong> — ${v.skill} — ${v.location}
        <span style="color:${v.availability === "Available" ? "#22c55e" : "#f97316"}">
          (${v.availability})
        </span>
      `;
      volunteerList.appendChild(li);
    });
}