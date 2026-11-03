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















// --- Tab 2: Independent Shopping List ---
let activeShoppingFilter = "all";

function updateShoppingProgress() {
  const items = document.querySelectorAll("#shoppingList .shopping-item");
  const purchased = document.querySelectorAll(
    '#shoppingList .shopping-item[data-status="purchased"]'
  );

  document.getElementById("shoppingProgress").textContent =
    `${purchased.length} of ${items.length} items in cart`;
}

function filterShoppingList(status, button) {
  activeShoppingFilter = status;

  document.querySelectorAll(".shopping-filter").forEach((filterButton) => {
    filterButton.classList.remove("active");
  });
  button.classList.add("active");

  applyShoppingFilter();
}

function applyShoppingFilter() {
  document.querySelectorAll("#shoppingList .shopping-item").forEach((item) => {
    const matches =
      activeShoppingFilter === "all" ||
      item.getAttribute("data-status") === activeShoppingFilter;
    item.style.display = matches ? "flex" : "none";
  });
}

function toggleShoppingItem(checkbox) {
  const item = checkbox.closest(".shopping-item");
  const status = checkbox.checked ? "purchased" : "needed";

  item.setAttribute("data-status", status);
  item.classList.toggle("purchased", checkbox.checked);
  updateShoppingProgress();
  applyShoppingFilter();
}

function removeShoppingItem(button) {
  button.closest(".shopping-item").remove();
  updateShoppingProgress();
}

function clearPurchasedItems() {
  document
    .querySelectorAll('#shoppingList .shopping-item[data-status="purchased"]')
    .forEach((item) => item.remove());
  updateShoppingProgress();
}

function addShoppingItem() {
  const nameInput = document.getElementById("shoppingItemName");
  const categoryInput = document.getElementById("shoppingCategory");
  const quantityInput = document.getElementById("shoppingQuantity");
  const name = nameInput.value.trim();
  const quantity = quantityInput.value.trim() || "1";

  if (!name) {
    nameInput.focus();
    return;
  }

  const item = document.createElement("div");
  item.className = "shopping-item";
  item.setAttribute("data-status", "needed");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.addEventListener("change", () => toggleShoppingItem(checkbox));

  const info = document.createElement("div");
  info.className = "shopping-item-info";

  const itemName = document.createElement("strong");
  itemName.textContent = name;

  const details = document.createElement("span");
  details.textContent = `${categoryInput.value} · Qty ${quantity}`;

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "shopping-remove";
  removeButton.textContent = "×";
  removeButton.setAttribute("aria-label", `Remove ${name}`);
  removeButton.addEventListener("click", () => removeShoppingItem(removeButton));

  info.append(itemName, details);
  item.append(checkbox, info, removeButton);
  document.getElementById("shoppingList").prepend(item);

  nameInput.value = "";
  quantityInput.value = "1";
  updateShoppingProgress();
  applyShoppingFilter();
}

const savedListsKey = "kk_savedLists";
const defaultSavedLists = [
  {
    name: "Basics",
    type: "general",
    items: [
      { name: "Milk", qty: 1, unit: "gal" },
      { name: "Eggs", qty: 12, unit: "count" },
      { name: "Bread", qty: 1, unit: "loaf" },
      { name: "Butter", qty: 1, unit: "lb" },
      { name: "Bananas", qty: 6, unit: "count" },
      { name: "Rice", qty: 2, unit: "lb" }
    ]
  },
  {
    name: "Spaghetti Bolognese",
    type: "recipe",
    items: [
      { name: "Spaghetti", qty: 1, unit: "lb" },
      { name: "Ground beef", qty: 1, unit: "lb" },
      { name: "Tomato sauce", qty: 24, unit: "oz" },
      { name: "Onion", qty: 1, unit: "count" },
      { name: "Garlic", qty: 1, unit: "head" },
      { name: "Parmesan", qty: 4, unit: "oz" }
    ]
  },
  {
    name: "Chicken Stir Fry",
    type: "recipe",
    items: [
      { name: "Chicken breast", qty: 1.5, unit: "lb" },
      { name: "Broccoli", qty: 1, unit: "head" },
      { name: "Bell pepper", qty: 2, unit: "count" },
      { name: "Soy sauce", qty: 10, unit: "oz" },
      { name: "Rice", qty: 2, unit: "lb" }
    ]
  }
];

function getSavedLists() {
  const stored = localStorage.getItem(savedListsKey);
  if (!stored || !stored.trim()) {
    localStorage.setItem(savedListsKey, JSON.stringify(defaultSavedLists));
    return defaultSavedLists.map((list) => ({ ...list, items: list.items.map((item) => ({ ...item })) }));
  }

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Saved shopping lists could not be read.", error);
    return [];
  }
}

function saveSavedLists(lists) {
  localStorage.setItem(savedListsKey, JSON.stringify(lists));
}

function renderSavedListOptions(selectedName) {
  const select = document.getElementById("savedListSelect");
  const lists = getSavedLists();
  select.innerHTML = "";

  const recipeGroup = document.createElement("optgroup");
  recipeGroup.label = "Recipe lists";
  const generalGroup = document.createElement("optgroup");
  generalGroup.label = "My lists";

  lists.forEach((list) => {
    const option = document.createElement("option");
    option.value = list.name;
    option.textContent = list.name;
    (list.type === "recipe" ? recipeGroup : generalGroup).append(option);
  });

  if (recipeGroup.children.length) select.append(recipeGroup);
  if (generalGroup.children.length) select.append(generalGroup);
  if (selectedName) select.value = selectedName;
}

function showSavedListMessage(message, isError = false) {
  const messageElement = document.getElementById("savedListMessage");
  messageElement.textContent = message;
  messageElement.classList.toggle("error", isError);
}

function clearSavedListAction() {
  const action = document.getElementById("savedListAction");
  action.hidden = true;
  action.replaceChildren();
}

function showSaveShoppingListForm() {
  clearSavedListAction();
  showSavedListMessage("");
  const action = document.getElementById("savedListAction");
  action.hidden = false;

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "List name";
  input.setAttribute("aria-label", "New saved list name");

  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.textContent = "Save";
  saveButton.addEventListener("click", () => saveCurrentShoppingList(input.value));

  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.textContent = "Cancel";
  cancelButton.addEventListener("click", clearSavedListAction);

  action.append(input, saveButton, cancelButton);
  input.focus();
}

function saveCurrentShoppingList(listName) {
  const name = listName.trim();
  const lists = getSavedLists();
  if (!name) {
    showSavedListMessage("Enter a name for the saved list.", true);
    return;
  }
  if (lists.some((list) => list.name.toLowerCase() === name.toLowerCase())) {
    showSavedListMessage("A saved list with that name already exists.", true);
    return;
  }

  lists.push({ name, type: "general", items: getCurrentShoppingItems() });
  saveSavedLists(lists);
  renderSavedListOptions(name);
  clearSavedListAction();
  showSavedListMessage(`Saved "${name}".`);
}

function getCurrentShoppingItems() {
  return Array.from(document.querySelectorAll("#shoppingList .shopping-item")).map((item) => {
    const details = item.querySelector(".shopping-item-info span").textContent.replace(/^.*?Qty\s+/i, "");
    const match = details.match(/^([0-9]+(?:\.[0-9]+)?)\s*(.*)$/);
    return {
      name: item.querySelector(".shopping-item-info strong").textContent.trim(),
      qty: match ? Number(match[1]) : 1,
      unit: match && match[2] ? match[2].trim() : "count"
    };
  });
}

function addSavedShoppingItem(savedItem) {
  const existing = Array.from(document.querySelectorAll("#shoppingList .shopping-item"))
    .find((item) => item.querySelector(".shopping-item-info strong").textContent.trim().toLowerCase() === savedItem.name.toLowerCase());

  if (existing) {
    const details = existing.querySelector(".shopping-item-info span");
    const currentText = details.textContent.replace(/^.*?Qty\s+/i, "");
    const currentMatch = currentText.match(/^([0-9]+(?:\.[0-9]+)?)\s*(.*)$/);
    const currentQty = currentMatch ? Number(currentMatch[1]) : 0;
    const unit = currentMatch && currentMatch[2] ? currentMatch[2].trim() : savedItem.unit;
    details.textContent = `Saved · Qty ${currentQty + Number(savedItem.qty)} ${unit}`;
    return;
  }

  const item = document.createElement("div");
  item.className = "shopping-item";
  item.dataset.status = "needed";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.addEventListener("change", () => toggleShoppingItem(checkbox));

  const info = document.createElement("div");
  info.className = "shopping-item-info";
  const itemName = document.createElement("strong");
  itemName.textContent = savedItem.name;
  const details = document.createElement("span");
  details.textContent = `Saved · Qty ${savedItem.qty} ${savedItem.unit}`;
  info.append(itemName, details);

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "shopping-remove";
  removeButton.textContent = "×";
  removeButton.setAttribute("aria-label", `Remove ${savedItem.name}`);
  removeButton.addEventListener("click", () => removeShoppingItem(removeButton));

  item.append(checkbox, info, removeButton);
  document.getElementById("shoppingList").prepend(item);
}

function loadSelectedShoppingList(showMessage = true) {
  const selectedName = document.getElementById("savedListSelect").value;
  const list = getSavedLists().find((savedList) => savedList.name === selectedName);
  if (!list) {
    showSavedListMessage("Select a saved list to load.", true);
    return;
  }

  list.items.forEach(addSavedShoppingItem);
  updateShoppingProgress();
  applyShoppingFilter();
  if (showMessage) {
    showSavedListMessage(`Loaded "${list.name}".`);
  }
}

function showNewShoppingListConfirm() {
  showInlineConfirmation("Clear current list?", clearCurrentShoppingList);
}

function showDeleteShoppingListConfirm() {
  const selectedName = document.getElementById("savedListSelect").value;
  if (selectedName) {
    showInlineConfirmation(`Delete "${selectedName}"?`, deleteSelectedShoppingList);
  }
}

function showInlineConfirmation(message, onConfirm) {
  clearSavedListAction();
  const action = document.getElementById("savedListAction");
  action.hidden = false;
  const text = document.createElement("span");
  text.textContent = message;
  const yesButton = document.createElement("button");
  yesButton.type = "button";
  yesButton.textContent = "Yes";
  yesButton.addEventListener("click", () => {
    onConfirm();
    clearSavedListAction();
  });
  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.textContent = "Cancel";
  cancelButton.addEventListener("click", clearSavedListAction);
  action.append(text, yesButton, cancelButton);
}

function clearCurrentShoppingList() {
  document.getElementById("shoppingList").replaceChildren();
  updateShoppingProgress();
  showSavedListMessage("Current list cleared.");
}

function deleteSelectedShoppingList() {
  const selectedName = document.getElementById("savedListSelect").value;
  const lists = getSavedLists().filter((list) => list.name !== selectedName);
  saveSavedLists(lists);
  renderSavedListOptions();
  showSavedListMessage(`Deleted "${selectedName}".`);
}

renderSavedListOptions();
loadSelectedShoppingList(false);
updateShoppingProgress();

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