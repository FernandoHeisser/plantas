# Projeto: Residência Heisser — Controle de Progresso

**Lote:** 12,50 m × 40,00 m = 500 m² — Charqueadas, RS  
**Última atualização:** 2026-05-28

---

## Estrutura de arquivos

```
plantas/
├── index.html                                                ← app principal (V1/V2/V3)
├── CLAUDE.md                                                 ← referência técnica para Claude Code
├── docs/
│   └── PROGRESSO.md                                          ← este arquivo
└── .claude/
    ├── launch.json                                           ← npx serve -p 3131
    └── settings.local.json
```

---

## Feito

### index.html — v1.0 (2026-05-24)
- [x] Navegação por 3 versões: V1 (MVP), V2 (+Garagem), V3 (Sobrado)
- [x] Sub-navegação: Planta 2D / Planta 3D / Detalhes — 9 painéis no total
- [x] Header sticky com tabs coloridos por fase (azul/âmbar/roxo)
- [x] Design full dark mode

### Mapa satélite (2026-05-25)
- [x] Leaflet.js + tiles ESRI World Imagery (sem API key)
- [x] GPS: LOT_LAT=−29.96296858, LOT_LNG=−51.63740784, LOT_ANGLE=−3°
- [x] `fitBounds` automático no lote
- [x] Polígonos por zona com labels permanentes
- [x] Contorno âmbar do lote
- [x] Véu branco 35% sobre o satélite

### Detalhes enriquecidos com PDFs (2026-05-25)
- [x] V1 — Seção 01: estrutura financeira (FGTS R$48.082, entrada ~R$46k, reserva R$40k, total ~R$230k)
- [x] V1 — Seção 02: planta baixa MVP
- [x] V1 — Seção 03: implantação bioclimática
- [x] V1 — Seção 05: espinha dorsal elétrica/TI/hidráulica
- [x] V3 — Seção 02: programa do 2º pav.
- [x] V3 — Seção 03: reconfiguração do térreo

### Planta 2D — layout V1 (2026-05-27/28)
- [x] Casa MVP: mN 1,5→6,5 × mE 22→30 (5×8 m = 40 m²)
- [x] Recuos: frente 22 m, fundo 10 m, laterais 1,5 m e 6 m
- [x] Linhas de cota alinhadas com a casa (mN=4) — sem cruzamentos
- [x] Cotas totais do lote em âmbar (40 m e 12,5 m)
- [x] Paredes internas: Banheiro (2×3 m, SE), Quarto (3×3 m, canto SE)
- [x] Sala+Cozinha em L — Zone A (corredor), Zone B (sala), Zone C (cozinha)
- [x] Labels de cômodo com nome, dimensões e área
- [x] Mobiliário: sofá, TV, mesa, 4 cadeiras, geladeira, fogão, pia, tanque
- [x] Bancadas em L (norte + leste) na cozinha
- [x] 5 portas: Principal, Banheiro, Lateral, Fundos, Quarto
- [x] Legenda V1 simplificada (só o que existe no V1)

### Mapa — melhorias de zoom (2026-05-28)
- [x] maxZoom=25, maxNativeZoom=18 (tiles ESRI esticados acima do zoom nativo)
- [x] Labels ocultos abaixo de zoom 22, visíveis em zoom ≥ 22
- [x] Indicador de zoom no canto inferior esquerdo do mapa

---

## Pendente

### Conteúdo faltando (index.html)
- [ ] **Cronograma / gatilhos** — condições financeiras V1 → V2 → V3
- [ ] **Responsáveis técnicos** — M² Engenharia, CREA do arquiteto e calculista
- [ ] **Acabamentos por fase** — piso, esquadrias, cobertura, revestimento
- [ ] **Corte esquemático** — piso elevado 40–60 cm, laje EPS, shaft, espera 2º pav.
- [ ] **Modelos 3D** — substituir placeholders
- [ ] **Checklist de visita presencial** — árvores de divisa, topografia, cercas, infraestrutura

### Ajustes técnicos
- [ ] Responsividade mobile (viewport < 600 px)
- [ ] `@media print` para memorial técnico imprimível
- [ ] Google Fonts: avaliar fallback local para uso offline

### Infraestrutura
- [ ] Inicializar git em `C:\dev\plantas`
