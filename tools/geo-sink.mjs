// Recebe N retratos (padrão 1) enviados por tools/geo-snapshot.js, grava em
// tools/geo-baseline/<label>/ e encerra. Só escuta em 127.0.0.1.
// Uso: node tools/geo-sink.mjs [N]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'geo-baseline');
const SAFE = /^[\w.-]+$/;
const LOCAL_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

const expected = Number(process.argv[2]) || 1;
let received = 0;

const giveUp = setTimeout(() => {
    console.error('Nenhum retrato recebido em 5 min.');
    process.exit(1);
}, 5 * 60 * 1000);

const server = http.createServer((req, res) => {
    const origin = req.headers.origin || '';
    if (LOCAL_ORIGIN.test(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    res.setHeader('Access-Control-Allow-Private-Network', 'true');

    if (req.method === 'OPTIONS') { res.writeHead(204).end(); return; }
    if (req.method !== 'POST') { res.writeHead(405).end(); return; }

    let body = '';
    req.setEncoding('utf8');
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
        const { label, files } = JSON.parse(body);
        if (!SAFE.test(label) || !Object.keys(files).every(n => SAFE.test(n))) {
            res.writeHead(400).end();
            return;
        }
        const dir = path.join(ROOT, label);
        fs.mkdirSync(dir, { recursive: true });
        for (const [name, content] of Object.entries(files)) {
            fs.writeFileSync(path.join(dir, name), content);
        }
        console.log(`${Object.keys(files).length} arquivos em ${dir}`);
        res.writeHead(200).end('ok', () => {
            if (++received < expected) return;
            clearTimeout(giveUp);
            server.close();
            server.closeAllConnections();
        });
    });
});

server.listen(3199, '127.0.0.1', () => console.log('Aguardando retrato em 127.0.0.1:3199'));
