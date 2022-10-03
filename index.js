const navbarLinks = document.getElementsByClassName("navbar-links")[0];
const toggleNavBtn = document.getElementsByClassName("toggle-button")[0];

toggleNavBtn.addEventListener("click", () => {
  navbarLinks.classList.toggle("active");
});
