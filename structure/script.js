/* =========================================================
   CATALYST FOR SUCCESS - IMAGE SEARCH
   =========================================================

   GitHub Account:
   rajaauddy

   Repository:
   catalystforsuccess

   Website folder:
   structure

   Image folder:
   structure/images

   ========================================================= */


/* =========================================================
   GITHUB SETTINGS
   ========================================================= */

const GITHUB_USERNAME = "rajaauddy";

const GITHUB_REPOSITORY = "catalystforsuccess";

const IMAGE_FOLDER = "structure/images";


/* =========================================================
   SUPPORTED IMAGE FILES
   ========================================================= */

const IMAGE_EXTENSIONS = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif",
    ".bmp",
    ".svg"
];


/* =========================================================
   VARIABLES
   ========================================================= */

let allImages = [];


/* =========================================================
   GET HTML ELEMENTS
   ========================================================= */

const searchInput =
    document.getElementById("searchInput");

const searchBtn =
    document.getElementById("searchBtn");

const status =
    document.getElementById("status");

const results =
    document.getElementById("results");


/* =========================================================
   LOAD IMAGES FROM GITHUB
   ========================================================= */

async function loadImages() {

    status.textContent =
        "⏳ Loading image library...";

    results.innerHTML = "";


    /*
     * GitHub API address
     *
     * Repository:
     * rajaauddy/catalystforsuccess
     *
     * Folder:
     * structure/images
     */

    const apiURL =
        `https://api.github.com/repos/` +
        `${GITHUB_USERNAME}/` +
        `${GITHUB_REPOSITORY}/contents/` +
        `${IMAGE_FOLDER}`;


    try {

        const response =
            await fetch(
                apiURL,
                {
                    cache: "no-store"
                }
            );


        /* ---------------------------------------------
           CHECK GITHUB RESPONSE
        --------------------------------------------- */

        if (!response.ok) {

            throw new Error(
                `GitHub returned HTTP ${response.status}`
            );

        }


        const files =
            await response.json();


        /* ---------------------------------------------
           MAKE SURE FOLDER WAS FOUND
        --------------------------------------------- */

        if (!Array.isArray(files)) {

            throw new Error(
                "GitHub did not return a folder."
            );

        }


        /* ---------------------------------------------
           FIND IMAGE FILES
        --------------------------------------------- */

        allImages =
            files.filter(
                file => {

                    return (
                        file.type === "file" &&
                        isImageFile(file.name)
                    );

                }
            );


        /* ---------------------------------------------
           SORT IMAGES
        --------------------------------------------- */

        allImages.sort(
            (a, b) => {

                return a.name.localeCompare(
                    b.name,
                    undefined,
                    {
                        numeric: true,
                        sensitivity: "base"
                    }
                );

            }
        );


        /* ---------------------------------------------
           SHOW STATUS
        --------------------------------------------- */

        status.textContent =
            `✅ ${allImages.length} image(s) available.`;


        /* ---------------------------------------------
           WELCOME MESSAGE
        --------------------------------------------- */

        showWelcome();


    }
    catch (error) {

        console.error(
            "GitHub image error:",
            error
        );


        status.textContent =
            "❌ Image library unavailable.";


        results.innerHTML = `

            <div class="empty">

                <h2>
                    ⚠️ Image library unavailable
                </h2>

                <p>
                    Please check your GitHub
                    repository and image folder.
                </p>

                <p>
                    <strong>
                        Account:
                    </strong>
                    rajaauddy
                </p>

                <p>
                    <strong>
                        Repository:
                    </strong>
                    catalystforsuccess
                </p>

                <p>
                    <strong>
                        Image folder:
                    </strong>
                    structure/images
                </p>

            </div>

        `;

    }

}


/* =========================================================
   CHECK IMAGE EXTENSION
   ========================================================= */

function isImageFile(filename) {

    const lowerName =
        filename.toLowerCase();


    return IMAGE_EXTENSIONS.some(
        extension =>
            lowerName.endsWith(extension)
    );

}


/* =========================================================
   WELCOME MESSAGE
   ========================================================= */

function showWelcome() {

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


/* =========================================================
   SEARCH IMAGES
   ========================================================= */

function searchImages() {

    const searchText =
        searchInput.value
        .trim()
        .toLowerCase();


    results.innerHTML = "";


    /* ---------------------------------------------
       EMPTY SEARCH
    --------------------------------------------- */

    if (searchText === "") {

        status.textContent =
            `✅ ${allImages.length} image(s) available.`;

        showWelcome();

        return;

    }


    /* ---------------------------------------------
       SEARCH FILE NAMES
    --------------------------------------------- */

    const matches =
        allImages.filter(
            image => {

                return image.name
                    .toLowerCase()
                    .includes(searchText);

            }
        );


    /* ---------------------------------------------
       RESULT COUNT
    --------------------------------------------- */

    status.textContent =
        `🔎 ${matches.length} image(s) found.`;


    /* ---------------------------------------------
       NOTHING FOUND
    --------------------------------------------- */

    if (matches.length === 0) {

        results.innerHTML = `

            <div class="empty">

                <h2>
                    😕 No image found
                </h2>

                <p>
                    No image matching
                    <strong>
                        "${escapeHTML(searchText)}"
                    </strong>
                    was found.
                </p>

            </div>

        `;

        return;

    }


    /* ---------------------------------------------
       DISPLAY IMAGES
    --------------------------------------------- */

    matches.forEach(
        image => {

            createImageCard(image);

        }
    );

}


/* =========================================================
   CREATE IMAGE CARD
   ========================================================= */

function createImageCard(file) {

    const card =
        document.createElement("div");


    card.className =
        "image-card";


    /*
     * GitHub gives us the raw download URL.
     *
     * Example:
     *
     * https://raw.githubusercontent.com/
     * rajaauddy/
     * catalystforsuccess/
     * main/
     * structure/images/dog.jpg
     */

    const imageURL =
        file.download_url;


    /* ---------------------------------------------
       IMAGE
    --------------------------------------------- */

    const image =
        document.createElement("img");


    image.src =
        imageURL;


    image.alt =
        file.name;


    image.loading =
        "lazy";


    image.className =
        "image-preview";


    /* ---------------------------------------------
       IMAGE NAME
    --------------------------------------------- */

    const filename =
        document.createElement("div");


    filename.className =
        "filename";


    filename.textContent =
        file.name;


    /* ---------------------------------------------
       COPY BUTTON
    --------------------------------------------- */

    const copyButton =
        document.createElement("button");


    copyButton.className =
        "copy-btn";


    copyButton.textContent =
        "📋 Copy Image";


    copyButton.type =
        "button";


    /* ---------------------------------------------
       COPY ACTION
    --------------------------------------------- */

    copyButton.addEventListener(
        "click",
        function() {

            copyImage(
                imageURL,
                copyButton
            );

        }
    );


    /* ---------------------------------------------
       ADD ELEMENTS TO CARD
    --------------------------------------------- */

    card.appendChild(image);

    card.appendChild(filename);

    card.appendChild(copyButton);


    /* ---------------------------------------------
       ADD CARD TO PAGE
    --------------------------------------------- */

    results.appendChild(card);

}


/* =========================================================
   COPY IMAGE
   ========================================================= */

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


        /* ---------------------------------------------
           DOWNLOAD IMAGE
        --------------------------------------------- */

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


        /* ---------------------------------------------
           CONVERT TO PNG
        --------------------------------------------- */

        const pngBlob =
            await convertToPNG(blob);


        /* ---------------------------------------------
           CHECK CLIPBOARD SUPPORT
        --------------------------------------------- */

        if (
            !navigator.clipboard ||
            !window.ClipboardItem
        ) {

            throw new Error(
                "Clipboard image support is unavailable."
            );

        }


        /* ---------------------------------------------
           COPY IMAGE
        --------------------------------------------- */

        await navigator.clipboard.write([

            new ClipboardItem({

                "image/png":
                    pngBlob

            })

        ]);


        /* ---------------------------------------------
           SUCCESS
        --------------------------------------------- */

        button.textContent =
            "✅ Copied!";


        setTimeout(
            function() {

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
            "Could not copy the image.\n\n" +
            "Please open your GitHub Pages website " +
            "using Chrome or Microsoft Edge."
        );


        setTimeout(
            function() {

                button.textContent =
                    oldText;

            },
            2000
        );

    }

}


/* =========================================================
   CONVERT IMAGE TO PNG
   ========================================================= */

function convertToPNG(blob) {

    return new Promise(
        function(resolve, reject) {

            const image =
                new Image();


            image.crossOrigin =
                "anonymous";


            const objectURL =
                URL.createObjectURL(
                    blob
                );


            /* ---------------------------------------------
               IMAGE LOADED
            --------------------------------------------- */

            image.onload =
                function() {

                    try {

                        const canvas =
                            document.createElement(
                                "canvas"
                            );


                        canvas.width =
                            image.naturalWidth;


                        canvas.height =
                            image.naturalHeight;


                        const context =
                            canvas.getContext(
                                "2d"
                            );


                        context.drawImage(
                            image,
                            0,
                            0
                        );


                        canvas.toBlob(
                            function(pngBlob) {

                                URL.revokeObjectURL(
                                    objectURL
                                );


                                if (pngBlob) {

                                    resolve(
                                        pngBlob
                                    );

                                }
                                else {

                                    reject(
                                        new Error(
                                            "Could not create PNG."
                                        )
                                    );

                                }

                            },
                            "image/png"
                        );


                    }
                    catch (error) {

                        URL.revokeObjectURL(
                            objectURL
                        );


                        reject(
                            error
                        );

                    }

                };


            /* ---------------------------------------------
               IMAGE FAILED
            --------------------------------------------- */

            image.onerror =
                function() {

                    URL.revokeObjectURL(
                        objectURL
                    );


                    reject(
                        new Error(
                            "Could not load image."
                        )
                    );

                };


            image.src =
                objectURL;

        }
    );

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(text) {

    return text

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   SEARCH BUTTON
   ========================================================= */

searchBtn.addEventListener(
    "click",
    searchImages
);


/* =========================================================
   ENTER KEY
   ========================================================= */

searchInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter"
        ) {

            searchImages();

        }

    }
);


/* =========================================================
   LOAD IMAGE LIBRARY
   ========================================================= */

loadImages();
