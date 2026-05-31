#!/usr/bin/env node
// Gera config.js a partir da variável SHOW_ALL_VERSIONS.
// Precedência: variável de ambiente real (ex.: Vercel) > .env.local > default(false).
//   - true  → mostra as abas V1/V2/V3
//   - ausente/null/qualquer-outro-valor → mostra só a V1
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

// Carrega .env.local SEM sobrescrever variáveis já definidas no ambiente.
// (Assim, na Vercel a env do painel sempre vence; .env.local só vale localmente.)
const envFile = path.join(root, '.env.local');
if (fs.existsSync(envFile)) {
    for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
        const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
        if (!m) continue;
        const key = m[1];
        const val = m[2].replace(/^["']|["']$/g, '');
        if (process.env[key] === undefined) process.env[key] = val;
    }
}

const enabled = String(process.env.SHOW_ALL_VERSIONS).toLowerCase() === 'true';

const out = `// GERADO AUTOMATICAMENTE por scripts/build-config.js — não editar à mão.
window.FEATURE_SHOW_ALL_VERSIONS = ${enabled};
`;
fs.writeFileSync(path.join(root, 'config.js'), out);
console.log(`config.js gerado — FEATURE_SHOW_ALL_VERSIONS = ${enabled}`);
