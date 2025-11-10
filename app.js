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
      loadPartial('#guide-placeholder', 'includes/guide_section.html'),
      loadPartial('#hero-placeholder', 'includes/hero_section.html'),
      loadPartial('#home-placeholder', 'includes/home.html'),
      loadPartial('#footer-placeholder', 'includes/footer.html'),
    ]);
  
    // 2) Une fois injectés, initialiser ce qui dépend des éléments injectés
    initMenuToggle();
    initFooterYear();

    
    // Charger styles et script du hero après insertion du HTML
    const head = document.head;
    if (!document.querySelector('link[href="includes/hero_section.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'includes/hero_section.css';
      head.appendChild(link);
    }
    // Injecter le script du hero (s'initialise tout seul)
    const existingHeroScript = Array.from(document.scripts).some(s => s.src.endsWith('includes/hero_section.js'));
    if (!existingHeroScript) {
      const script = document.createElement('script');
      script.src = 'includes/hero_section.js';
      script.defer = true;
      document.body.appendChild(script);
    }
  });
  