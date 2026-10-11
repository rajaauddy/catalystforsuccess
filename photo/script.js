const searchInput = document.getElementById("searchInput");
const gallery = document.getElementById("gallery");
const resultCount = document.getElementById("resultCount");
const status = document.getElementById("status");
const emptyState = document.getElementById("emptyState");
const emptyTitle = document.getElementById("emptyTitle");
const emptyText = document.getElementById("emptyText");
const chooseFolder = document.getElementById("chooseFolder");
const folderInput = document.getElementById("folderInput");

const imageExtensions = /\.(jpe?g|png|webp|gif|avif|bmp|svg)$/i;

let photos = [];
let localMode = false;
let objectUrls = [];

function cleanName(path) {
  return path
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\//g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function encodedPath(path) {
  return path
    .split("/")
    .map(segment => encodeURIComponent(segment))
    .join("/");
}

function setPhotos(items) {
  photos = items;
  renderPhotos();
}

function renderPhotos() {
  const query = searchInput.value.trim().toLowerCase();

  const matches = photos.filter(photo =>
    `${photo.name} ${photo.path}`.toLowerCase().includes(query)
  );

  gallery.replaceChildren();

  for (const photo of matches) {
    const card = document.createElement("article");
    card.className = "photo-card";

    const link = document.createElement("a");
    link.className = "image-link";
    link.href = photo.src;
    link.target = "_blank";
    link.rel = "noopener";
    link.setAttribute("aria-label", `Open ${photo.name}`);

    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.name;
    img.loading = "lazy";

    link.appendChild(img);

    const title = document.createElement("h3");
    title.textContent = photo.name;

    const filename = document.createElement("p");
    filename.className = "filename";
    filename.textContent = photo.path;

    card.append(link, title, filename);
    gallery.appendChild(card);
  }

  resultCount.textContent =
    `${matches.length} of ${photos.length} photos`;

  emptyState.hidden = matches.length > 0;

  if (query) {
    emptyTitle.textContent = "No matching photos";
    emptyText.textContent =
      `No filenames matched "${searchInput.value.trim()}".`;
  } else {
    emptyTitle.textContent = "No photos loaded";
    emptyText.textContent =
      "Select your photos folder or add images to the project.";
  }
}

async function loadPublishedIndex() {
  const response = await fetch("./photos-index.json", {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Could not load photos-index.json");
  }

  const items = await response.json();

  if (!Array.isArray(items)) {
    throw new Error("The photo index has an invalid format.");
  }

  localMode = false;

  setPhotos(items.map(item => ({
    name: item.name,
    path: item.path,
    src: `./photos/${encodedPath(item.path)}`
  })));

  status.textContent = `Loaded ${items.length} indexed photos.`;
}

function loadLocalFolder(files) {
  // Release object URLs from the previous selection.
  objectUrls.forEach(url => URL.revokeObjectURL(url));
  objectUrls = [];

  const items = Array.from(files)
    .filter(file =>
      imageExtensions.test(file.name) &&
      file.webkitRelativePath
    )
    .map(file => {
      // Remove the selected top-level folder name.
      const path = file.webkitRelativePath
        .split("/")
        .slice(1)
        .join("/");

      const src = URL.createObjectURL(file);
      objectUrls.push(src);

      return {
        name: cleanName(path),
        path,
        src
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  localMode = true;
  setPhotos(items);

  status.textContent =
    `Loaded ${items.length} photos from your selected folder.`;
}

chooseFolder.addEventListener("click", () => {
  folderInput.click();
});

folderInput.addEventListener("change", event => {
  if (event.target.files?.length) {
    loadLocalFolder(event.target.files);
  }
});

searchInput.addEventListener("input", renderPhotos);

// Keyboard shortcut: press "/" to focus the search box.
document.addEventListener("keydown", event => {
  if (
    event.key === "/" &&
    !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)
  ) {
    event.preventDefault();
    searchInput.focus();
  }
});

async function initialize() {
  if (window.location.protocol === "file:") {
    status.textContent =
      "Choose your photos folder to start searching locally.";
    resultCount.textContent = "Waiting for a folder";
    emptyTitle.textContent = "Select your photos folder";
    emptyText.textContent =
      "Your browser needs permission to read local images.";
    return;
  }

  try {
    await loadPublishedIndex();
  } catch (error) {
    console.error(error);
    status.textContent =
      "The index could not be loaded. You can select your photos folder instead.";
    resultCount.textContent = "Index unavailable";
  }
}

initialize();