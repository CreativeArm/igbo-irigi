const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const files = fs.readdirSync(root).filter(file => /\.(html|js)$/.test(file));

for (const file of files) {
  const target = path.join(root, file);
  const before = fs.readFileSync(target, 'utf8');
  const after = before.replace(/uploads\/([^'"`<>]+)\.jpg/g, 'uploads/$1.webp');
  if (after !== before) {
    fs.writeFileSync(target, after);
    console.log(`Updated ${file}`);
  }
}
