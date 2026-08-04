const storageKeys = {
  theme: "aether-portal-theme",
  shortcuts: "aether-portal-shortcuts-v1"
};

const defaultShortcuts = [
  { name: "Dashboard", url: "index.html", initials: "AE" },
  { name: "Google Drive", url: "https://drive.google.com/", initials: "DR" },
  { name: "GitHub", url: "https://github.com/", initials: "GH" },
  { name: "Onshape", url: "https://cad.onshape.com/", initials: "ON" },
  { name: "SimScale", url: "https://www.simscale.com/", initials: "SS" },
  { name: "Calendar", url: "https://calendar.google.com/", initials: "CA" }
];

const portalClock = document.querySelector("#portalClock");
const portalDate = document.querySelector("#portalDate");
const themeToggle = document.querySelector("#themeToggle");
const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");

const shortcutGrid = document.querySelector("#shortcutGrid");
const addShortcutButton = document.querySelector("#addShortcutButton");
const modalBackdrop = document.querySelector("#modalBackdrop");
const closeModalButton = document.querySelector("#closeModalButton");
const cancelShortcutButton = document.querySelector("#cancelShortcutButton");
const shortcutForm = document.querySelector("#shortcutForm");
const shortcutEditIndex = document.querySelector("#shortcutEditIndex");
const shortcutName = document.querySelector("#shortcutName");
const shortcutUrl = document.querySelector("#shortcutUrl");
const shortcutInitials = document.querySelector("#shortcutInitials");
const deleteShortcutButton = document.querySelector("#deleteShortcutButton");
const modalTitle = document.querySelector("#modalTitle");

function updateClock() {
  const now = new Date();

  portalClock.textContent = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(now);

  portalDate.textContent = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(now);
}

function setTheme(theme) {
  document.body.classList.toggle("light", theme === "light");
  localStorage.setItem(storageKeys.theme, theme);
}

function initialiseTheme() {
  const saved = localStorage.getItem(storageKeys.theme);
  const systemLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  setTheme(saved || (systemLight ? "light" : "dark"));
}

function getShortcuts() {
  try {
    return JSON.parse(localStorage.getItem(storageKeys.shortcuts)) || structuredClone(defaultShortcuts);
  } catch {
    return structuredClone(defaultShortcuts);
  }
}

function saveShortcuts(shortcuts) {
  localStorage.setItem(storageKeys.shortcuts, JSON.stringify(shortcuts));
}

function createInitials(name) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "↗";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function renderShortcuts() {
  const shortcuts = getShortcuts();
  shortcutGrid.innerHTML = "";

  if (shortcuts.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No shortcuts yet. Add your first one.";
    shortcutGrid.appendChild(empty);
    return;
  }

  shortcuts.forEach((shortcut, index) => {
    const card = document.createElement("div");
    card.className = "shortcut-card";

    const link = document.createElement("a");
    link.className = "shortcut-link";
    link.href = shortcut.url;

    if (!shortcut.url.endsWith(".html") && !shortcut.url.startsWith("/")) {
      link.target = "_blank";
      link.rel = "noopener";
    }

    const icon = document.createElement("span");
    icon.className = "shortcut-icon";
    icon.textContent = shortcut.initials || createInitials(shortcut.name);

    const name = document.createElement("span");
    name.className = "shortcut-name";
    name.textContent = shortcut.name;

    link.append(icon, name);

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "edit-shortcut";
    editButton.textContent = "⋯";
    editButton.title = "Edit shortcut";
    editButton.addEventListener("click", () => openShortcutModal(index));

    card.append(link, editButton);
    shortcutGrid.appendChild(card);
  });
}

function openShortcutModal(index = null) {
  shortcutForm.reset();
  shortcutEditIndex.value = index ?? "";
  deleteShortcutButton.classList.toggle("hidden", index === null);
  modalTitle.textContent = index === null ? "Add shortcut" : "Edit shortcut";

  if (index !== null) {
    const shortcut = getShortcuts()[index];
    shortcutName.value = shortcut.name;
    shortcutUrl.value = shortcut.url;
    shortcutInitials.value = shortcut.initials || "";
  }

  modalBackdrop.classList.remove("hidden");
  modalBackdrop.setAttribute("aria-hidden", "false");
  shortcutName.focus();
}

function closeShortcutModal() {
  modalBackdrop.classList.add("hidden");
  modalBackdrop.setAttribute("aria-hidden", "true");
}

function openSearch(query) {
  const trimmed = query.trim();
  if (!trimmed) return;

  const [possiblePrefix, ...rest] = trimmed.split(/\s+/);
  const prefix = possiblePrefix.toLowerCase();
  const term = rest.join(" ").trim();

  const engines = {
    g: value => `https://www.google.com/search?q=${encodeURIComponent(value)}`,
    yt: value => `https://www.youtube.com/results?search_query=${encodeURIComponent(value)}`,
    gh: value => `https://github.com/search?q=${encodeURIComponent(value)}`,
    sch: value => `https://scholar.google.com/scholar?q=${encodeURIComponent(value)}`,
    arxiv: value => `https://arxiv.org/search/?query=${encodeURIComponent(value)}&searchtype=all`,
    w: value => `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(value)}`
  };

  if (engines[prefix] && term) {
    window.location.href = engines[prefix](term);
    return;
  }

  window.location.href = `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
}

searchForm.addEventListener("submit", event => {
  event.preventDefault();
  openSearch(searchInput.value);
});

themeToggle.addEventListener("click", () => {
  setTheme(document.body.classList.contains("light") ? "dark" : "light");
});

addShortcutButton.addEventListener("click", () => openShortcutModal());
closeModalButton.addEventListener("click", closeShortcutModal);
cancelShortcutButton.addEventListener("click", closeShortcutModal);

modalBackdrop.addEventListener("click", event => {
  if (event.target === modalBackdrop) closeShortcutModal();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeShortcutModal();
});

shortcutForm.addEventListener("submit", event => {
  event.preventDefault();

  const shortcuts = getShortcuts();
  const editIndex = shortcutEditIndex.value === "" ? null : Number(shortcutEditIndex.value);
  const entry = {
    name: shortcutName.value.trim(),
    url: shortcutUrl.value.trim(),
    initials: shortcutInitials.value.trim().toUpperCase() || createInitials(shortcutName.value)
  };

  if (editIndex === null) {
    shortcuts.push(entry);
  } else {
    shortcuts[editIndex] = entry;
  }

  saveShortcuts(shortcuts);
  renderShortcuts();
  closeShortcutModal();
});

deleteShortcutButton.addEventListener("click", () => {
  const index = Number(shortcutEditIndex.value);
  const shortcuts = getShortcuts();
  const shortcut = shortcuts[index];

  if (!shortcut || !confirm(`Delete "${shortcut.name}"?`)) return;

  shortcuts.splice(index, 1);
  saveShortcuts(shortcuts);
  renderShortcuts();
  closeShortcutModal();
});

initialiseTheme();
updateClock();
renderShortcuts();
setInterval(updateClock, 1000);
