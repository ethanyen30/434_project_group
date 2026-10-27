// Tab Switching
function displayTab(tabName, tabButton) {
  const tabcontents = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabcontents.length; i++) {
    tabcontents[i].style.display = "none";
  }

  const activeContent = document.getElementById(tabName);
  if (activeContent) {
    // Inventory relies on flex layout for table sizing
    activeContent.style.display = (tabName === "inventory") ? "flex" : "block";
  }

  const tablinks = document.getElementsByClassName("tablink");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }

  if (tabButton) {
    tabButton.classList.add("active");
  }
}

// Ensure default tab opens on initial cold-start
const defaultTabBtn = document.getElementById("defaultOpen");
if (defaultTabBtn) {
  defaultTabBtn.click();
}

// --- Tab 1: Inventory Filtering & Search ---
let activeLocation = "all";

function filterLocation(loc, btnElement) {
  activeLocation = loc;

  const subtabs = document.querySelectorAll(".subtab-btn");
  subtabs.forEach((btn) => btn.classList.remove("active"));
  btnElement.classList.add("active");

  applyInventoryFilters();
}

function filterInventory() {
  applyInventoryFilters();
}

function applyInventoryFilters() {
  const query = document.getElementById("invSearch").value.toLowerCase().trim();
  const rows = document.querySelectorAll("#inventoryList tr");

  rows.forEach((row) => {
    const rowLoc = row.getAttribute("data-location");
    const itemName = row.children[0].textContent.toLowerCase();

    const matchesLoc = (activeLocation === "all" || rowLoc === activeLocation);
    const matchesSearch = itemName.includes(query);

    if (matchesLoc && matchesSearch) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

// --- Tab 1: Quick-Add Item (Deep Task Data Entry) ---
function addInventoryRow() {
  const nameInput = document.getElementById("addName");
  const locSelect = document.getElementById("addLoc");
  const qtyInput = document.getElementById("addQty");
  const expInput = document.getElementById("addExp");

  const name = nameInput.value.trim();
  const loc = locSelect.value;
  const qty = qtyInput.value;
  const exp = expInput.value.trim() || "N/A";

  if (!name) {
    nameInput.focus();
    return;
  }

  const tbody = document.getElementById("inventoryList");
  const newRow = document.createElement("tr");
  newRow.setAttribute("data-location", loc);
  newRow.innerHTML = `
    <td>${name}</td>
    <td>${loc}</td>
    <td>${qty}</td>
    <td>${exp}</td>
  `;

  // Prepend to top of table so user immediately sees their entry
  tbody.prepend(newRow);

  // Clear inputs
  nameInput.value = "";
  expInput.value = "";
  qtyInput.value = "1";

  applyInventoryFilters();
}















let currentDay = "Monday";


//storing meals per day of week
const mealPlans = {
  Monday: {
    breakfast: "",
    lunch: "",
    dinner: ""
  },
  Tuesday: {
    breakfast: "",
    lunch: "",
    dinner: ""
  },
  Wednesday: {
    breakfast: "",
    lunch: "",
    dinner: ""
  },
  Thursday: {
    breakfast: "",
    lunch: "",
    dinner: ""
  },
  Friday: {
    breakfast: "",
    lunch: "",
    dinner: ""
  },
  Saturday: {
    breakfast: "",
    lunch: "",
    dinner: ""
  },
  Sunday: {
    breakfast: "",
    lunch: "",
    dinner: ""
  }
};
// swaps day display and meals
function showDay(day, button) {
  currentDay = day;

  const buttons = document.querySelectorAll(".day-btn");
  buttons.forEach((btn) => btn.classList.remove("active"));
  button.classList.add("active");

  document.getElementById("selectedDay").textContent = day;

  document.querySelector(".meal-card:nth-child(1) p").textContent =
    mealPlans[day].breakfast || "No meal planned";

  document.querySelector(".meal-card:nth-child(2) p").textContent =
    mealPlans[day].lunch || "No meal planned";

  document.querySelector(".meal-card:nth-child(3) p").textContent =
    mealPlans[day].dinner || "No meal planned";
}

// adds customized meal to prep
function addMeal() {
  const mealType = document.getElementById("mealType").value;
  const mealName = document.getElementById("mealName").value.trim();

  if (!mealName) {
    document.getElementById("mealName").focus();
    return;
  }

  mealPlans[currentDay][mealType] = mealName;

  const cards = document.querySelectorAll(".meal-card");

  if (mealType === "breakfast") {
    cards[0].querySelector("p").textContent = mealName;
  }

  if (mealType === "lunch") {
    cards[1].querySelector("p").textContent = mealName;
  }

  if (mealType === "dinner") {
    cards[2].querySelector("p").textContent = mealName;
  }

  document.getElementById("mealName").value = "";
}

function filterRecipes() {
  const query = document.getElementById("recipeSearch").value.toLowerCase().trim();
  const cards = document.querySelectorAll(".recipe-card");

  cards.forEach((card) => {
    const title = card.querySelector("h3").textContent.toLowerCase();
    if (title.includes(query)) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}

function cookRecipe(recipeName) {
  alert("Cooking " + recipeName + "!");
}