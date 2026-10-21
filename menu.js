// Dynamically inject the shared menu into #menu-container.
async function initMenu() {
  const menuContainer = document.getElementById('menu-container');
  if (!menuContainer) {
    setupMenuLogic();
    return;
  }

  try {
    const response = await fetch('menu.html');
    if (!response.ok) throw new Error('Failed to fetch menu.html');

    const html = await response.text();
    const temp = document.createElement('div');
    temp.innerHTML = html;

    const nav = temp.querySelector('nav.main-menu');
    const header = temp.querySelector('div[style*="flex-direction:column"]');
    const announcement = temp.querySelector('.menu-announcement');

    let menuMarkup = '';
    if (header) menuMarkup += header.outerHTML;
    if (nav) menuMarkup += nav.outerHTML;
    if (announcement) menuMarkup += announcement.outerHTML;
    if (!menuMarkup) menuMarkup = temp.innerHTML;

    menuContainer.innerHTML = menuMarkup;
  } catch (error) {
    console.warn('Menu could not be loaded:', error);
    return;
  }

  setTimeout(() => {
    setupMenuLogic();
  }, 0);
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

