const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar_menu');

menu.addEventListener('click', function() {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
}); 

// Footer year
const yearSpan = document.getElementById('current_year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}