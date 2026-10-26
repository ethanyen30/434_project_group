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