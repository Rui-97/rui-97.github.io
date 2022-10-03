// js for submissom conformed alert-------------------------------------
const form = document.getElementById("subcription-form");
//when the form is submitted, an alert box will pop up
form.addEventListener("submit", (e) => {
  alert("Thank you for subscribing to My English Club newsletter!");
});

// js for go to top button----------------------------------------------------
var topBtn = document.getElementById('top-btn');

window.addEventListener('scroll', ()=> {
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    topBtn.style.display = "block";
  } else {
    topBtn.style.display = "none";
  }
})

// When the user clicks on the button, scroll to the top of the page
topBtn.addEventListener('click', ()=> {
  // For Safari
  document.body.scrollTop = 0; 
  // For Chrome, Firefox, IE and Opera
  document.documentElement.scrollTop = 0;
});













