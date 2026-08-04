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


const motivationalQuotes = [
  {
    quote: "Build the simplest version that can teach you something.",
    author: "AETHER"
  },
  {
    quote: "A difficult problem becomes smaller when you define it precisely.",
    author: "AETHER"
  },
  {
    quote: "Progress is usually a sequence of corrected assumptions.",
    author: "AETHER"
  },
  {
    quote: "Design first for clarity, then for performance.",
    author: "AETHER"
  },
  {
    quote: "A failed model is still useful if it reveals the wrong assumption.",
    author: "AETHER"
  },
  {
    quote: "The best engineering questions are specific enough to test.",
    author: "AETHER"
  },
  {
    quote: "Work until the mechanism is understood, not merely reproduced.",
    author: "AETHER"
  },
  {
    quote: "Complex systems are solved one interface at a time.",
    author: "AETHER"
  },
  {
    quote: "A good diagram can remove an hour of confusion.",
    author: "AETHER"
  },
  {
    quote: "Precision begins with naming things correctly.",
    author: "AETHER"
  },
  {
    quote: "Every simulation is an argument built from assumptions.",
    author: "AETHER"
  },
  {
    quote: "Reliable results require both calculation and scepticism.",
    author: "AETHER"
  },
  {
    quote: "The fastest route forward is often a better abstraction.",
    author: "AETHER"
  },
  {
    quote: "Measure twice, model once, validate always.",
    author: "AETHER"
  },
  {
    quote: "A clean equation is not automatically a correct model.",
    author: "AETHER"
  },
  {
    quote: "Understanding grows when you compare methods, not just answers.",
    author: "AETHER"
  },
  {
    quote: "The quality of a result depends on the quality of the question.",
    author: "AETHER"
  },
  {
    quote: "Build tools that make difficult thinking easier.",
    author: "AETHER"
  },
  {
    quote: "An engineer improves reality by first representing it honestly.",
    author: "AETHER"
  },
  {
    quote: "Small improvements compound into technical mastery.",
    author: "AETHER"
  },
  {
    quote: "When the result is surprising, inspect the assumptions before celebrating.",
    author: "AETHER"
  },
  {
    quote: "Good code makes the mathematics visible.",
    author: "AETHER"
  },
  {
    quote: "A model should be as detailed as necessary and no more.",
    author: "AETHER"
  },
  {
    quote: "The first prototype answers questions the plan cannot.",
    author: "AETHER"
  },
  {
    quote: "Difficulty is often a signal that the problem needs decomposition.",
    author: "AETHER"
  },
  {
    quote: "A strong solution explains why alternatives were rejected.",
    author: "AETHER"
  },
  {
    quote: "Accuracy without interpretation is incomplete.",
    author: "AETHER"
  },
  {
    quote: "Every constraint can become a design decision.",
    author: "AETHER"
  },
  {
    quote: "The best projects produce both an artefact and a better thinker.",
    author: "AETHER"
  },
  {
    quote: "What you cannot explain clearly, you do not yet control.",
    author: "AETHER"
  },
  {
    quote: "Numerical stability is part of correctness.",
    author: "AETHER"
  },
  {
    quote: "A result is trustworthy only when you know how it could fail.",
    author: "AETHER"
  },
  {
    quote: "Research starts where confident answers end.",
    author: "AETHER"
  },
  {
    quote: "The purpose of mathematics is not decoration but structure.",
    author: "AETHER"
  },
  {
    quote: "Good engineering balances performance, cost, safety and simplicity.",
    author: "AETHER"
  },
  {
    quote: "Do not optimise a process you have not understood.",
    author: "AETHER"
  },
  {
    quote: "A careful approximation is better than false precision.",
    author: "AETHER"
  },
  {
    quote: "The most valuable question is often: what changes the result most?",
    author: "AETHER"
  },
  {
    quote: "Test the boundary cases; they expose weak reasoning.",
    author: "AETHER"
  },
  {
    quote: "A robust system behaves sensibly even when inputs do not.",
    author: "AETHER"
  },
  {
    quote: "The model is not reality, but it should respect reality.",
    author: "AETHER"
  },
  {
    quote: "Iteration is not repetition when each cycle uses evidence.",
    author: "AETHER"
  },
  {
    quote: "Technical confidence should grow from verification, not familiarity.",
    author: "AETHER"
  },
  {
    quote: "A concise solution is usually the result of deep work.",
    author: "AETHER"
  },
  {
    quote: "The first calculation estimates; the second checks.",
    author: "AETHER"
  },
  {
    quote: "A project becomes serious when its decisions are documented.",
    author: "AETHER"
  },
  {
    quote: "You improve faster when you study your errors systematically.",
    author: "AETHER"
  },
  {
    quote: "The computer executes instructions, not intentions.",
    author: "AETHER"
  },
  {
    quote: "A graph can reveal what a table hides.",
    author: "AETHER"
  },
  {
    quote: "A clear limitation strengthens rather than weakens an analysis.",
    author: "AETHER"
  },
  {
    quote: "Engineering judgement begins where formulas stop deciding.",
    author: "AETHER"
  },
  {
    quote: "Make the hidden assumptions explicit.",
    author: "AETHER"
  },
  {
    quote: "A simulation is useful when it changes a decision.",
    author: "AETHER"
  },
  {
    quote: "Strong foundations make advanced ideas feel natural.",
    author: "AETHER"
  },
  {
    quote: "The best workflow removes friction from repeated tasks.",
    author: "AETHER"
  },
  {
    quote: "If a method cannot be validated, its output should be treated cautiously.",
    author: "AETHER"
  },
  {
    quote: "A mechanism understood from first principles is easier to improve.",
    author: "AETHER"
  },
  {
    quote: "The shortest code is not always the clearest code.",
    author: "AETHER"
  },
  {
    quote: "Build for the problem you have, not the complexity you imagine.",
    author: "AETHER"
  },
  {
    quote: "Every useful model leaves something out deliberately.",
    author: "AETHER"
  },
  {
    quote: "A precise definition can solve half the problem.",
    author: "AETHER"
  },
  {
    quote: "Curiosity becomes expertise through disciplined follow-through.",
    author: "AETHER"
  },
  {
    quote: "The difference between a guess and an estimate is the reasoning.",
    author: "AETHER"
  },
  {
    quote: "Good design makes correct use easier than incorrect use.",
    author: "AETHER"
  },
  {
    quote: "The most impressive project is one you can explain completely.",
    author: "AETHER"
  },
  {
    quote: "When two methods disagree, investigate before averaging.",
    author: "AETHER"
  },
  {
    quote: "Real progress often looks like fewer unexplained details.",
    author: "AETHER"
  },
  {
    quote: "A solver is only as good as its convergence criteria.",
    author: "AETHER"
  },
  {
    quote: "Visualisation should reveal structure, not merely decorate output.",
    author: "AETHER"
  },
  {
    quote: "A strong engineer asks what evidence would change the conclusion.",
    author: "AETHER"
  },
  {
    quote: "Documentation preserves the reasoning behind the result.",
    author: "AETHER"
  },
  {
    quote: "The best time to simplify is before complexity becomes permanent.",
    author: "AETHER"
  },
  {
    quote: "A physical test and a simulation answer different parts of the same question.",
    author: "AETHER"
  },
  {
    quote: "The purpose of validation is not to prove perfection but to quantify trust.",
    author: "AETHER"
  },
  {
    quote: "Good assumptions are visible, justified and revisable.",
    author: "AETHER"
  },
  {
    quote: "A project grows when its interfaces are designed carefully.",
    author: "AETHER"
  },
  {
    quote: "The deeper the theory, the more useful the approximation becomes.",
    author: "AETHER"
  },
  {
    quote: "A correct answer reached accidentally is not yet understanding.",
    author: "AETHER"
  },
  {
    quote: "Make each revision remove a specific weakness.",
    author: "AETHER"
  },
  {
    quote: "A reliable system fails clearly rather than silently.",
    author: "AETHER"
  },
  {
    quote: "There is no substitute for checking units.",
    author: "AETHER"
  },
  {
    quote: "The most useful models are understandable enough to challenge.",
    author: "AETHER"
  },
  {
    quote: "An elegant solution usually exposes the governing structure.",
    author: "AETHER"
  },
  {
    quote: "Do not confuse computational expense with physical accuracy.",
    author: "AETHER"
  },
  {
    quote: "A difficult derivation is easier when each step has a purpose.",
    author: "AETHER"
  },
  {
    quote: "You do not need every tool; you need the right tool used well.",
    author: "AETHER"
  },
  {
    quote: "The best experiments isolate the variable that matters.",
    author: "AETHER"
  },
  {
    quote: "Learning accelerates when theory is connected to something you build.",
    author: "AETHER"
  },
  {
    quote: "A good project question creates a path for evaluation.",
    author: "AETHER"
  },
  {
    quote: "When performance matters, measure before optimising.",
    author: "AETHER"
  },
  {
    quote: "A system is understandable when its components and interactions are explicit.",
    author: "AETHER"
  },
  {
    quote: "Strong technical work includes uncertainty, not just conclusions.",
    author: "AETHER"
  },
  {
    quote: "The most valuable revision is the one that improves the reasoning.",
    author: "AETHER"
  },
  {
    quote: "A practical solution can still be mathematically rigorous.",
    author: "AETHER"
  },
  {
    quote: "Breakthroughs often begin as better representations of old problems.",
    author: "AETHER"
  },
  {
    quote: "The goal is not to remove every error but to understand and control it.",
    author: "AETHER"
  },
  {
    quote: "A reliable estimate should survive a change in method.",
    author: "AETHER"
  },
  {
    quote: "Build knowledge in layers: principle, model, implementation, validation.",
    author: "AETHER"
  },
  {
    quote: "The best engineering habit is to ask what would make the result wrong.",
    author: "AETHER"
  },
  {
    quote: "Finish the version that works, then improve the version that matters.",
    author: "AETHER"
  }
];

let previousQuoteIndex = -1;

function showRandomQuote() {
  if (!quoteText || !quoteAuthor || motivationalQuotes.length === 0) return;

  let index;

  do {
    index = Math.floor(Math.random() * motivationalQuotes.length);
  } while (
    motivationalQuotes.length > 1 &&
    index === previousQuoteIndex
  );

  previousQuoteIndex = index;

  const selectedQuote = motivationalQuotes[index];
  quoteText.textContent = selectedQuote.quote;
  quoteAuthor.textContent = `— ${selectedQuote.author}`;
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
  newQuoteButton.addEventListener("click", showRandomQuote);
}
showRandomQuote();

initialiseTheme();
updateClock();
buildCalendar();
renderLinks();
renderProjects();
renderTasks();
setInterval(updateClock, 1000);
