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

const editListingImagesPreviewGrid =
    document.getElementById("editListingImagesPreviewGrid");

const editListingImageFileName =
    document.getElementById("editListingImageFileName");

let editExistingImages = [];
let selectedEditImageFiles = [];
let selectedEditPreviewUrls = [];

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

async function uploadListingImages(files, token) {
    if (!Array.isArray(files) || files.length === 0) {
        return [];
    }

    const formData = new FormData();

    files.forEach((file) => {
        formData.append("images", file);
    });

    const response = await fetch(
        `${BACKEND_URL}/api/uploads/images`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
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
            "Der Upload hat keine gültige Bilderliste zurückgegeben."
        );
    }

    return data.images.map((imageItem, index) => {
        if (!imageItem?.imageUrl) {
            throw new Error(
                "Mindestens ein hochgeladenes Bild hat keine Bildadresse."
            );
        }

        return {
            id: null,
            imageUrl: imageItem.imageUrl,
            publicId: imageItem.publicId || null,
            sortOrder: index
        };
    });
}

function normalizeListingImages(listing) {
    const rawImages =
        Array.isArray(listing?.images)
            ? listing.images
            : [];

    const normalizedImages = [];
    const usedUrls = new Set();

    rawImages.forEach((imageItem, index) => {
        const imageUrl =
            typeof imageItem?.imageUrl === "string"
                ? imageItem.imageUrl.trim()
                : typeof imageItem?.image_url === "string"
                    ? imageItem.image_url.trim()
                    : "";

        if (!imageUrl || usedUrls.has(imageUrl)) {
            return;
        }

        usedUrls.add(imageUrl);

        const numericId = Number(imageItem.id);

        normalizedImages.push({
            id:
                Number.isInteger(numericId) &&
                numericId > 0
                    ? numericId
                    : null,
            imageUrl,
            publicId:
                imageItem.publicId ||
                imageItem.public_id ||
                null,
            sortOrder:
                Number.isInteger(
                    Number(
                        imageItem.sortOrder ??
                        imageItem.sort_order
                    )
                )
                    ? Number(
                        imageItem.sortOrder ??
                        imageItem.sort_order
                    )
                    : index
        });
    });

    normalizedImages.sort(
        (firstImage, secondImage) =>
            firstImage.sortOrder -
            secondImage.sortOrder
    );

    if (
        normalizedImages.length === 0 &&
        typeof listing?.image === "string" &&
        listing.image.trim()
    ) {
        normalizedImages.push({
            id: null,
            imageUrl: listing.image.trim(),
            publicId: null,
            sortOrder: 0
        });
    }

    return normalizedImages.map(
        (imageItem, index) => ({
            ...imageItem,
            sortOrder: index
        })
    );
}

function releaseEditPreviewUrls() {
    selectedEditPreviewUrls.forEach((previewUrl) => {
        URL.revokeObjectURL(previewUrl);
    });

    selectedEditPreviewUrls = [];
}

function updateEditImageCount() {
    const totalImages =
        editExistingImages.length +
        selectedEditImageFiles.length;

    editListingImageFileName.textContent =
        `${totalImages} von 8 Bildern`;
}

function createEditPreviewItem({
    imageUrl,
    index,
    onRemove,
    removeLabel
}) {
    const previewItem =
        document.createElement("div");

    previewItem.className =
        "listing-image-preview-item";

    const previewImage =
        document.createElement("img");

    previewImage.src = imageUrl;
    previewImage.alt =
        `Vorschau Bild ${index + 1}`;

    const removeButton =
        document.createElement("button");

    removeButton.className =
        "listing-image-remove-button";

    removeButton.type = "button";
    removeButton.textContent = "×";

    removeButton.setAttribute(
        "aria-label",
        removeLabel
    );

    removeButton.addEventListener(
        "click",
        onRemove
    );

    previewItem.appendChild(previewImage);
    previewItem.appendChild(removeButton);

    if (index === 0) {
        const primaryBadge =
            document.createElement("span");

        primaryBadge.className =
            "listing-image-primary-badge";

        primaryBadge.textContent =
            "Titelbild";

        previewItem.appendChild(primaryBadge);
    }

    editListingImagesPreviewGrid.appendChild(
        previewItem
    );
}

function renderEditListingImages() {
    releaseEditPreviewUrls();

    editListingImagesPreviewGrid.innerHTML = "";

    editExistingImages.forEach(
        (imageItem, index) => {
            createEditPreviewItem({
                imageUrl: imageItem.imageUrl,
                index,
                removeLabel:
                    `Vorhandenes Bild ${index + 1} löschen`,
                onRemove: async (event) => {
                    const removeButton =
                        event.currentTarget;

                    if (imageItem.id) {
                        await deleteExistingListingImage(
                            imageItem.id,
                            removeButton
                        );

                        return;
                    }

                    editExistingImages.splice(index, 1);

                    editExistingImages =
                        editExistingImages.map(
                            (item, itemIndex) => ({
                                ...item,
                                sortOrder: itemIndex
                            })
                        );

                    renderEditListingImages();
                }
            });
        }
    );

    selectedEditImageFiles.forEach(
        (file, fileIndex) => {
            const previewUrl =
                URL.createObjectURL(file);

            selectedEditPreviewUrls.push(
                previewUrl
            );

            const combinedIndex =
                editExistingImages.length +
                fileIndex;

            createEditPreviewItem({
                imageUrl: previewUrl,
                index: combinedIndex,
                removeLabel:
                    `Neues Bild ${fileIndex + 1} entfernen`,
                onRemove: () => {
                    selectedEditImageFiles.splice(
                        fileIndex,
                        1
                    );

                    editListingImageFile.value = "";

                    renderEditListingImages();
                }
            });
        }
    );

    const currentPrimaryImage =
        editExistingImages[0]?.imageUrl ||
        "";

    document
        .getElementById("editListingImage")
        .value = currentPrimaryImage;

    updateEditImageCount();
}

function resetEditListingImages() {
    releaseEditPreviewUrls();

    editExistingImages = [];
    selectedEditImageFiles = [];

    editListingImageFile.value = "";
    editListingImagesPreviewGrid.innerHTML = "";

    document
        .getElementById("editListingImage")
        .value = "";

    updateEditImageCount();
}

async function deleteExistingListingImage(
    imageId,
    button
) {
    if (!Clerk.user || !Clerk.session) {
        alert(
            "Du musst angemeldet sein, um ein Bild zu löschen."
        );

        return;
    }

    const listingId = Number(
        document
            .getElementById("editListingId")
            .value
    );

    if (
        !Number.isInteger(listingId) ||
        listingId <= 0
    ) {
        alert("Ungültige Anzeigen-ID.");
        return;
    }

    const confirmed = window.confirm(
        "Möchtest du dieses Bild wirklich löschen?"
    );

    if (!confirmed) {
        return;
    }

    const oldButtonText = button.textContent;

    try {
        button.disabled = true;
        button.textContent = "…";

        const token =
            await Clerk.session.getToken();

        const response = await fetch(
            `${BACKEND_URL}/api/listings/${listingId}/images/${imageId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Das Bild konnte nicht gelöscht werden."
            );
        }

        editExistingImages =
            normalizeListingImages({
                images: data.images || [],
                image: data.primaryImage || ""
            });

        const matchingListing =
            ownListings.find(
                (listing) =>
                    Number(listing.id) ===
                    listingId
            );

        if (matchingListing) {
            matchingListing.images =
                editExistingImages;

            matchingListing.image =
                data.primaryImage ||
                editExistingImages[0]
                    ?.imageUrl ||
                "";
        }

        renderEditListingImages();

    } catch (error) {
        console.error(
            "Fehler beim Löschen des Bildes:",
            error
        );

        button.disabled = false;
        button.textContent = oldButtonText;

        alert(
            error.message ||
            "Das Bild konnte nicht gelöscht werden."
        );
    }
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

    editExistingImages =
        normalizeListingImages(listing);

    selectedEditImageFiles = [];
    editListingImageFile.value = "";

    renderEditListingImages();

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

    resetEditListingImages();

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
        const incomingFiles =
            Array.from(
                editListingImageFile.files || []
            );

        editListingImageFile.value = "";

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
                selectedEditImageFiles.some(
                    (selectedFile) =>
                        selectedFile.name ===
                            file.name &&
                        selectedFile.size ===
                            file.size &&
                        selectedFile.lastModified ===
                            file.lastModified
                );

            if (alreadySelected) {
                duplicateCount += 1;
                return;
            }

            const currentTotal =
                editExistingImages.length +
                selectedEditImageFiles.length;

            if (currentTotal >= 8) {
                overflowCount += 1;
                return;
            }

            selectedEditImageFiles.push(file);
        });

        renderEditListingImages();

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
            alert(
                `Einige Bilder wurden nicht übernommen: ${rejectedReasons.join(", ")}.`
            );
        }
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

        let images =
            editExistingImages.map(
                (imageItem, index) => ({
                    id: imageItem.id || null,
                    imageUrl: imageItem.imageUrl,
                    publicId:
                        imageItem.publicId || null,
                    sortOrder: index
                })
            );

        let image =
            images[0]?.imageUrl || "";

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

if (selectedEditImageFiles.length > 0) {
    saveEditListingButton.textContent =
        `${selectedEditImageFiles.length} Bild${selectedEditImageFiles.length === 1 ? "" : "er"} werden hochgeladen …`;

    const uploadedImages =
        await uploadListingImages(
            selectedEditImageFiles,
            token
        );

    images = [
        ...images,
        ...uploadedImages
    ].map((imageItem, index) => ({
        id: imageItem.id || null,
        imageUrl: imageItem.imageUrl,
        publicId:
            imageItem.publicId || null,
        sortOrder: index
    }));
}

image =
    images[0]?.imageUrl || "";

document
    .getElementById("editListingImage")
    .value = image;

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
                        images,
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
