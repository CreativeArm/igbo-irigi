const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const rootFiles = fs.readdirSync(root).filter(file => /\.(html|js)$/.test(file)).map(f => path.join(root, f));
const jsDir = path.join(root, 'assets', 'js');
const jsFiles = fs.existsSync(jsDir)
  ? fs.readdirSync(jsDir).filter(file => /\.js$/.test(file)).map(f => path.join(jsDir, f))
  : [];
const allFiles = [...rootFiles, ...jsFiles];

for (const target of allFiles) {
  const before = fs.readFileSync(target, 'utf8');
  const after = before.replace(/uploads\/([^'"`<>]+)\.jpg/g, 'uploads/$1.webp');
  if (after !== before) {
    fs.writeFileSync(target, after);
    console.log(`Updated ${path.relative(root, target)}`);
  }
}
