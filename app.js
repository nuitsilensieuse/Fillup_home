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

  // Cookie banner -----------------------------------------------------------
  function getStoredConsent() {
    try {
      const raw = localStorage.getItem('cookieConsent');
      return raw ? JSON.parse(raw) : null;
    } catch (_err) {
      return null;
    }
  }

  function saveConsent(consent) {
    try {
      localStorage.setItem('cookieConsent', JSON.stringify(consent));
    } catch (_err) {
      // If storage fails, silently ignore to avoid breaking UX
    }
  }

  function initCookieBanner() {
    // Prevent duplicate insertion
    if (document.getElementById('cookie-banner')) return;

    const existing = getStoredConsent();
    if (existing && existing.necessary === true) return; // already accepted

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div id="cookie-banner" class="cookie_banner_overlay">
        <div class="cookie_banner">
          <div class="cookie_view" data-view="base">
            <h3>Cookies</h3>
            <p>Nous utilisons des cookies pour améliorer ton expérience, mesurer l'audience et proposer des contenus personnalisés.</p>
            <div class="cookie_actions">
              <button class="cookie_btn ghost" data-action="prefs">Préférences</button>
              <button class="cookie_btn primary" data-action="accept">Accepter</button>
            </div>
          </div>
          <div class="cookie_view hidden" data-view="prefs">
            <h3>Préférences des cookies</h3>
            <p>Choisis les catégories que tu souhaites autoriser.</p>
            <div class="cookie_checks">
              <label>
                <input type="checkbox" disabled checked>
                <span>Obligatoires (nécessaires au fonctionnement du site)</span>
              </label>
              <label>
                <input type="checkbox" data-cookie="analytics" checked>
                <span>Mesure d'audience</span>
              </label>
              <label>
                <input type="checkbox" data-cookie="marketing" checked>
                <span>Personnalisation & marketing</span>
              </label>
            </div>
            <div class="cookie_actions">
              <button class="cookie_btn ghost" data-action="back">Retour</button>
              <button class="cookie_btn primary" data-action="save">Sauvegarder</button>
            </div>
          </div>
        </div>
      </div>
    `;

    const banner = wrapper.firstElementChild;
    document.body.appendChild(banner);

    const baseView = banner.querySelector('[data-view="base"]');
    const prefView = banner.querySelector('[data-view="prefs"]');
    const prefBtn = banner.querySelector('[data-action="prefs"]');
    const acceptBtn = banner.querySelector('[data-action="accept"]');
    const backBtn = banner.querySelector('[data-action="back"]');
    const saveBtn = banner.querySelector('[data-action="save"]');
    const analyticsInput = banner.querySelector('input[data-cookie="analytics"]');
    const marketingInput = banner.querySelector('input[data-cookie="marketing"]');

    function showPrefs(show) {
      baseView.classList.toggle('hidden', show);
      prefView.classList.toggle('hidden', !show);
    }

    function hideBanner() {
      banner.classList.add('hidden');
      setTimeout(() => banner.remove(), 300);
    }

    function setDefaultsFromExisting() {
      if (!existing) return;
      if (typeof existing.analytics === 'boolean') analyticsInput.checked = existing.analytics;
      if (typeof existing.marketing === 'boolean') marketingInput.checked = existing.marketing;
    }

    setDefaultsFromExisting();

    prefBtn.addEventListener('click', () => showPrefs(true));
    backBtn.addEventListener('click', () => showPrefs(false));

    acceptBtn.addEventListener('click', () => {
      saveConsent({ necessary: true, analytics: true, marketing: true });
      hideBanner();
    });

    saveBtn.addEventListener('click', () => {
      saveConsent({
        necessary: true,
        analytics: analyticsInput.checked,
        marketing: marketingInput.checked,
      });
      hideBanner();
    });
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
      loadPartial('#pricing-placeholder', 'includes/tarifs_section.html'),
      loadPartial('#cgv-placeholder', 'includes/cgv_section.html'),
    ]);
  
    // 2) Une fois injectés, initialiser ce qui dépend des éléments injectés
    initMenuToggle();
    initFooterYear();
    initCookieBanner();

    
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
  