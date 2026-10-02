// Display tab feature adapted from https://www.w3schools.com/howto/howto_js_tab_header.asp
function displayTab(tabName) {
  // Hide all elements with class="tabcontent" by default */
  let tabcontent = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Show the specific tab content
  document.getElementById(tabName).style.display = "block";

}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();