# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Metodologia de trabalho — LER E SEGUIR EM TODA SESSÃO

Esta é a forma de trabalho que produziu resultados aprovados pelo cliente. Replicar.

### 1. Incremental, com commits granulares
- Trabalhar em **feature branch** (`git checkout -b <nome>`), nunca direto na `main`.
- **Uma mudança lógica = um commit separado**, mensagem descritiva em pt-BR + `Co-Authored-By`.
  Isso dá **rollback granular**: o cliente reverte só o que não gostou sem perder o resto.
- O cliente pediu explicitamente "faz um de cada vez" — não empacotar mudanças não relacionadas.
- Merge na `main` (`--no-ff`), push e deletar a branch **só quando o cliente pedir**.

### 2. Discutir antes de implementar (decisões subjetivas/de layout)
- **Propor com números concretos e o porquê**; confirmar a direção antes de codar.
- Oferecer opções (leve / médio / pesado) quando couber.
- O cliente tem opinião forte e corrige — respeitar e iterar, não defender o que fiz.
  Ex.: reverteu a inversão da porta do banheiro (privacidade do box + acesso à pia);
  trocou um biombo sólido por uma **estante vazada** como divisória.

### 3. Verificar SEMPRE no preview antes de commitar
- Rodar o preview, recarregar, **checar console (erros)** + screenshot **2D e 3D**.
- O 3D é extrudado do 2D (pipeline GEO) — conferir paredes/vãos/móveis e **z-fight**.
- **Nunca** pedir pro cliente conferir manualmente — mostrar a prova (screenshot).
- Screenshot do mapa 2D às vezes trava (tiles de satélite). **Reiniciar o preview server resolve.**
  O canvas 3D não depende de tiles.

### 4. Raciocínio bioclimático (lat −29,96°, hemisfério sul, RS — Zona Bioclim. 3)
- **Sol vem sempre do NORTE** ao meio-dia: verão alto ~83°, inverno baixo ~37°.
- **Norte = fachada nobre** → estar/jantar/cozinha (pega sol de inverno). Beiral norte ~0,9 m
  auto-regula (sombreia verão, admite inverno). **Não fazer beiral resolver o oeste** (sol baixo).
- **Sul** = frio + vento minuano → usos de baixa permanência (banheiro, serviço, hall).
- **Oeste** = sol da tarde quente + ofuscamento, difícil sombrear → evitar TV/longa permanência.
- **Leste** = sol da manhã suave → bom p/ quarto.
- **Canto sudoeste** (oeste+sul) = pior da casa → hall/entrada/storage, nunca estar.
- Estratégias: ventilação cruzada + admitir sol de inverno + sombrear no verão.

### 5. Conformidade Caixa (FGTS/SFH) — checar a CADA mudança de cômodo
- Casa ≥ **36 m²** (serviço externa) / 39 m² (interna). Hoje **44 m²** ✓.
- Dormitório: **menor dimensão ≥ 2,40 m**; casal ~8 m². Janela de quarto **≥ 1,50 m²** de abertura.
- Área de serviço coberta com tanque (atendido). Exige PCI assinada por eng./arq.
- **O quarto vira despensa/depósito só no V3**; em V1/V2 é 100% dormitório (entra na planta
  aprovada como quarto). Por isso ele fica colado na cozinha e a porta dá pro lado dela — proposital.

### 6. Regras de código (detalhes nas seções abaixo)
- **Fonte única 2D→3D:** mexeu no `buildLayers` (2D) → o 3D acompanha ao reabrir. **Base comum
  propaga V1/V2/V3.** Mudou cota/posição/novo tipo `FURN3D`? **Atualizar este CLAUDE.md junto.**
- Após editar JS: **Ctrl+Shift+R** (Leaflet e Three cacheiam).
- Z-fight: `polygonOffset` em `matWall`/`lajeMat`; colunas (`matEmbase`) sempre vencem.

---

## Como rodar

```bash
npx serve -p 3131 . --single
```

Acesso: http://localhost:3131  
Config em `.claude/launch.json`.

> **`--single` é obrigatório:** o app usa rotas resolvidas no cliente (`/v2` → V2,
> `/v3` → V3, `/` ou qualquer outra → V1). Sem o modo SPA, o `serve` devolve **404**
> em `/v2` e `/v3` (só `/` funciona). Na Vercel isso é tratado pelo rewrite catch-all
> do `vercel.json`.

> **Importante:** o Leaflet cacheia os mapas em `maps[v]`. Após editar o JS, fazer **Ctrl+Shift+R** (hard refresh) para ver as mudanças. O mesmo vale para o 3D (Three.js).

---

## Arquitetura

**Arquivo único:** `index.html` — toda a lógica, estilos e conteúdo numa página só, sem build step, sem dependências locais.

**Dependências externas (CDN):**
- Leaflet.js 1.9.4 — mapas 2D
- Three.js r128 + OrbitControls + RoomEnvironment — cena 3D
- ESRI World Imagery — tiles de satélite (sem API key)
- Google Fonts — JetBrains Mono + Inter

**Estrutura da página:**
- Header sticky → tabs V1 / V2 / V3
- Section nav sticky → Planta 2D / Planta 3D
- 6 painéis (`p-v1-2d`, `p-v1-3d`, `p-v2-2d`, `p-v2-3d`, `p-v3-2d`, `p-v3-3d`) — só um visível por vez
- **A aba Detalhes foi removida** (V1, V2, V3) — todo o CSS/JS de detalhes editáveis também foi removido

---

## Sistema de coordenadas do lote

```
LOT_LAT  = -29.96296858   (ponto SW do lote)
LOT_LNG  = -51.63740784
LOT_ANGLE = -3            (graus — lote ligeiramente inclinado)

LAT_M  = 1 / 111320       (metros por grau de latitude)
LNG_M  = 1 / 96373        (metros por grau de longitude em −30°)
```

**Eixos 2D:**
- `mN` = metros para norte, 0 → 12,5 (testada sul → fundo norte)
- `mE` = metros para leste, 0 → 40 (rua/oeste → quintal/leste)
- Rua está em `mE = 0` (oeste)

**Eixos 3D:** X = mE (leste), Y = altura (cima), Z = **−mN** (norte → −Z).  
O Z é negado para não espelhar a planta (regra ENU: com Leste +X e Cima +Y, Norte vai para −Z).  
A rotação de −3° é ignorada no 3D (irrelevante para a cena local).

**Função `rot(mN, mE)`** — converte metros do lote em `[lat, lng]` aplicando a rotação de −3°.

---

## Funções helper do mapa 2D

Todas retornam `Array<L.Layer>` — usar com `.forEach(l => lys.push(l))`.

```
rot(mN, mE)
  Converte coordenadas do lote para [lat, lng] com rotação de -3°.

rect(n, e, dn, de, fill, opts?)
  Retângulo eixo-NE. n,e = canto SW; dn=tamanho N-S, de=tamanho E-O.
  opts 3D: h3d, z3d, no3d, m3d (ver seção Pipeline 2D→3D).

circ(n, e, r, fill, opts?)
  Círculo aproximado por polígono de 32 lados. n,e = centro.
  opts 3D: h3d, z3d, no3d, m3d.

wall(n1, e1, n2, e2, t, opts?)
  Parede grossa centrada na linha (n1,e1)→(n2,e2), espessura t.
  Paredes externas: EW = 0.20m. Internas: IW = 0.10m.
  Registra automaticamente em GEO quando GEO !== null.

doorArc(hn, he, dn, de, swing, opts?)
  Arco de abertura de porta + folha + pivô.
  hinge=(hn,he); (dn,de) = direção inicial da folha;
  swing: +1 anti-horário / -1 horário.
  opts.no3d = true → não gera folha 3D (usado em glassdoor).
  opts.glass = true → gera folha de vidro no 3D (em vez de madeira).

win(n, e, dn, de, axis, opts?)
  Janela: abertura branca (no3d:true) + 3 linhas (caixilho/vidro/caixilho).
  axis='N' parede horizontal (mN=const), axis='E' parede vertical (mE=const).
  O rect de fundo branco tem no3d:true — não gera volume 3D.
  opts.sill / opts.head = peitoril/verga customizados (padrão 1,0 / 2,1).
    Ex.: fita horizontal de respaldo (entre armário de baixo e de cima) → { sill: 0.90, head: 1.50 }.

cut(n, e, dn, de, type?)
  Recorte de porta na parede. type padrão = 'door'.
  type = 'glassdoor' → vão de vidro (porta lateral dupla).
  Sempre no3d:true no rect 2D; registra k:'opening' no GEO.

dimLine(n1, e1, n2, e2, texto, cor?)
  Linha tracejada de cota com ticks perpendiculares e label central.

roomLabel(mN, mE, nome, dims, area)
  Marker com label de cômodo (3 linhas). Centralizado via CSS.

dimLabel(mN, mE, nome, dims, area, corNome, corDim)
  Label grande de área (ex: "Terreno / 12,5×40m / 500m²").
```

---

## buildLayers — estrutura atual

```javascript
function buildLayers(v) {
    // Base comum V1/V2/V3 (bloco { })
    //   → terreno cinza + casa branca + cotas + paredes + portas + janelas
    //   → banheiro + quarto + cozinha + sala + área de serviço + labels

    if (v === 'v2' || v === 'v3') {
        // → garagem (mN 1,5→8,5, mE 14→22)
    }
    if (v === 'v3') {
        // → 2º pavimento (suíte, quartos, home office)
    }
}
```

V1, V2 e V3 compartilham a mesma planta baixa detalhada do térreo. Diferenças são adicionadas nos blocos `if`.

---

## Pipeline 2D → 3D (fonte única)

O 3D **não é modelado à mão** — é extrudado automaticamente do mesmo `buildLayers` que desenha o 2D.  
**Regra: mexeu no 2D → o 3D acompanha sozinho ao reabrir a aba.**

### Como funciona

1. Quando `GEO !== null`, os helpers registram em `GEO` o que desenham (metros do lote).
2. `captureModel(v)` faz `GEO = []`, roda `buildLayers(v)` e devolve o modelo.
3. `buildBuilding3D(v)` extruda o modelo:
   - **paredes** (`k:'wall'`) → caixas até `CEIL3D=2,70 m`, **recortando vãos** (cheio + peitoril + verga + vidro).
   - **vãos** (`k:'opening'`):
     - `type:'window'` → vidro fixo entre peitoril e verga (padrão 1,0→2,1; customizável via `opts.sill`/`opts.head` no `win()`) + batente + montante + peitoril saliente.
     - `type:'door'` → abertura vazia + batente + folha de madeira abrindo pelo swing do `doorArc`.
     - `type:'glassdoor'` → abertura vazia + batente + soleira + **duas folhas de vidro** abertas (grade 2×3 em cada folha). A lateral dupla usa este tipo.
   - **móveis** (`k:'solid'`) → modelo realista por tipo via `FURN3D[m3d]`, ou volume de massa se sem tipo.

### Tags nos `opts` da chamada 2D

| Tag | Efeito |
|---|---|
| `h3d: n` | Altura em metros (padrão 0,45 m) |
| `z3d: n` | Base acima do piso em metros (padrão 0) |
| `no3d: true` | Não gerar volume 3D |
| `m3d: 'tipo'` | Usa builder dedicado em `FURN3D` |

### Tipos de móveis (`FURN3D`)

| Tipo | Móvel |
|---|---|
| `rug` | Tapete plano fosco (respeita `z3d`) |
| `tv` | Painel fino de TV + tela emissiva |
| `rack` | Rack baixo + pés + ranhura |
| `coffee` | Mesa de centro + pernas baixas |
| `sofa` | Base + encosto + braços + 3 almofadas |
| `bed` | Estrado + colchão + cabeceira + 2 travesseiros + edredom (GAP=7cm da parede) |
| `wardrobe` | Guarda-roupa + portas + puxadores |
| `fridge` | Geladeira inox + fenda freezer + 2 puxadores |
| `stove` | Fogão + forno + porta + puxador + cooktop |
| `sink` | Pia + 2 cubas + torneira (sem saliência lateral) |
| `counter` | Bancada segmentada: abre vãos p/ `stove` e `sink` via `model`. **Recebe `model` como 3º arg.** Recortes são **clampados ao próprio vão** (ignora fogão/pia fora do range da bancada — necessário p/ a península não vazar segmentos). |
| `lavatory` | Lavatório + cuba + torneira |
| `shower` | Box: base + 2 vidros sem sombra + ducha |
| `toilet` | Vaso: bacia + assento + caixa acoplada |
| `table` | Mesa de jantar + 4 pernas |
| `chair` | Cadeira: assento cilíndrico + pernas + encosto voltado para fora da mesa |
| `tank` | Tanque: pé + cuba |
| `shelf` | Estante vazada divisória: montantes + 5 prateleiras + livros coloridos + folhagens |
| `benchcorner` | Canto alemão: banco em **L** (assento 0→0,45 + encosto 0,45→0,85). Driver = **bbox do L** (rect transparente no 2D); encostos na face **N + L** (mN/mE altos). Bancos visíveis no 2D são `rect{no3d:true}` separados. |
| `wallcab` | Armário **aéreo**, frente p/ **SUL** (costas na parede norte). Carcaça + porta + fenda central + puxadores na base. Usa `z3d` (base) + `h3d`. |
| `wallcabW` | Armário **aéreo**, frente p/ **OESTE** (costas na parede leste, mE=s.e+s.de). `wallcab` espelhado — usado na coluna da geladeira. |
| `hood` | **Coifa**: canopy inox + boca de sucção escura + duto até o teto (z local **2,70**). Usa `z3d` como base (~1,55). Monta acima de uma janela-fita. |
| `washer` | — (removido — ponto daquela posição virou tapete/capacho) |

> **Atenção:** `counter` e `chair` recebem `(g, s, model)` — precisam do array model completo. O dispatch já passa: `FURN3D[s.m3d](g, s, model)`.

### Iluminação e sol

- **Sombras** PCFSoft 2048², tone mapping ACESFilmic, saída sRGB.
- **Environment** RoomEnvironment + PMREM → reflexos suaves nos materiais Standard.
- `setSun3D(S, hora, mês)` = posição solar **real** para lat −29,96° (declinação por dia do ano + ângulo horário → vetor ENU mapeado pra cena).
- HUD inferior: slider 5h–19h + seletor de mês + relógio com elevação (`14:30 ☀29°`).
- Bússola (canto sup. esq.) que gira com a câmera; N em vermelho.
- Vidros (`matGlass`, box/shower/glassdoor) têm `castShadow=false` → luz passa.

### Chão 3D

- **Satélite dos vizinhos:** plano de ~140 m com tiles ESRI (z18, maxNativeZoom), composto num canvas via `loadSatelliteTexture()`. Singleton `satGroundMat`. Fallback verde se CORS falhar.
- **Grama no lote:** plano axis-aligned cobrindo mN 0→12,5 / mE 0→40 por **cima** do satélite (y=−0,025 vs satélite y=−0,03). Textura procedural nítida.
- **Piso interno:** `box3d(2.11, 22.11, 5.28, 7.78, -0.02, 0.001, matFloor)` — 1 cm aquém das faces interiores das paredes p/ evitar z-fight (dn=5,28 cobre mN 2,11→7,39 após extensão norte).
- **Contorno âmbar** do lote em `y=0.02` marcando a propriedade.

### Cobertura

Laje plana de concreto (não telhado de duas águas) — **V3 recebe 2º pavimento sobre ela**.  
Grupo `roof` = laje (y 2,70→2,86) + platibanda em 4 lados (y 2,86→3,28). Começa oculta.  
Toggle: botão "Laje: oculta/visível" via `set3DRoof(v, btn)`.

### Bugs resolvidos / armadilhas conhecidas

| Bug | Causa | Solução |
|---|---|---|
| Z-fight base de janelas | `win()` criava `rect('#fafafa')` capturado como sólido 3D | `no3d:true` no rect de fundo da janela |
| Porta parecendo fechada e aberta | Grade de caixilho gerada no vão fechado da glassdoor | Removida a grade do vão; ela existe só nas folhas |
| Z-fight piso × parede | Piso slab face externa coplanar com parede exterior | Piso insetado 1 cm das faces interiores |
| Paredes z-fight chão | Paredes começando em y=0 coplanar com topo do piso | `seg()` usa `z0adj=-0.01` quando `z0≤0` |
| Cabeceira dentro da parede | Cama terminava em mN=4,50 = face da parede | GAP=7 cm: cama vai até mN 4,43 |
| Vidro bloqueando luz | MeshStandard transparente ainda projeta sombra | `castShadow=false` em todos os vidros |
| Z-fight coluna×viga/parede | `matEmbase` (col.) e `matWall`/`lajeMat` têm faces coplanares (mesma mE, mN ou y=GLAJE) | `polygonOffset: true, factor:1, units:4` em `matWall` e `lajeMat` — colunas sempre vencem |

### Regra: `polygonOffset` — Z-fight entre materiais coplanares

`matWall` e `lajeMat` têm `polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 4`.  
`matEmbase` (colunas, baldrame) **não tem** offset → suas faces vencem qualquer coplanar.

**Regra:** toda nova geometria criada com `matWall` ou `lajeMat` herda o offset automaticamente.  
Se criar um **novo material** que possa ter faces coplanares com `matEmbase`, adicione o mesmo offset.

Situações que causam Z-fight (e são cobertas pelo offset):
- Box de parede com face no mesmo plano de face de coluna (mesma mE ou mN)
- Box de viga com face no mesmo plano de coluna
- Topo de parede em `y=GLAJE` coincidindo com topo de coluna

---

### Padrão V2 — garagem usa `{no3d:true}` + `box3d` manual (não pipeline GEO)

**Por quê não usar o pipeline GEO para as paredes da garagem?**  
O extrusor de paredes (`walls.forEach`) inicia em `z=0` e vai até `CEIL3D+CPA=3,10 m`.  
O piso da garagem é `GCPA=0,20 m` (não `CPA=0,40 m`). Usando o pipeline, a parede ficaria **20 cm afundada no baldrame**.

**Padrão correto para paredes da garagem:**
```javascript
// 2D — visual apenas; NÃO registra no GEO
lys.push(wall(n1, e1, n2, e2, 0.20, { no3d: true }));

// 3D — box manual assentado no GCPA
g.add(box3d(n - 0.10, e,       0.20, len,  GCPA, GLAJE, matWall)); // parede E-O
g.add(box3d(n,       e - 0.10, len,  0.20, GCPA, GLAJE, matWall)); // parede N-S
```

**Cotas de referência da garagem:**
- `GCPA = 0.20` — piso da garagem (20 cm acima do chão externo)
- `GLAJE = CEIL3D + CPA = 3.10` — teto da garagem = teto da casa
- `EW = 0.20` — espessura de parede externa (centrada: ±0,10 m em torno da linha)

**Paredes da garagem — estado:**
| Parede | mN/mE | 2D (`wall`) | 3D (`box3d`) |
|---|---|---|---|
| Sul | mN=GN0=2,0 | ✅ `no3d:true` | ✅ `GCPA→GLAJE` |
| Norte | mN=GN1=10,5 | ✅ `no3d:true` | ✅ `GCPA→GLAJE` |
| Leste superior | mE=GE1=22, mN 7,0→10,5 | ✅ `no3d:true` | ✅ `GCPA→GLAJE` |
| Leste inferior | mE=GE1=22, mN 2,0→7,0 | ✅ (parede da casa, base comum) | ✅ (pipeline GEO) |
| Oeste (portão) | mE=GE0=13 | ⬜ pendente | ⬜ pendente |

---

### Renderização

`init3D(v)` cria cena/câmera/OrbitControls/luzes/HUD **uma vez** e reconstrói o prédio a cada abertura.  
`render()` chama `init3D` quando `sec === '3d'`.  
Fallback de dimensões (W=960, H=520) + `ResizeObserver` quando container ainda sem largura.

> Só o painel **V1** tem cena 3D hoje (`#scene3d-v1`). Para migrar V2/V3, substitua o placeholder por `<div id="scene3d-v2" class="scene3d">…</div>` e adicione o botão de laje.

---

## Layout V1 — estado final ✅

### Lote
- **Tamanho:** 12,5 m × 40 m = 500 m²
- **Frente:** mE=0 (oeste/rua)

### Casa — posição no lote
- **mN 2,0 → 7,5** × **mE 22 → 30** (5,5 m × 8 m = 44 m²)
- Recuo sul: 2,0 m | Recuo norte: 5,0 m | Recuo frente: 22 m | Recuo fundo: 10 m
- Parede norte estendida de 7,0 → 7,5 (0,5 m do jardim norte → +2,5 m² sala, +1,5 m² cozinha)

### Cômodos

| Cômodo | mN | mE | Dimensão | Área |
|---|---|---|---|---|
| Banheiro | 2,0 → 4,5 | 25,5 → 27 | 1,5 × 2,5 m | 3,75 m² |
| Quarto | 2,0 → 4,5 | 27 → 30 | 2,5 × 3 m | 7,5 m² |
| Sala | 2,0 → 7,5 | 22 → 27 | — | ~17,5 m² |
| Cozinha | 4,5 → 7,5 | 27 → 30 | 3 × 3 m | 9 m² |

### Mobiliário — Banheiro (linear 1,5×2,5, parede norte alinhada ao quarto em mN=4,5)
- Box chuveiro (`shower`): mN 2,05→2,85, mE 26,15→26,95 — canto SE, vidros N+O p/ dentro (sem sombra)
- Vaso (`toilet`): mN 3,20→3,62, mE 26,45→26,90 — parede leste (mE=27)
- Lavatório (`lavatory`): mN 4,13→4,45, mE 25,65→26,15 — parede norte (mN=4,5), canto NO

### Mobiliário — Quarto
- Cama (`bed`): footprint mN 2,60→4,50, mE 27,40→28,80 — GAP 7cm da parede norte
- Guarda-roupa (`wardrobe`): mN 2,10→2,65, mE 29,25→29,80, h=2,00 m

### Mobiliário — Sala (grupo recentralizado p/ a nova profundidade — centro mN≈5,85)
- Rack (`rack`): mN 5,15→6,55, mE 22,15→22,50, h=0,50 m — na parede oeste
- TV (`tv`): mN 5,30→6,40, mE 22,10→22,15 — painel na parede, `m3d:'tv'`
- Sofá (`sofa`): mN 4,975→6,725, mE **24,20→25,05**, h=0,75 m — frente p/ a TV (oeste). Recuado 0,25 m p/ O p/ abrir folga do canto alemão.
- Mesa de centro (`coffee`): mN 5,35→6,35, mE **23,40→23,95** (acompanha o sofá)

### Mobiliário — Hall de entrada (canto SO — antes "morto")
- **Estante divisória vazada** (`shelf`): mN 3,83→4,18, mE 23,50→25,50, h=1,80 m — encosta na parede oeste do banheiro (mE=25,5), ponta oeste livre (passagem de ~1,5 m p/ a sala). Esconde a porta do banheiro da sala sem fechar luz/ar.
- Sapateira/console (`rack`): mN 2,10→2,45, mE 23,95→25,20, h=0,85 m — parede sul, entre janela e porta do banheiro
- Tapete entrada (`rug`): mN 2,80→3,80, mE 22,95→23,90, h=0,02 m
- Porta do banheiro abre p/ sul (swing −1): folha aberta protege o box (privacidade) e o olhar cai na pia

### Mobiliário — Cozinha em U (bancada norte + península O + geladeira L)
Layout em **U**: o cozinheiro fica no "poço" (mE 28,00→29,45) e acessa fogão/pia pela parede norte;
a geladeira fecha o leste; a península fecha o oeste e vira bancada de preparo voltada p/ a TV.
- Bancada norte (`counter`): mN 6,85→7,40, mE 27,25→29,90, h=0,90 — **segmentada** (vãos p/ fogão e pia)
- Península O (`counter`): mN 5,80→6,85, mE 27,25→**28,00** (prof. 0,75) — braço O do U; face O = encosto do canto alemão; deixa mN 4,5→5,80 (1,3 m) livre p/ a passagem sala→cozinha
- Fogão (`stove`): mN 6,85→7,40, mE **28,10→28,65**, h=0,90 — central, acessível pelo poço, respaldo + coifa
- Coifa (`hood`): mN 6,95→7,40, mE 28,00→28,75, base z=1,55 → duto até 2,70 — encostada na parede norte, **fora da linha de visão da TV** (cliente cozinha vendo TV → coifa de ilha foi descartada)
- Pia (`sink`): mN 6,85→7,40, mE **28,85→29,40**, h=0,90 — sob a janela-fita (lavar louça com luz)
- Geladeira (`fridge`): mN 6,20→6,85, mE 29,45→30,00, h=1,70 — parede leste, abre p/ O

**Armários aéreos** (tracejado no 2D):
- Aéreo parede norte (`wallcab`, frente S): mN 7,07→7,40, z 1,50→2,30 — mE 27,30→28,00 (sobre a península) e mE 28,75→29,40 (sobre a janela)
- Coluna da geladeira (`wallcabW`, frente O, costas na parede leste mE=30):
  - canto sobre a bancada: mN 6,85→7,40, mE 29,45→30,00, z 1,50→2,30
  - sobre a geladeira: mN 6,20→6,85, mE 29,45→30,00, z **1,70**→2,30

### Mobiliário — Canto alemão (refeição, encostado na parede norte)
Substitui a antiga mesa central da cozinha. Banco em **L** abre p/ SO; fica ao N (mN≥5,80), fora da passagem.
- Banco norte: mN 6,95→7,40, mE 25,55→27,25 — encosto na parede norte, assento p/ S (2D `rect{no3d}`)
- Banco leste: mN 5,80→7,40, mE 26,80→27,25 — encosto na face O da península, assento p/ O (2D `rect{no3d}`)
- Driver 3D do L (`benchcorner`, rect transparente): bbox mN 5,80→7,40, mE 25,55→27,25, h=0,85
- Mesa (`table`): mN 5,95→6,85, mE 25,85→26,90
- 2 cadeiras (`chair`): lado sul aberto — (mN 5,75; mE 26,05) e (mN 5,75; mE 26,70)

### Mobiliário — Área de Serviço (externa, leste)
- Laje coberta (`rug`): mN 3,50→5,70, mE 30,10→31,50, h=0,06 m (tapete plano)
- Tanque (`tank`): mN 3,70→4,40, mE 30,20→30,75, z=0,06 m
- Capacho saída (`rug`): mN 4,70→5,25, mE 30,20→30,75, z=0,06 m

### Portas

| Porta | Tipo | Hinge | Swing |
|---|---|---|---|
| Principal | madeira | mN=3,05, mE=22 | −1 (leste) |
| Banheiro | madeira | mN=2,90, mE=25,5 | −1 (leste) |
| Porta grande sala esq | **vidro** (glassdoor, 1,0 m) | mE=22,70, mN=7,5 | +1 (norte) |
| Porta grande sala dir | **vidro** (glassdoor, 1,0 m) | mE=24,70, mN=7,5 | −1 (norte) |
| Fundos | madeira | mN=4,70, mE=30 | +1 (oeste) |
| Quarto | madeira | mE=29,80, mN=4,50 | +1 (sul) |

### Janelas

| Janela | Parede | mN (corte) | mE | Largura |
|---|---|---|---|---|
| Banheiro | Sul (mN=2,0) | 1,90→2,10 | 25,70→26,50 | 0,80 m |
| Quarto | Leste (mE=30) | 2,80→3,80 | 29,90→30,10 | 1,00 m |
| Sala | Sul (mN=2,0) | 1,90→2,10 | 22,80→23,80 | 1,00 m |
| Sala (norte) | Norte (mN=7,5) | 7,40→7,60 | 25,40→27,20 | 1,80 m |
| Cozinha (fita) | Norte (mN=7,5) | 7,40→7,60 | 27,80→29,40 | 1,60 m — **janela-fita** peitoril 0,90 / verga 1,50; passa atrás do cooktop (coifa monta acima); canto da geladeira fica p/ armário |

> **Porta grande de vidro (sala) em mE 22,70→24,70** (onde era a janela solar): estilo japonês,
> abre a sala pro jardim norte. A janela de 1,80 m foi pro vão onde era a porta (mE 25,40→27,20).
> Troca feita na branch `sala-japonesa`.

---

## Sistema de layout (atualizado)

```
--sticky-h   medido via ResizeObserver no .sticky-top — atualiza automaticamente no resize
```

- Todos os painéis 2D e 3D: `height: calc(100dvh - var(--sticky-h))`, full-bleed (sem padding/borda)
- `.content { padding: 0; margin: 0; }` — sem max-width
- `[id$="-2d"] .card, #p-v1-3d .card` → full-bleed; `#p-v2-3d .card, #p-v3-3d .card` → altura padronizada com padding mantido (são placeholders)

### Mapa 2D — overlays internos

O sidebar lateral foi **removido**. Bússola e legenda ficam sobrepostos dentro do mapa:
- **Bússola:** `div.scene3d-compass` posicionado `top:10px; left:10px; z-index:800` — mesmo CSS/posição do 3D
- **Legenda:** `div.map-legend-ov` posicionado `bottom:40px; left:10px; z-index:800`
- `zoomControl: false` no Leaflet — botões +/− removidos; zoom por scroll/pinch permanece

### Mapa 2D — comportamento de zoom

```
maxZoom       = 25
maxNativeZoom = 18
```

- Zoom < 22 → labels ocultos (`zlvl-far`)
- Zoom ≥ 22 → labels visíveis (`zlvl-near`)

---

## Cor do terreno — constante compartilhada

```javascript
const LOT_FILL   = '#5f7a3f';   // verde grama — string para Leaflet
const LOT_FILL_N = 0x5f7a3f;   // numérico para Three.js
```

Usada em:
- 2D: `fillColor: LOT_FILL` no polígono do lote
- 3D grass texture: base color em `texGrass()`
- 3D satellite fallback material: `color: LOT_FILL_N`

---

## Cotas 3D (dimLine3D)

Funções adicionadas após `buildBuilding3D`:

```javascript
_makeLabel3D(txt, hexColor)   // sprite canvas sempre voltado para a câmera
_dimLine3D(g, n1,e1, n2,e2, txt, hexColor)  // linha dashed + ticks + label, Y=0.12m
buildDims3D(g)                // chamada no final de buildBuilding3D(v)
```

Cotas renderizadas (mesmas do 2D):
- Afastamentos (branco): frente 22m, fundo 10m, sul 2m, norte 5,5m
- Totais do lote (âmbar): 40m (mN=13,5) e 12,5m (mE=41,5)

---

## Bússola — padronização 2D/3D

Ambas usam `.scene3d-compass` (58×58px, `rgba(15,23,42,0.78)`, `border-radius:50%`) com labels:
- N vermelho (classe `.n`), L verde `#4ade80`, S cinza `#64748b`, O âmbar `#f59e0b`
- Posições px: N[29,9], L[47,29], S[29,47], O[11,29]
- 3D: rose rotaciona com câmera via `updateCompass3D()` usando `pos = { N, L, S, O }`

---

## Véu branco no 3D

Plano `MeshBasicMaterial` branco (`opacity:0.35`, `depthWrite:false`) adicionado ao `satGroup` em `y=0.002` — fica entre o satélite (y=−0.03) e a grama (y=−0.025). Mesmo efeito do `L.rectangle fillOpacity:0.35` do 2D.

---

## Classes CSS relevantes

| Classe | Uso |
|---|---|
| `.scene3d` | Container da cena Three.js (height: 100% do card) |
| `.scene3d-toolbar` | Barra de botões (topo direito da cena) |
| `.scene3d-hud` | HUD de horário/mês (base esquerda) |
| `.scene3d-compass` | Bússola 58px circular — usada em **ambos** 2D e 3D |
| `.map-legend-ov` | Legenda do mapa 2D (overlay bottom-left) |
| `.dim-txt` | Label de cota de afastamento 2D |
| `.rlbl` / `.rlbl-nome` / `.rlbl-dim` / `.rlbl-area` | Label de cômodo |
| `.flbl` | Label de móvel |
| `.zlvl-far` / `.zlvl-near` | Visibilidade por zoom |
| `.zoom-indicator` | Indicador de zoom (bottomleft Leaflet) |

---

## Financiamento — referência

O V1 é compatível com **Caixa FGTS/SFH** (construção em terreno próprio):
- 44 m² > mínimo de 36 m² ✓
- 1 quarto suficiente no SFH
- Área de serviço coberta com tanque — **requisito Caixa atendido** ✓
- Exige PCI assinada por engenheiro/arquiteto antes da liberação do crédito

---

## Estado atual das versões

| Versão | 2D | 3D |
|---|---|---|
| **V1** | ✅ Completo | ✅ Completo (com cotas 3D) |
| **V2** | 🔶 Garagem parcial (paredes sul/norte/leste ✅, portão ⬜, cotas ⬜) | 🔶 Estrutura completa (colunas/vigas/laje/escada/paredes ✅, portão ⬜) |
| **V3** | ⬜ 2º pavimento a desenhar | ⬜ Placeholder |

---

## Próximos passos — V2

### V2 — Garagem
Adicionar no bloco `if (v === 'v2' || v === 'v3')` em `buildLayers`:
- Garagem prevista: **mN 1,5→8,5, mE 14→22** (7×8 m = 56 m²)
- Paredes externas da garagem (EW=0,20)
- Portão (mE=14, mN ~3→6): tipo `glassdoor` ou portão de aço
- Piso de concreto diferenciado
- Ativar cena 3D no V2: substituir placeholder por `<div id="scene3d-v2" class="scene3d">…</div>` + botão laje

### V3 — Sobrado
Adicionar no bloco `if (v === 'v3')`:
- 2º pavimento sobre a laje do V1
- Suíte master (leste), quartos filhos (norte), home office (oeste)
- Escada de acesso (a definir: interna ou externa)

---

## Pendências conhecidas

- [ ] `@media print` para memorial imprimível
- [ ] Dados da M² Engenharia (CREA) para incluir no app
- [ ] Acabamentos por fase (piso, esquadrias, cobertura)
- [ ] V2: portão oeste da garagem (mE=GE0=13, abertura p/ carros ~5 m, tipo glassdoor ou aço)
- [ ] V2: cotas 2D/3D da garagem (`dimLine`, `buildDims3D`)
- [ ] V2: ativar cena 3D completa (substituir placeholder por `<div id="scene3d-v2" class="scene3d">`) + botão laje
- [ ] V3: desenhar 2º pavimento no 2D + ativar cena 3D + escada de acesso (interna ou externa a definir)
- [ ] Cotas 3D de V2/V3: `buildDims3D` precisará ser parametrizado por versão
