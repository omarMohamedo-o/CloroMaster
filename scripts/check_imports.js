const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'frontend', 'src');
const exts = ['.js', '.jsx', '.ts', '.tsx'];

function walk(dir) {
    let files = [];
    for (const name of fs.readdirSync(dir)) {
        const p = path.join(dir, name);
        const stat = fs.statSync(p);
        if (stat.isDirectory()) files = files.concat(walk(p));
        else if (/\.(js|jsx|ts|tsx)$/.test(name)) files.push(p);
    }
    return files;
}

function resolveImport(fromFile, importPath) {
    if (importPath.startsWith('.')) {
        const base = path.resolve(path.dirname(fromFile), importPath);
        // If importPath already points to a file with extension, check directly
        if (fs.existsSync(base)) return base;
        // try with extensions and index files
        for (const ext of exts) {
            if (fs.existsSync(base + ext)) return base + ext;
        }
        for (const ext of exts) {
            if (fs.existsSync(path.join(base, 'index' + ext))) return path.join(base, 'index' + ext);
        }
        return null;
    } else {
        // ignore node_modules etc
        return true;
    }
}

const importRegex = /import\s+(?:[^'\"]+\s+from\s+)?['\"]([^'\"]+)['\"]/g;

const files = walk(root);
let errors = [];
for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    let m;
    while ((m = importRegex.exec(content)) !== null) {
        const imp = m[1];
        const resolved = resolveImport(file, imp);
        if (resolved === null) {
            errors.push({ file, imp });
        }
    }
}

if (errors.length === 0) {
    console.log('No missing relative imports found');
    process.exit(0);
}

for (const e of errors) {
    console.log(`${e.file} -> ${e.imp}`);
}
process.exit(1);
