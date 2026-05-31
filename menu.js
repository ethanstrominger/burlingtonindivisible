// Dynamically inject menu.html into #menu-container if present, then initialize menu logic
async function initMenu() {
  const menuContainer = document.getElementById('menu-container');
  if (menuContainer) {
    const fallbackMenuMarkup = [
      '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;background:#fff; margin-bottom: 0.5em;min-height:3.2em;">',
      '  <div style="width:100%;display:flex;align-items:center;justify-content:center;position:relative;">',
      '    <h1 class="burlingtonindivisible-title" style="margin-bottom:0.1em; margin-top:0; width:100%; text-align:center;">Burlington Indivisible</h1>',
      '    <a href="contact.html" class="contact-link-next-title" style="position:absolute;right:2em;top:50%;transform:translateY(-50%);color:#23408e;font-weight:700;text-decoration:underline;padding:0.3em 1em;border-radius:5px;transition:background 0.2s;white-space:nowrap;">Contact</a>',
      '  </div>',
      '  <div class="burlingtonindivisible-subtitle" style="margin-bottom:0.2em;">Burlington, MA Indivisible Chapter</div>',
      '  <div style="font-size:0.95em;font-style:italic;color:#23408e;margin-bottom:0.7em;">Advocate, Donate, Protest, Volunteer, Boycott</div>',
      '</div>',
      '<nav class="main-menu">',
      '  <button class="menu-toggle" aria-label="Toggle menu" id="menuToggle">',
      '    <span class="menu-bar"></span>',
      '    <span class="menu-bar"></span>',
      '    <span class="menu-bar"></span>',
      '  </button>',
      '  <div class="menu-links" id="menuLinks">',
      '    <a href="about.html" class="menu-item">About</a>',
      '    <a href="events.html" class="menu-item">Events</a>',
      '    <a href="demand-oversight.html" class="menu-item">Take Action</a>',
      '    <a href="protests1000districtave.html" class="menu-item">Protests at 1000 District Ave</a>',
      '    <a href="donate.html" class="menu-item">Donate</a>',
      '  </div>',
      '</nav>'
    ].join('');

    try {
      const response = await fetch('menu.html');
      if (!response.ok) throw new Error('Failed to fetch menu.html');
      const html = await response.text();
      const temp = document.createElement('div');
      temp.innerHTML = html;
      let menuMarkup = '';
      const nav = temp.querySelector('nav.main-menu');
      const header = temp.querySelector('div[style*="flex-direction:column"]');
      const announcement = temp.querySelector('.menu-announcement');
      if (header) menuMarkup += header.outerHTML;
      if (nav) menuMarkup += nav.outerHTML;
      if (announcement) menuMarkup += announcement.outerHTML;
      if (!menuMarkup) menuMarkup = temp.innerHTML;
      menuContainer.innerHTML = menuMarkup || fallbackMenuMarkup;
    } catch (e) {
      // file:// pages and some browser settings block fetch for local files.
      menuContainer.innerHTML = fallbackMenuMarkup;
    }

    // Wait for DOM update, then run menu logic
    setTimeout(() => {
      setupMenuLogic();
    }, 0);
  } else {
    setupMenuLogic();
  }
}

// Analytics: record page loads and link clicks
(function() {
  // Use explicit API URL since the frontend (burlingtonindivisible.org) and API (api.burlingtonindivisible.org) are separate services
  const API_BASE = window.location.hostname === 'localhost' ? '' : 'https://api.burlingtonindivisible.org';
  function recordVisit(url) {
    fetch(API_BASE + '/api/record?url=' + encodeURIComponent(url), { method: 'GET', keepalive: true });
  }
  // Record on page load
  recordVisit(window.location.href);
  // Record on link clicks
  document.addEventListener('click', function(e) {
    let link = e.target.closest('a[href]');
    if (link && link.href.startsWith('http')) {
      recordVisit(link.href);
    }
  }, true);
})();

function setupMenuLogic() {
  // Hamburger menu logic
  const menuToggle = document.getElementById('menuToggle');
  const menuLinks = document.getElementById('menuLinks');
  if (menuToggle && menuLinks) {
    menuToggle.addEventListener('click', function () {
      menuLinks.classList.toggle('menu-links-open');
    });
    document.addEventListener('click', function (e) {
      if (
        window.innerWidth <= 1200 &&
        !menuLinks.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        menuLinks.classList.remove('menu-links-open');
      }
    });
  }
}

