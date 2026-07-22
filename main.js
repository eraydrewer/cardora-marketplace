const defaultListings = [
    {
        id: 1,
        title: "Glurak Base Set Holo",
        category: "Pokémon",
        condition: "Excellent",
        price: 549.99,
        location: "Köln",
        language: "Deutsch",
        shipping: "Versand oder Abholung",
        image: "",
        description: "Glurak aus dem Base Set. Leichte Gebrauchsspuren vorhanden.",
        seller: "CardMaster92",
        createdAt: "2026-07-15T08:30:00"
    },
    {
        id: 2,
        title: "Pikachu Illustration Rare",
        category: "Pokémon",
        condition: "Near Mint",
        price: 189,
        location: "Düsseldorf",
        language: "Englisch",
        shipping: "Versand möglich",
        image: "",
        description: "Direkt aus dem Booster gezogen und sofort geschützt.",
        seller: "PikaCollector",
        createdAt: "2026-07-15T07:15:00"
    },
    {
        id: 3,
        title: "Monkey D. Luffy Alternate Art",
        category: "One Piece",
        condition: "Near Mint",
        price: 134.5,
        location: "Berlin",
        language: "Englisch",
        shipping: "Versand möglich",
        image: "",
        description: "Sehr guter Zustand. Karte befindet sich im Toploader.",
        seller: "GrandLineCards",
        createdAt: "2026-07-14T21:45:00"
    },
    {
        id: 4,
        title: "Blue-Eyes White Dragon",
        category: "Yu-Gi-Oh!",
        condition: "Excellent",
        price: 79.99,
        location: "Hamburg",
        language: "Deutsch",
        shipping: "Versand oder Abholung",
        image: "",
        description: "Klassischer Blauäugiger weißer Drache.",
        seller: "DuelKing",
        createdAt: "2026-07-14T18:20:00"
    },
    {
        id: 5,
        title: "Black Lotus Sammlerkarte",
        category: "Magic",
        condition: "Played",
        price: 899,
        location: "München",
        language: "Englisch",
        shipping: "Nur Abholung",
        image: "",
        description: "Sammlerstück mit sichtbaren Gebrauchsspuren.",
        seller: "ManaVault",
        createdAt: "2026-07-14T13:10:00"
    },
    {
        id: 6,
        title: "Cristiano Ronaldo Topps Chrome",
        category: "Sportkarten",
        condition: "Near Mint",
        price: 64.9,
        location: "Frankfurt",
        language: "Englisch",
        shipping: "Versand möglich",
        image: "",
        description: "Topps Chrome Fußballkarte in sehr gutem Zustand.",
        seller: "SportsCardDE",
        createdAt: "2026-07-13T20:00:00"
    },
    {
        id: 7,
        title: "Mewtu VSTAR Gold",
        category: "Pokémon",
        condition: "Neu",
        price: 42,
        location: "Essen",
        language: "Deutsch",
        shipping: "Versand möglich",
        image: "",
        description: "Neue Karte ohne sichtbare Schäden.",
        seller: "RareHunter",
        createdAt: "2026-07-13T15:35:00"
    },
    {
        id: 8,
        title: "Roronoa Zoro Manga Rare",
        category: "One Piece",
        condition: "Near Mint",
        price: 379,
        location: "Dortmund",
        language: "Englisch",
        shipping: "Versand oder Abholung",
        image: "",
        description: "Seltene Manga-Karte in hervorragendem Zustand.",
        seller: "PirateCards",
        createdAt: "2026-07-12T17:10:00"
    },
    {
        id: 9,
        title: "Dark Magician Girl Secret Rare",
        category: "Yu-Gi-Oh!",
        condition: "Near Mint",
        price: 119.99,
        location: "Bremen",
        language: "Deutsch",
        shipping: "Versand möglich",
        image: "",
        description: "Geschützt gelagerte Secret Rare Karte.",
        seller: "MillenniumShop",
        createdAt: "2026-07-12T11:45:00"
    },
    {
        id: 10,
        title: "Umbreon VMAX Alternative Art",
        category: "Pokémon",
        condition: "Near Mint",
        price: 699,
        location: "Hannover",
        language: "Englisch",
        shipping: "Versand möglich",
        image: "",
        description: "Sehr seltene Umbreon-Karte. Keine sichtbaren Schäden.",
        seller: "MoonbreonDE",
        createdAt: "2026-07-11T22:30:00"
    },
    {
        id: 11,
        title: "Jace, the Mind Sculptor",
        category: "Magic",
        condition: "Excellent",
        price: 56.5,
        location: "Leipzig",
        language: "Englisch",
        shipping: "Versand möglich",
        image: "",
        description: "Guter Zustand mit leichten Gebrauchsspuren.",
        seller: "Planeswalker",
        createdAt: "2026-07-11T14:05:00"
    },
    {
        id: 12,
        title: "Lionel Messi Panini Prizm",
        category: "Sportkarten",
        condition: "Neu",
        price: 89,
        location: "Stuttgart",
        language: "Englisch",
        shipping: "Versand oder Abholung",
        image: "",
        description: "Frisch aus dem Pack und sofort geschützt.",
        seller: "FootballCards",
        createdAt: "2026-07-10T19:30:00"
    },
    {
        id: 13,
        title: "Cristiano Ronaldo Topps Chrome",
        category: "Fußballkarten",
        condition: "Near Mint",
        price: 74.99,
        location: "Köln",
        language: "Englisch",
        shipping: "Versand möglich",
        image: "",
        description: "Cristiano-Ronaldo-Karte von Topps Chrome in sehr gutem Zustand.",
        seller: "FootballCollector",
        createdAt: "2026-07-15T10:30:00"
    },
    {
        id: 14,
        title: "Lionel Messi Panini Prizm",
        category: "Fußballkarten",
        condition: "Neu",
        price: 89.00,
        location: "Dortmund",
        language: "Englisch",
        shipping: "Versand oder Abholung",
        image: "",
        description: "Lionel-Messi-Karte von Panini Prizm, direkt nach dem Öffnen geschützt.",
        seller: "PaniniCardsDE",
        createdAt: "2026-07-15T10:15:00"
    },
    {
        id: 15,
        title: "Jude Bellingham Rookie Card",
        category: "Fußballkarten",
        condition: "Near Mint",
        price: 129.99,
        location: "Düsseldorf",
        language: "Englisch",
        shipping: "Versand möglich",
        image: "",
        description: "Jude-Bellingham-Rookie-Karte in hervorragendem Zustand.",
        seller: "RookieHunter",
        createdAt: "2026-07-15T09:50:00"
    },
    {
        id: 16,
        title: "Kylian Mbappé Topps Finest",
        category: "Fußballkarten",
        condition: "Excellent",
        price: 54.50,
        location: "Berlin",
        language: "Englisch",
        shipping: "Versand möglich",
        image: "",
        description: "Topps-Finest-Karte von Kylian Mbappé mit leichten Gebrauchsspuren.",
        seller: "GoalCards",
        createdAt: "2026-07-15T09:30:00"
    },
    {
        id: 17,
        title: "Michael Jordan Upper Deck",
        category: "Basketballkarten",
        condition: "Excellent",
        price: 249.99,
        location: "Hamburg",
        language: "Englisch",
        shipping: "Versand oder Abholung",
        image: "",
        description: "Michael-Jordan-Sammlerkarte von Upper Deck.",
        seller: "BasketballVault",
        createdAt: "2026-07-15T09:00:00"
    },
    {
        id: 18,
        title: "LeBron James Panini Prizm",
        category: "Basketballkarten",
        condition: "Near Mint",
        price: 179.00,
        location: "Frankfurt",
        language: "Englisch",
        shipping: "Versand möglich",
        image: "",
        description: "LeBron-James-Panini-Prizm-Karte im Toploader.",
        seller: "NBACollector",
        createdAt: "2026-07-15T08:45:00"
    },
    {
        id: 19,
        title: "Stephen Curry Select Silver",
        category: "Basketballkarten",
        condition: "Near Mint",
        price: 119.99,
        location: "München",
        language: "Englisch",
        shipping: "Versand möglich",
        image: "",
        description: "Stephen-Curry-Select-Silver-Karte in sehr gutem Zustand.",
        seller: "CourtCards",
        createdAt: "2026-07-15T08:15:00"
    },
    {
        id: 20,
        title: "Luka Dončić Rookie Card",
        category: "Basketballkarten",
        condition: "Excellent",
        price: 299.00,
        location: "Essen",
        language: "Englisch",
        shipping: "Versand oder Abholung",
        image: "",
        description: "Gesuchte Luka-Dončić-Rookie-Karte mit leichten Gebrauchsspuren.",
        seller: "RookieBasket",
        createdAt: "2026-07-15T07:50:00"
    },
    {
        id: 21,
        title: "Victor Wembanyama Rookie",
        category: "Basketballkarten",
        condition: "Neu",
        price: 159.90,
        location: "Stuttgart",
        language: "Englisch",
        shipping: "Versand möglich",
        image: "",
        description: "Victor-Wembanyama-Rookie-Karte, frisch gezogen und geschützt.",
        seller: "NextGenCards",
        createdAt: "2026-07-15T07:30:00"
    }
];

let listings = [];
let favoriteIds = loadFavorites();

let activeCategory = "Alle";
let activeSearch = "";
let visibleListings = 8;

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

const mobileNavigation = document.getElementById("mobileNavigation");

const toast = document.getElementById("toast");
const toastTitle = document.getElementById("toastTitle");
const toastMessage = document.getElementById("toastMessage");

async function loadListingsFromBackend() {
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

    if (activeSearch) {
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

function updateLoginArea() {
    if (!loginButton) {
        return;
    }

    if (Clerk.user) {

    syncUserWithBackend();

    loginButton.innerHTML = "";
    loginButton.classList.add("user-profile-button");

Clerk.mountUserButton(loginButton, {
    appearance: {
        elements: {
            userButtonAvatarBox: {
                borderRadius: "9999px",
                backgroundColor: "transparent",
                boxShadow: "none"
            },
            avatarBox: {
                borderRadius: "9999px",
                backgroundColor: "transparent",
                boxShadow: "none"
            },
            userButtonTrigger: {
                backgroundColor: "transparent",
                boxShadow: "none",
                border: "none"
            }
        }
    }
});
    } else {
        loginButton.classList.remove("user-profile-button");
        loginButton.innerHTML = "Anmelden";

        loginButton.onclick = () => {
            Clerk.openSignIn();
        };
    }
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

listingForm.addEventListener("submit", (event) => {
    event.preventDefault();

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

    const image =
        document.getElementById("listingImage").value.trim();

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

    const newListing = {
        id: Date.now(),
        title,
        category,
        condition,
        price,
        location,
        language,
        shipping,
        image,
        description,
        seller:
    Clerk.user?.fullName ||
    Clerk.user?.firstName ||
    Clerk.user?.username ||
    "Unbekannter Verkäufer",
        createdAt: new Date().toISOString()
    };

    listings.unshift(newListing);
    saveListings();

    listingForm.reset();

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

    renderListings();

    document
        .getElementById("marketplace")
        .scrollIntoView({
            behavior: "smooth"
        });

    showToast(
        "Anzeige veröffentlicht",
        "Deine Karte wurde erfolgreich zum Marktplatz hinzugefügt."
    );
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
