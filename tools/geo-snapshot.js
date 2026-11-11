// Retrato da geometria da app (2D, GEO e 3D) p/ provar que uma mudança não alterou
// nada sem querer. Roda DENTRO da página (usa buildLayers, captureModel e
// buildBuilding3D) e envia o resultado ao tools/geo-sink.mjs, que grava em disco.
//
//   node tools/geo-sink.mjs                (deixa aguardando)
//   no console de http://localhost:3131:
//   await (await import('/tools/geo-snapshot.js')).run('check-1')
//   node tools/geo-diff.mjs pre-v1-oficial check-1
//
// Fora do deploy (.vercelignore exclui tools/). Não é carregado pela index.html.

const VERSIONS = ['v1', 'v11', 'v2', 'v3'];
const SINK = 'http://127.0.0.1:3199/';

// Arredonda e normaliza -0 (senão "-0" e "0" viram diferença falsa)
const r = (x, d = 3) => {
    const k = 10 ** d;
    return Math.round(x * k) / k + 0;
};

function hash(s) {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) | 0;
    return (h >>> 0).toString(16);
}

// Só p/ o GEO (metros, ainda sem arredondar). No 2D as lat/lng já vêm com 8 casas
// (~1 mm): arredondar de novo a 4 casas (~11 m) esconderia qualquer mudança.
const roundMeters = (_, v) => (typeof v === 'number' ? r(v, 4) : v);
const lines = (recs, replacer) => recs.map(x => JSON.stringify(x, replacer)).sort().join('\n') + '\n';

// ── 2D ──────────────────────────────────────────────────────────────────────
function latlngs(a, out = []) {
    for (const x of a) {
        if (Array.isArray(x)) latlngs(x, out);
        else out.push([r(x.lat, 8), r(x.lng, 8)]);
    }
    return out;
}

function layer2D(l, out) {
    if (l.getLayers) { l.getLayers().forEach(c => layer2D(c, out)); return; }
    const o = l.options || {};
    const rec = {
        k: l instanceof L.Marker ? 'marker'
            : l instanceof L.Polygon ? 'polygon'
            : l instanceof L.Polyline ? 'polyline'
            : l instanceof L.CircleMarker ? 'circle' : 'layer',
    };
    if (l.getLatLngs) rec.p = latlngs(l.getLatLngs());
    else if (l.getLatLng) rec.p = latlngs([l.getLatLng()]);
    for (const key of ['color', 'fillColor', 'weight', 'opacity', 'fillOpacity', 'dashArray', 'className']) {
        if (o[key] !== undefined) rec[key] = o[key];
    }
    if (o.icon && o.icon.options) rec.html = o.icon.options.html;
    const tip = l.getTooltip && l.getTooltip();
    if (tip && tip.getContent) rec.tip = String(tip.getContent());
    out.push(rec);
}

function snapshot2D(build) {
    const out = [];
    [build()].flat(Infinity).forEach(l => layer2D(l, out));
    return out;
}

// ── 3D ──────────────────────────────────────────────────────────────────────
function material(m) {
    if (!m) return null;
    const rec = { t: m.type };
    if (m.color) rec.c = m.color.getHexString();
    if (m.transparent) rec.op = m.opacity;
    if (m.map) rec.map = 1;
    if (m.polygonOffset) rec.po = [m.polygonOffsetFactor, m.polygonOffsetUnits];
    return rec;
}

function snapshot3D(v) {
    const g = buildBuilding3D(v);
    g.updateMatrixWorld(true);
    const out = [];
    const q = new THREE.Quaternion();
    const box = new THREE.Box3();

    g.traverse(o => {
        if (o === g) return;
        const rec = { k: o.type };
        if (o.name) rec.name = o.name;
        if (!o.visible) rec.hidden = 1;
        if (o.userData && o.userData.ph != null) rec.ph = o.userData.ph;

        if (o.geometry) {
            const geo = o.geometry;
            if (!geo.boundingBox) geo.computeBoundingBox();
            box.copy(geo.boundingBox).applyMatrix4(o.matrixWorld);
            rec.g = geo.type;
            rec.v = geo.attributes.position.count;
            rec.bb = [...box.min.toArray(), ...box.max.toArray()].map(x => r(x));
            o.getWorldQuaternion(q);
            if (Math.abs(Math.abs(q.w) - 1) > 1e-6) rec.q = q.toArray().map(x => r(x, 4));
            if (geo.type === 'BufferGeometry') {
                rec.h = hash(Array.from(geo.attributes.position.array, x => r(x)).join());
            }
            rec.m = Array.isArray(o.material) ? o.material.map(material) : material(o.material);
            if (o.isSprite && o.material.map && o.material.map.image && o.material.map.image.toDataURL) {
                rec.tx = hash(o.material.map.image.toDataURL());
            }
            if (o.isInstancedMesh) {
                rec.n = o.count;
                rec.ih = hash(Array.from(o.instanceMatrix.array, x => r(x)).join());
            }
        } else {
            rec.pos = o.getWorldPosition(new THREE.Vector3()).toArray().map(x => r(x));
        }
        out.push(rec);
    });

    if (typeof disposeObject3D === 'function') disposeObject3D(g);
    return out;
}

// ── Execução ────────────────────────────────────────────────────────────────
export async function run(label) {
    const files = {};
    const summary = {};
    const put = (name, recs, replacer) => {
        files[`${name}.jsonl`] = lines(recs, replacer);
        summary[name] = recs.length;
    };

    for (const v of VERSIONS) {
        put(`${v}.2d`, snapshot2D(() => buildLayers(v)));
        put(`${v}.geo`, captureModel(v), roundMeters);
        put(`${v}.3d`, snapshot3D(v));
    }
    put('v3f2.2d', snapshot2D(() => buildFloor2Layers()));

    const res = await fetch(SINK, { method: 'POST', body: JSON.stringify({ label, files }) });
    return { label, gravado: res.ok, registros: summary };
}
