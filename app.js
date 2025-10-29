// Load partial
async function loadPartial(selector, url) {
    const host = document.querySelector(selector);
    if (!host) return;
  
    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      host.innerHTML = await res.text();
    } catch (err) {
      console.error(err);
    }
  }
  // Initialize menu toggle
  function initMenuToggle() {
    const menu = document.querySelector('#mobile-menu');
    const menuLinks = document.querySelector('.navbar_menu');
    if (!menu || !menuLinks) return;
    menu.addEventListener('click', function () {
      menu.classList.toggle('is-active');
      menuLinks.classList.toggle('active');
    });
  }
  //Elle met à jour automatiquement année actuelle dans le footer.
  function initFooterYear() {
    const yearSpan = document.getElementById('current_year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  }
  // Load nav & footer
  document.addEventListener('DOMContentLoaded', async () => {
    // 1) Charger nav & footer
    await Promise.all([
      loadPartial('#nav-placeholder', 'includes/nav.html'),
      loadPartial('#footer-placeholder', 'includes/footer.html'),
    ]);
  
    // 2) Une fois injectés, initialiser ce qui dépend des éléments injectés
    initMenuToggle();
    initFooterYear();
  });
  