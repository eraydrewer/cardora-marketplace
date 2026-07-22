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

function attachDeleteButtons() {
    const deleteButtons =
        document.querySelectorAll("[data-delete-id]");

    deleteButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            const listingId =
                Number(button.dataset.deleteId);

            await deleteListing(listingId, button);
        });
    });
}

async function deleteListing(listingId, button) {
    if (!Clerk.user || !Clerk.session) {
        alert("Du musst angemeldet sein.");
        return;
    }

    const confirmed = window.confirm(
        "Möchtest du diese Anzeige wirklich dauerhaft löschen?"
    );

    if (!confirmed) {
        return;
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

        alert("Die Anzeige wurde erfolgreich gelöscht.");

        await loadMyListings();

    } catch (error) {
        console.error(
            "Fehler beim Löschen der Anzeige:",
            error
        );

        alert(
            error.message ||
            "Die Anzeige konnte nicht gelöscht werden."
        );

        button.disabled = false;
        button.textContent = "🗑 Anzeige löschen";
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

initializePage();
