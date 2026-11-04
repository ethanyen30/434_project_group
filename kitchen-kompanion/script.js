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
const TODAY = new Date("2026-11-04");
let inventory = structuredClone(INVENTORY);
let activeLocation = "all";
const locationAbbreviations = {
  Fridge: "Frg",
  Cabinet: "Cab",
  Freezer: "Fzr"
};

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

function clearInventory() {
  inventory = [];
  renderInventory();
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

function renderInventory() {
  const tbody = document.getElementById("inventoryList");
  tbody.replaceChildren();

  inventory.forEach((inventoryItem) => {
    const row = document.createElement("tr");
    row.dataset.location = inventoryItem.location;
    row.dataset.inventoryId = inventoryItem.id;

    const nameCell = document.createElement("td");
    nameCell.textContent = inventoryItem.name;
    const locationCell = document.createElement("td");
    locationCell.textContent = locationAbbreviations[inventoryItem.location] || inventoryItem.location;
    const expirationCell = document.createElement("td");
    expirationCell.textContent = formatExpiration(inventoryItem.expires);
    const expires = new Date(`${inventoryItem.expires}T00:00:00`);
    const daysUntilExpiration = Math.ceil((expires - TODAY) / 86400000);
    if (expires < TODAY) {
      expirationCell.className = "expired";
    } else if (daysUntilExpiration <= 3) {
      expirationCell.className = "exp-soon";
    }
    const quantityCell = document.createElement("td");
    quantityCell.append(createQuantityStepper(
      inventoryItem.qty,
      inventoryItem.unit,
      inventoryItem.step,
      0,
      (quantity) => {
        inventoryItem.qty = quantity;
        renderInventory();
        applyInventoryFilters();
        updateShoppingInventoryStatuses();
      },
      () => showInventoryZeroAction(inventoryItem)
    ));

    row.append(nameCell, locationCell, expirationCell, quantityCell);
    tbody.append(row);
  });
}

function formatQuantity(quantity) {
  return Number(quantity.toFixed(2)).toString();
}

function formatExpiration(dateString) {
  return new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric"
  }).format(new Date(`${dateString}T00:00:00`));
}

function updateShoppingInventoryStatus(item) {
  const name = item.querySelector(".shopping-item-info strong").textContent;
  const status = item.querySelector(".shopping-inventory-status");
  if (!status) {
    return;
  }
  const inventoryItem = inventory.find((candidate) =>
    normalizedName(candidate.name) === normalizedName(name) &&
    candidate.unit === item.dataset.unit &&
    candidate.qty > 0
  );

  if (inventoryItem) {
    status.textContent = `In inventory: ${formatQuantity(inventoryItem.qty)} ${inventoryItem.unit}`;
    status.className = "shopping-inventory-status in-inventory";
  } else {
    status.textContent = "Not in inventory";
    status.className = "shopping-inventory-status not-in-inventory";
  }
}

function updateShoppingInventoryStatuses() {
  document.querySelectorAll("#shoppingList .shopping-item").forEach(updateShoppingInventoryStatus);
}

function createQuantityStepper(quantity, unit, step, minimum, onChange, onAtMinimum) {
  const stepper = document.createElement("div");
  stepper.className = "quantity-stepper";

  const decrement = document.createElement("button");
  decrement.type = "button";
  decrement.className = "quantity-step";
  decrement.textContent = "−";
  decrement.setAttribute("aria-label", "Decrease quantity");
  decrement.addEventListener("click", () => {
    if (quantity === minimum && onAtMinimum) {
      onAtMinimum();
      return;
    }
    onChange(Number(Math.max(minimum, quantity - step).toFixed(2)));
  });

  const value = document.createElement("span");
  value.className = "quantity-value";
  value.textContent = `${formatQuantity(quantity)} ${unit}`;
  if (quantity === 0) {
    value.classList.add("zero-quantity");
  }

  const increment = document.createElement("button");
  increment.type = "button";
  increment.className = "quantity-step";
  increment.textContent = "+";
  increment.setAttribute("aria-label", "Increase quantity");
  increment.addEventListener("click", () => onChange(Number((quantity + step).toFixed(2))));

  stepper.append(value, decrement, increment);
  return stepper;
}

function showInventoryZeroAction(inventoryItem) {
  if (document.getElementById("inventoryZeroModal")) {
    return;
  }

  const modal = document.createElement("div");
  modal.id = "inventoryZeroModal";
  modal.className = "inventory-zero-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "inventoryZeroModalTitle");

  const panel = document.createElement("div");
  panel.className = "inventory-zero-modal-panel";
  const title = document.createElement("h3");
  title.id = "inventoryZeroModalTitle";
  title.textContent = `${inventoryItem.name} is out of stock`;
  const message = document.createElement("span");
  message.textContent = "What would you like to do?";
  message.className = "inventory-zero-modal-message";

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.textContent = "Remove";
  removeButton.addEventListener("click", () => {
    inventory = inventory.filter((item) => item.id !== inventoryItem.id);
    modal.remove();
    renderInventory();
    applyInventoryFilters();
  });

  const shoppingButton = document.createElement("button");
  shoppingButton.type = "button";
  shoppingButton.textContent = "Add to shopping";
  shoppingButton.addEventListener("click", () => {
    addInventoryItemToShopping(inventoryItem);
    modal.remove();
  });

  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.textContent = "Cancel";
  cancelButton.addEventListener("click", () => modal.remove());

  const actions = document.createElement("div");
  actions.className = "inventory-zero-modal-actions";
  actions.append(removeButton, shoppingButton, cancelButton);
  panel.append(title, message, actions);
  modal.append(panel);
  document.querySelector(".device").append(modal);
  cancelButton.focus();
}

function addInventoryItemToShopping(inventoryItem) {
  const existing = Array.from(document.querySelectorAll("#shoppingList .shopping-item"))
    .find((item) =>
      normalizedName(item.querySelector(".shopping-item-info strong").textContent) ===
      normalizedName(inventoryItem.name)
    );

  if (existing) {
    const quantity = Number(existing.dataset.qty) + 1;
    existing.dataset.qty = quantity;
    const unit = existing.dataset.unit;
    const step = unit === "gal" ? 0.25 : unit === "lb" ? 0.5 : 1;
    existing.querySelector(".quantity-stepper").replaceWith(
      createShoppingStepper(existing, quantity, unit, step)
    );
  } else {
    document.getElementById("shoppingList").prepend(
      createShoppingItem(inventoryItem.name, 1, inventoryItem.unit, "Inventory")
    );
  }
  updateShoppingProgress();
  applyShoppingFilter();
}

// --- Tab 1: Quick-Add Item (Deep Task Data Entry) ---
function addInventoryRow() {
  const nameInput = document.getElementById("addName");
  const locSelect = document.getElementById("addLoc");
  const qtyInput = document.getElementById("addQty");
  const unitInput = document.getElementById("addUnit");
  const expInput = document.getElementById("addExp");

  const name = nameInput.value.trim();
  const loc = locSelect.value;
  const qty = Math.max(0, Number(qtyInput.value) || 0);
  const unit = unitInput.value;
  const expires = expInput.value || "2026-11-12";

  if (!name) {
    nameInput.focus();
    return;
  }

  inventory.unshift({
    id: `inventory-${Date.now()}`,
    name,
    qty,
    unit,
    step: unit === "gal" ? 0.25 : unit === "lb" ? 0.5 : 1,
    location: loc,
    category: "Other",
    expires
  });
  renderInventory();

  nameInput.value = "";
  qtyInput.value = "1";
  updateShoppingInventoryStatuses();
}

renderInventory();














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
  const purchasedItems = Array.from(
    document.querySelectorAll('#shoppingList .shopping-item[data-status="purchased"]')
  );

  purchasedItems.forEach((item) => {
    const name = item.querySelector(".shopping-item-info strong").textContent.trim();
    const quantity = Number(item.dataset.qty);
    const unit = item.dataset.unit;
    const existing = inventory.find((inventoryItem) =>
      normalizedName(inventoryItem.name) === normalizedName(name) &&
      inventoryItem.unit === unit
    );

    if (existing) {
      existing.qty = Number((existing.qty + quantity).toFixed(2));
    } else {
      inventory.unshift({
        id: `inventory-${Date.now()}-${purchasedItems.indexOf(item)}`,
        name,
        qty: quantity,
        unit,
        step: unit === "gal" ? 0.25 : unit === "lb" ? 0.5 : 1,
        location: "Fridge",
        category: "Other",
        expires: "2026-11-12"
      });
    }

    item.remove();
  });

  renderInventory();
  applyInventoryFilters();
  updateShoppingInventoryStatuses();
  updateShoppingProgress();
}

function addShoppingItem() {
  const nameInput = document.getElementById("shoppingItemName");
  const categoryInput = document.getElementById("shoppingCategory");
  const quantityInput = document.getElementById("shoppingQuantity");
  const unitInput = document.getElementById("shoppingUnit");
  const name = nameInput.value.trim();
  const quantity = Math.max(1, Number(quantityInput.value) || 1);
  const unit = unitInput.value;

  if (!name) {
    nameInput.focus();
    return;
  }

  const item = createShoppingItem(name, quantity, unit, categoryInput.value);
  document.getElementById("shoppingList").prepend(item);

  nameInput.value = "";
  quantityInput.value = "1";
  updateShoppingProgress();
  applyShoppingFilter();
}

function createShoppingItem(name, quantity, unit, category) {
  const item = document.createElement("div");
  item.className = "shopping-item";
  item.setAttribute("data-status", "needed");
  item.dataset.qty = quantity;
  item.dataset.unit = unit;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.addEventListener("change", () => toggleShoppingItem(checkbox));

  const info = document.createElement("div");
  info.className = "shopping-item-info";

  const itemName = document.createElement("strong");
  itemName.textContent = name;

  const details = document.createElement("span");
  details.textContent = category;
  const inventoryStatus = document.createElement("span");
  inventoryStatus.className = "shopping-inventory-status";

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "shopping-remove";
  removeButton.textContent = "×";
  removeButton.setAttribute("aria-label", `Remove ${name}`);
  removeButton.addEventListener("click", () => removeShoppingItem(removeButton));

  info.append(itemName, details, inventoryStatus);
  const step = unit === "gal" ? 0.25 : unit === "lb" ? 0.5 : 1;
  const stepper = createShoppingStepper(item, quantity, unit, step);
  item.append(checkbox, info, stepper, removeButton);
  updateShoppingInventoryStatus(item);
  return item;
}

function createShoppingStepper(item, quantity, unit, step) {
  return createQuantityStepper(quantity, unit, step, 1, (nextQuantity) => {
    item.dataset.qty = nextQuantity;
    item.querySelector(".quantity-stepper").replaceWith(
      createShoppingStepper(item, nextQuantity, unit, step)
    );
  });
}

let recipes = structuredClone(RECIPES);
const savedListsKey = "kk_savedLists_v2";
const defaultSavedLists = [
  {
    name: "Basics",
    type: "general",
    items: [
      { name: "Milk", qty: 1, unit: "gal" },
      { name: "Eggs", qty: 12, unit: "count" },
      { name: "Bread", qty: 14, unit: "slices" },
      { name: "Butter", qty: 1, unit: "lb" },
      { name: "Bananas", qty: 6, unit: "count" },
      { name: "Rice", qty: 2, unit: "lb" }
    ]
  },
  ...recipes.map((recipe) => ({
    name: recipe.name,
    type: "recipe",
    items: recipe.ingredients.map((ingredient) => ({ ...ingredient }))
  }))
];

function getSavedLists() {
  const stored = localStorage.getItem(savedListsKey);
  if (!stored || !stored.trim()) {
    localStorage.setItem(savedListsKey, JSON.stringify(defaultSavedLists));
    return structuredClone(defaultSavedLists);
  }

  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return structuredClone(defaultSavedLists);
    }

    const defaultRecipeLists = new Map(
      defaultSavedLists
        .filter((list) => list.type === "recipe")
        .map((list) => [list.name.toLowerCase(), list])
    );
    const savedNames = new Set(parsed.map((list) => list.name.toLowerCase()));
    let recipeListsChanged = false;
    const updatedLists = parsed.map((list) => {
      const defaultRecipe = defaultRecipeLists.get(list.name.toLowerCase());
      if (defaultRecipe && list.type === "recipe") {
        recipeListsChanged = true;
        return structuredClone(defaultRecipe);
      }
      return list;
    });
    let missingRecipeList = false;
    defaultSavedLists.forEach((list) => {
      if (list.type === "recipe" && !savedNames.has(list.name.toLowerCase())) {
        updatedLists.push(structuredClone(list));
        missingRecipeList = true;
      }
    });
    if (recipeListsChanged || missingRecipeList) {
      localStorage.setItem(savedListsKey, JSON.stringify(updatedLists));
      return updatedLists;
    }

    return parsed;
  } catch (error) {
    console.error("Saved shopping lists could not be read.", error);
    return structuredClone(defaultSavedLists);
  }
}

function saveSavedLists(lists) {
  localStorage.setItem(savedListsKey, JSON.stringify(lists));
}

function renderSavedListOptions(selectedName) {
  const select = document.getElementById("savedListSelect");
  const lists = getSavedLists();
  select.innerHTML = "";

  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = "";
  select.append(emptyOption);

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
    return {
      name: item.querySelector(".shopping-item-info strong").textContent.trim(),
      qty: Number(item.dataset.qty),
      unit: item.dataset.unit
    };
  });
}

function addSavedShoppingItem(savedItem) {
  const item = createShoppingItem(
    savedItem.name,
    Number(savedItem.qty) || 1,
    savedItem.unit || "count",
    "Saved"
  );
  document.getElementById("shoppingList").prepend(item);
  updateShoppingInventoryStatus(item);
}

function loadSelectedShoppingList(showMessage = true) {
  const selectedName = document.getElementById("savedListSelect").value;
  const list = getSavedLists().find((savedList) => savedList.name === selectedName);
  if (!list) {
    showSavedListMessage("Select a saved list to load.", true);
    return;
  }

  document.getElementById("shoppingList").replaceChildren();
  (Array.isArray(list.items) ? list.items : []).forEach(addSavedShoppingItem);
  activeShoppingFilter = "all";
  document.querySelectorAll(".shopping-filter").forEach((filterButton) => {
    filterButton.classList.toggle(
      "active",
      filterButton.textContent.trim() === "All"
    );
  });
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
updateShoppingProgress();
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

function recipeMeta(recipe) {
  return `${recipe.prepMins + recipe.cookMins} min · ${recipe.difficulty} · Serves ${recipe.servings}`;
}

const recipePreferences = {
  allergies: ["dairy"],
  diet: "None",
  hideAllergens: true,
  favorites: ["chicken-stir-fry"]
};
const recipeFilters = {
  vegetarian: false,
  "gluten-free": false,
  "dairy-free": false,
  "not-spicy": false,
  favorites: false
};

function normalizedName(name) {
  return name.trim().toLowerCase();
}

function recipeInventoryStatus(recipe) {
  return recipe.ingredients.map((ingredient) => ({
    ...ingredient,
    have: inventory.some((item) =>
      normalizedName(item.name) === normalizedName(ingredient.name) && item.qty > 0
    )
  }));
}

function recipeMatchesFilters(recipe, ignoreAllergies = false) {
  const query = document.getElementById("recipeSearch").value.toLowerCase().trim();
  const searchMatch = `${recipe.name} ${recipe.tags.join(" ")}`.toLowerCase().includes(query);
  const tagMatch = Object.entries(recipeFilters).every(([filter, enabled]) => {
    if (!enabled) return true;
    if (filter === "not-spicy") return !recipe.tags.includes("spicy");
    if (filter === "favorites") return recipePreferences.favorites.includes(recipe.id);
    return recipe.tags.includes(filter);
  });
  const dietMatch = recipePreferences.diet !== "Vegetarian" ||
    recipe.tags.includes("vegetarian");
  const allergyMatch = ignoreAllergies || !recipePreferences.hideAllergens ||
    !recipe.allergens.some((allergen) => recipePreferences.allergies.includes(allergen));
  return searchMatch && tagMatch && dietMatch && allergyMatch;
}

function renderRecipeFilters() {
  const container = document.getElementById("recipeFilters");
  container.replaceChildren();
  [
    ["vegetarian", "Vegetarian"],
    ["gluten-free", "Gluten-free"],
    ["dairy-free", "Dairy-free"],
    ["not-spicy", "Not spicy"],
    ["favorites", "Favorites"]
  ].forEach(([key, label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "recipe-filter-chip";
    button.textContent = label;
    button.classList.toggle("active", recipeFilters[key]);
    button.addEventListener("click", () => {
      recipeFilters[key] = !recipeFilters[key];
      renderRecipeFilters();
      renderRecipes();
    });
    container.append(button);
  });
}

function renderRecipePreferences() {
  const panel = document.getElementById("recipePreferences");
  panel.replaceChildren();
  const allergyHeading = document.createElement("strong");
  allergyHeading.textContent = "My allergies";
  const allergyGroup = document.createElement("div");
  allergyGroup.className = "preference-options";
  ["gluten", "dairy", "eggs", "nuts", "soy"].forEach((allergen) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = recipePreferences.allergies.includes(allergen);
    checkbox.addEventListener("change", () => {
      recipePreferences.allergies = Array.from(allergyGroup.querySelectorAll("input:checked"))
        .map((input) => input.value);
      renderRecipes();
    });
    checkbox.value = allergen;
    label.append(checkbox, allergen);
    allergyGroup.append(label);
  });

  const dietLabel = document.createElement("strong");
  dietLabel.textContent = "Diet";
  const dietGroup = document.createElement("div");
  dietGroup.className = "preference-options";
  ["None", "Vegetarian"].forEach((diet) => {
    const label = document.createElement("label");
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "recipeDiet";
    radio.value = diet;
    radio.checked = recipePreferences.diet === diet;
    radio.addEventListener("change", () => {
      recipePreferences.diet = radio.value;
      recipeFilters.vegetarian = radio.value === "Vegetarian";
      renderRecipeFilters();
      renderRecipes();
    });
    label.append(radio, diet);
    dietGroup.append(label);
  });

  const hideLabel = document.createElement("label");
  const hideCheckbox = document.createElement("input");
  hideCheckbox.type = "checkbox";
  hideCheckbox.checked = recipePreferences.hideAllergens;
  hideCheckbox.addEventListener("change", () => {
    recipePreferences.hideAllergens = hideCheckbox.checked;
    renderRecipes();
  });
  hideLabel.append(hideCheckbox, "Hide recipes with my allergens");

  const doneButton = document.createElement("button");
  doneButton.type = "button";
  doneButton.textContent = "Done";
  doneButton.addEventListener("click", () => {
    panel.hidden = true;
  });
  panel.append(allergyHeading, allergyGroup, dietLabel, dietGroup, hideLabel, doneButton);
}

function toggleRecipePreferences() {
  const panel = document.getElementById("recipePreferences");
  panel.hidden = !panel.hidden;
  if (!panel.hidden) renderRecipePreferences();
}

function filterRecipes() {
  renderRecipes();
}

function renderRecipes() {
  const list = document.getElementById("recipeList");
  list.replaceChildren();
  let visibleCount = 0;
  let hiddenByAllergy = 0;

  recipes.forEach((recipe) => {
    const hasUserAllergy = recipe.allergens.some((allergen) =>
      recipePreferences.allergies.includes(allergen)
    );
    if (recipePreferences.hideAllergens && hasUserAllergy && recipeMatchesFilters(recipe, true)) {
      hiddenByAllergy++;
    }
    if (!recipeMatchesFilters(recipe)) return;
    visibleCount++;
    const card = document.createElement("button");
    card.type = "button";
    card.className = "recipe-card";
    card.dataset.searchText = `${recipe.name} ${recipe.tags.join(" ")}`.toLowerCase();
    card.addEventListener("click", () => showRecipeDetail(recipe.id));

    const content = document.createElement("span");
    content.className = "recipe-card-content";
    const name = document.createElement("strong");
    name.textContent = recipe.name;
    const meta = document.createElement("span");
    meta.className = "recipe-meta";
    meta.textContent =
      `${recipe.prepMins + recipe.cookMins} min · ${recipe.difficulty} · ${recipe.ingredients.length} ingredients`;
    content.append(name, meta);

    const status = document.createElement("span");
    status.className = "recipe-stock-status";
    const missingCount = recipeInventoryStatus(recipe).filter((ingredient) => !ingredient.have).length;
    status.textContent = missingCount
      ? `Missing ${missingCount} ${missingCount === 1 ? "ingredient" : "ingredients"}`
      : "Have all ingredients";
    status.classList.add(missingCount ? "missing" : "have-all");
    content.append(status);

    const tags = document.createElement("span");
    tags.className = "recipe-tags";
    recipe.tags.forEach((tag) => {
      const chip = document.createElement("span");
      chip.className = "recipe-tag";
      chip.textContent = tag;
      tags.append(chip);
    });

    card.append(content, tags);
    list.append(card);
  });

  const noMatch = document.createElement("p");
  noMatch.className = "no-recipes";
  noMatch.textContent = visibleCount ? "" : "No recipes match";
  list.append(noMatch);
  document.getElementById("hiddenRecipeMessage").textContent =
    hiddenByAllergy ? `${hiddenByAllergy} hidden due to your allergies` : "";
}

function showRecipeDetail(recipeId) {
  const recipe = recipes.find((item) => item.id === recipeId);
  if (!recipe) {
    return;
  }

  const list = document.getElementById("recipeList");
  const header = document.querySelector(".recipe-header");
  const detail = document.getElementById("recipeDetail");
  list.hidden = true;
  header.hidden = true;
  document.getElementById("recipeFilters").hidden = true;
  document.getElementById("hiddenRecipeMessage").hidden = true;
  detail.hidden = false;
  detail.replaceChildren();

  const topBar = document.createElement("div");
  topBar.className = "recipe-detail-topbar";
  const backButton = document.createElement("button");
  backButton.type = "button";
  backButton.className = "recipe-back";
  backButton.textContent = "‹ Back";
  backButton.addEventListener("click", showRecipeList);
  const heading = document.createElement("div");
  heading.className = "recipe-detail-heading";
  const title = document.createElement("h3");
  title.textContent = recipe.name;
  const meta = document.createElement("p");
  meta.textContent = recipeMeta(recipe);
  heading.append(title, meta);
  const favoriteButton = document.createElement("button");
  favoriteButton.type = "button";
  favoriteButton.className = "recipe-favorite";
  favoriteButton.textContent = recipePreferences.favorites.includes(recipe.id) ? "★" : "☆";
  favoriteButton.setAttribute("aria-label", "Toggle favorite");
  favoriteButton.addEventListener("click", () => {
    const index = recipePreferences.favorites.indexOf(recipe.id);
    if (index >= 0) recipePreferences.favorites.splice(index, 1);
    else recipePreferences.favorites.push(recipe.id);
    favoriteButton.textContent = recipePreferences.favorites.includes(recipe.id) ? "★" : "☆";
  });
  topBar.append(backButton, heading, favoriteButton);

  const allergy = recipe.allergens.find((allergen) => recipePreferences.allergies.includes(allergen));
  if (allergy) {
    const allergyBanner = document.createElement("div");
    allergyBanner.className = "recipe-allergy-banner";
    allergyBanner.textContent = `⚠ Contains ${allergy} — on your allergy list`;
    detail.append(allergyBanner);
  }

  const columns = document.createElement("div");
  columns.className = "recipe-detail-columns";
  const ingredientsSection = document.createElement("section");
  const ingredientsHeading = document.createElement("h4");
  ingredientsHeading.textContent = "Ingredients";
  const ingredients = document.createElement("ul");
  const statusItems = recipeInventoryStatus(recipe);
  statusItems.forEach((ingredient) => {
    const item = document.createElement("li");
    item.classList.add(ingredient.have ? "ingredient-have" : "ingredient-missing");
    item.textContent = ingredient.have
      ? `✓ ${ingredient.qty} ${ingredient.unit} ${ingredient.name}`
      : `✗ Missing ${ingredient.qty} ${ingredient.unit} ${ingredient.name}`;
    ingredients.append(item);
  });
  ingredientsSection.append(ingredientsHeading, ingredients);

  const stepsSection = document.createElement("section");
  const stepsHeading = document.createElement("h4");
  stepsHeading.textContent = "Steps";
  const steps = document.createElement("ol");
  recipe.steps.forEach((step) => {
    const item = document.createElement("li");
    item.textContent = step;
    steps.append(item);
  });
  stepsSection.append(stepsHeading, steps);
  columns.append(ingredientsSection, stepsSection);
  const missing = statusItems.filter((ingredient) => !ingredient.have);
  const missingAction = document.createElement("div");
  missingAction.className = "missing-recipe-action";
  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.className = "btn-add";
  addButton.textContent = missing.length ? "Add missing to Shopping List" : "You have everything";
  addButton.disabled = !missing.length;
  const result = document.createElement("span");
  addButton.addEventListener("click", () => {
    const added = addMissingIngredients(missing);
    result.textContent = `Added ${added} items to Shopping List`;
    if (!missingAction.querySelector(".view-shopping-list")) {
      const viewButton = document.createElement("button");
      viewButton.type = "button";
      viewButton.className = "view-shopping-list";
      viewButton.textContent = "View list";
      viewButton.addEventListener("click", () => {
        document.querySelector(".tablink[onclick*=\"shoppinglist\"]").click();
      });
      missingAction.append(viewButton);
    }
  });
  missingAction.append(addButton, result);
  detail.append(topBar, columns, missingAction);
}

function showRecipeList() {
  document.getElementById("recipeDetail").hidden = true;
  document.getElementById("recipeList").hidden = false;
  document.querySelector(".recipe-header").hidden = false;
  document.getElementById("recipeFilters").hidden = false;
  document.getElementById("hiddenRecipeMessage").hidden = false;
  filterRecipes();
}

function addMissingIngredients(missingIngredients) {
  let added = 0;
  missingIngredients.forEach((ingredient) => {
    const existing = Array.from(document.querySelectorAll("#shoppingList .shopping-item"))
      .find((item) => normalizedName(item.querySelector(".shopping-item-info strong").textContent) === normalizedName(ingredient.name));
    if (existing) {
      const currentQty = Number(existing.dataset.qty);
      const nextQty = Number((currentQty + ingredient.qty).toFixed(2));
      existing.dataset.qty = nextQty;
      const unit = existing.dataset.unit;
      const step = unit === "gal" ? 0.25 : unit === "lb" ? 0.5 : 1;
      existing.querySelector(".quantity-stepper").replaceWith(
        createShoppingStepper(existing, nextQty, unit, step)
      );
    } else {
      document.getElementById("shoppingList").prepend(
        createShoppingItem(ingredient.name, ingredient.qty, ingredient.unit, "Other")
      );
    }
    added++;
  });
  updateShoppingProgress();
  applyShoppingFilter();
  return added;
}

renderRecipeFilters();
renderRecipes();