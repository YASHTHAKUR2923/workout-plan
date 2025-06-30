let currentMonth = 6; // July
let selectedDay = null;
const workoutLogs = {};
const calendar = document.getElementById("calendarGrid");

const pushPullLegs = ["Push 1", "Pull 1", "Legs 1", "Rest", "Push 2", "Pull 2", "Legs 2"];

const fullWorkouts = {
  "Push 1": [
    "Flat Barbell Bench: 3x6-8",
    "Incline DB Bench: 3x8-10",
    "Lateral Raise: 3x10-15",
    "Triceps Extension: 3x10-15",
    "Pushdown: 2x15-20",
  ],
  "Pull 1": [
    "Barbell Row: 3x8",
    "Cable Row: 3x10",
    "Lat Pulldown: 3x10-12",
    "Face Pull: 3x12-15",
    "Bicep Curl: 3x10-12",
  ],
  "Legs 1": [
    "Back Squat: 3x6",
    "Lunges: 3x10",
    "Leg Extension: 3x12",
    "Calf Raise: 4x15",
    "Cable Crunch: 4x15",
  ],
  "Push 2": [
    "Overhead Press: 3x6-8",
    "Incline Barbell: 3x8-10",
    "Chest Fly: 3x12",
    "Cable Lateral Raise: 3x15",
    "Dips: 3x10",
    "EZ Bar Extension: 2x10-12",
  ],
  "Pull 2": [
    "Deadlift: 3x5",
    "T-Bar Row: 3x8",
    "Lat Pulldown (under): 3x10",
    "Rear Delt Fly: 3x12-15",
    "Hammer Curl: 3x10",
  ],
  "Legs 2": [
    "Leg Press: 3x12",
    "Split Squat: 3x8",
    "Seated Curl: 3x15",
    "Calf Raise: 4x12-15",
    "Hanging Leg Raise: 4x10",
  ],
  "Rest": ["Rest Day — Hydrate, Stretch, Recover 🙏"]
};

function loadCalendar(monthIndex) {
  currentMonth = monthIndex;
  calendar.innerHTML = "";
  const year = 2024;
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    calendar.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, monthIndex, day);
    const dateKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const div = document.createElement("div");
    div.className = "day";

    const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
    div.innerHTML = `<div class="day-name">${dayName}</div><div class="day-number">${day}</div>`;

    div.addEventListener("click", () => openPopup(dateKey, day));

    if (workoutLogs[dateKey]) {
      const dot = document.createElement("div");
      dot.className = "log-dot";
      div.appendChild(dot);
    }

    calendar.appendChild(div);
  }
}

function openPopup(dateKey, dayNumber) {
  selectedDay = dateKey;
  document.getElementById("logDay").textContent = `${selectedDay}`;
  document.getElementById("logPopup").style.display = "block";

  const date = new Date(selectedDay);
  const startDate = new Date("2024-07-01");
  const diffDays = Math.floor((date - startDate) / (1000 * 60 * 60 * 24));
  const type = pushPullLegs[diffDays % 7];

  const workoutPlan = document.getElementById("workoutPlanList");
  workoutPlan.innerHTML = "";
  fullWorkouts[type].forEach(ex => {
    const li = document.createElement("li");
    li.textContent = ex;
    workoutPlan.appendChild(li);
  });

  document.getElementById("workoutInput").value = workoutLogs[dateKey] || "";
}

function closePopup() {
  document.getElementById("logPopup").style.display = "none";
}

function saveWorkout() {
  const input = document.getElementById("workoutInput").value;
  if (input.trim()) {
    workoutLogs[selectedDay] = input.trim();
  } else {
    delete workoutLogs[selectedDay];
  }
  closePopup();
  loadCalendar(currentMonth);
}

loadCalendar(currentMonth);



function saveWorkout() {
  const input = document.getElementById("workoutInput").value;
  if (input.trim()) {
    workoutLogs[selectedDay] = input.trim();
  } else {
    delete workoutLogs[selectedDay];
  }
  closePopup();
  localStorage.setItem("logs", JSON.stringify(workoutLogs)); // Persist
  loadCalendar(currentMonth);
  renderSavedTable(); // Update the saved table
}

// Load saved data if any
const savedFromLocal = JSON.parse(localStorage.getItem("logs"));
if (savedFromLocal) {
  Object.assign(workoutLogs, savedFromLocal);
}

function renderSavedTable() {
  const tableBody = document.getElementById("savedLogBody");
  tableBody.innerHTML = "";

  const sortedDates = Object.keys(workoutLogs).sort();
  sortedDates.forEach(date => {
    const dateObj = new Date(date);
    const startDate = new Date("2024-07-01");
    const diffDays = Math.floor((dateObj - startDate) / (1000 * 60 * 60 * 24));
    const workoutType = pushPullLegs[diffDays % 7] || "Workout";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${date}</td>
      <td>${workoutType}</td>
      <td>${workoutLogs[date]}</td>
    `;
    tableBody.appendChild(tr);
  });
}

renderSavedTable(); // Render once on load
