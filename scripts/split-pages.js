const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'index.html');
const source = fs.readFileSync(sourcePath, 'utf8');

const routes = {
  home: 'index.html',
  aboutIriji: 'about-iriji.html',
  ourStory: 'our-story.html',
  culture: 'culture.html',
  team: 'team.html',
  festival: 'festival.html',
  programme: 'programme.html',
  performers: 'performers.html',
  venue: 'venue.html',
  faqs: 'faqs.html',
  sponsor: 'sponsor.html',
  advertise: 'advertise.html',
  volunteer: 'volunteer.html',
  support: 'support.html',
  gallery: 'gallery.html',
  videos: 'videos.html',
  livestream: 'live-stream.html',
  news: 'news.html',
  brochure: 'brochure.html',
  register: 'register.html',
  contact: 'contact.html'
};

const mainStart = source.indexOf('<main class="site-main">');
const mainEnd = source.indexOf('</main><!-- /site-main -->');
if (mainStart < 0 || mainEnd < 0) throw new Error('Could not find the page-content boundaries.');

const sharedStart = source.slice(0, mainStart) + '<main class="site-main">\n';
const sharedEnd = '\n</main><!-- /site-main -->' + source.slice(mainEnd + '</main><!-- /site-main -->'.length);

for (const [pageId, filename] of Object.entries(routes)) {
  const marker = `<div id="page-${pageId}" class="page-section">`;
  const start = source.indexOf(marker, mainStart);
  const endMarker = `</div><!-- /page-${pageId} -->`;
  const end = source.indexOf(endMarker, start);
  if (start < 0 || end < 0) throw new Error(`Could not extract ${pageId}.`);

  const page = source.slice(start, end + endMarker.length)
    .replace(marker, `<div id="page-${pageId}" class="page-section is-active">`);
  const doc = (sharedStart + page + sharedEnd)
    .replace('<body>', `<body data-page="${pageId}">`);
  fs.writeFileSync(path.join(root, filename), doc);
}

console.log(`Created ${Object.keys(routes).length} page files.`);
