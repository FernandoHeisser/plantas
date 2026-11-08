// Compara dois retratos: node tools/geo-diff.mjs <base> <novo> [máx. de linhas por arquivo]
// Sai com código 0 se forem idênticos e 1 se houver diferença. A ordem dos elementos não importa.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'geo-baseline');
const [baseLabel, newLabel, maxArg] = process.argv.slice(2);
if (!baseLabel || !newLabel) {
    console.error('Uso: node tools/geo-diff.mjs <base> <novo> [máx]');
    process.exit(2);
}
const MAX = Number(maxArg) || 8;

const read = (label, file) => {
    const p = path.join(ROOT, label, file);
    return fs.existsSync(p) ? fs.readFileSync(p, 'utf8').split('\n').filter(Boolean) : [];
};

// Diferença de multiconjunto: o que há em a e não há em b, respeitando repetições
function minus(a, b) {
    const count = new Map();
    for (const x of b) count.set(x, (count.get(x) || 0) + 1);
    return a.filter(x => {
        const n = count.get(x) || 0;
        if (n === 0) return true;
        count.set(x, n - 1);
        return false;
    });
}

const names = new Set([
    ...fs.readdirSync(path.join(ROOT, baseLabel)),
    ...fs.readdirSync(path.join(ROOT, newLabel)),
]);

let total = 0;
for (const file of [...names].sort()) {
    const a = read(baseLabel, file);
    const b = read(newLabel, file);
    const removed = minus(a, b);
    const added = minus(b, a);
    const n = removed.length + added.length;
    total += n;
    console.log(`${n === 0 ? 'igual    ' : 'DIFERENTE'} ${file}  (${a.length} → ${b.length}; -${removed.length} +${added.length})`);
    removed.slice(0, MAX).forEach(x => console.log(`    - ${x.slice(0, 220)}`));
    added.slice(0, MAX).forEach(x => console.log(`    + ${x.slice(0, 220)}`));
}

console.log(total === 0 ? '\nRESULTADO: idênticos.' : `\nRESULTADO: ${total} diferenças.`);
process.exit(total === 0 ? 0 : 1);
