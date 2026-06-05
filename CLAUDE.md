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
- Casa ≥ **36 m²** (serviço externa) / 39 m² (interna). Hoje **49,5 m²** ✓.
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
LOT_LAT  = -29.96308087   (ponto SW do lote — TERRENO SUL; antes -29.96296858 = lote norte)
LOT_LNG  = -51.63740784
LOT_ANGLE = -1.95         (graus — divisa SUL alinhada ao muro do vizinho sul; antes -3)

LAT_M  = 1 / 111320       (metros por grau de latitude)
LNG_M  = 1 / 96373        (metros por grau de longitude em −30°)
```

**Eixos 2D:**
- `mN` = metros para norte, 0 → 12,5 (testada sul → fundo norte)
- `mE` = metros para leste, 0 → 40 (rua/oeste → quintal/leste)
- Rua está em `mE = 0` (oeste)

**Eixos 3D:** X = mE (leste), Y = altura (cima), Z = **−mN** (norte → −Z).  
O Z é negado para não espelhar a planta (regra ENU: com Leste +X e Cima +Y, Norte vai para −Z).  
A rotação de `LOT_ANGLE` (−1,95°) é ignorada no 3D (irrelevante para a cena local).

**Função `rot(mN, mE)`** — converte metros do lote em `[lat, lng]` aplicando a rotação de `LOT_ANGLE` (−1,95°).

### Deslocamento da casa — constante `OE`

```javascript
const OE = -0.5;   // metros em mE — desloca casa+garagem p/ OESTE (frente)
```

A casa/garagem inteira está deslocada **0,5 m para o oeste** (frente/rua) em relação ao
lote. O **lote/terreno não se move** (continua mE 0→40, ancorado ao satélite).

**Como é aplicado (fonte única):** os helpers métricos (`rect`, `circ`, `wall`,
`doorArc`, `win`, `roomLabel`) **somam `OE` ao `mE`** logo na entrada — isso desloca o
desenho 2D **e** o que vai pro `GEO`, então todo o 3D extrudado do GEO (paredes, vãos,
móveis, folhas de porta) acompanha automaticamente.

**Cuidados ao mexer:**
- Helpers que chamam outro helper internamente **cancelam** o `OE` p/ não duplicar:
  `doorArc` chama `circ(hn, he - OE, …)`; `win` chama `rect(n, e - OE, …)`. O `cut`
  (closure) empurra o GEO com `e + OE` para casar o recorte 3D com a parede deslocada.
- **Geometria 3D manual** (`box3d`: embasamento, baldrame, pisos, degraus, laje/roof,
  garagem) **não passa pelo GEO** → soma `OE` explicitamente (constantes `EE0/EE1`,
  `GE0/GE1`, `e0/e1`, `be0`, `ESC_E_*`, `HE1`, e nos slabs/pisos literais).
- **Cotas** (`dimLine` 2D / `_dimLine3D` 3D): pontos sobre a parede usam o `mE`
  deslocado e o **rótulo muda** (frente: parede em mE 22,5 → cota **22 m**; fundo 10→**10,5 m**; garagem
  frente 12,5→**12 m**). Pontos na borda do lote (0, 40) e as cotas-totais (40 m, 12,5 m)
  **não mudam**.
- **Para reverter ou ajustar o deslocamento, basta mudar `OE`** — não reescrever cotas.

---

## Funções helper do mapa 2D

Todas retornam `Array<L.Layer>` — usar com `.forEach(l => lys.push(l))`.

```
rot(mN, mE)
  Converte coordenadas do lote para [lat, lng] com rotação de LOT_ANGLE (-1,95°).

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
| `wardrobeE` | Guarda-roupa com portas voltadas p/ **LESTE** (costas na parede oeste). Espelho do `wardrobe` — usado no quarto (parede oeste mE=28,5). |
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

- **Satélite dos vizinhos:** plano de ~140 m com tiles ESRI (z18, maxNativeZoom), composto num canvas via `loadSatelliteTexture()`. Singleton `satGroundMat`. Fallback verde se CORS falhar. **Rebaixado p/ y=−1,05** (`satGroup.position.y`) — abaixo do ponto mais baixo da grama em declive, p/ o plano de contexto nunca ocultar o lote. É só backdrop; a leitura do lote/casa fica correta.
- **Grama no lote (inclinada):** plano de 2 triângulos (não mais axis-aligned) seguindo `grade(mE)` — frente (mE=0) em y=0, fundos (mE=40) em y=−1,0. `side: DoubleSide`. Textura procedural nítida.
- **Saia de terra (skirt):** quads verticais nas bordas frente/sul/norte do lote, do topo `grade(mE)` até a base `−1,05`, fechando o vão até o satélite rebaixado (evita "lote flutuando"). `matSoil` marrom.
- **Piso interno:** slabs `matFloor` em `CPA−0,025 → CPA` (sobem com a CPA=0,50).
- **Contorno âmbar** do lote acompanha o declive: `grade(mE)+0,02` (frente ≈0,02, fundos ≈−0,98).

### Declive do terreno (visita) — datum, CPA e aterro

Observado na visita: **~1 m de queda em 40 m = 2,5 %**, descendo da frente (calçada) para os fundos. Constantes (perto da `CPA`):

```javascript
const SLOPE = 1.0 / 40;            // 2,5%
const grade = mE => -mE * SLOPE;   // cota natural do solo (m), datum 0 = calçada (mE=0)
```

- **Datum 0 = calçada** (frente, mE=0). Fundos (mE=40) = −1,0 m.
- **`CPA = 0,15`** — piso acabado 15 cm **acima do terreno acabado**: mesmo nível que a garagem (`GCPA=0,15`). Atende Caixa, resulta em **1 degrau** na entrada pós-aterro. No V2 a transição garagem→casa é plana (sem degrau intermediário).
- **Embasamento/aterro exposto:** as cintas do embasamento (`emSides`/`BEM`/`QEM`) descem da `CPA` até `baseBot(e,de) = grade(e+de)` — usa a borda **leste** de cada caixa (ponto mais baixo) p/ a base **nunca flutuar** (fica enterrada onde o terreno é mais alto). Mostra ~1,0–1,3 m de aterro exposto = o vão que o aterramento futuro preenche.
- **Escadas externas** (`extStairs()`, normas Caixa/NBR 9050): lances de degraus **iguais** do solo (`grade`) até a `CPA`. Espelho 16–18 cm (`NS=ceil(rise/0,18)`), piso ~0,28–0,29 m, **Blondel** 2e+p≈0,63. Porta principal (V1): 6 degraus, 1,20 m, desce p/ oeste; porta de vidro (norte): 6 degraus, 2,00 m, desce p/ o jardim; porta dos fundos (cozinha, leste): ~8 degraus, 1,0 m, desce p/ o quintal (lado baixo do declive → lance mais alto). Direções suportadas: `'W'`/`'E'`/`'N'`. No **V2** há ainda 2 degraus de transição garagem (`GCPA=0,20`) → casa (`CPA=0,50`) na porta principal. A escada interna da garagem p/ 2º pav. (18 degraus, e≈0,176/p≈0,278) já era compliant (lance de 3,16 m < 3,20 m sem patamar).
- **Cota 3D `declive 1,0 m (2,5%)`** (ciano) no canto fundo-sul, em `buildDims3D`.
- As cotas de afastamento (`_dimLine3D`, Y=0,12) seguem esquemáticas/planas — não acompanham o declive (de propósito, leitura tipo CAD).

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
O extrusor de paredes (`walls.forEach`) inicia em `z=0` e vai até `CEIL3D+CPA=2,85 m`.  
O piso da garagem é `GCPA=0,15 m` (igual a `CPA=0,15 m`). No V2 casa e garagem ficam no mesmo nível — sem degrau de transição.

**Padrão correto para paredes da garagem:**
```javascript
// 2D — visual apenas; NÃO registra no GEO
lys.push(wall(n1, e1, n2, e2, 0.20, { no3d: true }));

// 3D — box manual assentado no GCPA
g.add(box3d(n - 0.10, e,       0.20, len,  GCPA, GLAJE, matWall)); // parede E-O
g.add(box3d(n,       e - 0.10, len,  0.20, GCPA, GLAJE, matWall)); // parede N-S
```

**Cotas de referência da garagem:**
- `GCPA = 0.15` — piso da garagem (15 cm acima da calçada/datum; entrada quase plana para o carro)
- `GLAJE = CEIL3D + CPA = 2.85` — teto da garagem = teto da casa
- `EW = 0.20` — espessura de parede externa (centrada: ±0,10 m em torno da linha)
- **Declive:** colunas (12) e baldrame (`gbSides`) descem da `GCPA` até `baseBot(e,de)=grade(e+de)` — assentam no terreno em declive sem flutuar (a garagem fica na frente/oeste, terreno mais alto, ~0,3–0,5 m de base exposta). Mesmo `baseBot` da casa, em escopo na `buildBuilding3D`.

**Paredes da garagem — estado:**
| Parede | mN/mE | 2D (`wall`) | 3D (`box3d`) |
|---|---|---|---|
| Sul | mN=GN0=2,0 | ✅ `no3d:true` | ✅ `GCPA→GLAJE` |
| Norte | mN=GN1=10,5 | ❌ removida (estrutura aberta) | ❌ removida |
| Leste superior | mE=GE1=22, mN 7,5→10,5 | ❌ removida | ❌ removida |
| Leste inferior | mE=GE1=22, mN 2,0→7,0 | ✅ (parede da casa, base comum) | ✅ (pipeline GEO) |
| Oeste (portão) | mE=GE0=13 | ⬜ pendente | ⬜ pendente |

> A garagem é **estrutura aberta** (colunas + laje + baldrame de perímetro). Só a parede **sul** existe; norte e leste-superior foram removidas (tinham sido adicionadas por engano). O baldrame (`gbSides`) continua nos 4 lados como fundação.

---

### Renderização

`init3D(v)` cria cena/câmera/OrbitControls/luzes/HUD **uma vez** e reconstrói o prédio a cada abertura.  
`render()` chama `init3D` quando `sec === '3d'`.  
Fallback de dimensões (W=960, H=520) + `ResizeObserver` quando container ainda sem largura.

> **V1 e V2** têm cena 3D ativa (`#scene3d-v1`, `#scene3d-v2`, ambos com botão de laje). V2 renderiza casa + garagem. **V3** ainda é placeholder (`#p-v3-3d`) — para ativar, trocar por `<div id="scene3d-v3" class="scene3d">…</div>` + botão de laje.

---

## Layout V1 — estado final ✅

### Lote
- **Tamanho:** 12,5 m × 40 m = 500 m²
- **Frente:** mE=0 (oeste/rua)

### Casa — posição no lote e área total
- **Posição real no lote:** mN 2,0→8,0 × mE 22,0→30,0 (corpo principal) + saliência quarto mE 29,5→31,0 (já com OE)
- Recuo sul: 2,0 m | Recuo norte: ~5,0 m | **Recuo frente: 22 m | Recuo fundo: ~9,5 m (cozinha) / ~8,5 m (quarto)**
- **Área total V1: ~44 m²** — enxugada de 49,5 m² p/ caber no orçamento Caixa de R$ 140k (banheiro/serviço 1,5 m + fachada oeste recuada 1 m). Acima do mínimo Caixa (36 m²).

> **Coordenadas das tabelas abaixo:** valores de `mE` são pré-`OE` (código). A posição renderizada subtrai 0,5 m. Ver seção **"Deslocamento da casa — constante `OE`"**.

### Cômodos

| Cômodo | mN | mE (código) | Dimensão | Área |
|---|---|---|---|---|
| Hall | 2,0 → 7,5 | 22,5 → 25,5 | ~3,0 m aberto | — |
| Banheiro | 2,0 → 4,5 | 25,5 → 27,0 | 1,5 × 2,5 m | 3,75 m² |
| Á. Serviço | 2,0 → 4,5 | 27,0 → 28,5 | 1,5 × 2,5 m | 3,75 m² |
| Quarto | 2,0 → 4,5 | 28,5 → 31,5 | 3,0 × 2,5 m | 7,5 m² (saliência mE 30→31,5) |
| Sala | 2,0 → 7,5 | 22,5 → 27,5 | — | ~14,5 m² |
| Cozinha | 4,5 → 8,0 | 27,5 → 30,5 | 3,0 × 3,5 m | ~10,5 m² (+ bump-out) |

> **Enxugamento p/ R$ 140k (branch terreno-sul-declive):** banheiro/serviço voltaram a 1,5 m (devolveram largura ao hall) e a **fachada oeste recuou 1 m** (mE 21,5→22,5) — hall mantém 3,0 m, sala 1 m mais estreita. Footprint −5,5 m² → menos fundação/laje p/ o futuro 2º piso (V3). Quarto e cozinha intocados.

### Mobiliário — Banheiro (1,5×2,5, mE 25,5→27,0)
- Box chuveiro (`shower`): mN 2,05→3,05, mE 26,00→27,00 — canto SE, 1,0×1,0 m
- Vaso (`toilet`): mN 3,20→3,62, mE 26,45→26,90 — parede leste (mE=27,0)
- Bancada/cuba (`lavatory`): mN 4,13→4,45, mE 25,55→26,50 — parede norte, 0,95 m de largura

### Mobiliário — Área de Serviço (1,5×2,5, mE 27,0→28,5)
- Tanque (`tank`): mN 2,15→2,65, mE 27,05→27,55 — parede sul, sob janela de ventilação
- Máquina de lavar: mN 2,15→2,65, mE 27,65→28,15 — ao lado do tanque, parede sul
- Despensa/armário alto: mN 2,80→3,35, mE 27,95→28,40 — canto NE (contra parede leste, livre da porta)

### Mobiliário — Quarto (3,0×2,5, mE 28,5→31,5)
- Cama (`bed`): mN 2,60→4,50, mE 29,90→31,30 — pé p/ sul, cabeceira ao norte; deslocada p/ leste (livra a porta)
- Guarda-roupa (`wardrobeE`, portas p/ leste): mN 2,10→3,30, mE 28,60→29,15 — parede oeste, abre p/ dentro do quarto

### Mobiliário — Sala (parede oeste recuou p/ mE 22,5)
- Rack (`rack`): mN 5,15→6,55, mE 22,65→23,00, h=0,50 m — parede oeste
- TV (`tv`): mN 5,30→6,40, mE 22,60→22,65 — painel na parede
- Sofá (`sofa`): mN 4,975→6,725, mE 24,20→25,05, h=0,75 m — frente p/ TV (oeste)
- Mesa de centro (`coffee`): mN 5,35→6,35, mE 23,40→23,95

### Mobiliário — Hall de entrada (canto SO, aberto à sala)
- Estante divisória vazada (`shelf`): mN 3,83→4,18, mE 23,35→24,85, h=1,80 m
- Sapateira/console (`rack`): mN 2,10→2,45, mE 23,90→24,85, h=0,85 m — parede sul
- Tapete entrada (`rug`): mN 2,80→3,80, mE 23,45→24,40

### Mobiliário — Cozinha em U (mE 27,5→30,5)
O cozinheiro fica no "poço" central e acessa fogão/pia pela parede norte; a geladeira fecha o leste; a península fecha o oeste (encosto do canto alemão). Passagem sala→cozinha em mN 4,5→5,8.
- Bancada norte (`counter`): mN 7,35→7,90, mE 27,75→30,40 — segmentada (vãos fogão e pia)
- Península O (`counter`): mN 5,80→7,35, mE 27,75→28,50 (prof. 0,75)
- Fogão (`stove`): mN 7,35→7,90, mE 28,60→29,15
- Coifa (`hood`): mN 7,45→7,90, mE 28,50→29,25, z3d=1,55 — parede norte, fora da linha de visão da TV
- Pia (`sink`): mN 7,35→7,90, mE 29,35→29,90 — sob a janela-fita
- Geladeira (`fridge`): mN 6,20→6,85, mE 29,95→30,50, h=1,70 — parede leste (mE=30,5)
- Aéreos norte (`wallcab`): mE 27,80→28,50 e mE 29,25→29,90, z 1,50→2,30
- Coluna geladeira (`wallcabW`): mE 29,95→30,50, z 1,50→2,30

### Mobiliário — Canto alemão (refeição, parede norte)
Banco em **L** maior (cozinha cresceu 0,5 m p/ leste, liberando espaço). Passagem sala→cozinha ao sul (mN<5,80).
- Banco norte: mN 6,95→7,40, mE 25,55→27,75 — assento p/ sul (2D `rect{no3d}`)
- Banco leste: mN 5,80→7,40, mE 27,30→27,75 — encosto na face O da península (2D `rect{no3d}`)
- Driver 3D (`benchcorner`): bbox mN 5,80→7,40, mE 25,55→27,75, h=0,85
- Mesa (`table`): mN 5,95→6,85, mE 25,65→27,10
- 2 cadeiras (`chair`): (mN 5,75; mE 26,05) e (mN 5,75; mE 26,80)

### Portas

| Porta | Tipo | Hinge | Swing |
|---|---|---|---|
| Principal | madeira | mN=2,30, mE=22,5 | −1 (leste) |
| Banheiro | madeira | mN=2,90, mE=25,5 | −1 (leste) |
| Á. Serviço | madeira | mN=4,50, mE=28,20 | +1 (sul) |
| Quarto | madeira | mN=4,50, mE=28,90 | +1 (sul) |
| Porta grande sala esq | **vidro** (glassdoor, 1,0 m) | mE=22,70, mN=7,5 | +1 (norte) |
| Porta grande sala dir | **vidro** (glassdoor, 1,0 m) | mE=24,70, mN=7,5 | −1 (norte) |
| Fundos | madeira | mN=4,70, mE=30,5 | +1 (oeste) |

### Janelas (centradas e proporcionais ao ambiente)

| Janela | Parede | mE ou mN (centro) | Largura |
|---|---|---|---|
| Banheiro | Sul (mN=2,0) | mE 25,85→26,65 | 0,80 m |
| Á. Serviço | Sul (mN=2,0) | mE 27,35→28,15 | 0,80 m |
| Quarto (sol manhã) | Leste (mE=31,5) | mN 2,65→3,85 | 1,20 m |
| Quarto (cruzada) | Sul (mN=2,0) | mE 29,40→30,60 | 1,20 m |
| Sala/hall | Sul (mN=2,0) | mE 23,40→24,60 | 1,20 m |
| Sala | Norte (mN=7,5) | mE 25,20→27,00 | 1,80 m |
| Cozinha (fita) | Norte (mN=8,0) | mE 28,20→29,80 | 1,60 m — peitoril 0,90 / verga 1,50 |

> **Ventilação cruzada:** quarto (sul + leste) · sala/living (sul + norte/porta de vidro) · cozinha (fita norte + abertura p/ sala).

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
- 49,5 m² > mínimo de 36 m² ✓
- 1 quarto suficiente no SFH
- Área de serviço coberta com tanque — **requisito Caixa atendido** ✓
- Exige PCI assinada por engenheiro/arquiteto antes da liberação do crédito

---

## Estado atual das versões

| Versão | 2D | 3D |
|---|---|---|
| **V1** | ✅ Completo | ✅ Completo (cotas 3D + declive/aterro) |
| **V2** | 🔶 Garagem parcial (paredes sul/norte/leste ✅, portão ⬜, cotas ⬜) | ✅ Cena ativa: casa + garagem (colunas/vigas/laje/escada/paredes ✅, base seguindo o declive ✅; portão ⬜) |
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
