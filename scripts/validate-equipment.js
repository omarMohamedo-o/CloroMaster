const fs = require('fs');
const path = require('path');
const vm = require('vm');

const file = path.join(__dirname, '..', 'frontend', 'src', 'i18n', 'services.master.js');
const src = fs.readFileSync(file, 'utf8');

// Prepare a transform to convert ES exports to CommonJS so we can run it safely in vm
let transformed = src
    .replace(/export default servicesMaster\s*;?/g, 'module.exports.servicesMaster = servicesMaster;')
    .replace(/export const equipmentDefaults\s*=\s*/g, 'const equipmentDefaults = ')
    .replace(/export const equipmentMaster\s*=\s*/g, 'const equipmentMaster = ')
    + '\nmodule.exports.equipmentMaster = equipmentMaster;\nmodule.exports.equipmentDefaults = equipmentDefaults;\n';

const sandbox = { module: { exports: {} }, exports: {} };
vm.createContext(sandbox);
try {
    vm.runInContext(transformed, sandbox, { filename: file });
} catch (err) {
    console.error('Failed to evaluate services.master.js:', err);
    process.exit(2);
}

const servicesMaster = sandbox.module.exports.servicesMaster;
const equipmentMaster = sandbox.module.exports.equipmentMaster;
const equipmentDefaults = sandbox.module.exports.equipmentDefaults;

function slugFromFilename(name) {
    const base = name.replace(/\.(jpeg|jpg|png|webp)$/i, '').replace(/[_-]?\d+$/i, '').trim();
    return base.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
}

// gather all candidate slugs from equipmentMaster
const slugs = equipmentMaster.map(e => e.slug);

// also include datasheet slugs from servicesMaster
for (const s of servicesMaster) {
    if (Array.isArray(s.datasheets)) {
        for (const d of s.datasheets) {
            if (!slugs.includes(d.slug)) slugs.push(d.slug);
        }
    }
    // and also image-derived slugs
    if (Array.isArray(s.images)) {
        for (const img of s.images) {
            const name = img.split('/').pop();
            const derived = slugFromFilename(name);
            if (!slugs.includes(derived)) slugs.push(derived);
        }
    }
}

const report = [];
for (const slug of slugs) {
    const matched = [];
    for (const s of servicesMaster) {
        const imgs = s.images || [];
        for (const img of imgs) {
            const name = img.split('/').pop();
            const itemSlug = slugFromFilename(name);
            if (itemSlug === slug) matched.push({ service: s.slug || s.title?.en || 'unknown', img });
        }
    }
    // datasheet exists?
    let datasheetFound = false;
    let datasheetTitle = null;
    for (const s of servicesMaster) {
        if (Array.isArray(s.datasheets)) {
            const found = s.datasheets.find(d => d.slug === slug);
            if (found) { datasheetFound = true; datasheetTitle = found.title; break; }
        }
    }
    const eqEntry = equipmentMaster.find(e => e.slug === slug);
    const descriptionResolved = !!((eqEntry && eqEntry.description) || (equipmentDefaults && equipmentDefaults.description));
    const requestLabelResolved = !!((eqEntry && eqEntry.requestLabel) || (equipmentDefaults && equipmentDefaults.requestLabel));
    const title_en = eqEntry ? (eqEntry.title?.en || null) : (datasheetFound ? (datasheetTitle?.en || null) : null);
    const title_ar = eqEntry ? (eqEntry.title?.ar || null) : (datasheetFound ? (datasheetTitle?.ar || null) : null);

    report.push({ slug, matchedImages: matched.length, datasheetFound, eqEntry: !!eqEntry, descriptionResolved, requestLabelResolved, title_en, title_ar });
}

// Print summary
console.log('Equipment validation report');
console.log('Total slugs checked:', report.length);
const missing = report.filter(r => r.matchedImages === 0 && !r.datasheetFound);
console.log('Pages likely missing both images and datasheet (would show "not found"):', missing.length);
if (missing.length) {
    missing.slice(0, 30).forEach(m => console.log('- ', m.slug, ' eqEntry:', m.eqEntry));
}

// print detailed per-slug lines
console.log('\nDetailed:');
for (const r of report) {
    console.log(`- ${r.slug}: images=${r.matchedImages}, datasheet=${r.datasheetFound}, entry=${r.eqEntry}, desc=${r.descriptionResolved}, reqLabel=${r.requestLabelResolved}, title_en=${!!r.title_en}, title_ar=${!!r.title_ar}`);
}

process.exit(0);
