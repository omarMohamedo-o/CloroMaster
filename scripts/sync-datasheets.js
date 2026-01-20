#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const i18nDir = path.join(__dirname, '..', 'frontend', 'src', 'i18n');
const destDir = path.join(__dirname, '..', 'backend', 'storage', 'datasheets');

function processFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    // crude split by top-level objects (assumes array of objects)
    const parts = content.split(/},\s*\n\s*\{/m);
    let copied = 0;
    for (const part of parts) {
        const slugMatch = part.match(/slug\s*:\s*'([^']+)'/);
        const datasheetMatch = part.match(/datasheet\s*:\s*'([^']+)'/);
        if (!slugMatch || !datasheetMatch) continue;
        const slug = slugMatch[1].trim();
        const src = datasheetMatch[1].trim();
        // Only handle local filesystem paths
        if (!src || src.startsWith('http')) continue;
        const srcPath = path.isAbsolute(src) ? src : path.join(path.dirname(filePath), src);
        const destPath = path.join(destDir, `${slug}.pdf`);
        try {
            if (fs.existsSync(destPath)) {
                // already present
                continue;
            }
            if (fs.existsSync(srcPath)) {
                fs.copyFileSync(srcPath, destPath);
                console.log(`Copied ${srcPath} -> ${destPath}`);
                copied++;
            } else {
                // try to find matching file case-insensitively in destDir by normalizing names
                const normalize = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
                const targetKey = normalize(slug);
                const candidates = fs.readdirSync(destDir).filter(f => normalize(f).includes(targetKey));
                if (candidates.length > 0) {
                    const candidate = path.join(destDir, candidates[0]);
                    fs.copyFileSync(candidate, destPath);
                    console.log(`Linked ${candidate} -> ${destPath}`);
                    copied++;
                } else {
                    console.warn(`Source not found for slug=${slug}: ${srcPath}`);
                }
            }
        } catch (err) {
            console.error('Failed copying', srcPath, '->', destPath, err.message);
        }
    }
    return copied;
}

function main() {
    if (!fs.existsSync(destDir)) {
        console.error('Destination datasheets dir not found:', destDir);
        process.exit(2);
    }
    const files = fs.readdirSync(i18nDir).filter(f => f.endsWith('.products.js'));
    let total = 0;
    for (const f of files) {
        const p = path.join(i18nDir, f);
        total += processFile(p);
    }
    console.log(`Done. Copied ${total} datasheet(s).`);
}

main();
