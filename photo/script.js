/* ==========================================
   CHEMISTRY PHOTO SEARCH
   Automatic GitHub image gallery
   Search + Preview + Copy Image
========================================== */

// 1. GITHUB CONFIGURATION
const GITHUB_USERNAME = "YOUR_GITHUB_USERNAME";
const REPOSITORY_NAME = "catalystforsuccess";
const BRANCH = "main";
const IMAGE_FOLDER = "photo/images";

// 2. PAGE ELEMENTS
const searchInput = document.getElementById("searchInput");
const gallery = document.getElementById("gallery");
const resultCount = document.getElementById("resultCount");
const status = document.getElementById("status");
const emptyState = document.getElementById("emptyState");
const emptyTitle = document.getElementById("emptyTitle");
const emptyText = document.getElementById("emptyText");

let photos = [];

// 3. LOAD PHOTOS FROM GITHUB
async function loadPhotos() {
  status.textContent = "Loading chemistry photos...";
  gallery.replaceChildren();

  try {
    const apiURL =
      `https://api.github.com/repos/${GITHUB_USERNAME}/` +
      `${REPOSITORY_NAME}/contents/${IMAGE_FOLDER}?ref=${BRANCH}`;

    const response = await fetch(apiURL);

    if (!response.ok) {
      throw new Error(
        `GitHub error ${response.status}. Check your username, repository, branch, and image folder.`
      );
    }

    const files = await response.json();

    photos = files
      .filter(file =>
        file.type === "file" &&
        /\.(jpg|jpeg|png|gif|webp|bmp|avif)$/i.test(file.name)
      )
      .map(file => ({
        name: file.name,
        url: file.download_url
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    status.textContent = "";
    renderPhotos();

  } catch (error) {
    console.error("Photo loading error:", error);

    status.textContent = error.message;
    resultCount.textContent = "Photos unavailable";

    emptyState.hidden = false;
    emptyTitle.textContent = "Could not load photos";
    emptyText.textContent =
      "Check your GitHub configuration and photo folder.";
  }
}

// 4. RENDER SEARCH RESULTS
function renderPhotos() {
  const query = searchInput.value.trim().toLowerCase();

  const filtered = photos.filter(photo =>
    photo.name.toLowerCase().includes(query)
  );

  gallery.replaceChildren();

  filtered.forEach(photo => {
    const card = document.createElement("article");
    card.className = "photo-card";

    // Image preview button
    const imageButton = document.createElement("button");
    imageButton.className = "image-link";
    imageButton.type = "button";
    imageButton.setAttribute(
      "aria-label",
      `Preview ${photo.name}`
    );

    const image = document.createElement("img");
    image.src = photo.url;
    image.alt = photo.name;
    image.loading = "lazy";

    imageButton.appendChild(image);

    imageButton.addEventListener("click", () => {
      openPreview(photo.url, photo.name);
    });

    // Photo title
    const title = document.createElement("h3");
    title.textContent = photo.name.replace(/\.[^.]+$/, "");

    // Filename
    const filename = document.createElement("p");
    filename.className = "filename";
    filename.textContent = photo.name;

    // Copy Image button
    const copyButton = document.createElement("button");
    copyButton.className = "copy-button";
    copyButton.type = "button";
    copyButton.textContent = "▣ Copy Image";

    const copyStatus = document.createElement("span");
    copyStatus.className = "copy-status";
    copyStatus.setAttribute("role", "status");

    copyButton.addEventListener("click", () => {
      copyImageToClipboard(
        photo.url,
        copyButton,
        copyStatus
      );
    });

    card.append(
      imageButton,
      title,
      filename,
      copyButton,
      copyStatus
    );

    gallery.appendChild(card);
  });

  resultCount.textContent =
    `${filtered.length} of ${photos.length} photos`;

  emptyState.hidden = filtered.length > 0;

  if (filtered.length === 0) {
    emptyTitle.textContent =
      photos.length ? "No photos found" : "No photos available";

    emptyText.textContent =
      photos.length
        ? "Try another search term."
        : "Upload images to your GitHub photo/images folder.";
  }
}

// 5. COPY ACTUAL IMAGE TO CLIPBOARD
async function copyImageToClipboard(imageUrl, button, copyStatus) {
  const originalText = "▣ Copy Image";

  try {
    if (!navigator.clipboard || !window.ClipboardItem) {
      throw new Error("Image clipboard is not supported by this browser.");
    }

    button.disabled = true;
    button.textContent = "Copying image...";
    copyStatus.textContent = "";

    // Fetch the image
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error("Could not download the image.");
    }

    const blob = await response.blob();

    // Convert to PNG for clipboard compatibility
    let pngBlob;

    if (blob.type === "image/png") {
      pngBlob = blob;
    } else {
      const bitmap = await createImageBitmap(blob);

      try {
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;

        const context = canvas.getContext("2d");
        context.drawImage(bitmap, 0, 0);

        pngBlob = await new Promise((resolve, reject) => {
          canvas.toBlob(result => {
            if (result) resolve(result);
            else reject(new Error("Image conversion failed."));
          }, "image/png");
        });
      } finally {
        bitmap.close();
      }
    }

    // Write the image data, not the filename or URL
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": pngBlob })
    ]);

    button.textContent = "✓ Image copied!";
    copyStatus.textContent = "Paste the image into your app.";

  } catch (error) {
    console.error("Copy image error:", error);

    button.textContent = originalText;
    copyStatus.textContent =
      "Copy failed. Try Chrome on HTTPS or check image access.";

  } finally {
    button.disabled = false;
  }
}

// 6. FULL-SCREEN IMAGE PREVIEW
function openPreview(imageUrl, imageName) {
  const preview = document.getElementById("preview");
  const previewImage = document.getElementById("previewImage");

  if (preview && previewImage) {
    previewImage.src = imageUrl;
    previewImage.alt = imageName;
    preview.hidden = false;
  } else {
    window.open(imageUrl, "_blank", "noopener");
  }
}

function closePreview() {
  const preview = document.getElementById("preview");
  const previewImage = document.getElementById("previewImage");

  if (preview) preview.hidden = true;
  if (previewImage) previewImage.src = "";
}

const closePreviewButton = document.getElementById("closePreview");

if (closePreviewButton) {
  closePreviewButton.addEventListener("click", closePreview);
}

const previewElement = document.getElementById("preview");

if (previewElement) {
  previewElement.addEventListener("click", event => {
    if (event.target === previewElement) {
      closePreview();
    }
  });
}

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closePreview();
  }

  if (
    event.key === "/" &&
    !["INPUT", "TEXTAREA"].includes(
      document.activeElement.tagName
    )
  ) {
    event.preventDefault();
    searchInput.focus();
  }
});

// 7. LIVE SEARCH
searchInput.addEventListener("input", renderPhotos);

// 8. START THE GALLERY
loadPhotos();
