(function () {
  'use strict';

  const groups = [
    {
      label: 'Main',
      items: [
        { href: '/', title: 'Home', icon: '🏠', description: 'All SecureTools categories and featured tools.', keywords: ['securetools', 'landing', 'start'] },
        { href: '/about.html', title: 'About', icon: 'ℹ️', description: 'Project mission, privacy stance, and contact details.', keywords: ['privacy', 'mission', 'contact'] },
        { href: '/geogames/index.html', title: 'GeoGames', icon: '🗺️', description: 'Map quizzes for geography and history study.', keywords: ['maps', 'history', 'geography', 'games'] }
      ]
    },
    {
      label: 'Generators',
      items: [
        { href: '/qr-code-generator/index.html', title: 'QR Code Generator', icon: '🔳', description: 'Generate styled QR codes in the browser.', keywords: ['qr', 'qrcode', 'codes'] },
        { href: '/password-generator/index.html', title: 'Password Generator', icon: '🔑', description: 'Create strong passwords locally.', keywords: ['passwords', 'security', 'random'] },
        { href: '/uuid-generator/index.html', title: 'UUID Generator', icon: '🆔', description: 'Generate UUIDs instantly.', keywords: ['uuid', 'guid', 'identifiers'] },
        { href: '/rng-generator/index.html', title: 'Random Number Generator', icon: '🎲', description: 'Pick secure random numbers.', keywords: ['rng', 'random', 'numbers'] },
        { href: '/favicon-generator/index.html', title: 'Favicon Generator', icon: '🖼️', description: 'Create browser icons quickly.', keywords: ['favicon', 'icons'] }
      ]
    },
    {
      label: 'Encoders',
      items: [
        { href: '/base64-tool/index.html', title: 'Base64 Encoder and Decoder', icon: '🔤', description: 'Convert Base64 text locally.', keywords: ['base64', 'encode', 'decode'] },
        { href: '/url-encoder-decoder/index.html', title: 'URL Encoder and Decoder', icon: '🔗', description: 'Encode and decode URL text safely.', keywords: ['url', 'encode', 'decode'] }
      ]
    },
    {
      label: 'Learning Tools',
      items: [
        { href: '/gaussian-elimination/index.html', title: 'Gaussian Elimination', icon: '➗', description: 'Interactive linear algebra puzzle.', keywords: ['math', 'matrix', 'equations', 'algebra'] }
      ]
    },
    {
      label: 'GeoGames',
      items: [
        { href: '/geogames/games/us-states/index.html', title: 'U.S. States Quiz', icon: '🗺️', description: 'Click the correct state on the map.', keywords: ['states', 'usa', 'quiz', 'map'] },
        { href: '/geogames/games/13-colonies/index.html', title: 'Original 13 Colonies Quiz', icon: '📜', description: 'Practice the original colonies on a 1775 map.', keywords: ['colonies', '1775', 'history', 'map'] },
        { href: '/geogames/games/US-1861/index.html', title: '1861 U.S. States and Territories', icon: '🏞️', description: 'Historic state and territory quiz.', keywords: ['1861', 'territories', 'civil war', 'history'] }
      ]
    }
  ];

  function normalizePath(path) {
    if (!path) {
      return '/';
    }

    let normalized = path.trim();

    if (!normalized.startsWith('/')) {
      normalized = '/' + normalized;
    }

    normalized = normalized.replace(/\/+/g, '/');
    normalized = normalized.replace(/\/index\.html$/i, '/');

    if (normalized.length > 1 && normalized.endsWith('/')) {
      normalized = normalized.slice(0, -1);
    }

    return normalized || '/';
  }

  function escapeHtml(value) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function buildMarkup(currentPath) {
    const sections = groups.map(group => {
      const items = group.items.map(item => {
        const isCurrent = normalizePath(item.href) === currentPath;
        const searchText = [group.label, item.title, item.description].concat(item.keywords || []).join(' ').toLowerCase();
        const className = isCurrent ? 'tool-switcher-link is-current' : 'tool-switcher-link';
        const currentBadge = isCurrent ? '<span class="tool-switcher-badge">Current</span>' : '';
        const icon = item.icon ? '<span class="tool-switcher-link-icon" aria-hidden="true">' + escapeHtml(item.icon) + '</span>' : '';

        return [
          '<a class="', className, '" href="', item.href, '" data-search="', escapeHtml(searchText), '">',
          icon,
          '<span class="tool-switcher-link-body">',
          '<span class="tool-switcher-link-row">',
          '<span class="tool-switcher-link-title">', escapeHtml(item.title), '</span>',
          currentBadge,
          '</span>',
          '<span class="tool-switcher-link-desc">', escapeHtml(item.description), '</span>',
          '</span>',
          '</a>'
        ].join('');
      }).join('');

      return [
        '<section class="tool-switcher-group" data-group>',
        '<h2>', escapeHtml(group.label), '</h2>',
        '<div class="tool-switcher-links">', items, '</div>',
        '</section>'
      ].join('');
    }).join('');

    return [
      '<div class="tool-switcher-backdrop" hidden></div>',
      '<aside class="tool-switcher-panel" id="tool-switcher-panel" aria-hidden="true" aria-label="Tool switcher">',
      '<div class="tool-switcher-header">',
      '<div>',
      '<p class="tool-switcher-eyebrow">Browse SecureTools</p>',
      '<h1>Find a tool that feels familiar</h1>',
      '<p class="tool-switcher-intro">Jump between tools without losing the site&rsquo;s normal rhythm.</p>',
      '</div>',
      '<button type="button" class="tool-switcher-close" aria-label="Close tool switcher">Done</button>',
      '</div>',
      '<label class="tool-switcher-search-wrap" for="tool-switcher-search">',
      '<span class="tool-switcher-search-label">Search tools</span>',
      '<input id="tool-switcher-search" type="search" placeholder="Try QR, colonies, password, map..." autocomplete="off" spellcheck="false">',
      '</label>',
      '<p class="tool-switcher-shortcut">Press Ctrl+K any time to open this drawer.</p>',
      '<div class="tool-switcher-results" data-results>', sections, '</div>',
      '<p class="tool-switcher-empty" hidden>No matching tools found.</p>',
      '</aside>'
    ].join('');
  }

  function init() {
    const nav = document.querySelector('nav');
    if (!nav) {
      return;
    }

    const currentPath = normalizePath(window.location.pathname);
    const wrapper = document.createElement('div');
    wrapper.className = 'tool-switcher-shell';
    wrapper.innerHTML = buildMarkup(currentPath);
    document.body.appendChild(wrapper);

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'tool-switcher-toggle';
    toggle.setAttribute('aria-controls', 'tool-switcher-panel');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open tool switcher');
    toggle.innerHTML = '<span aria-hidden="true">Tools</span>';
    nav.appendChild(toggle);

    const panel = wrapper.querySelector('.tool-switcher-panel');
    const backdrop = wrapper.querySelector('.tool-switcher-backdrop');
    const closeBtn = wrapper.querySelector('.tool-switcher-close');
    const input = wrapper.querySelector('#tool-switcher-search');
    const resultItems = Array.from(wrapper.querySelectorAll('.tool-switcher-link'));
    const groupsEls = Array.from(wrapper.querySelectorAll('[data-group]'));
    const emptyState = wrapper.querySelector('.tool-switcher-empty');

    let previousFocus = null;

    function filterResults() {
      const query = input.value.trim().toLowerCase();
      let matches = 0;

      groupsEls.forEach(groupEl => {
        const links = Array.from(groupEl.querySelectorAll('.tool-switcher-link'));
        let groupMatches = 0;

        links.forEach(link => {
          const haystack = link.getAttribute('data-search') || '';
          const show = !query || haystack.indexOf(query) !== -1;
          link.hidden = !show;
          if (show) {
            groupMatches += 1;
            matches += 1;
          }
        });

        groupEl.hidden = groupMatches === 0;
      });

      emptyState.hidden = matches !== 0;
    }

    function setOpen(open) {
      document.body.classList.toggle('tool-switcher-open', open);
      panel.classList.toggle('is-open', open);
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');
      backdrop.hidden = !open;
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');

      if (open) {
        previousFocus = document.activeElement;
        input.value = '';
        filterResults();
        window.setTimeout(() => input.focus(), 20);
      } else if (previousFocus && typeof previousFocus.focus === 'function') {
        previousFocus.focus();
      }
    }

    function onKeyDown(event) {
      const key = event.key.toLowerCase();
      if ((event.ctrlKey || event.metaKey) && key === 'k') {
        event.preventDefault();
        setOpen(!panel.classList.contains('is-open'));
        return;
      }

      if (event.key === 'Escape' && panel.classList.contains('is-open')) {
        event.preventDefault();
        setOpen(false);
      }
    }

    toggle.addEventListener('click', function () {
      setOpen(!panel.classList.contains('is-open'));
    });

    closeBtn.addEventListener('click', function () {
      setOpen(false);
    });

    backdrop.addEventListener('click', function () {
      setOpen(false);
    });

    input.addEventListener('input', filterResults);
    document.addEventListener('keydown', onKeyDown);

    resultItems.forEach(link => {
      link.addEventListener('click', function () {
        setOpen(false);
      });
    });

    setOpen(false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
