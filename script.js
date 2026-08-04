const storageKeys = {
  theme: "devid-dashboard-theme",
  tasks: "devid-dashboard-tasks",
  quickNote: "devid-dashboard-quick-note",
  customLinks: "devid-dashboard-custom-links-v3",
  projects: "devid-dashboard-projects-v3"
};

const defaultLinks = {
  learn: [
    { name: "MIT OpenCourseWare", url: "https://ocw.mit.edu/", description: "University-level material" },
    { name: "Isaac Physics", url: "https://isaacphysics.org/", description: "Physics problem solving" },
    { name: "Khan Academy", url: "https://www.khanacademy.org/", description: "Core explanations" },
    { name: "Coursera", url: "https://www.coursera.org/", description: "Structured courses" },
    { name: "edX", url: "https://www.edx.org/", description: "University courses" }
  ],
  build: [
    { name: "Onshape", url: "https://cad.onshape.com/", description: "Browser CAD" },
    { name: "Autodesk Fusion", url: "https://www.autodesk.com/products/fusion-360/personal", description: "CAD, CAM and simulation" },
    { name: "GrabCAD Library", url: "https://grabcad.com/library", description: "Reference models" },
    { name: "McMaster-Carr", url: "https://www.mcmaster.com/", description: "Standard components" },
    { name: "TraceParts", url: "https://www.traceparts.com/", description: "Supplier CAD models" }
  ],
  analyse: [
    { name: "SimScale", url: "https://www.simscale.com/", description: "Cloud CFD and FEA" },
    { name: "OpenFOAM", url: "https://www.openfoam.com/", description: "Open-source CFD" },
    { name: "ParaView", url: "https://www.paraview.org/", description: "Scientific visualisation" },
    { name: "SU2", url: "https://su2code.github.io/", description: "Open-source multiphysics" },
    { name: "CFD Online", url: "https://www.cfd-online.com/", description: "Community and reference" }
  ],
  develop: [
    { name: "GitHub", url: "https://github.com/", description: "Repositories and portfolio" },
    { name: "VS Code Web", url: "https://vscode.dev/", description: "Browser editor" },
    { name: "Python Documentation", url: "https://docs.python.org/3/", description: "Language reference" },
    { name: "NumPy Documentation", url: "https://numpy.org/doc/", description: "Numerical arrays" },
    { name: "SciPy Documentation", url: "https://docs.scipy.org/doc/scipy/", description: "Scientific computing" }
  ],
  research: [
    { name: "Google Scholar", url: "https://scholar.google.com/", description: "Academic search" },
    { name: "arXiv", url: "https://arxiv.org/", description: "Research preprints" },
    { name: "Semantic Scholar", url: "https://www.semanticscholar.org/", description: "Paper discovery" },
    { name: "NASA Technical Reports", url: "https://ntrs.nasa.gov/", description: "Aerospace research" },
    { name: "ScienceDirect", url: "https://www.sciencedirect.com/", description: "Journal articles" }
  ],
  tools: [
    { name: "Google Drive", url: "https://drive.google.com/", description: "Files and archive" },
    { name: "Google Docs", url: "https://docs.google.com/", description: "Writing and reports" },
    { name: "Overleaf", url: "https://www.overleaf.com/", description: "LaTeX documents" },
    { name: "Wolfram|Alpha", url: "https://www.wolframalpha.com/", description: "Symbolic calculation" },
    { name: "Desmos", url: "https://www.desmos.com/calculator", description: "Graphing calculator" }
  ]
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

const quoteText = document.querySelector("#quoteText");
const quoteAuthor = document.querySelector("#quoteAuthor");
const newQuoteButton = document.querySelector("#newQuoteButton");

const modalBackdrop = document.querySelector("#modalBackdrop");
const linkModal = document.querySelector("#linkModal");
const projectModal = document.querySelector("#projectModal");
const projectDetailsModal = document.querySelector("#projectDetailsModal");

const linkForm = document.querySelector("#linkForm");
const linkCategory = document.querySelector("#linkCategory");
const linkEditIndex = document.querySelector("#linkEditIndex");
const linkName = document.querySelector("#linkName");
const linkUrl = document.querySelector("#linkUrl");
const linkDescription = document.querySelector("#linkDescription");

const projectForm = document.querySelector("#projectForm");
const projectEditIndex = document.querySelector("#projectEditIndex");
const projectName = document.querySelector("#projectName");
const projectDescription = document.querySelector("#projectDescription");
const projectLinkRows = document.querySelector("#projectLinkRows");
const addProjectLinkRow = document.querySelector("#addProjectLinkRow");
const addProjectButton = document.querySelector("#addProjectButton");
const projectList = document.querySelector("#projectList");

const projectDetailsTitle = document.querySelector("#projectDetailsTitle");
const projectDetailsDescription = document.querySelector("#projectDetailsDescription");
const projectDetailsLinks = document.querySelector("#projectDetailsLinks");
const editProjectButton = document.querySelector("#editProjectButton");
const deleteProjectButton = document.querySelector("#deleteProjectButton");

let activeProjectIndex = null;

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

    if (cellDate.getMonth() !== month) cell.classList.add("other-month");

    const day = cellDate.getDay();
    if (day === 0 || day === 6) cell.classList.add("weekend");

    if (
      cellDate.getFullYear() === today.getFullYear() &&
      cellDate.getMonth() === today.getMonth() &&
      cellDate.getDate() === today.getDate()
    ) {
      cell.classList.add("current");
      cell.setAttribute("aria-current", "date");
    }

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

function getLinks() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKeys.customLinks));
    return saved || structuredClone(defaultLinks);
  } catch {
    return structuredClone(defaultLinks);
  }
}

function saveLinks(links) {
  localStorage.setItem(storageKeys.customLinks, JSON.stringify(links));
}

function renderLinks() {
  const links = getLinks();

  document.querySelectorAll("[data-category]").forEach(container => {
    const category = container.dataset.category;
    container.innerHTML = "";

    links[category].forEach((link, index) => {
      const row = document.createElement("div");
      row.className = "link-row";

      const anchor = document.createElement("a");
      anchor.href = link.url;
      anchor.target = "_blank";
      anchor.rel = "noopener";

      const title = document.createElement("span");
      title.textContent = link.name;

      const description = document.createElement("small");
      description.textContent = link.description || "Custom website";

      anchor.append(title, description);

      const controls = document.createElement("div");
      controls.className = "link-controls";

      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.className = "mini-control";
      editButton.textContent = "✎";
      editButton.title = "Edit website";
      editButton.addEventListener("click", () => openLinkModal(category, index));

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "mini-control";
      deleteButton.textContent = "×";
      deleteButton.title = "Delete website";
      deleteButton.addEventListener("click", () => {
        if (!confirm(`Delete "${link.name}"?`)) return;
        const current = getLinks();
        current[category].splice(index, 1);
        saveLinks(current);
        renderLinks();
      });

      controls.append(editButton, deleteButton);
      row.append(anchor, controls);
      container.appendChild(row);
    });
  });
}

function showModal(modal) {
  modalBackdrop.classList.remove("hidden");
  modalBackdrop.setAttribute("aria-hidden", "false");
  [linkModal, projectModal, projectDetailsModal].forEach(item => item.classList.add("hidden"));
  modal.classList.remove("hidden");
}

function closeModals() {
  modalBackdrop.classList.add("hidden");
  modalBackdrop.setAttribute("aria-hidden", "true");
  [linkModal, projectModal, projectDetailsModal].forEach(item => item.classList.add("hidden"));
}

function openLinkModal(category, index = null) {
  linkForm.reset();
  linkCategory.value = category;
  linkEditIndex.value = index ?? "";
  document.querySelector("#linkModalTitle").textContent = index === null ? "Add website" : "Edit website";

  if (index !== null) {
    const link = getLinks()[category][index];
    linkName.value = link.name;
    linkUrl.value = link.url;
    linkDescription.value = link.description || "";
  }

  showModal(linkModal);
  linkName.focus();
}

function getProjects() {
  try {
    return JSON.parse(localStorage.getItem(storageKeys.projects)) || [];
  } catch {
    return [];
  }
}

function saveProjects(projects) {
  localStorage.setItem(storageKeys.projects, JSON.stringify(projects));
}

function renderProjects() {
  const projects = getProjects();
  projectList.innerHTML = "";

  if (projects.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No projects yet. Add one when you begin.";
    projectList.appendChild(empty);
    return;
  }

  projects.forEach((project, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "project-card-button";

    const title = document.createElement("strong");
    title.textContent = project.name;

    const description = document.createElement("small");
    description.textContent = project.description || `${project.links.length} relevant link${project.links.length === 1 ? "" : "s"}`;

    button.append(title, description);
    button.addEventListener("click", () => openProjectDetails(index));
    projectList.appendChild(button);
  });
}

function addProjectLinkInput(label = "", url = "") {
  const row = document.createElement("div");
  row.className = "project-link-row";

  const labelInput = document.createElement("input");
  labelInput.type = "text";
  labelInput.placeholder = "Link name, e.g. Google Drive";
  labelInput.value = label;
  labelInput.dataset.projectLinkLabel = "";

  const urlInput = document.createElement("input");
  urlInput.type = "url";
  urlInput.placeholder = "https://...";
  urlInput.value = url;
  urlInput.dataset.projectLinkUrl = "";

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "remove-row-button";
  removeButton.textContent = "×";
  removeButton.title = "Remove link";
  removeButton.addEventListener("click", () => row.remove());

  row.append(labelInput, urlInput, removeButton);
  projectLinkRows.appendChild(row);
}

function openProjectEditor(index = null) {
  projectForm.reset();
  projectLinkRows.innerHTML = "";
  projectEditIndex.value = index ?? "";
  document.querySelector("#projectModalTitle").textContent = index === null ? "Add project" : "Edit project";

  if (index !== null) {
    const project = getProjects()[index];
    projectName.value = project.name;
    projectDescription.value = project.description || "";
    project.links.forEach(link => addProjectLinkInput(link.label, link.url));
  } else {
    addProjectLinkInput();
  }

  showModal(projectModal);
  projectName.focus();
}

function openProjectDetails(index) {
  const project = getProjects()[index];
  if (!project) return;

  activeProjectIndex = index;
  projectDetailsTitle.textContent = project.name;
  projectDetailsDescription.textContent = project.description || "No description added.";
  projectDetailsLinks.innerHTML = "";

  if (project.links.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No links added yet.";
    projectDetailsLinks.appendChild(empty);
  } else {
    project.links.forEach(link => {
      const anchor = document.createElement("a");
      anchor.href = link.url;
      anchor.target = "_blank";
      anchor.rel = "noopener";
      anchor.textContent = link.label || link.url;
      projectDetailsLinks.appendChild(anchor);
    });
  }

  showModal(projectDetailsModal);
}

document.querySelectorAll("[data-add-link]").forEach(button => {
  button.addEventListener("click", () => openLinkModal(button.dataset.addLink));
});

document.querySelectorAll("[data-close-modal]").forEach(button => {
  button.addEventListener("click", closeModals);
});

modalBackdrop.addEventListener("click", event => {
  if (event.target === modalBackdrop) closeModals();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeModals();
});

linkForm.addEventListener("submit", event => {
  event.preventDefault();

  const category = linkCategory.value;
  const editIndex = linkEditIndex.value === "" ? null : Number(linkEditIndex.value);
  const links = getLinks();
  const entry = {
    name: linkName.value.trim(),
    url: linkUrl.value.trim(),
    description: linkDescription.value.trim()
  };

  if (editIndex === null) {
    links[category].push(entry);
  } else {
    links[category][editIndex] = entry;
  }

  saveLinks(links);
  renderLinks();
  closeModals();
});

addProjectButton.addEventListener("click", () => openProjectEditor());
addProjectLinkRow.addEventListener("click", () => addProjectLinkInput());

projectForm.addEventListener("submit", event => {
  event.preventDefault();

  const labels = [...projectLinkRows.querySelectorAll("[data-project-link-label]")];
  const urls = [...projectLinkRows.querySelectorAll("[data-project-link-url]")];
  const links = [];

  labels.forEach((input, index) => {
    const label = input.value.trim();
    const url = urls[index].value.trim();
    if (label && url) links.push({ label, url });
  });

  const project = {
    name: projectName.value.trim(),
    description: projectDescription.value.trim(),
    links
  };

  const projects = getProjects();
  const editIndex = projectEditIndex.value === "" ? null : Number(projectEditIndex.value);

  if (editIndex === null) {
    projects.push(project);
  } else {
    projects[editIndex] = project;
  }

  saveProjects(projects);
  renderProjects();
  closeModals();
});

editProjectButton.addEventListener("click", () => {
  if (activeProjectIndex === null) return;
  openProjectEditor(activeProjectIndex);
});

deleteProjectButton.addEventListener("click", () => {
  if (activeProjectIndex === null) return;

  const projects = getProjects();
  const project = projects[activeProjectIndex];
  if (!confirm(`Delete "${project.name}"?`)) return;

  projects.splice(activeProjectIndex, 1);
  saveProjects(projects);
  activeProjectIndex = null;
  renderProjects();
  closeModals();
});


const fallbackQuotes = [
  {
    quote: "The important thing is not to stop questioning.",
    author: "Albert Einstein"
  },
  {
    quote: "What we know is a drop; what we do not know is an ocean.",
    author: "Isaac Newton"
  },
  {
    quote: "Nothing is too wonderful to be true, if it is consistent with the laws of nature.",
    author: "Michael Faraday"
  }
  {
  text: "Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.",
  author: "Richard Feynman"
  },
  {
    text: "The scientist is not a person who gives the right answers; he's one who asks the right questions.",
    author: "Claude Lévi-Strauss"
  },
  {
    text: "The first principle is that you must not fool yourself—and you are the easiest person to fool.",
    author: "Richard Feynman"
  },
  {
    text: "Everything should be made as simple as possible, but not simpler.",
    author: "Albert Einstein"
  },
  {
    text: "If I have seen further it is by standing on the shoulders of giants.",
    author: "Isaac Newton"
  },
  {
    text: "Research is what I'm doing when I don't know what I'm doing.",
    author: "Wernher von Braun"
  },
  {
    text: "Science is a way of thinking much more than it is a body of knowledge.",
    author: "Carl Sagan"
  },
  {
    text: "Somewhere, something incredible is waiting to be known.",
    author: "Carl Sagan"
  },
  {
    text: "The great tragedy of science—the slaying of a beautiful hypothesis by an ugly fact.",
    author: "Thomas Huxley"
  },
  {
    text: "Nature uses only the longest threads to weave her patterns.",
    author: "Richard Feynman"
  },
  {
    text: "Every once in a while, a new technology, an old problem, and a big idea turn into an innovation.",
    author: "Dean Kamen"
  },
  {
    text: "Scientists investigate that which already is; engineers create that which has never been.",
    author: "Theodore von Kármán"
  },
  {
    text: "Engineering is the art of directing the great sources of power in nature for the use and convenience of mankind.",
    author: "Thomas Tredgold"
  },
  {
    text: "The engineer has been, and is, a maker of history.",
    author: "James Kip Finch"
  },
  {
    text: "No problem can withstand the assault of sustained thinking.",
    author: "Voltaire"
  },
  {
    text: "We are still pioneers.",
    author: "James Webb"
  },
  {
    text: "Failure is simply the opportunity to begin again, this time more intelligently.",
    author: "Henry Ford"
  },
  {
    text: "Vision without execution is hallucination.",
    author: "Thomas Edison"
  },
  {
    text: "The best way to predict the future is to invent it.",
    author: "Alan Kay"
  },
  {
    text: "The limits of my language mean the limits of my world.",
    author: "Ludwig Wittgenstein"
  },
  {
    text: "The important thing is not to stop questioning.",
    author: "Albert Einstein"
  },
  {
    text: "What we know is a drop; what we do not know is an ocean.",
    author: "Isaac Newton"
  },
  {
    text: "Nothing is too wonderful to be true, if it is consistent with the laws of nature.",
    author: "Michael Faraday"
  },
  {
    text: "An experiment is a question which science poses to nature.",
    author: "Max Planck"
  },
  {
    text: "The present is theirs; the future, for which I really worked, is mine.",
    author: "Nikola Tesla"
  }
];

function showFallbackQuote() {
  if (!quoteText || !quoteAuthor) return;

  const quote =
    fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];

  quoteText.textContent = quote.quote;
  quoteAuthor.textContent = `— ${quote.author}`;
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
  saveTasks(getTasks().filter(task => !task.completed));
  renderTasks();
});

quickNote.value = localStorage.getItem(storageKeys.quickNote) || "";
quickNote.addEventListener("input", () => {
  localStorage.setItem(storageKeys.quickNote, quickNote.value);
});

if (newQuoteButton) {
  newQuoteButton.addEventListener("click", showFallbackQuote);
}
showFallbackQuote();

initialiseTheme();
updateClock();
buildCalendar();
renderLinks();
renderProjects();
renderTasks();
setInterval(updateClock, 1000);
