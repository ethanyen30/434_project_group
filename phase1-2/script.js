// Display tab feature adapted from https://www.w3schools.com/howto/howto_js_tab_header.asp
function displayTab(tabName, tabButton) {
  // Hide all elements with class="tabcontent" by default */
  let tabcontent = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Show the specific tab content
  document.getElementById(tabName).style.display = "block";

  let tablinks = document.getElementsByClassName("tablink");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }
  tabButton.classList.add("active");

}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();



// this displays the choices made in the choices tab
function displayChoices() {
  let food1 = document.querySelector('input[name="food1"]:checked');
  let food2 = document.getElementById("food2").value;

  if (food1) {
    document.getElementById("results").textContent =
      "food 1 is  " + food1.value + " and food 2 is  " + food2;
  }
}

function addTodoItem() {
  let input = document.getElementById("todoInput");
  let taskText = input.value.trim();
  if (taskText === "") return;
  let ul = document.getElementById("todoList");
  let li = document.createElement("li");
  li.style.margin = "10px 0";
  li.style.display = "flex";
  li.style.justifyContent = "center";
  li.style.alignItems = "center";
  li.style.gap = "10px";
  let span = document.createElement("span");
  span.textContent = taskText;
  span.style.cursor = "pointer";
  span.onclick = function() {
    span.style.textDecoration = span.style.textDecoration === "line-through" ? "none" : "line-through";
  };
  let deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.onclick = function() {
    ul.removeChild(li);
  };
  li.appendChild(span);
  li.appendChild(deleteBtn);
  ul.appendChild(li);
  input.value = "";
}