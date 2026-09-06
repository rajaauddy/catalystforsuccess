// ============================================
// GITHUB SETTINGS
// ============================================

const GITHUB_USERNAME = "rajaauddy";
const GITHUB_REPOSITORY = "catalystforsuccess";
const GITHUB_BRANCH = "main";
const IMAGE_FOLDER = "structure/images";


// ============================================
// SUPPORTED IMAGE FORMATS
// ============================================

const IMAGE_EXTENSIONS = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif",
    ".bmp",
    ".svg"
];


// ============================================
// VARIABLES
// ============================================

let allImages = [];


// ============================================
// HTML ELEMENTS
// ============================================

const searchInput =
    document.getElementById("searchInput");

const searchBtn =
    document.getElementById("searchBtn");

const status =
    document.getElementById("status");

const results =
    document.getElementById("results");


// ============================================
// GITHUB API URL
// ============================================

const API_URL =
    `https://api.github.com/repos/` +
    `${GITHUB_USERNAME}/` +
    `${GITHUB_REPOSITORY}/contents/` +
    `${IMAGE_FOLDER}?ref=${GITHUB_BRANCH}`;


// ============================================
// LOAD IMAGES
// ============================================

async function loadImages() {

    status.textContent =
        "Loading image library...";

    try {

        const response =
            await fetch(API_URL, {
                cache: "no-store"
            });


        if (!response.ok) {

            throw new Error(
                "GitHub API error: " +
                response.status
            );

        }


        const files =
            await response.json();


        if (!Array.isArray(files)) {

            throw new Error(
                "Images folder was not found."
            );

        }


        // Keep image files only

        allImages =
            files.filter(file => {

                return (
                    file.type === "file" &&
                    isImage(file.name)
                );

            });


        // Sort alphabetically

        allImages.sort((a, b) =>
            a.name.localeCompare(
                b.name,
                undefined,
                {
                    numeric: true,
                    sensitivity: "base"
                }
            )
        );


        status.textContent =
            `${allImages.length} image(s) available.`;


        showStartMessage();


    }
    catch (error) {

        console.error(error);


        status.textContent =
            "Image library unavailable";


        results.innerHTML = `

            <div class="empty">

                <h2>
                    ⚠️ Image library unavailable
                </h2>

                <p>
                    GitHub could not access:
                </p>

                <p>
                    <strong>
                        structure/images
                    </strong>
                </p>

                <p>
                    Repository:
                    <strong>
                        rajaauddy/catalystforsuccess
                    </strong>
                </p>

                <p>
                    Please make sure your images are
                    actually inside the
                    <strong>images</strong>
                    folder.
                </p>

            </div>

        `;

    }

}


// ============================================
// CHECK IMAGE FILE
// ============================================

function isImage(filename) {

    const name =
        filename.toLowerCase();


    return IMAGE_EXTENSIONS.some(
        extension =>
            name.endsWith(extension)
    );

}


// ============================================
// START MESSAGE
// ============================================

function showStartMessage() {

    results.innerHTML = `

        <div class="empty">

            <h2>
                🔍 Search for an image
            </h2>

            <p>
                Type an image name above.
            </p>

            <p>
                Example:
                <strong>dog</strong>
            </p>

        </div>

    `;

}


// ============================================
// SEARCH
// ============================================

function searchImages() {

    const text =
        searchInput.value
        .trim()
        .toLowerCase();


    results.innerHTML = "";


    // Empty search

    if (!text) {

        status.textContent =
            `${allImages.length} image(s) available.`;

        showStartMessage();

        return;

    }


    // Search filename

    const matches =
        allImages.filter(image => {

            return image.name
                .toLowerCase()
                .includes(text);

        });


    status.textContent =
        `${matches.length} image(s) found.`;


    // Nothing found

    if (matches.length === 0) {

        results.innerHTML = `

            <div class="empty">

                <h2>
                    😕 No image found
                </h2>

                <p>
                    No image found for
                    <strong>
                        ${escapeHTML(text)}
                    </strong>
                </p>

            </div>

        `;

        return;

    }


    // Display images

    matches.forEach(
        image =>
            displayImage(image)
    );

}


// ============================================
// DISPLAY IMAGE
// ============================================

function displayImage(file) {

    const card =
        document.createElement("div");

    card.className =
        "image-card";


    // Build raw GitHub image URL

    const imageURL =
        `https://raw.githubusercontent.com/` +
        `${GITHUB_USERNAME}/` +
        `${GITHUB_REPOSITORY}/` +
        `${GITHUB_BRANCH}/` +
        `${IMAGE_FOLDER}/` +
        encodeURIComponent(file.name);


    // Image

    const img =
        document.createElement("img");

    img.src =
        imageURL;

    img.alt =
        file.name;

    img.loading =
        "lazy";


    // Filename

    const filename =
        document.createElement("div");

    filename.className =
        "filename";

    filename.textContent =
        file.name;


    // Copy button

    const copyButton =
        document.createElement("button");

    copyButton.className =
        "copy-btn";

    copyButton.type =
        "button";

    copyButton.textContent =
        "📋 Copy Image";


    copyButton.onclick =
        function () {

            copyImage(
                imageURL,
                copyButton
            );

        };


    // Add elements

    card.appendChild(img);

    card.appendChild(filename);

    card.appendChild(copyButton);

    results.appendChild(card);

}


// ============================================
// COPY IMAGE
// ============================================

async function copyImage(
    imageURL,
    button
) {

    const oldText =
        button.textContent;


    try {

        button.textContent =
            "⏳ Copying...";


        button.disabled =
            true;


        // Download image

        const response =
            await fetch(
                imageURL,
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Could not download image."
            );

        }


        const blob =
            await response.blob();


        // Convert to PNG

        const pngBlob =
            await convertToPNG(blob);


        // Copy

        await navigator.clipboard.write([

            new ClipboardItem({

                "image/png":
                    pngBlob

            })

        ]);


        button.textContent =
            "✅ Copied!";


        setTimeout(
            () => {

                button.textContent =
                    oldText;

                button.disabled =
                    false;

            },
            2000
        );


    }
    catch (error) {

        console.error(
            "Copy error:",
            error
        );


        button.textContent =
            "❌ Copy failed";


        button.disabled =
            false;


        alert(
            "Copy failed.\n\n" +
            "Please use Chrome or Edge " +
            "and open the GitHub Pages website."
        );


        setTimeout(
            () => {

                button.textContent =
                    oldText;

            },
            2000
        );

    }

}


// ============================================
// CONVERT IMAGE TO PNG
// ============================================

function convertToPNG(blob) {

    return new Promise(
        (resolve, reject) => {

            const img =
                new Image();

            img.crossOrigin =
                "anonymous";


            const url =
                URL.createObjectURL(blob);


            img.onload =
                function () {

                    try {

                        const canvas =
                            document.createElement(
                                "canvas"
                            );


                        canvas.width =
                            img.naturalWidth;

                        canvas.height =
                            img.naturalHeight;


                        const ctx =
                            canvas.getContext(
                                "2d"
                            );


                        ctx.drawImage(
                            img,
                            0,
                            0
                        );


                        canvas.toBlob(
                            function(pngBlob) {

                                URL.revokeObjectURL(
                                    url
                                );


                                if (pngBlob) {

                                    resolve(
                                        pngBlob
                                    );

                                }
                                else {

                                    reject(
                                        new Error(
                                            "PNG conversion failed."
                                        )
                                    );

                                }

                            },
                            "image/png"
                        );

                    }
                    catch (error) {

                        URL.revokeObjectURL(
                            url
                        );

                        reject(error);

                    }

                };


            img.onerror =
                function () {

                    URL.revokeObjectURL(
                        url
                    );

                    reject(
                        new Error(
                            "Image could not be loaded."
                        )
                    );

                };


            img.src =
                url;

        }
    );

}


// ============================================
// SECURITY
// ============================================

function escapeHTML(text) {

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ============================================
// SEARCH BUTTON
// ============================================

searchBtn.addEventListener(
    "click",
    searchImages
);


// ============================================
// ENTER KEY
// ============================================

searchInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            searchImages();

        }

    }
);


// ============================================
// START
// ============================================

loadImages();
