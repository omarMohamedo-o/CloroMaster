#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const Module = module.constructor;

const I18N_DIR = path.join(__dirname, '..', 'src', 'i18n');
const OUT_XLSX = path.join(__dirname, '..', 'i18n.xlsx');

function loadJsExport(filePath) {
    const code = fs.readFileSync(filePath, 'utf8');
    // Convert ES module pattern to CommonJS safely for evaluation
    const modCode = code.replace(/export\s+default\s+\w+\s*;?\s*$/m, '')
        .replace(/const\s+(\w+)\s*=\s*/m, 'module.exports = ');
    const m = new Module();
    m._compile(modCode, filePath);
    return m.exports;
}

function flatten(obj, prefix = '', res = {}) {
    if (obj === null || obj === undefined) return res;
    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
        res[prefix] = obj;
        return res;
    }
    if (Array.isArray(obj)) {
        obj.forEach((v, i) => flatten(v, prefix ? `${prefix}.${i}` : `${i}`, res));
        return res;
    }
    if (typeof obj === 'object') {
        Object.keys(obj).forEach(k => {
            const p = prefix ? `${prefix}.${k}` : k;
            flatten(obj[k], p, res);
        });
        return res;
    }
    return res;
}

function unflatten(map) {
    const out = {};
    Object.keys(map).forEach(key => {
        const parts = key.split('.');
        let cur = out;
        for (let i = 0; i < parts.length; i++) {
            const p = parts[i];
            const isIndex = /^\d+$/.test(p);
            if (i === parts.length - 1) {
                if (isIndex) {
                    if (!Array.isArray(cur)) cur = [];
                    cur[p] = map[key];
                } else {
                    cur[p] = map[key];
                }
            } else {
                if (isIndex) {
                    if (!Array.isArray(cur[p])) cur[p] = [];
                    cur = cur[p];
                } else {
                    if (cur[p] === undefined) cur[p] = {};
                    cur = cur[p];
                }
            }
        }
    });
    return out;
}

function listI18nFiles() {
    const files = fs.readdirSync(I18N_DIR).filter(f => f.endsWith('.js'));
    return files.map(f => path.join(I18N_DIR, f));
}

function langFromFilename(filename) {
    const base = path.basename(filename);
    const m = base.match(/^translations-(.+)\.js$/);
    if (m) return m[1];
    if (base === 'translations.js') return 'default';
    // fallback to filename
    return base.replace(/\.js$/, '');
}

function exportToXlsx() {
    const files = listI18nFiles();
    const wb = xlsx.utils.book_new();

    files.forEach(f => {
        const base = path.basename(f, '.js');
        const obj = loadJsExport(f) || {};
        const flat = flatten(obj);
        const rows = [["key", "value"]];
        Object.keys(flat).sort().forEach(k => rows.push([k, flat[k]]));
        const ws = xlsx.utils.aoa_to_sheet(rows);
        // Excel sheet names have limits; use base name
        xlsx.utils.book_append_sheet(wb, ws, base.substring(0, 31));
    });

    xlsx.writeFile(wb, OUT_XLSX);
    console.log('Exported i18n files to', OUT_XLSX);
}

function importFromXlsx() {
    if (!fs.existsSync(OUT_XLSX)) {
        console.error('File not found:', OUT_XLSX);
        process.exit(1);
    }
    const wb = xlsx.readFile(OUT_XLSX);
    wb.SheetNames.forEach(sheetName => {
        const ws = wb.Sheets[sheetName];
        const rows = xlsx.utils.sheet_to_json(ws, { header: 1 });
        if (rows.length < 2) return;
        const header = rows[0];
        // Expect header: [key, value]
        const map = {};
        for (let r = 1; r < rows.length; r++) {
            const row = rows[r];
            const key = row[0];
            const val = row[1];
            if (!key) continue;
            if (val !== undefined && val !== null && val !== '') map[key] = val;
        }
        const obj = unflatten(map);
        const varName = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(sheetName) ? sheetName : 't';
        const content = `const ${varName} = ${JSON.stringify(obj, null, 2)};\n\nexport default ${varName};\n`;
        const target = path.join(I18N_DIR, `${sheetName}.js`);
        fs.writeFileSync(target, content, 'utf8');
        console.log('Wrote', target);
    });
    console.log('Import complete.');
}

function main() {
    const cmd = process.argv[2];
    if (!cmd || (cmd !== 'export' && cmd !== 'import')) {
        console.log('Usage: node i18n-xlsx.js [export|import]');
        process.exit(0);
    }
    if (cmd === 'export') exportToXlsx();
    if (cmd === 'import') importFromXlsx();
}

main();
