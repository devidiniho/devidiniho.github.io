const storageKeys = {
  theme: "devid-dashboard-theme",
  tasks: "devid-dashboard-tasks",
  quickNote: "devid-dashboard-quick-note"
};

const clockElement = document.querySelector("#clock");
const dateElement = document.querySelector("#date");
const themeToggle = document.querySelector("#themeToggle");
const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector("#taskList");
const clearTasks = document.querySelector("#clearTasks");
const calendarGrid = document.querySelector("#calendarGrid");
const calendarTitle = document.querySelector("#calendarTitle");
const quickNote = document.querySelector("#quickNote");

function updateClock() {
  const now = new Date();

  clockElement.textContent = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(now);

  dateElement.textContent = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(now);
}

function setTheme(theme) {
  document.body.classList.toggle("light", theme === "light");
  localStorage.setItem(storageKeys.theme, theme);
}

function initialiseTheme() {
  const savedTheme = localStorage.getItem(storageKeys.theme);
  const systemPrefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  setTheme(savedTheme || (systemPrefersLight ? "light" : "dark"));
}

function buildCalendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  calendarTitle.textContent = new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric"
  }).format(today);

  const firstOfMonth = new Date(year, month, 1);
  const mondayBasedOffset = (firstOfMonth.getDay() + 6) % 7;
  const startDate = new Date(year, month, 1 - mondayBasedOffset);

  calendarGrid.innerHTML = "";

  for (let i = 0; i < 42; i++) {
    const cellDate = new Date(startDate);
    cellDate.setDate(startDate.getDate() + i);

    const cell = document.createElement("div");
    cell.className = "calendar-day";
    cell.textContent = cellDate.getDate();

    if (cellDate.getMonth() !== month) {
      cell.classList.add("other-month");
    }

    const day = cellDate.getDay();
    if (day === 0 || day === 6) {
      cell.classList.add("weekend");
    }

    if (
      cellDate.getFullYear() === today.getFullYear() &&
      cellDate.getMonth() === today.getMonth() &&
      cellDate.getDate() === today.getDate()
    ) {
      cell.classList.add("current");
      cell.setAttribute("aria-current", "date");
    }

    cell.setAttribute(
      "aria-label",
      new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(cellDate)
    );

    calendarGrid.appendChild(cell);
  }
}

function getTasks() {
  try {
    return JSON.parse(localStorage.getItem(storageKeys.tasks)) || [];
  } catch {
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem(storageKeys.tasks, JSON.stringify(tasks));
}

function renderTasks() {
  const tasks = getTasks();
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    const empty = document.createElement("li");
    empty.innerHTML = "<span>No tasks yet. Add one above.</span>";
    taskList.appendChild(empty);
    return;
  }

  tasks.forEach((task, index) => {
    const item = document.createElement("li");
    if (task.completed) item.classList.add("completed");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark ${task.text} complete`);
    checkbox.addEventListener("change", () => {
      const currentTasks = getTasks();
      currentTasks[index].completed = checkbox.checked;
      saveTasks(currentTasks);
      renderTasks();
    });

    const text = document.createElement("span");
    text.textContent = task.text;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "delete-task";
    removeButton.textContent = "×";
    removeButton.setAttribute("aria-label", `Delete ${task.text}`);
    removeButton.addEventListener("click", () => {
      const currentTasks = getTasks();
      currentTasks.splice(index, 1);
      saveTasks(currentTasks);
      renderTasks();
    });

    item.append(checkbox, text, removeButton);
    taskList.appendChild(item);
  });
}

themeToggle.addEventListener("click", () => {
  setTheme(document.body.classList.contains("light") ? "dark" : "light");
});

taskForm.addEventListener("submit", event => {
  event.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;

  const tasks = getTasks();
  tasks.push({ text, completed: false });
  saveTasks(tasks);
  taskInput.value = "";
  renderTasks();
});

clearTasks.addEventListener("click", () => {
  const remainingTasks = getTasks().filter(task => !task.completed);
  saveTasks(remainingTasks);
  renderTasks();
});

quickNote.value = localStorage.getItem(storageKeys.quickNote) || "";
quickNote.addEventListener("input", () => {
  localStorage.setItem(storageKeys.quickNote, quickNote.value);
});

initialiseTheme();
updateClock();
buildCalendar();
setInterval(updateClock, 1000);
renderTasks();
