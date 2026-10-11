const searchInput = document.getElementById("searchInput");
const gallery = document.getElementById("gallery");
const resultCount = document.getElementById("resultCount");
const status = document.getElementById("status");
const emptyState = document.getElementById("emptyState");
const emptyTitle = document.getElementById("emptyTitle");
const emptyText = document.getElementById("emptyText");

const GITHUB_USERNAME = "rajaauddy";
const REPOSITORY_NAME = "catalystforsuccess";
const BRANCH = "main";
const IMAGE_FOLDER = "photo/images";

let photos = [];

async function loadPhotos() {
  status.textContent = "Loading photos from GitHub...";
  gallery.replaceChildren();

  try {
    const apiURL =
      `https://api.github.com/repos/${GITHUB_USERNAME}/` +
      `${REPOSITORY_NAME}/contents/${IMAGE_FOLDER}?ref=${BRANCH}`;

    const response = await fetch(apiURL);

    if (!response.ok) {
      throw new Error(
        `GitHub returned ${response.status}. Check the repository, branch, and folder names.`
      );
    }

    const files = await response.json();

    photos = files
      .filter(file =>
        file.type === "file" &&
        /\.(jpe?g|png|gif|webp|bmp|avif)$/i.test(file.name)
      )
      .map(file => ({
        name: file.name,
        url: file.download_url
      }));

    photos.sort((a, b) => a.name.localeCompare(b.name));

    status.textContent = "";
    renderPhotos();
  } catch (error) {
    status.textContent = error.message;
    resultCount.textContent = "Photos unavailable";
    emptyState.hidden = false;
    emptyTitle.textContent = "Could not load photos";
    emptyText.textContent =
      "Check the GitHub username, repository name, branch, and image folder.";
    console.error(error);
  }
}

function renderPhotos() {
  const query = searchInput.value.trim().toLowerCase();

  const filtered = photos.filter(photo =>
    photo.name.toLowerCase().includes(query)
  );

  gallery.replaceChildren();

  filtered.forEach(photo => {
    const card = document.createElement("article");
    card.className = "photo-card";

    const button = document.createElement("button");
    button.className = "image-link";
    button.type = "button";
    button.setAttribute("aria-label", `Preview ${photo.name}`);

    const img = document.createElement("img");
    img.src = photo.url;
    img.alt = photo.name;
    img.loading = "lazy";

    button.appendChild(img);

    button.addEventListener("click", () => {
      const preview = document.getElementById("preview");
      const previewImage = document.getElementById("previewImage");

      if (preview && previewImage) {
        previewImage.src = photo.url;
        previewImage.alt = photo.name;
        preview.hidden = false;
      } else {
        window.open(photo.url, "_blank", "noopener");
      }
    });

    const title = document.createElement("h3");
    title.textContent = photo.name.replace(/\.[^.]+$/, "");

    const filename = document.createElement("p");
    filename.className = "filename";
    filename.textContent = photo.name;

    card.append(button, title, filename);
    gallery.appendChild(card);
  });

  resultCount.textContent =
    `${filtered.length} of ${photos.length} photos`;

  emptyState.hidden = filtered.length > 0;

  if (filtered.length === 0) {
    emptyTitle.textContent =
      photos.length ? "No photos found" : "No photos available";

    emptyText.textContent = photos.length
      ? "Try another search term."
      : "Upload images to your GitHub photo/images folder.";
  }
}

searchInput.addEventListener("input", renderPhotos);

loadPhotos();
