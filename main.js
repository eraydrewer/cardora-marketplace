let listings = [];
let favoriteIds = loadFavorites();

let activeCategory = "Alle";
let activeSearch = "";
let visibleListings = 8;
let showingOwnListings = false;

const listingGrid = document.getElementById("listingGrid");
const emptyState = document.getElementById("emptyState");
const resultsText = document.getElementById("resultsText");

const conditionFilter = document.getElementById("conditionFilter");
const sortFilter = document.getElementById("sortFilter");

const heroSearchForm = document.getElementById("heroSearchForm");
const heroSearchInput = document.getElementById("heroSearchInput");

const loadMoreButton = document.getElementById("loadMoreButton");
const resetFiltersButton = document.getElementById("resetFiltersButton");

const listingModal = document.getElementById("listingModal");
const loginModal = document.getElementById("loginModal");

const listingForm = document.getElementById("listingForm");
const loginForm = document.getElementById("loginForm");

const listingImageFile =
    document.getElementById("listingImageFile");

const listingImagesPreviewGrid =
    document.getElementById("listingImagesPreviewGrid");

const listingImageFileName =
    document.getElementById("listingImageFileName");

const listingImageInput =
    document.getElementById("listingImage");

const publishListingButton =
    document.getElementById("publishListingButton");

let selectedListingImageFiles = [];
let selectedListingPreviewUrls = [];

const mobileNavigation = document.getElementById("mobileNavigation");

const toast = document.getElementById("toast");
const toastTitle = document.getElementById("toastTitle");
const toastMessage = document.getElementById("toastMessage");

async function loadListingsFromBackend() {
    showingOwnListings = false;

    try {
        const response = await fetch(
            "https://cardora-backend-m9d0.onrender.com/api/listings"
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Anzeigen konnten nicht geladen werden."
            );
        }

        listings = data.listings.map((listing) => ({
            id: Number(listing.id),
            title: listing.title,
            category: listing.category,
            condition: listing.condition,
            price: Number(listing.price),
            location: listing.location,
            language: listing.language || "",
            shipping: listing.shipping || "",
            image: listing.image || "",
            images: Array.isArray(listing.images)
                ? listing.images
                : [],
            description: listing.description || "",
            seller:
                [listing.first_name, listing.last_name]
                    .filter(Boolean)
                    .join(" ") ||
                listing.seller ||
                "Unbekannter Verkäufer",
            sellerId: Number(listing.seller_id),
            sellerImage: listing.seller_image || "",
            createdAt: listing.created_at
        }));

        renderListings();
    } catch (error) {
        console.error("Fehler beim Laden der Anzeigen:", error);

        listings = [];

       renderListings();

        showToast(
            "Anzeigen nicht geladen",
            "Die Anzeigen konnten momentan nicht vom Server geladen werden."
        );
    }
}

async function loadMyListings() {
    if (!Clerk.user || !Clerk.session) {
        showToast(
            "Anmeldung erforderlich",
            "Du musst angemeldet sein, um deine Anzeigen zu sehen."
        );

        Clerk.openSignIn();
        return;
    }

    try {
        const token = await Clerk.session.getToken();

        const response = await fetch(
            "https://cardora-backend-m9d0.onrender.com/api/listings/mine",
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Deine Anzeigen konnten nicht geladen werden."
            );
        }

        listings = data.listings.map((listing) => ({
            id: Number(listing.id),
            title: listing.title,
            category: listing.category,
            condition: listing.condition,
            price: Number(listing.price),
            location: listing.location,
            language: listing.language || "",
            shipping: listing.shipping || "",
            image: listing.image || "",
            images: Array.isArray(listing.images)
                ? listing.images
                : [],
            description: listing.description || "",
            seller:
                [listing.first_name, listing.last_name]
                    .filter(Boolean)
                    .join(" ") ||
                "Du",
            sellerId: Number(listing.user_id),
            sellerImage: listing.seller_image || "",
            createdAt: listing.created_at
        }));

        showingOwnListings = true;
        activeCategory = "Alle";
        activeSearch = "";
        visibleListings = 8;

        conditionFilter.value = "Alle";
        sortFilter.value = "newest";
        heroSearchInput.value = "";

        renderListings();

        document
            .getElementById("marketplace")
            .scrollIntoView({
                behavior: "smooth"
            });

        showToast(
            "Meine Anzeigen",
            `${listings.length} eigene Anzeige${listings.length === 1 ? "" : "n"} geladen.`
        );

    } catch (error) {
        console.error(
            "Fehler beim Laden der eigenen Anzeigen:",
            error
        );

        showToast(
            "Fehler",
            error.message ||
            "Deine Anzeigen konnten nicht geladen werden."
        );
    }
}

function loadFavorites() {
    try {
        const storedFavorites = localStorage.getItem("cardoraFavorites");

        if (!storedFavorites) {
            return [];
        }

        const parsedFavorites = JSON.parse(storedFavorites);

        return Array.isArray(parsedFavorites)
            ? parsedFavorites
            : [];
    } catch (error) {
        console.error("Favoriten konnten nicht geladen werden:", error);
        return [];
    }
}

function saveFavorites() {
    localStorage.setItem(
        "cardoraFavorites",
        JSON.stringify(favoriteIds)
    );
}

function formatPrice(price) {
    return Number(price).toLocaleString("de-DE", {
        style: "currency",
        currency: "EUR"
    });
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function getCategoryIcon(category) {
    const icons = {
        "Pokémon": "⚡",
        "Yu-Gi-Oh!": "✦",
        "One Piece": "☠",
        "Magic": "✺",
        "Sportkarten": "🏆",
        "Fußballkarten": "⚽",
        "Basketballkarten": "🏀"
    };

    return icons[category] || "◇";
}

function getFilteredListings() {
    const selectedCondition = conditionFilter.value;
    const selectedSort = sortFilter.value;

    let filteredListings = listings.filter((listing) => {
        const categoryMatches =
            activeCategory === "Alle" ||
            listing.category === activeCategory;

        const conditionMatches =
            selectedCondition === "Alle" ||
            listing.condition === selectedCondition;

        const searchableText = [
            listing.title,
            listing.category,
            listing.condition,
            listing.location,
            listing.language,
            listing.seller,
            listing.description
        ]
            .join(" ")
            .toLowerCase();

        const searchMatches =
            activeSearch === "" ||
            searchableText.includes(activeSearch.toLowerCase());

        return (
            categoryMatches &&
            conditionMatches &&
            searchMatches
        );
    });

    filteredListings.sort((a, b) => {
        if (selectedSort === "price-low") {
            return Number(a.price) - Number(b.price);
        }

        if (selectedSort === "price-high") {
            return Number(b.price) - Number(a.price);
        }

        if (selectedSort === "name") {
            return a.title.localeCompare(
                b.title,
                "de",
                { sensitivity: "base" }
            );
        }

        return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );
    });

    return filteredListings;
}

function createListingCard(listing) {
    const isFavorite = favoriteIds.includes(listing.id);

    const imageHtml = listing.image
        ? `
            <img
                src="${escapeHtml(listing.image)}"
                alt="${escapeHtml(listing.title)}"
                loading="lazy"
                onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';"
            >

            <div
                class="listing-placeholder"
                style="display:none;"
            >
                ${getCategoryIcon(listing.category)}
            </div>
        `
        : `
            <div class="listing-placeholder">
                ${getCategoryIcon(listing.category)}
            </div>
        `;

    return `
        <article class="listing-card">

            <div class="listing-image">

                ${imageHtml}

                <span class="listing-condition">
                    ${escapeHtml(listing.condition)}
                </span>

                <button
                    class="listing-favorite ${isFavorite ? "active" : ""}"
                    type="button"
                    data-favorite-id="${listing.id}"
                    aria-label="Anzeige als Favorit speichern"
                    title="Favorit"
                >
                    ${isFavorite ? "♥" : "♡"}
                </button>

            </div>

            <div class="listing-content">

                <span class="listing-category">
                    ${escapeHtml(listing.category)}
                </span>

                <h3>
                    ${escapeHtml(listing.title)}
                </h3>

                <div class="listing-price">
                    ${formatPrice(listing.price)}
                </div>

                <div class="listing-meta">

                    <span>
                        📍 ${escapeHtml(listing.location)}
                    </span>

                    <span>
                        👤 ${escapeHtml(listing.seller)}
                    </span>

                </div>

            </div>

        </article>
    `;
}

function renderListings() {
    const filteredListings = getFilteredListings();
    const visibleResults = filteredListings.slice(0, visibleListings);

    listingGrid.innerHTML = visibleResults
        .map(createListingCard)
        .join("");

    const resultCount = filteredListings.length;

    if (showingOwnListings) {
    resultsText.textContent =
        `${resultCount} eigene Anzeige${resultCount === 1 ? "" : "n"}`;
} else if (activeSearch) {
    resultsText.textContent =
        `${resultCount} Ergebnis${resultCount === 1 ? "" : "se"} für „${activeSearch}“`;
} else if (activeCategory !== "Alle") {
    resultsText.textContent =
        `${resultCount} Angebot${resultCount === 1 ? "" : "e"} in ${activeCategory}`;
} else {
    resultsText.textContent =
        `${resultCount} aktuelle Angebote auf Cardora`;
}

    if (filteredListings.length === 0) {
        listingGrid.style.display = "none";
        emptyState.style.display = "block";
        loadMoreButton.style.display = "none";
    } else {
        listingGrid.style.display = "grid";
        emptyState.style.display = "none";

        loadMoreButton.style.display =
            visibleListings < filteredListings.length
                ? "inline-block"
                : "none";
    }

    attachFavoriteButtons();
}

function attachFavoriteButtons() {
    const favoriteButtons =
        document.querySelectorAll("[data-favorite-id]");

    favoriteButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const listingId = Number(
                button.dataset.favoriteId
            );

            toggleFavorite(listingId);
        });
    });
}

function toggleFavorite(listingId) {
    if (favoriteIds.includes(listingId)) {
        favoriteIds = favoriteIds.filter(
            (id) => id !== listingId
        );

        showToast(
            "Favorit entfernt",
            "Die Karte wurde aus deinen Favoriten entfernt."
        );
    } else {
        favoriteIds.push(listingId);

        showToast(
            "Favorit gespeichert",
            "Die Karte wurde zu deinen Favoriten hinzugefügt."
        );
    }

    saveFavorites();
    renderListings();
}

function setActiveCategory(category) {
    activeCategory = category;
    visibleListings = 8;

    document
        .querySelectorAll(".category-card")
        .forEach((card) => {
            card.classList.toggle(
                "active",
                card.dataset.category === category
            );
        });

    renderListings();

    document
        .getElementById("marketplace")
        .scrollIntoView({
            behavior: "smooth"
        });
}

function resetFilters() {
    activeCategory = "Alle";
    activeSearch = "";
    visibleListings = 8;

    heroSearchInput.value = "";
    conditionFilter.value = "Alle";
    sortFilter.value = "newest";

    document
        .querySelectorAll(".category-card")
        .forEach((card) => {
            card.classList.toggle(
                "active",
                card.dataset.category === "Alle"
            );
        });

    renderListings();
}

function openModal(modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeModal(modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
}

let toastTimer;

function releaseSelectedListingPreviewUrls() {
    selectedListingPreviewUrls.forEach((previewUrl) => {
        URL.revokeObjectURL(previewUrl);
    });

    selectedListingPreviewUrls = [];
}

function updateSelectedListingFileName() {
    const imageCount = selectedListingImageFiles.length;

    listingImageFileName.textContent =
        imageCount === 0
            ? "Keine Bilder ausgewählt"
            : `${imageCount} Bild${imageCount === 1 ? "" : "er"} ausgewählt`;
}

function renderSelectedListingImages() {
    releaseSelectedListingPreviewUrls();

    listingImagesPreviewGrid.innerHTML = "";
    updateSelectedListingFileName();

    selectedListingImageFiles.forEach((file, index) => {
        const previewUrl = URL.createObjectURL(file);

        selectedListingPreviewUrls.push(previewUrl);

        const previewItem = document.createElement("div");
        previewItem.className = "listing-image-preview-item";

        const previewImage = document.createElement("img");
        previewImage.src = previewUrl;
        previewImage.alt = `Vorschau Bild ${index + 1}`;

        const removeButton = document.createElement("button");
        removeButton.className = "listing-image-remove-button";
        removeButton.type = "button";
        removeButton.textContent = "×";
        removeButton.setAttribute(
            "aria-label",
            `Bild ${index + 1} entfernen`
        );

        removeButton.addEventListener("click", () => {
            selectedListingImageFiles.splice(index, 1);
            listingImageFile.value = "";
            renderSelectedListingImages();
        });

        previewItem.appendChild(previewImage);
        previewItem.appendChild(removeButton);

        if (index === 0) {
            const primaryBadge = document.createElement("span");
            primaryBadge.className = "listing-image-primary-badge";
            primaryBadge.textContent = "Titelbild";
            previewItem.appendChild(primaryBadge);
        }

        listingImagesPreviewGrid.appendChild(previewItem);
    });
}

function resetSelectedListingImages() {
    releaseSelectedListingPreviewUrls();

    selectedListingImageFiles = [];

    listingImageFile.value = "";
    listingImageInput.value = "";
    listingImagesPreviewGrid.innerHTML = "";

    updateSelectedListingFileName();
}

async function uploadNewListingImages(files, token) {
    if (!Array.isArray(files) || files.length === 0) {
        return [];
    }

    const formData = new FormData();

    files.forEach((file) => {
        formData.append("images", file);
    });

    const response = await fetch(
        "https://cardora-backend-m9d0.onrender.com/api/uploads/images",
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        }
    );

    const responseText = await response.text();

    let data = {};

    try {
        data = responseText
            ? JSON.parse(responseText)
            : {};
    } catch (error) {
        throw new Error(
            "Das Backend hat eine ungültige Antwort gesendet."
        );
    }

    if (!response.ok) {
        throw new Error(
            data.message ||
            data.error ||
            "Die Bilder konnten nicht hochgeladen werden."
        );
    }

    if (!Array.isArray(data.images)) {
        throw new Error(
            "Der Bild-Upload hat keine gültige Bilderliste zurückgegeben."
        );
    }

    return data.images.map((imageItem, index) => {
        if (!imageItem?.imageUrl) {
            throw new Error(
                "Mindestens ein hochgeladenes Bild hat keine Bildadresse."
            );
        }

        return {
            imageUrl: imageItem.imageUrl,
            publicId: imageItem.publicId || null,
            sortOrder: index
        };
    });
}

function showToast(title, message) {
    clearTimeout(toastTimer);

    toastTitle.textContent = title;
    toastMessage.textContent = message;

    toast.classList.add("active");

    toastTimer = setTimeout(() => {
        toast.classList.remove("active");
    }, 3500);
}

document
    .querySelectorAll(".category-card")
    .forEach((card) => {
        card.addEventListener("click", () => {
            setActiveCategory(
                card.dataset.category
            );
        });
    });

document
    .querySelectorAll(".quick-search")
    .forEach((button) => {
        button.addEventListener("click", () => {
            const searchValue =
                button.dataset.search || "";

            activeSearch = searchValue;
            heroSearchInput.value = searchValue;
            visibleListings = 8;

            renderListings();

            document
                .getElementById("marketplace")
                .scrollIntoView({
                    behavior: "smooth"
                });
        });
    });

heroSearchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    activeSearch = heroSearchInput.value.trim();
    visibleListings = 8;

    renderListings();

    document
        .getElementById("marketplace")
        .scrollIntoView({
            behavior: "smooth"
        });
});

conditionFilter.addEventListener("change", () => {
    visibleListings = 8;
    renderListings();
});

sortFilter.addEventListener("change", () => {
    visibleListings = 8;
    renderListings();
});

loadMoreButton.addEventListener("click", () => {
    visibleListings += 4;
    renderListings();
});

resetFiltersButton.addEventListener("click", () => {
    resetFilters();
});

document
    .getElementById("showAllCategoriesButton")
    .addEventListener("click", () => {
        setActiveCategory("Alle");
    });

const listingOpenButtons = [
    document.getElementById("openListingButton"),
    document.getElementById("mobileSellButton"),
    document.getElementById("bannerSellButton")
];

listingOpenButtons.forEach((button) => {
    if (!button) {
        return;
    }

    button.addEventListener("click", () => {
        openModal(listingModal);
        mobileNavigation.classList.remove("active");
    });
});

document
    .getElementById("closeListingModal")
    .addEventListener("click", () => {
        closeModal(listingModal);
    });

document
    .getElementById("cancelListingButton")
    .addEventListener("click", () => {
        closeModal(listingModal);
    });

const loginButton = document.getElementById("loginButton");

async function initializeClerk() {
    try {
        await Clerk.load({
            ui: {
                ClerkUI: window.__internal_ClerkUICtor
            },

            localization: {
                locale: "de-DE",

                signIn: {
                    start: {
                        title: "Bei Cardora anmelden",
                        subtitle: "Willkommen zurück! Melde dich an, um fortzufahren.",
                        actionText: "Noch kein Konto?",
                        actionLink: "Jetzt registrieren"
                    }
                },

                signUp: {
                    start: {
                        title: "Cardora-Konto erstellen",
                        subtitle: "Registriere dich, um Karten zu kaufen und zu verkaufen.",
                        actionText: "Du hast bereits ein Konto?",
                        actionLink: "Anmelden"
                    }
                },

                formFieldLabel__emailAddress: "E-Mail-Adresse",
                formFieldLabel__password: "Passwort",
                formFieldLabel__firstName: "Vorname",
                formFieldLabel__lastName: "Nachname",
                formButtonPrimary: "Weiter",
                dividerText: "oder",
                socialButtonsBlockButton: "Mit {{provider|titleize}} fortfahren",
                formFieldAction__forgotPassword: "Passwort vergessen?"
            }
        });

        updateLoginArea();

        Clerk.addListener(() => {
            updateLoginArea();
        });

    } catch (error) {
        console.error("Clerk konnte nicht geladen werden:", error);

        showToast(
            "Anmeldung nicht verfügbar",
            "Das Anmeldesystem konnte nicht geladen werden."
        );
    }
}

let clerkButtonMounted = false;

function updateLoginArea() {
    if (!loginButton) {
        return;
    }

    if (Clerk.user) {
        syncUserWithBackend();

        loginButton.onclick = null;

        loginButton.classList.remove(
            "login-button",
            "user-profile-button"
        );

        loginButton.classList.add(
            "clerk-profile-container"
        );

        if (!clerkButtonMounted) {
            loginButton.innerHTML = "";

      Clerk.mountUserButton(loginButton, {
    customMenuItems: [
        {
            label: "Meine Anzeigen",

            onClick: () => {
                window.location.href = "meine-anzeigen.html";
            },

            mountIcon: (element) => {
                element.innerHTML = "▣";
            },

            unmountIcon: (element) => {
                element.innerHTML = "";
            }
        }
    ],

    appearance: {
        elements: {
            rootBox: {
                display: "flex",
                alignItems: "center"
            },

            userButtonTrigger: {
                padding: "0",
                margin: "0",
                border: "none",
                background: "transparent",
                boxShadow: "none"
            },

            userButtonAvatarBox: {
                borderRadius: "50%",
                border: "none",
                boxShadow: "none"
            },

            avatarBox: {
                borderRadius: "50%",
                border: "none",
                boxShadow: "none"
            }
        }
    }
});
            clerkButtonMounted = true;
        }

        return;
    }

    if (
        clerkButtonMounted &&
        typeof Clerk.unmountUserButton === "function"
    ) {
        Clerk.unmountUserButton(loginButton);
    }

    clerkButtonMounted = false;

    loginButton.innerHTML = "Anmelden";

    loginButton.classList.remove(
        "clerk-profile-container",
        "user-profile-button"
    );

    loginButton.classList.add("login-button");

    loginButton.onclick = () => {
        Clerk.openSignIn();
    };
}

async function syncUserWithBackend() {
    try {
        const token = await Clerk.session.getToken();

        const response = await fetch(
            "https://cardora-backend-m9d0.onrender.com/api/users/sync",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        console.log("Benutzer synchronisiert:", data.user);

    } catch (error) {
        console.error(error);
    }
}

initializeClerk();

document
    .getElementById("closeLoginModal")
    .addEventListener("click", () => {
        closeModal(loginModal);
    });

document
    .getElementById("mobileMenuButton")
    .addEventListener("click", () => {
        mobileNavigation.classList.toggle("active");
    });

listingModal.addEventListener("click", (event) => {
    if (event.target === listingModal) {
        closeModal(listingModal);
    }
});

loginModal.addEventListener("click", (event) => {
    if (event.target === loginModal) {
        closeModal(loginModal);
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeModal(listingModal);
        closeModal(loginModal);
    }
});

listingImageFile.addEventListener(
    "change",
    () => {
        const incomingFiles =
            Array.from(listingImageFile.files || []);

        listingImageFile.value = "";

        if (incomingFiles.length === 0) {
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        const maximumFileSize =
            5 * 1024 * 1024;

        let invalidTypeCount = 0;
        let tooLargeCount = 0;
        let duplicateCount = 0;
        let overflowCount = 0;

        incomingFiles.forEach((file) => {
            if (!allowedTypes.includes(file.type)) {
                invalidTypeCount += 1;
                return;
            }

            if (file.size > maximumFileSize) {
                tooLargeCount += 1;
                return;
            }

            const alreadySelected =
                selectedListingImageFiles.some(
                    (selectedFile) =>
                        selectedFile.name === file.name &&
                        selectedFile.size === file.size &&
                        selectedFile.lastModified === file.lastModified
                );

            if (alreadySelected) {
                duplicateCount += 1;
                return;
            }

            if (selectedListingImageFiles.length >= 8) {
                overflowCount += 1;
                return;
            }

            selectedListingImageFiles.push(file);
        });

        renderSelectedListingImages();

        const rejectedReasons = [];

        if (invalidTypeCount > 0) {
            rejectedReasons.push(
                `${invalidTypeCount} Datei${invalidTypeCount === 1 ? "" : "en"} hatte${invalidTypeCount === 1 ? "" : "n"} ein ungültiges Format`
            );
        }

        if (tooLargeCount > 0) {
            rejectedReasons.push(
                `${tooLargeCount} Bild${tooLargeCount === 1 ? "" : "er"} war${tooLargeCount === 1 ? "" : "en"} größer als 5 MB`
            );
        }

        if (duplicateCount > 0) {
            rejectedReasons.push(
                `${duplicateCount} Bild${duplicateCount === 1 ? "" : "er"} war${duplicateCount === 1 ? "" : "en"} bereits ausgewählt`
            );
        }

        if (overflowCount > 0) {
            rejectedReasons.push(
                "maximal 8 Bilder sind erlaubt"
            );
        }

        if (rejectedReasons.length > 0) {
            showToast(
                "Einige Bilder nicht übernommen",
                `${rejectedReasons.join(", ")}.`
            );
        }
    }
);

listingForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!Clerk.user || !Clerk.session) {
        showToast(
            "Anmeldung erforderlich",
            "Du musst angemeldet sein, um eine Anzeige zu veröffentlichen."
        );

        Clerk.openSignIn();
        return;
    }

    const title =
        document.getElementById("listingTitle").value.trim();

    const category =
        document.getElementById("listingCategory").value;

    const condition =
        document.getElementById("listingCondition").value;

    const price =
        Number(document.getElementById("listingPrice").value);

    const location =
        document.getElementById("listingLocation").value.trim();

    const language =
        document.getElementById("listingLanguage").value;

    const shipping =
        document.getElementById("listingShipping").value;

    let image =
        listingImageInput.value.trim();

    let images = [];

    const description =
        document.getElementById("listingDescription").value.trim();

    if (
        !title ||
        !category ||
        !condition ||
        !location ||
        !Number.isFinite(price) ||
        price < 0
    ) {
        showToast(
            "Angaben prüfen",
            "Bitte fülle alle Pflichtfelder korrekt aus."
        );

        return;
    }

    try {
    publishListingButton.disabled = true;
    publishListingButton.textContent =
        "Wird vorbereitet …";

    const token =
        await Clerk.session.getToken();

    if (selectedListingImageFiles.length > 0) {
        publishListingButton.textContent =
            `${selectedListingImageFiles.length} Bild${selectedListingImageFiles.length === 1 ? "" : "er"} werden hochgeladen …`;

        images = await uploadNewListingImages(
            selectedListingImageFiles,
            token
        );

        image =
            images[0]?.imageUrl ||
            "";

        listingImageInput.value = image;
    }

    publishListingButton.textContent =
        "Anzeige wird veröffentlicht …";

    const response = await fetch(
            "https://cardora-backend-m9d0.onrender.com/api/listings",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title,
                    category,
                    condition,
                    price,
                    location,
                    language,
                    shipping,
                    image,
                    images,
                    description
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Die Anzeige konnte nicht veröffentlicht werden."
            );
        }

        listingForm.reset();

resetSelectedListingImages();

publishListingButton.disabled = false;
publishListingButton.textContent =
    "Anzeige veröffentlichen";

closeModal(listingModal);

        activeCategory = "Alle";
        activeSearch = "";
        visibleListings = 8;

        heroSearchInput.value = "";
        conditionFilter.value = "Alle";
        sortFilter.value = "newest";

        document
            .querySelectorAll(".category-card")
            .forEach((card) => {
                card.classList.toggle(
                    "active",
                    card.dataset.category === "Alle"
                );
            });

        await loadListingsFromBackend();

        document
            .getElementById("marketplace")
            .scrollIntoView({
                behavior: "smooth"
            });

        showToast(
            "Anzeige veröffentlicht",
            "Deine Karte wurde erfolgreich auf Cardora veröffentlicht."
        );

    } catch (error) {
        console.error(
            "Fehler beim Veröffentlichen der Anzeige:",
            error
        );

        publishListingButton.disabled = false;
        publishListingButton.textContent =
            "Erneut versuchen";

        showToast(
            "Veröffentlichung fehlgeschlagen",
            error.message ||
            "Die Anzeige konnte momentan nicht gespeichert werden."
        );
    }
});

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;

    if (!email || !password) {
        showToast(
            "Anmeldung fehlgeschlagen",
            "Bitte gib deine E-Mail-Adresse und dein Passwort ein."
        );

        return;
    }

    closeModal(loginModal);
    loginForm.reset();

    showToast(
        "Demo-Anmeldung",
        "Der echte Benutzer-Login wird später mit einer Datenbank verbunden."
    );
});

const featuredFavoriteButton =
    document.querySelector(".featured-card .favorite-button");

if (featuredFavoriteButton) {
    featuredFavoriteButton.addEventListener("click", () => {
        featuredFavoriteButton.classList.toggle("active");

        const isActive =
            featuredFavoriteButton.classList.contains("active");

        featuredFavoriteButton.textContent =
            isActive ? "♥" : "♡";

        showToast(
            isActive
                ? "Favorit gespeichert"
                : "Favorit entfernt",
            isActive
                ? "Das Top-Angebot wurde zu deinen Favoriten hinzugefügt."
                : "Das Top-Angebot wurde aus deinen Favoriten entfernt."
        );
    });
}

document
    .querySelectorAll(".mobile-navigation a")
    .forEach((link) => {
        link.addEventListener("click", () => {
            mobileNavigation.classList.remove("active");
        });
    });

loadListingsFromBackend();
