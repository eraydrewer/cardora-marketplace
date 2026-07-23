const BACKEND_URL =
    "https://cardora-backend-m9d0.onrender.com";

const listingGrid =
    document.getElementById("listingGrid");

const emptyState =
    document.getElementById("emptyState");

const resultsText =
    document.getElementById("resultsText");

const authState =
    document.getElementById("authState");

const signInButton =
    document.getElementById("signInButton");

const loginButton =
    document.getElementById("loginButton");

const editListingModal =
    document.getElementById("editListingModal");

const editListingForm =
    document.getElementById("editListingForm");

const closeEditListingModalButton =
    document.getElementById("closeEditListingModal");

const cancelEditListingButton =
    document.getElementById("cancelEditListingButton");

const editListingImageFile =
    document.getElementById("editListingImageFile");

const editListingImagePreview =
    document.getElementById("editListingImagePreview");

const editListingImageFileName =
    document.getElementById("editListingImageFileName");

let selectedEditImageFile = null;

const saveEditListingButton =
    document.getElementById("saveEditListingButton");

let ownListings = [];

const deleteConfirmModal =
    document.getElementById("deleteConfirmModal");

const cancelDeleteButton =
    document.getElementById("cancelDeleteButton");

const confirmDeleteButton =
    document.getElementById("confirmDeleteButton");

const deleteConfirmText =
    document.querySelector(
        "#deleteConfirmModal .delete-confirm-window p"
    );

let pendingDeleteId = null;
let pendingDeleteButton = null;

let clerkButtonMounted = false;

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function formatPrice(price) {
    return Number(price).toLocaleString("de-DE", {
        style: "currency",
        currency: "EUR"
    });
}

async function uploadListingImage(file, token) {
    const formData = new FormData();

    formData.append("image", file);

    const response = await fetch(
        `${BACKEND_URL}/api/uploads/image`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        }
    );

    const responseText = await response.text();

    console.log("Upload-Status:", response.status);
    console.log("Upload-Antwort:", responseText);

    let data = {};

    try {
        data = responseText
            ? JSON.parse(responseText)
            : {};
    } catch (error) {
        throw new Error(
            `Ungültige Antwort vom Backend. Status: ${response.status}. Antwort: ${responseText}`
        );
    }

    if (!response.ok) {
        throw new Error(
            data.message ||
            data.error ||
            `Bild-Upload fehlgeschlagen. HTTP-Status: ${response.status}`
        );
    }

    if (!data.imageUrl) {
        throw new Error(
            "Der Upload war erfolgreich, aber das Backend hat keine imageUrl zurückgegeben."
        );
    }

    return data.imageUrl;
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

function createListingCard(listing) {
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

    const sellerName =
        [listing.first_name, listing.last_name]
            .filter(Boolean)
            .join(" ") ||
        "Du";

    return `
        <article class="listing-card">

            <div class="listing-image">

                ${imageHtml}

                <span class="listing-condition">
                    ${escapeHtml(listing.condition)}
                </span>

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
                        👤 ${escapeHtml(sellerName)}
                    </span>

                </div>

                <div class="my-listing-actions">

    <button
        class="edit-listing-button"
        type="button"
        data-edit-id="${listing.id}"
    >
        ✎ Anzeige bearbeiten
    </button>

    <button
        class="delete-listing-button"
        type="button"
        data-delete-id="${listing.id}"
    >
        🗑 Anzeige löschen
    </button>

</div>

            </div>

        </article>
    `;
}

function attachEditButtons() {
    const editButtons =
        document.querySelectorAll("[data-edit-id]");

    editButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const listingId =
                Number(button.dataset.editId);

            openEditListingModal(listingId);
        });
    });
}

function openEditListingModal(listingId) {
    const listing = ownListings.find(
        (item) => Number(item.id) === listingId
    );

    if (!listing) {
        return;
    }

    document.getElementById("editListingId").value =
        listing.id;

    document.getElementById("editListingTitle").value =
        listing.title || "";

    document.getElementById("editListingCategory").value =
        listing.category || "Pokémon";

    document.getElementById("editListingCondition").value =
        listing.condition || "Near Mint";

    document.getElementById("editListingPrice").value =
        listing.price ?? "";

    document.getElementById("editListingLocation").value =
        listing.location || "";

    document.getElementById("editListingLanguage").value =
        listing.language || "Deutsch";

    document.getElementById("editListingShipping").value =
        listing.shipping || "Versand möglich";

    const currentImage =
    listing.image || "";

document.getElementById("editListingImage").value =
    currentImage;

selectedEditImageFile = null;
editListingImageFile.value = "";

    editListingImageFileName.textContent =
    "Kein neues Bild ausgewählt";

if (currentImage) {
    editListingImagePreview.src =
        currentImage;

    editListingImagePreview.hidden =
        false;
} else {
    editListingImagePreview.src = "";
    editListingImagePreview.hidden =
        true;
}

document.getElementById("editListingDescription").value =
    listing.description || "";

    saveEditListingButton.disabled = false;
    saveEditListingButton.textContent =
        "Änderungen speichern";

    editListingModal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeEditListingModal() {
    editListingModal.classList.remove("active");
    document.body.style.overflow = "";

    editListingForm.reset();

    selectedEditImageFile = null;
    editListingImageFile.value = "";

    editListingImageFileName.textContent =
        "Kein neues Bild ausgewählt";

    editListingImagePreview.removeAttribute("src");
    editListingImagePreview.hidden = true;

    saveEditListingButton.disabled = false;
    saveEditListingButton.textContent =
        "Änderungen speichern";
}

function attachDeleteButtons() {
    const deleteButtons =
        document.querySelectorAll("[data-delete-id]");

    deleteButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const listingId =
                Number(button.dataset.deleteId);

            openDeleteConfirmModal(
                listingId,
                button
            );
        });
    });
}

function openDeleteConfirmModal(listingId, button) {
    pendingDeleteId = listingId;
    pendingDeleteButton = button;

    deleteConfirmText.textContent =
        "Möchtest du diese Anzeige wirklich dauerhaft löschen? Diese Aktion kann nicht rückgängig gemacht werden.";

    confirmDeleteButton.disabled = false;
    confirmDeleteButton.textContent =
        "Anzeige löschen";

    deleteConfirmModal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeDeleteConfirmModal() {
    deleteConfirmModal.classList.remove("active");
    document.body.style.overflow = "";

    pendingDeleteId = null;
    pendingDeleteButton = null;

    confirmDeleteButton.disabled = false;
    confirmDeleteButton.textContent =
        "Anzeige löschen";
}
async function deleteListing(listingId, button) {
    if (!Clerk.user || !Clerk.session) {
        return {
            success: false,
            message: "Du musst angemeldet sein."
        };
    }

    try {
        button.disabled = true;
        button.textContent = "Wird gelöscht …";

       const token =
    await Clerk.session.getToken();

const response = await fetch(
            `${BACKEND_URL}/api/listings/${listingId}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Die Anzeige konnte nicht gelöscht werden."
            );
        }

        await loadMyListings();

        return {
            success: true
        };

    } catch (error) {
        console.error(
            "Fehler beim Löschen der Anzeige:",
            error
        );

        button.disabled = false;
        button.textContent = "🗑 Anzeige löschen";

        return {
            success: false,
            message:
                error.message ||
                "Die Anzeige konnte nicht gelöscht werden."
        };
    }
}
function showSignedOutState() {
    listingGrid.innerHTML = "";
    listingGrid.style.display = "none";
    emptyState.style.display = "none";
    authState.classList.add("active");
    resultsText.textContent =
        "Melde dich an, um deine Anzeigen zu sehen.";
}

function renderMyListings(listings) {
    ownListings = listings;

    authState.classList.remove("active");

    if (listings.length === 0) {
        listingGrid.innerHTML = "";
        listingGrid.style.display = "none";
        emptyState.style.display = "block";
        resultsText.textContent =
            "Du hast momentan keine aktiven Anzeigen.";
        return;
    }

    emptyState.style.display = "none";
    listingGrid.style.display = "grid";

    listingGrid.innerHTML = listings
    .map(createListingCard)
    .join("");

attachEditButtons();
attachDeleteButtons();

    resultsText.textContent =
        `${listings.length} eigene Anzeige${listings.length === 1 ? "" : "n"}`;
}

async function loadMyListings() {
    if (!Clerk.user || !Clerk.session) {
        showSignedOutState();
        return;
    }

    try {
        resultsText.textContent =
            "Deine Anzeigen werden geladen …";

        const token =
            await Clerk.session.getToken();

        const response = await fetch(
            `${BACKEND_URL}/api/listings/mine`,
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

        renderMyListings(data.listings || []);

    } catch (error) {
        console.error(
            "Fehler beim Laden der eigenen Anzeigen:",
            error
        );

        listingGrid.innerHTML = "";
        listingGrid.style.display = "none";
        emptyState.style.display = "none";
        authState.classList.remove("active");

        resultsText.textContent =
            error.message ||
            "Deine Anzeigen konnten nicht geladen werden.";
    }
}

function updateLoginArea() {
    if (!loginButton) {
        return;
    }

    if (Clerk.user) {
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

async function initializePage() {
    try {
        await Clerk.load({
            ui: {
                ClerkUI: window.__internal_ClerkUICtor
            },

            localization: {
                locale: "de-DE",
                formFieldLabel__emailAddress: "E-Mail-Adresse",
                formFieldLabel__password: "Passwort",
                formButtonPrimary: "Weiter",
                dividerText: "oder"
            }
        });

        updateLoginArea();
        await loadMyListings();

        Clerk.addListener(async () => {
            updateLoginArea();
            await loadMyListings();
        });

    } catch (error) {
        console.error(
            "Clerk konnte nicht geladen werden:",
            error
        );

        resultsText.textContent =
            "Das Anmeldesystem konnte nicht geladen werden.";
    }
}

signInButton.addEventListener("click", () => {
    Clerk.openSignIn();
});

cancelDeleteButton.addEventListener("click", () => {
    if (confirmDeleteButton.disabled) {
        return;
    }

    closeDeleteConfirmModal();
});

confirmDeleteButton.addEventListener(
    "click",
    async () => {
        if (
            !pendingDeleteId ||
            !pendingDeleteButton
        ) {
            return;
        }

        const listingId = pendingDeleteId;
        const listingButton = pendingDeleteButton;

        confirmDeleteButton.disabled = true;
        confirmDeleteButton.textContent =
            "Wird gelöscht …";

        const result = await deleteListing(
            listingId,
            listingButton
        );

        if (result?.success) {
            closeDeleteConfirmModal();
            return;
        }

        deleteConfirmText.textContent =
            result?.message ||
            "Die Anzeige konnte nicht gelöscht werden.";

        confirmDeleteButton.disabled = false;
        confirmDeleteButton.textContent =
            "Erneut versuchen";
    }
);

deleteConfirmModal.addEventListener(
    "click",
    (event) => {
        if (
            event.target === deleteConfirmModal &&
            !confirmDeleteButton.disabled
        ) {
            closeDeleteConfirmModal();
        }
    }
);

document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
        return;
    }

    if (
        editListingModal.classList.contains("active") &&
        !saveEditListingButton.disabled
    ) {
        closeEditListingModal();
        return;
    }

    if (
        deleteConfirmModal.classList.contains("active") &&
        !confirmDeleteButton.disabled
    ) {
        closeDeleteConfirmModal();
    }
});

editListingImageFile.addEventListener(
    "change",
    () => {
        const file =
            editListingImageFile.files[0];

        if (!file) {
            selectedEditImageFile = null;
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {
            editListingImageFile.value = "";
            selectedEditImageFile = null;
            editListingImageFileName.textContent =
    "Kein neues Bild ausgewählt";

            alert(
                "Bitte wähle ein JPG-, PNG- oder WEBP-Bild aus."
            );

            return;
        }

        const maximumFileSize =
            5 * 1024 * 1024;

        if (file.size > maximumFileSize) {
            editListingImageFile.value = "";
            selectedEditImageFile = null;
            editListingImageFileName.textContent =
    "Kein neues Bild ausgewählt";

            alert(
                "Das Bild darf maximal 5 MB groß sein."
            );

            return;
        }

        selectedEditImageFile = file;

        editListingImageFileName.textContent =
    file.name;

        const reader = new FileReader();

        reader.addEventListener(
            "load",
            () => {
                editListingImagePreview.src =
                    reader.result;

                editListingImagePreview.hidden =
                    false;
            }
        );

        reader.readAsDataURL(file);
    }
);

closeEditListingModalButton.addEventListener(
    "click",
    () => {
        if (!saveEditListingButton.disabled) {
            closeEditListingModal();
        }
    }
);

cancelEditListingButton.addEventListener(
    "click",
    () => {
        if (!saveEditListingButton.disabled) {
            closeEditListingModal();
        }
    }
);

editListingModal.addEventListener(
    "click",
    (event) => {
        if (
            event.target === editListingModal &&
            !saveEditListingButton.disabled
        ) {
            closeEditListingModal();
        }
    }
);

editListingForm.addEventListener(
    "submit",
    async (event) => {
        event.preventDefault();

        if (!Clerk.user || !Clerk.session) {
            saveEditListingButton.textContent =
                "Bitte erneut anmelden";
            return;
        }

        const listingId = Number(
            document.getElementById("editListingId").value
        );

        const title =
            document
                .getElementById("editListingTitle")
                .value
                .trim();

        const category =
            document.getElementById(
                "editListingCategory"
            ).value;

        const condition =
            document.getElementById(
                "editListingCondition"
            ).value;

        const price = Number(
            document.getElementById(
                "editListingPrice"
            ).value
        );

        const location =
            document
                .getElementById("editListingLocation")
                .value
                .trim();

        const language =
            document.getElementById(
                "editListingLanguage"
            ).value;

        const shipping =
            document.getElementById(
                "editListingShipping"
            ).value;

        let image =
    document
        .getElementById("editListingImage")
        .value
        .trim();

        const description =
            document
                .getElementById(
                    "editListingDescription"
                )
                .value
                .trim();

        if (
            !Number.isInteger(listingId) ||
            listingId <= 0 ||
            !title ||
            !category ||
            !condition ||
            !location ||
            !Number.isFinite(price) ||
            price < 0
        ) {
            saveEditListingButton.textContent =
                "Bitte Angaben prüfen";

            return;
        }

        try {
            saveEditListingButton.disabled = true;
            saveEditListingButton.textContent =
                "Wird gespeichert …";

           const token =
    await Clerk.session.getToken();

if (selectedEditImageFile) {
    saveEditListingButton.textContent =
        "Bild wird hochgeladen …";

    image = await uploadListingImage(
        selectedEditImageFile,
        token
    );

    document
        .getElementById("editListingImage")
        .value = image;
}

saveEditListingButton.textContent =
    "Wird gespeichert …";

const response = await fetch(
                `${BACKEND_URL}/api/listings/${listingId}`,
                {
                    method: "PUT",
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
                        description
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Die Änderungen konnten nicht gespeichert werden."
                );
            }

            closeEditListingModal();

            await loadMyListings();

        } catch (error) {
    console.error(
        "Fehler beim Bearbeiten der Anzeige:",
        error
    );

    saveEditListingButton.disabled = false;
    saveEditListingButton.textContent =
        "Fehler – erneut versuchen";
}
    }
);

initializePage();
