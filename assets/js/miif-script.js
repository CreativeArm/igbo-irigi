/* ============================================================
   MIIF — Manchester Igbo Iriji Festival
   Main Application Script
   ============================================================ */

'use strict';

/* ── Configuration (edit these before going live) ─────────── */
const CONFIG = {
  festivalDate:  '2026-09-05T11:00:00',
  dateLabel:     'Saturday 5th September 2026',
  festivalTime:  '11:00 AM',
  venueName:     'Platt Fields Park',
  venueAddress:  'Wilmslow Road, Fallowfield, Manchester, M14 6LA',
  streamStatus:  'before',  /* 'before' | 'live' | 'after' */
  ctaMode:       'register', /* 'register' | 'watch-live' */
  registerUrl:   'https://www.eventbrite.co.uk/e/manchester-igbo-iriji-festival-2026-tickets-1988321379771',
  donateUrl:     'https://www.crowdfunder.co.uk/p/manchester-igbo-iriji-festival-2025-appeal-fund',
  pricesVisible: true,
  priceHeadline: 'Amount to be confirmed',
  priceGold:     'Amount to be confirmed',
  priceSilver:   'Amount to be confirmed',
  pricePartner:  'Amount to be confirmed',
  priceAdCover:  'Rate to be confirmed',
  priceAdFull:   'Rate to be confirmed',
  priceAdHalf:   'Rate to be confirmed',
  priceAdQuarter:'Rate to be confirmed',
};

/* ── Page Routing ──────────────────────────────────────────── */
const PAGE_ROUTES = {
  home: '/', aboutIriji: 'about-iriji', ourStory: 'our-story',
  culture: 'culture', team: 'team', festival: 'festival',
  programme: 'programme', performers: 'performers', venue: 'venue',
  faqs: 'faqs', sponsor: 'sponsor', advertise: 'advertise',
  volunteer: 'volunteer', support: 'support', gallery: 'gallery',
  videos: 'videos', livestream: 'live-stream', news: 'news',
  brochure: 'brochure', register: 'register', contact: 'contact',
  notfound: '404'
};

let currentPage = document.body.dataset.page || 'home';

function showPage(pageId) {
  if (pageId === 'register' && CONFIG.registerUrl) {
    window.open(CONFIG.registerUrl, '_blank', 'noopener,noreferrer');
    return;
  }
  const route = PAGE_ROUTES[pageId];
  if (!route) return;
  // If previewing locally via file:// protocol, fallback to .html
  if (window.location.protocol === 'file:') {
    window.location.href = route === '/' ? 'index.html' : route + '.html';
  } else {
    window.location.href = route;
  }
}

function updateNavState() {
  const groups = {
    about:  ['aboutIriji','ourStory','culture','team'],
    fest:   ['festival','programme','performers','venue','faqs'],
    inv:    ['sponsor','advertise','volunteer','support'],
    media:  ['gallery','videos','livestream','news']
  };
  // desktop nav links
  document.querySelectorAll('.nav-link[data-nav]').forEach(btn => {
    const key = btn.dataset.nav;
    let active = false;
    if (key === 'home')     active = currentPage === 'home';
    else if (key === 'brochure') active = currentPage === 'brochure';
    else if (key === 'contact')  active = currentPage === 'contact';
    else if (groups[key])   active = groups[key].includes(currentPage);
    btn.classList.toggle('is-on', active);
  });
  // update page select dropdown
  const sel = document.getElementById('page-select');
  if (sel) sel.value = currentPage;
}

/* ── Navigation: Mega Menu ─────────────────────────────────── */
let activeMega = null;

function openMega(group) {
  closeMega();
  const el = document.getElementById('mega-' + group);
  if (el) {
    el.style.display = 'block';
    activeMega = group;
    // mark button as open
    const btn = document.querySelector('.nav-link[data-mega="' + group + '"]');
    if (btn) btn.classList.add('mega-open');
  }
}

function closeMega() {
  document.querySelectorAll('.mega-dropdown').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.nav-link.mega-open').forEach(btn => btn.classList.remove('mega-open'));
  activeMega = null;
}

function toggleMega(group) {
  if (activeMega === group) closeMega();
  else openMega(group);
}

/* ── Navigation: Mobile Menu ──────────────────────────────── */
let mobileMenuOpen = false;
let activeMobileSub = null;

function toggleMobileMenu() {
  mobileMenuOpen = !mobileMenuOpen;
  const menu = document.getElementById('mobile-menu');
  const burger = document.getElementById('nav-burger');
  document.documentElement.classList.toggle('menu-open', mobileMenuOpen);
  document.body.classList.toggle('menu-open', mobileMenuOpen);
  if (menu) {
    menu.style.display = mobileMenuOpen ? 'flex' : 'none';
    if (!mobileMenuOpen) activeMobileSub = null;
  }
  if (burger) {
    burger.textContent = mobileMenuOpen ? '×' : '☰';
    burger.setAttribute('aria-label', mobileMenuOpen ? 'Close menu' : 'Open menu');
    burger.setAttribute('aria-expanded', String(mobileMenuOpen));
  }
}

function closeMobileMenu() {
  mobileMenuOpen = false;
  activeMobileSub = null;
  const menu = document.getElementById('mobile-menu');
  const burger = document.getElementById('nav-burger');
  document.documentElement.classList.remove('menu-open');
  document.body.classList.remove('menu-open');
  if (menu) menu.style.display = 'none';
  if (burger) {
    burger.textContent = '☰';
    burger.setAttribute('aria-label', 'Open menu');
    burger.setAttribute('aria-expanded', 'false');
  }
  // hide all sub-menus
  document.querySelectorAll('.mm-sub').forEach(el => el.style.display = 'none');
}

function toggleMobileSub(group) {
  const sub = document.getElementById('mm-sub-' + group);
  const sign = document.getElementById('mm-sign-' + group);
  if (!sub) return;
  if (activeMobileSub === group) {
    sub.style.display = 'none';
    if (sign) sign.textContent = '+';
    activeMobileSub = null;
  } else {
    // close other subs
    document.querySelectorAll('.mm-sub').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.mm-sign').forEach(el => el.textContent = '+');
    sub.style.display = 'flex';
    if (sign) sign.textContent = '−';
    activeMobileSub = group;
  }
}

/* Close mega when clicking outside */
document.addEventListener('click', function(e) {
  if (!e.target.closest('.site-header')) closeMega();
});

/* ── Hero Slideshow ────────────────────────────────────────── */
let slide = 0;
const SLIDE_COUNT = 8;
let slideTimer = null;
let heroPaused = false;

function goToSlide(n) {
  slide = ((n % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT;
  const track = document.getElementById('hero-track');
  if (track) track.style.transform = 'translateX(-' + (slide * 100) + '%)';
  // update dot states
  document.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('is-on', i === slide);
  });
  // update slide animation class
  document.querySelectorAll('.hero-slide').forEach((s, i) => {
    s.classList.toggle('is-active', i === slide);
  });
}

function nextSlide() { goToSlide(slide + 1); }
function prevSlide() { goToSlide(slide - 1); }

function startSlideshow() {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => {
    if (!heroPaused && currentPage === 'home') nextSlide();
  }, 6800);
}

/* ── Countdown Timer ───────────────────────────────────────── */
function pad(n) { return n < 10 ? '0' + n : String(n); }

function updateCountdown() {
  const target = new Date(CONFIG.festivalDate).getTime();
  const left = Math.max(0, target - Date.now());
  const day = 86400000;
  const d = Math.floor(left / day);
  const h = Math.floor((left % day) / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  setVal('cd-days',    String(d));
  setVal('cd-hours',   pad(h));
  setVal('cd-minutes', pad(m));
  setVal('cd-seconds', pad(s));
  // also update any plain text references
  document.querySelectorAll('[data-cd-days]').forEach(el => el.textContent = String(d));
}

/* ── FAQ Accordion ─────────────────────────────────────────── */
let openFaq = -1;

function toggleFaq(index) {
  const items = document.querySelectorAll('.faq-item');
  items.forEach((item, i) => {
    const answer = item.querySelector('.faq-a');
    const sign   = item.querySelector('.faq-sign');
    if (i === index) {
      const isOpen = item.classList.contains('is-open');
      item.classList.toggle('is-open', !isOpen);
      if (answer) answer.style.display = isOpen ? 'none' : 'block';
      if (sign)   sign.textContent = isOpen ? '+' : '−';
      openFaq = isOpen ? -1 : i;
    } else {
      item.classList.remove('is-open');
      if (answer) answer.style.display = 'none';
      if (sign)   sign.textContent = '+';
    }
  });
}

/* ── Gallery ───────────────────────────────────────────────── */
const GALLERY_DATA = [
  { src:'uploads/ICM%20Iriji%202025%20-%20@pixelhivemedia%20(92%20of%20540)%20(1).webp',  alt:'Elders holding gold baskets of yam at the ceremony table', cat:'Ceremony', wide:true },
  { src:'uploads/ICM%20Iriji%202025%20-%20@pixelhivemedia%20(41%20of%20540)%20(1).webp',  alt:'A woman in green carrying a covered tray of yam',           cat:'Ceremony' },
  { src:'uploads/ICM%20Iriji%202025%20-%20@pixelhivemedia%20(87%20of%20540)%20(1).webp',  alt:'Row of guests in matching gele watching the ceremony',       cat:'Ceremony' },
  { src:'uploads/ICM%20Iriji%202025%20-%20@pixelhivemedia%20(440%20of%20540)%20(1).webp', alt:'Masquerade performer with a carved mask among drummers',     cat:'Dance', wide:true },
  { src:'uploads/ICM%20Iriji%202025%20-%20@pixelhivemedia%20(230%20of%20540)%20(1).webp', alt:'Cultural dancer mid step with a decorated staff',           cat:'Dance' },
  { src:'uploads/ICM%20Iriji%202025%20-%20@pixelhivemedia%20(172%20of%20540)%20(1).webp', alt:'A dancer celebrating with a horsetail fan',                 cat:'Dance' },
  { src:'uploads/ICM%20Iriji%202025%20-%20@pixelhivemedia%20(383%20of%20540)%20(1).webp', alt:'A woman dancing in purple gele and embroidered wrapper',    cat:'Dance' },
  { src:'uploads/ICM%20Iriji%202025%20-%20@pixelhivemedia%20(382%20of%20540)%20(1).webp', alt:'Guests dancing together on the field',                      cat:'Dance', wide:true },
  { src:'uploads/ICM%20Iriji%202025%20-%20@pixelhivemedia%20(386%20of%20540)%20(1).webp', alt:"Women's group in blue gele and orange wrappers",            cat:'Dress' },
  { src:'uploads/ICM%20Iriji%202025%20-%20@pixelhivemedia%20(26%20of%20540)%20(1).webp',  alt:'Two women in green and blue gele with coral beads',         cat:'Dress' },
  { src:'uploads/ICM%20Iriji%202025%20-%20@pixelhivemedia%20(88%20of%20540)%20(1).webp',  alt:'Six women in colourful wrappers holding horsetail fans',    cat:'Dress', wide:true },
  { src:'uploads/ICM%20Iriji%202025%20-%20@pixelhivemedia%20(37%20of%20540)%20(1).webp',  alt:'A guest in a patterned isiagu shirt and knitted cap',       cat:'Dress' },
  { src:'uploads/ICM%20Iriji%202025%20-%20@pixelhivemedia%20(477%20of%20540)%20(1).webp', alt:'Families gathered with a traditional ruler',                cat:'Community', wide:true },
  { src:'uploads/ICM%20Iriji%202025%20-%20@pixelhivemedia%20(12%20of%20540)%20(1).webp',  alt:'Three women in yellow gele holding a baby',                 cat:'Community' },
  { src:'uploads/ICM%20Iriji%202025%20-%20@pixelhivemedia%20(30%20of%20540)%20(1).webp',  alt:'Five men in traditional dress and caps',                    cat:'Community' },
  { src:'uploads/ICM%20Iriji%202025%20-%20@pixelhivemedia%20(7%20of%20540)%20(1).webp',   alt:'Three men in matching lion print shirts and red caps',      cat:'Community' },
];

let galFilter = 'all';
let viewIndex = -1;

function getFilteredGallery() {
  return galFilter === 'all' ? GALLERY_DATA : GALLERY_DATA.filter(g => g.cat === galFilter);
}

function renderGallery() {
  const list = getFilteredGallery();
  const mosaic = document.getElementById('gallery-mosaic');
  const count  = document.getElementById('gallery-count');
  if (!mosaic) return;
  const getUrl = typeof window.getCloudinaryUrl === 'function' ? window.getCloudinaryUrl : s => s;
  mosaic.innerHTML = list.map((g, i) => `
    <button class="tile${g.wide ? ' tile-wide' : ''}" onclick="openViewer(${i})" aria-label="${g.alt}">
      <img class="tile-img" src="${getUrl(g.src)}" alt="${g.alt}" loading="lazy" />
    </button>
  `).join('');
  if (count) count.textContent = list.length + ' photographs';
}

function setGalFilter(cat) {
  galFilter = cat;
  viewIndex = -1;
  closeViewer();
  renderGallery();
  // update chip states
  document.querySelectorAll('.chip[data-filter]').forEach(chip => {
    chip.classList.toggle('is-on', chip.dataset.filter === cat);
  });
}

function openViewer(i) {
  const list = getFilteredGallery();
  viewIndex = i;
  const item = list[i];
  if (!item) return;
  const viewer  = document.getElementById('gallery-viewer');
  const img     = document.getElementById('viewer-img');
  const label   = document.getElementById('viewer-label');
  const getUrl  = typeof window.getCloudinaryUrl === 'function' ? window.getCloudinaryUrl : s => s;
  const imgSrc  = getUrl(item.src);
  if (viewer) viewer.style.display = 'flex';
  if (img)    img.style.backgroundImage = 'url("' + imgSrc + '")';
  img.setAttribute('aria-label', item.alt);
  if (label)  label.textContent = (i + 1) + ' of ' + list.length + ' · ' + item.cat;
}

function closeViewer() {
  viewIndex = -1;
  const viewer = document.getElementById('gallery-viewer');
  if (viewer) viewer.style.display = 'none';
}

function viewerNext() {
  const list = getFilteredGallery();
  openViewer((viewIndex + 1) % list.length);
}

function viewerPrev() {
  const list = getFilteredGallery();
  openViewer((viewIndex - 1 + list.length) % list.length);
}

/* Keyboard nav for viewer */
document.addEventListener('keydown', function(e) {
  if (viewIndex < 0) return;
  if (e.key === 'ArrowRight') viewerNext();
  if (e.key === 'ArrowLeft')  viewerPrev();
  if (e.key === 'Escape')     closeViewer();
});

/* ── Stream Status ─────────────────────────────────────────── */
function applyStreamStatus() {
  const st = CONFIG.streamStatus;
  ['before','live','after'].forEach(s => {
    document.querySelectorAll('[data-stream="' + s + '"]').forEach(el => {
      el.style.display = (s === st) ? 'flex' : 'none';
    });
  });
}

/* ── Editable Fields injection ─────────────────────────────── */
function injectConfig() {
  // Date labels
  document.querySelectorAll('[data-field="dateLabel"]').forEach(el => {
    el.textContent = CONFIG.dateLabel;
  });
  document.querySelectorAll('[data-field="festivalTime"]').forEach(el => {
    el.textContent = CONFIG.festivalTime;
  });
  document.querySelectorAll('[data-field="venueName"]').forEach(el => {
    el.textContent = CONFIG.venueName;
  });
  document.querySelectorAll('[data-field="venueAddress"]').forEach(el => {
    el.textContent = CONFIG.venueAddress;
  });
  // CTA button labels
  const ctaLabel = CONFIG.ctaMode === 'watch-live' ? 'Watch Live' : 'Register Now';
  document.querySelectorAll('[data-cta]').forEach(btn => {
    btn.textContent = ctaLabel;
    btn.onclick = () => showPage(CONFIG.ctaMode === 'watch-live' ? 'livestream' : 'register');
  });
  // Prices
  const price = (val) => CONFIG.pricesVisible ? val : 'Price on request';
  document.querySelectorAll('[data-field="priceHeadline"]').forEach(el => el.textContent = price(CONFIG.priceHeadline));
  document.querySelectorAll('[data-field="priceGold"]').forEach(el => el.textContent = price(CONFIG.priceGold));
  document.querySelectorAll('[data-field="priceSilver"]').forEach(el => el.textContent = price(CONFIG.priceSilver));
  document.querySelectorAll('[data-field="pricePartner"]').forEach(el => el.textContent = price(CONFIG.pricePartner));
  document.querySelectorAll('[data-field="priceAdCover"]').forEach(el => el.textContent = price(CONFIG.priceAdCover));
  document.querySelectorAll('[data-field="priceAdFull"]').forEach(el => el.textContent = price(CONFIG.priceAdFull));
  document.querySelectorAll('[data-field="priceAdHalf"]').forEach(el => el.textContent = price(CONFIG.priceAdHalf));
  document.querySelectorAll('[data-field="priceAdQuarter"]').forEach(el => el.textContent = price(CONFIG.priceAdQuarter));
  // Donate link
  document.querySelectorAll('a[data-donate]').forEach(el => el.href = CONFIG.donateUrl);
}

/* ── Scroll Reveal Observer ────────────────────────────────── */
function observeReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal:not(.is-visible)').forEach(el => observer.observe(el));
}

/* ── Touch swipe on hero ───────────────────────────────────── */
let touchX = null;
function heroTouchStart(e) { touchX = e.touches[0].clientX; }
function heroTouchEnd(e) {
  if (touchX == null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 40) { dx < 0 ? nextSlide() : prevSlide(); }
  touchX = null;
}

/* ── Bind hero events (called after DOM ready) ─────────────── */
function bindHero() {
  const strip = document.getElementById('hero-strip');
  if (!strip) return;
  strip.addEventListener('mouseenter', () => heroPaused = true);
  strip.addEventListener('mouseleave', () => heroPaused = false);
  strip.addEventListener('touchstart', heroTouchStart, { passive: true });
  strip.addEventListener('touchend',   heroTouchEnd,   { passive: true });
}

/* ── Viewport switcher (preview tool only) ─────────────────── */
function setViewport(vp) {
  const frame = document.getElementById('site-frame');
  if (!frame) return;
  frame.className = 'site'; // reset
  if (vp === 'tablet') { frame.style.maxWidth = '834px'; frame.style.margin = '0 auto'; }
  else if (vp === 'mobile') { frame.style.maxWidth = '390px'; frame.style.margin = '0 auto'; }
  else { frame.style.maxWidth = ''; frame.style.margin = ''; }
  // update buttons
  ['desktop','tablet','mobile'].forEach(v => {
    const btn = document.getElementById('vp-' + v);
    if (btn) btn.classList.toggle('is-on', v === vp);
  });
}

/* ── Init ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {

  // Inject config values into DOM
  injectConfig();

  // Set stream status
  applyStreamStatus();

  // Highlight the current page in the shared navigation.
  updateNavState();

  // Countdown
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Hero slideshow
  bindHero();
  startSlideshow();

  // Gallery initial render
  renderGallery();

  // Scroll reveal
  observeReveal();

  // Page select dropdown (if present)
  const sel = document.getElementById('page-select');
  if (sel) sel.addEventListener('change', e => showPage(e.target.value));

  // Welcome video autoplay on screen
  bindWelcomeVideo();

  // FAQ: close all answers initially
  document.querySelectorAll('.faq-a').forEach(el => el.style.display = 'none');

});

/* ── Welcome to Iriji Video Controller ─────────────────────── */
function bindWelcomeVideo() {
  const video = document.getElementById('welcome-video');
  if (!video) return;

  // IntersectionObserver: automatically play when in viewport, pause when scrolled away
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.2 });
    observer.observe(video);
  } else {
    video.play().catch(() => {});
  }
}

function toggleWelcomeSound() {
  const video = document.getElementById('welcome-video');
  const btn = document.getElementById('welcome-sound-btn');
  if (!video || !btn) return;
  video.muted = !video.muted;
  if (video.muted) {
    btn.textContent = '🔇';
    btn.setAttribute('aria-label', 'Unmute video');
  } else {
    btn.textContent = '🔊';
    btn.setAttribute('aria-label', 'Mute video');
  }
}


