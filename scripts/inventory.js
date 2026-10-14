import fs from 'fs';
import path from 'path';

function getJpgDimensions(buffer) {
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xFF) break;
    let marker = buffer[offset + 1];
    if (marker === 0xC0 || marker === 0xC2) {
      const height = buffer.readUInt16BE(offset + 5);
      const width = buffer.readUInt16BE(offset + 7);
      return { width, height };
    }
    const len = buffer.readUInt16BE(offset + 2);
    offset += 2 + len;
  }
  return { width: 0, height: 0 };
}

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) results = results.concat(getFiles(file));
    else results.push(file);
  });
  return results;
}

const files = getFiles('src').filter(f => f.endsWith('.js') || f.endsWith('.jsx'));
const imageRegex = /['"]\/images\/([^'"]+)['"]/g;
const imageUsages = {};

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = imageRegex.exec(content)) !== null) {
    const img = match[1];
    if (!imageUsages[img]) imageUsages[img] = new Set();
    imageUsages[img].add(path.relative('.', file).replace(/\\/g, '/'));
  }
}

const imgDir = 'public/images';
const imgFiles = fs.readdirSync(imgDir);
const inventory = [];

for (const file of imgFiles) {
  const filePath = path.join(imgDir, file);
  const stat = fs.statSync(filePath);
  const buf = fs.readFileSync(filePath);
  const dims = getJpgDimensions(buf);
  const usages = imageUsages[file] ? Array.from(imageUsages[file]) : ['(unreferenced / legacy)'];
  inventory.push({
    filename: file,
    format: path.extname(file).replace('.', '').toUpperCase(),
    width: dims.width,
    height: dims.height,
    fileSizeKB: Math.round(stat.size / 1024),
    fileSizeBytes: stat.size,
    usedIn: usages
  });
}

inventory.sort((a, b) => b.fileSizeBytes - a.fileSizeBytes);

fs.writeFileSync('image-inventory.json', JSON.stringify(inventory, null, 2));
console.log(`Generated inventory for ${inventory.length} images.`);
console.log('Top 5 largest:');
inventory.slice(0, 5).forEach(img => {
  console.log(`- ${img.filename}: ${img.fileSizeKB} KB (${img.width}x${img.height}) used in: ${img.usedIn.join(', ')}`);
});
