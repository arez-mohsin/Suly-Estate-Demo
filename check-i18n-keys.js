/* global process */
import { en } from './src/i18n/resources/en.js';
import { ckb } from './src/i18n/resources/ckb.js';
import { ar } from './src/i18n/resources/ar.js';

function getLeafKeys(obj, prefix = '') {
  let keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys = keys.concat(getLeafKeys(value, fullKey));
    } else {
      keys.push({ key: fullKey, value });
    }
  }
  return keys;
}

const enLeaves = getLeafKeys(en);
const ckbLeaves = getLeafKeys(ckb);
const arLeaves = getLeafKeys(ar);

const enKeyMap = new Map(enLeaves.map(item => [item.key, item.value]));
const ckbKeyMap = new Map(ckbLeaves.map(item => [item.key, item.value]));
const arKeyMap = new Map(arLeaves.map(item => [item.key, item.value]));

let errors = [];

// Check EN -> CKB & AR
for (const [key, val] of enKeyMap.entries()) {
  if (!ckbKeyMap.has(key)) {
    errors.push(`Missing key in ckb: "${key}"`);
  } else {
    const ckbVal = ckbKeyMap.get(key);
    if (ckbVal === '' || ckbVal === undefined || ckbVal === null) {
      errors.push(`Empty or null value in ckb: "${key}"`);
    }
    if (Array.isArray(val)) {
      if (!Array.isArray(ckbVal) || ckbVal.length !== val.length) {
        errors.push(`Array length mismatch in ckb: "${key}" (expected ${val.length}, got ${ckbVal?.length})`);
      }
    }
  }

  if (!arKeyMap.has(key)) {
    errors.push(`Missing key in ar: "${key}"`);
  } else {
    const arVal = arKeyMap.get(key);
    if (arVal === '' || arVal === undefined || arVal === null) {
      errors.push(`Empty or null value in ar: "${key}"`);
    }
    if (Array.isArray(val)) {
      if (!Array.isArray(arVal) || arVal.length !== val.length) {
        errors.push(`Array length mismatch in ar: "${key}" (expected ${val.length}, got ${arVal?.length})`);
      }
    }
  }
}

// Check CKB -> EN (extra keys)
for (const key of ckbKeyMap.keys()) {
  if (!enKeyMap.has(key)) {
    errors.push(`Extra key in ckb not in en: "${key}"`);
  }
}

// Check AR -> EN (extra keys)
for (const key of arKeyMap.keys()) {
  if (!enKeyMap.has(key)) {
    errors.push(`Extra key in ar not in en: "${key}"`);
  }
}

console.log(`Total translation keys checked: ${enLeaves.length}`);

if (errors.length > 0) {
  console.error(`\n❌ Key parity check failed with ${errors.length} error(s):`);
  errors.forEach(err => console.error(`  - ${err}`));
  process.exit(1);
} else {
  console.log(`✅ All translation keys match with 100% parity across en, ckb, and ar!`);
  process.exit(0);
}
