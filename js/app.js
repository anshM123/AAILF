// Initial sample items with image placeholders
let items = JSON.parse(localStorage.getItem("items")) || [
    { id: 1, title: "Black Backpack", claimed: false, image: "images/black-backpack.jpg" },
    { id: 2, title: "AirPods Case", claimed: false, image: "images/airpods-case.jpg" },
    { id: 3, title: "Calculator", claimed: false, image: "images/calculator.jpg" },
    { id: 4, title: "Water Bottle", claimed: false, image: "images/water-bottle.jpg" },
    { id: 5, title: "Notebook", claimed: false, image: "images/notebook.jpg" },
    { id: 6, title: "Phone Charger", claimed: false, image: "images/phone-charger.jpg" },
    { id: 7, title: "Sunglasses", claimed: false, image: "images/sunglasses.jpg" },
    { id: 8, title: "Keychain", claimed: false, image: "images/keychain.jpg" },
    { id: 9, title: "Umbrella", claimed: false, image: "images/umbrella.jpg" },
    { id: 10, title: "Lunchbox", claimed: false, image: "images/lunchbox.jpg" }
];

let claims = JSON.parse(localStorage.getItem("claims")) || [];

function saveState() {
    localStorage.setItem("items", JSON.stringify(items));
    localStorage.setItem("claims", JSON.stringify(claims));
}

// ---------------------------
// DOM references
// ---------------------------

const itemsListEl = document.getElementById("itemsList");
const itemSelectEl = document.getElementById("itemSelect");
const claimFormEl = document.getElementById("claimForm");
const cancelClaimBtn = document.getElementById("cancelClaim");
const pendingClaimsEl = document.getElementById("pendingClaims");
const adminItemsEl = document.getElementById("adminItems");
const refreshBtn = document.getElementById("refreshBtn");
const claimStatusEl = document.getElementById("claimStatus");

// Lost form
const lostFormEl = document.getElementById("lostForm");
const cancelLostBtn = document.getElementById("cancelLost");
const lostTitleEl = document.getElementById("lostTitle");
const lostLocationEl = document.getElementById("lostLocation");
const lostDateEl = document.getElementById("lostDate");
const lostNameEl = document.getElementById("lostName");
const lostContactEl = document.getElementById("lostContact");
const lostMessageEl = document.getElementById("lostMessage");

// Found form
const foundFormEl = document.getElementById("foundForm");
const cancelFoundBtn = document.getElementById("cancelFound");
const foundTitleEl = document.getElementById("foundTitle");
const foundLocationEl = document.getElementById("foundLocation");
const foundDateEl = document.getElementById("foundDate");
const foundNameEl = document.getElementById("foundName");
const foundContactEl = document.getElementById("foundContact");
const foundMessageEl = document.getElementById("foundMessage");
const foundImageEl = document.getElementById("foundImage");

// Claim form (for claim.html)
const studentNameEl = document.getElementById("studentName");
const contactEl = document.getElementById("contact");
const messageEl = document.getElementById("message");

// ---------------------------
// Rendering functions
// ---------------------------

let currentSearchQuery = "";

function renderItems() {
    if (!itemsListEl) return;
    itemsListEl.innerHTML = "";

    const query = currentSearchQuery.toLowerCase();

    // Filter unclaimed items, then apply search query
    let visibleItems = items.filter(item => !item.claimed);

    if (query) {
        // Separate matches from non-matches
        const matches = visibleItems.filter(item =>
            item.title.toLowerCase().includes(query) ||
            (item.location && item.location.toLowerCase().includes(query))
        );
        const nonMatches = visibleItems.filter(item =>
            !item.title.toLowerCase().includes(query) &&
            !(item.location && item.location.toLowerCase().includes(query))
        );

        // Sort matches: items starting with the query first, then by indexOf
        matches.sort((a, b) => {
            const aTitle = a.title.toLowerCase();
            const bTitle = b.title.toLowerCase();
            const aStarts = aTitle.startsWith(query) ? 0 : 1;
            const bStarts = bTitle.startsWith(query) ? 0 : 1;
            if (aStarts !== bStarts) return aStarts - bStarts;
            return aTitle.indexOf(query) - bTitle.indexOf(query);
        });

        visibleItems = [...matches, ...nonMatches];
    }

    if (visibleItems.length === 0) {
        itemsListEl.innerHTML = `<p class="muted small">No items currently in the lost & found.</p>`;
        return;
    }

    visibleItems.forEach(item => {
        const isMatch = !query || item.title.toLowerCase().includes(query) ||
            (item.location && item.location.toLowerCase().includes(query));

        const wrapper = document.createElement("div");
        wrapper.className = "item";
        if (query) {
            wrapper.classList.add(isMatch ? "search-match" : "search-dimmed");
        }

        const thumb = document.createElement("div");
        thumb.className = "thumb";
        const img = document.createElement("img");
        img.src = item.image || "images/lost-items-bg.jpg";
        img.alt = item.title;
        img.onerror = () => { img.src = "images/lost-items-bg.jpg"; };
        thumb.appendChild(img);

        const meta = document.createElement("div");
        meta.className = "meta";
        const title = document.createElement("h4");

        // Highlight matching text in the title
        if (query && item.title.toLowerCase().includes(query)) {
            const idx = item.title.toLowerCase().indexOf(query);
            const before = item.title.slice(0, idx);
            const match = item.title.slice(idx, idx + query.length);
            const after = item.title.slice(idx + query.length);
            title.innerHTML = `${before}<mark>${match}</mark>${after}`;
        } else {
            title.textContent = item.title;
        }

        const location = document.createElement("p");
        location.className = "muted";
        location.textContent = item.location || "Location not specified";
        meta.appendChild(title);
        meta.appendChild(location);

        const btn = document.createElement("a");
        btn.className = "btn";
        btn.textContent = "Claim";
        btn.href = "claim.html";

        wrapper.appendChild(thumb);
        wrapper.appendChild(meta);
        wrapper.appendChild(btn);

        itemsListEl.appendChild(wrapper);
    });

    if (query && !visibleItems.some(item =>
        item.title.toLowerCase().includes(query) ||
        (item.location && item.location.toLowerCase().includes(query))
    )) {
        itemsListEl.innerHTML = `<p class="muted small">No items match your search.</p>`;
    }
}

function populateItemSelect() {
    if (!itemSelectEl) return;
    itemSelectEl.innerHTML = "";
    items.forEach(item => {
        if (item.claimed) return;
        const opt = document.createElement("option");
        opt.value = item.id;
        opt.textContent = item.title;
        itemSelectEl.appendChild(opt);
    });
}

function renderClaimStatus() {
    if (claims.length === 0) {
        claimStatusEl.textContent = "No recent claims.";
        return;
    }

    const latest = claims[claims.length - 1];
    let text = "";

    if (latest.type === "found") {
        const item = items.find(i => i.id == latest.itemId);
        const itemTitle = item ? item.title : `Item #${latest.itemId}`;
        text = `${latest.name} submitted a claim for "${itemTitle}" — status: ${latest.status || "pending"}.`;
    } else {
        text = `${latest.name} reported a lost item "${latest.title}" — status: ${latest.status || "pending"}.`;
    }

    claimStatusEl.textContent = text;
}

function renderAdminClaims() {
    pendingClaimsEl.innerHTML = "<h3>Pending Claims</h3>";

    const pending = claims.filter(c => !c.status || c.status === "pending");

    if (pending.length === 0) {
        const empty = document.createElement("p");
        empty.className = "muted small";
        empty.textContent = "No pending claims at the moment.";
        pendingClaimsEl.appendChild(empty);
        return;
    }

    pending.forEach((c, index) => {
        const wrapper = document.createElement("div");
        wrapper.className = "item";

        const info = document.createElement("div");

        if (c.type === "lost") {
            info.innerHTML = `
                <strong>${c.name}</strong> reported <em>lost</em>: "${c.title}"
                <div class="muted small">${c.location || "Location not specified"} · ${c.dateLost || "Date not specified"}</div>
                <div class="muted small">${c.message || ""}</div>
            `;
        } else {
            const item = items.find(i => i.id == c.itemId);
            const itemTitle = item ? item.title : `Item #${c.itemId}`;
            info.innerHTML = `
                <strong>${c.name}</strong> claims: "${itemTitle}"
                <div class="muted small">${c.message || ""}</div>
            `;
        }

        const actions = document.createElement("div");
        actions.className = "actions";

        const approveBtn = document.createElement("button");
        approveBtn.className = "btn";
        approveBtn.textContent = c.type === "lost" ? "Mark Found" : "Approve";
        approveBtn.addEventListener("click", () => approveClaim(index));

        const rejectBtn = document.createElement("button");
        rejectBtn.className = "btn gray";
        rejectBtn.textContent = "Reject";
        rejectBtn.addEventListener("click", () => rejectClaim(index));

        actions.appendChild(approveBtn);
        actions.appendChild(rejectBtn);

        wrapper.appendChild(info);
        wrapper.appendChild(actions);
        pendingClaimsEl.appendChild(wrapper);
    });
}

function renderAdminItems() {
    adminItemsEl.innerHTML = "<h3>All Items</h3>";

    if (items.length === 0) {
        adminItemsEl.innerHTML += `<p class="muted small">No items in the system.</p>`;
        return;
    }

    items.forEach(item => {
        const wrapper = document.createElement("div");
        wrapper.className = "item";

        const info = document.createElement("div");
        info.innerHTML = `
            <strong>${item.title}</strong>
            <div class="muted small">${item.claimed ? "Status: Claimed" : "Status: Available"}</div>
        `;

        wrapper.appendChild(info);
        adminItemsEl.appendChild(wrapper);
    });
}

function renderAll() {
    if (itemsListEl) renderItems();
    if (claimStatusEl) renderClaimStatus();
}

// ---------------------------
// Claim flow
// ---------------------------

function startClaimForItem(itemId) {
    window.location.href = "claim.html";
}

function toggleClaimTypeFields(type) {
    if (type === "found") {
        foundFieldsEl.style.display = "";
        lostFieldsEl.style.display = "none";
    } else {
        foundFieldsEl.style.display = "none";
        lostFieldsEl.style.display = "";
    }
}

function clearForm() {
    lostTitleEl.value = "";
    lostLocationEl.value = "";
    lostDateEl.value = "";
    studentNameEl.value = "";
    contactEl.value = "";
    messageEl.value = "";
}

function handleClaimSubmit(event) {
    event.preventDefault();

    const name = studentNameEl.value.trim();
    const contact = contactEl.value.trim();
    const selectedItem = itemSelectEl.value;

    clearForm();

    if (!name || !contact) {
        alert("Please enter your name and contact information.");
        return;
    }

    if (!selectedItem) {
        alert("Please select an item to claim.");
        return;
    }

    claims.push({
        type: "found",
        itemId: selectedItem,
        name,
        contact,
        message: messageEl.value.trim(),
        status: "pending",
        createdAt: new Date().toISOString()
    });

    saveState();
    renderClaimStatus();
    const successEl = document.getElementById("successMessage");
    if (successEl) {
        successEl.style.display = "block";
        setTimeout(() => window.location.href = "index.html", 2000);
    } else {
        alert("Your claim has been submitted and is pending review.");
        window.location.href = "index.html";
    }
}

function clearForm() {
    if (lostTitleEl) lostTitleEl.value = "";
    if (lostLocationEl) lostLocationEl.value = "";
    if (lostDateEl) lostDateEl.value = "";
    if (studentNameEl) studentNameEl.value = "";
    if (contactEl) contactEl.value = "";
    if (messageEl) messageEl.value = "";
    if (foundTitleEl) foundTitleEl.value = "";
    if (foundLocationEl) foundLocationEl.value = "";
    if (foundDateEl) foundDateEl.value = "";
    if (foundNameEl) foundNameEl.value = "";
    if (foundContactEl) foundContactEl.value = "";
    if (foundMessageEl) foundMessageEl.value = "";
    if (foundImageEl) foundImageEl.value = "";
}

function handleLostSubmit(event) {
    event.preventDefault();

    const title = lostTitleEl.value.trim();
    const location = lostLocationEl.value.trim();
    const dateLost = lostDateEl.value;
    const name = lostNameEl.value.trim();
    const contact = lostContactEl.value.trim();

    clearForm();

    if (!title || !name || !contact) {
        alert("Please fill in all required fields.");
        return;
    }

    claims.push({
        type: "lost",
        title,
        location,
        dateLost,
        name,
        contact,
        message: lostMessageEl.value.trim(),
        status: "pending",
        createdAt: new Date().toISOString()
    });

    saveState();
    renderClaimStatus();
    const successEl = document.getElementById("successMessage");
    if (successEl) {
        successEl.style.display = "block";
        setTimeout(() => window.location.href = "index.html", 2000);
    } else {
        alert("Report submitted successfully!");
        window.location.href = "index.html";
    }
}

function handleFoundSubmit(event) {
    event.preventDefault();

    const title = foundTitleEl.value.trim();
    const location = foundLocationEl.value.trim();
    const dateFound = foundDateEl.value;
    const name = foundNameEl.value.trim();
    const contact = foundContactEl.value.trim();

    clearForm();

    if (!title || !name || !contact) {
        alert("Please fill in all required fields.");
        return;
    }

    // Add to items
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    items.push({
        id: newId,
        title,
        claimed: false
    });

    saveState();
    const successEl = document.getElementById("successMessage");
    if (successEl) {
        successEl.style.display = "block";
        setTimeout(() => window.location.href = "index.html", 2000);
    } else {
        alert("Your found item report has been submitted. The item is now available for claims.");
        window.location.href = "index.html";
    }
}

// ---------------------------
// Admin actions
// ---------------------------

function approveClaim(index) {
    const claim = claims[index];
    if (!claim) return;

    if (claim.type === "found") {
        const item = items.find(i => i.id == claim.itemId);
        if (item) item.claimed = true;
        claim.status = "approved";
    } else if (claim.type === "lost") {
        claim.status = "resolved";
    } else {
        claim.status = "approved";
    }

    saveState();
    renderAll();
    renderAdminClaims();
    renderAdminItems();
}

function rejectClaim(index) {
    const claim = claims[index];
    if (!claim) return;

    claim.status = "rejected";
    saveState();
    renderClaimStatus();
    renderAdminClaims();
}

// ---------------------------
// Admin login
// ---------------------------

function handleLogin(event) {
    event.preventDefault();
    const user = document.getElementById("adminUser").value;
    const pass = document.getElementById("adminPass").value;
    if (user === "Admin" && pass === "12345678") {
        document.getElementById("login").style.display = "none";
        document.getElementById("admin").style.display = "block";
        renderAdminClaims();
        renderAdminItems();
    } else {
        alert("Incorrect username or password.");
    }
}

// ---------------------------
// Misc / refresh

function handleRefresh() {
    // For now, just re-render from localStorage
    items = JSON.parse(localStorage.getItem("items")) || items;
    claims = JSON.parse(localStorage.getItem("claims")) || claims;
    renderAll();
    alert("Data refreshed.");
}

// ---------------------------
// Initialization
// ---------------------------

function init() {
    if (claimFormEl) {
        claimFormEl.addEventListener("submit", handleClaimSubmit);
    }
    if (cancelClaimBtn) {
        cancelClaimBtn.addEventListener("click", () => window.location.href = "index.html");
    }
    if (lostFormEl) {
        lostFormEl.addEventListener("submit", handleLostSubmit);
    }
    if (cancelLostBtn) {
        cancelLostBtn.addEventListener("click", () => window.location.href = "index.html");
    }
    if (foundFormEl) {
        foundFormEl.addEventListener("submit", handleFoundSubmit);
    }
    if (cancelFoundBtn) {
        cancelFoundBtn.addEventListener("click", () => window.location.href = "index.html");
    }
    if (refreshBtn) {
        refreshBtn.addEventListener("click", handleRefresh);
    }
    if (document.getElementById("loginForm")) {
        document.getElementById("loginForm").addEventListener("submit", handleLogin);
    }

    // Search bar setup
    const searchBarEl = document.getElementById("searchBar");
    if (searchBarEl) {
        searchBarEl.addEventListener("input", () => {
            currentSearchQuery = searchBarEl.value.trim();
            renderItems();
        });
    }

    renderAll();
    populateItemSelect();
}

document.addEventListener("DOMContentLoaded", init);

