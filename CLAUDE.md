# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Metodologia de trabalho — LER E SEGUIR EM TODA SESSÃO

Esta é a forma de trabalho que produziu resultados aprovados pelo cliente. Replicar.

### 1. Incremental, com commits granulares e fluxo de deploy

#### A. Início de cada conversa — criar feature branch
**Regra obrigatória:** ao iniciar qualquer mudança no código, criar uma feature branch **antes** do primeiro commit:
```bash
git checkout -b <nome-descritivo>   # ex: feat/janela-quarto, fix/zfight-laje
```
Nunca commitar direto na `main`.

#### B. Durante o trabalho
- **Uma mudança lógica = um commit separado**, mensagem descritiva em pt-BR + `Co-Authored-By`.
  Isso dá **rollback granular**: o cliente reverte só o que não gostou sem perder o resto.
- O cliente pediu explicitamente "faz um de cada vez" — não empacotar mudanças não relacionadas.

#### C. Quando o cliente disser "concluído" — merge, deploy e limpeza
Executar **exatamente nesta sequência**, sem pular etapas:

```bash
# 1. Merge na main (--no-ff preserva o histórico da branch)
git checkout main
git merge --no-ff <nome-da-branch> -m "merge: <descrição>"

# 2. Push para origin/main → dispara deploy automático no Vercel
git push origin main

# 3. Apagar branch local
git branch -d <nome-da-branch>

# 4. Apagar branch remota (se tiver sido publicada)
git push origin --delete <nome-da-branch>

# 5. Apagar TODAS as outras feature branches locais e remotas que sobraram
git branch | grep -v "main" | xargs -r git branch -d
git fetch --prune   # limpa referências remotas mortas no local
```

**Confirmar ao cliente:** "Branch `<nome>` mergeada na `main`, push feito (Vercel vai fazer deploy), branches apagadas."

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
- **Herança de versões:** mudança no V2 (garagem etc.) → aplicar no bloco `v2 || v3`. Mudança
  só do V3 → bloco `v3`. Nunca aplicar em só uma versão quando a funcionalidade existe em versões superiores.
- Após editar JS: **Ctrl+Shift+R** (Leaflet e Three cacheiam).
- Z-fight: hierarquia de `polygonOffset` — `matEmbase` (sem offset) > `matWall` (factor:1/units:4) > `lajeMat` (factor:2/units:8). Colunas sempre vencem paredes, paredes sempre vencem vigas/laje.

---

## Como rodar

```bash
npx serve -p 3131 . --single
```

Acesso: http://localhost:3131  
Config em `.claude/launch.json`.

> **`--single` é obrigatório:** o app usa rotas resolvidas no cliente (`/v2` → V2,
> `/v3` → V3, `/v3.1` → V3.1, `/v3.2` → V3.2, `/v1.1` → V1.1, `/v0.1`…`/v0.5` → V1 numa
> **fase da obra** (3D), `/` ou qualquer outra → V1). Sem o modo SPA, o `serve` devolve **404**
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
- Section nav sticky → Planta 2D / Planta 3D / **Medidas**
- 9 painéis (`p-v1-2d`, `p-v1-3d`, `p-v1-med`, `p-v2-2d`, `p-v2-3d`, `p-v2-med`, `p-v3-2d`, `p-v3-3d`, `p-v3-med`) — só um visível por vez
- **A aba Detalhes foi removida** (V1, V2, V3) — todo o CSS/JS de detalhes editáveis também foi removido
- **Marcadores de engenharia removidos do 2D**: colunas vermelhas (`col()`), esperas V3 (roxo), ferragens/consolo V2 (azul/âmbar), junta de dilatação. A estrutura 3D (vigas, colunas embutidas) permanece intacta.

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
const OE = -3.5;   // −3,5 m: casa encostada na garagem (GE1=22,5 exibido=19,0)
```

A casa/garagem inteira está deslocada **3,5 m para o oeste** em relação ao lote.
O **lote/terreno não se move** (continua mE 0→40, ancorado ao satélite).

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
  `GE0/GE1`, `e0/e1`, `be0`, `ESC_E_*`, `HE1`, e nos slabs/pisos literais). O **chão da
  casa no 2D** (polígono branco do bloco base) também soma `OE` (`rot(…, 22,5+OE)` …
  `30+OE`) — senão o piso fica para trás quando o `OE` muda.
- **Cotas** (`dimLine` 2D / `_dimLine3D` 3D): endpoints sobre a parede e o **rótulo** são
  **calculados a partir do `OE`** (helper `fmtM`): frente = `22,5+OE` (V1) ou `13,5+OE`
  (garagem V2+); fundo = `40−(30+OE)`; laterais coladas na face oeste (`22,5+OE`) com valor
  fixo (recuo N-S não depende do OE). Pontos na borda do lote (0, 40) e as cotas-totais
  (40 m, 12,5 m) **não mudam**.
- **Para ajustar o deslocamento, basta mudar `OE`** — chão da casa, carros e **todas as
  cotas (2D e 3D) acompanham automaticamente** (posição e valor). Não reescrever cotas.

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
  opts.z0 = base da parede no 3D (padrão 0 = datum/calçada). Use p/ paredes que
    assentam num piso elevado — ex.: depósito da garagem sobre GCPA=0,15 (senão a
    base começa em z=0 e atravessa a fundação/baldrame).

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

### Regra de herança entre versões

**Toda alteração deve ser aplicada na versão alvo e em todas as versões superiores:**

| Alteração em | Deve refletir em |
|---|---|
| Base comum (térreo) | V1, V2 e V3 (automático — é o mesmo bloco) |
| `if (v === 'v2' \|\| v === 'v3')` | V2 e V3 |
| `if (v === 'v3')` | só V3 |

**Exemplos práticos:**
- Mudança na garagem (introduzida no V2) → aplicar no bloco `v2 || v3`, não só em `v2`.
- Nova janela no 2º piso → só no bloco `v3`.
- Correção de parede do térreo → base comum, já propaga para todos.

**Antes de commitar:** abrir as 3 versões e conferir se a mudança aparece/não aparece onde deveria.

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
     - `type:'window'` → vidro fixo entre peitoril e verga (padrão 1,0→2,1; customizável via `opts.sill`/`opts.head` no `win()`) + batente + peitoril saliente + **grade de caixilho** (montantes + travessas, ~0,55 m por pano, cor `matFrame`). Mesmo formato de grade no 2º piso (`winGrid`) — estilo único em todas as janelas (V1/V2/V3).
     - `type:'door'` → abertura vazia + batente + folha de madeira abrindo pelo swing do `doorArc`.
     - `type:'glassdoor'` → abertura vazia + batente + soleira. O vão é preenchido por um `rect{m3d:'slidingdoor4'}` (porta de correr 4 painéis, frame preto, divisória horizontal) ou por `doorArc{glass:true}` (folhas de vidro abatíveis — não usado na sala norte desde a troca para correr).
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
| `car` | **Carro** (referência de escala no piso da frente, V2+): carroceria + cabine de vidro + teto + 4 rodas (cilindros eixo N-S) + faróis/lanternas. `dn`=largura (~1,8 m), `de`=comprimento (~4,5 m); **frente aponta p/ LESTE** (+mE). `s.color` = cor da lataria. Assenta na base do piso (CPA=0,15 = topo do acesso GCPA). Não é parte da casa — só dimensiona o pátio/manobra. **Só no V2** (gate `if (v==='v2')` dentro do bloco da garagem): V3/V3.1/V3.2 são renders finais e V4 é a linha do tempo da obra, sem carros. |

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
Grupo `roof` = **fascia do beiral** (banda de 25 cm pendurada sob a laje, `fbb=CEIL3D+CPA−0,25
→ fbt=CEIL3D+CPA+0,16`, `BT=0,08`, faces sul/norte/leste) + laje (`CEIL3D+CPA → +0,16`) +
platibanda/mureta em **4 lados** (`pb=CEIL3D+CPA+0,16 → pbTop+0,42`, `tt=0,12`). Começa oculta.  
A **fascia + platibanda** fecham o beiral num plano vertical limpo: a platibanda esconde o
topo da casa/laje e a fascia é o **acabamento inferior (pingadeira)** que protege a parede da
chuva. É a réplica do `addBorda` do V4 (laje 1) — V1 e V4 têm o mesmo acabamento de beiral.
Oeste = junta de dilatação → no **V1 standalone** tem **platibanda** (igual ao V4), mas **sem fascia** (laje rente à parede). **Quando a garagem está anexada (V2/V3/V3.1/V3.2)** a borda oeste deixa de ser exposta — a laje da casa encontra a laje da garagem na junta e as duas leem como uma **superfície contínua**, então a platibanda oeste é **suprimida** (gate `if (!hasGarage)`, `hasGarage = rv∈{v2,v3,v31,v32}`).  
Toggle: botão "Laje: oculta/visível" via `set3DRoof(v, btn)`.

**Platibanda da garagem (V2 e V3):** gate `if (!SOLAR)` → platibanda no perímetro
**exposto** (sul/norte/oeste) + trecho leste-norte além da casa. Na junta com a casa
(leste, mN ≤ `n1`=7,5) fica **rente, sem platibanda** (lajes encostadas); só o trecho
norte exposto (mN `n1`→`gn1`) leva platibanda na leste, parando na boneca da coluna NE
(`ePN = GN1 − COL/2 − 0,12`). No **V3** a mesma laje é o teto do 2º piso.

**Junta casa↔garagem (V2/V3):** as duas lajes ficam no mesmo nível e se encontram **rente
na junta de dilatação, sem mureta e sem vão entre elas**. A borda oeste da casa vai até a
**linha da junta `GE1j = 22,5 − EW/2 − GAP = 22,37 + OE`** (= face leste da garagem) em
**todas as lajes**, encostando rente — sem beiral oeste, sem fresta, sem sobreposição:
- **Teto** (laje plana não-SOLAR, **inclusive V1**): a borda oeste vai SEMPRE até a junta
  (`eW = 22,37 + OE`), **sem beiral nem platibanda oeste**. (Antes `e0=22,0` cavalgava a
  garagem → platibandas transpostas; depois `e0=22,4` deixou 3 cm de vão; agora `22,37`
  encosta rente.) **O V1 não tem mais beiral oeste** — a laje termina rente à parede, p/ a
  expansão V2 (junta com a garagem) ser possível. `e0 = 22,5 − BN_EW + OE` sobrou só para
  o telhado solar (`addShed`), que mantém o beiral oeste próprio.
- **Laje 1** (intermediária, `floor2` V3/V3.1/V3.2 **e V4**): a laje da casa começa em `Egar`
  (= junta), sem beiral oeste. No **V4** a mureta de perímetro inclui o oeste **na junta**
  desde a fase da laje (fase 4) — não há mais o trecho de beiral oeste simétrico (mE 22,0)
  que existia só enquanto a casa era standalone.

### Bugs resolvidos / armadilhas conhecidas

| Bug | Causa | Solução |
|---|---|---|
| Z-fight base de janelas | `win()` criava `rect('#fafafa')` capturado como sólido 3D | `no3d:true` no rect de fundo da janela |
| Porta parecendo fechada e aberta | Grade de caixilho gerada no vão fechado da glassdoor | Removida a grade do vão; ela existe só nas folhas |
| Z-fight piso × parede | Piso slab face externa coplanar com parede exterior | Piso insetado 1 cm das faces interiores |
| Paredes z-fight chão | Paredes começando em y=0 coplanar com topo do piso | `seg()` usa `z0adj=-0.01` quando `z0≤0` |
| Parede do depósito atravessando a fundação (V2/V3) | Paredes do depósito iam pelo pipeline GEO (sempre de z=0); piso da garagem é GCPA=0,15 → 15 cm de parede abaixo do piso, dentro do baldrame | `wall(..., {z0:0.15})` + pipeline usa `base=w.z0` nos `seg()` (assenta no piso) |
| Cabeceira dentro da parede | Cama terminava em mN=4,50 = face da parede | GAP=7 cm: cama vai até mN 4,43 |
| Vidro bloqueando luz | MeshStandard transparente ainda projeta sombra | `castShadow=false` em todos os vidros |
| Z-fight coluna×viga/parede | `matEmbase` (col.) e `matWall`/`lajeMat` têm faces coplanares (mesma mE, mN ou y=GLAJE) | `polygonOffset: true, factor:1, units:4` em `matWall` e `lajeMat` — colunas sempre vencem |

### Regra: `polygonOffset` — Z-fight entre materiais coplanares

Hierarquia de prioridade (quem aparece na frente quando faces são coplanares):

| Material | offset | Prioridade |
|---|---|---|
| `matEmbase` (colunas, baldrame) | nenhum | **1º — sempre vence** |
| `matWall` (paredes) | factor:1 / units:4 | 2º |
| `lajeMat` (vigas, laje, platibanda) | factor:2 / units:8 | 3º |

**Regra:** toda nova geometria deve herdar o offset do seu "tipo". Se criar novo material coplanar com `matEmbase`, adicione o offset de `matWall`. Vigas e laje nunca devem ter o mesmo offset de `matWall` (causa z-fight).

Situações cobertas:
- Face de coluna × face de parede (mesma mE ou mN) → coluna vence ✓
- Face de viga × face de parede (VW=EW=0,20 m, mesma posição) → parede vence ✓
- Topo de parede × topo de coluna (mesmo y=GLAJE) → coluna vence ✓

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

> **V1, V2 e V3** têm cena 3D ativa (`#scene3d-v1`, `#scene3d-v2`, `#scene3d-v3`). V2/V3 renderizam casa + garagem. **V3** tem 2 botões: `2º piso` (`set3DFloor2`) + `Laje` (`set3DRoof`) — ver seção "V3 — Sobrado (pilotis)".

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
| Porta sala norte | **correr 4 painéis** (`slidingdoor4`, 2,0 m) | mE 23,00→25,00, mN=7,5 | fechada; frame preto; divisória horizontal no meio |
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
| Cozinha (fita) | Norte (mN=7,5) | mE 29,20→30,80 | 1,60 m — peitoril 1,00 / verga 1,60 — alinhado com a sala (sill=1,0) |

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
- Afastamentos V1 (branco): frente 19m, fundo 13,5m, sul 2m, norte 5,0m
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
- ~44 m² > mínimo de 36 m² ✓ (área interna líquida; footprint externo 49,5 m²)
- 1 quarto suficiente no SFH
- Área de serviço coberta com tanque — **requisito Caixa atendido** ✓
- Exige PCI assinada por engenheiro/arquiteto antes da liberação do crédito

---

## Estado atual das versões

| Versão | 2D | 3D | Medidas |
|---|---|---|---|
| **V1** | ✅ Completo | ✅ Completo (cotas 3D + declive/aterro + **esperas p/ V3**, botão revelar) | ✅ Completo |
| **V2** | 🔶 Garagem parcial (paredes sul ✅, portão ⬜, cotas ⬜) | ✅ Casa + garagem (colunas/vigas/laje/escada ✅; portão ⬜) + **esperas p/ V3** | ✅ Preenchida (garagem + depósito + escada) |
| **V3** | 🔶 Sobrado — botão alterna térreo ↔ 2º piso (laje + paredes ext. em L) ✅; interno do 2º ⬜ | 🔶 Cena ativa: térreo + 2º piso togglável + laje que sobe sobre o 2º ✅; interno do 2º ⬜ | ⬜ Placeholder |
| **V3.1** | 🔶 Herda o 2D do V3 (mesmo `v3Layers`) | ✅ Herda o sobrado do V3 + **2 telhados de uma água reais (norte ~12°, com empenas) e usina FV** no lugar da laje plana | 🔶 Placeholder com resumo do telhado |
| **V3.2** | 🔶 Herda o 2D do V3.1 | ✅ Herda o V3.1 + **pintura da casa em marrom** (`WALL_TINT` tinge o `matWall` só p/ `v32`) | 🔶 Placeholder com resumo |
| **V3.3** | 🔶 Herda o 2D do V3.2 (mesmo `v3Layers`) | ✅ Herda **tudo do V3.2** + **sistema de calhas/escoamento** (calha no beiral norte → descida no canto NO → condutor à rua) — só `v33` | 🔶 Placeholder com resumo do escoamento |
| **V3.4** | 🔶 Herda o 2D do V3.3 + **área gourmet/churrasqueira** no quintal leste (`buildChurras2D`, só `v34`) | 🔶 Herda **tudo do V3.3** (calhas inclusas) + **área gourmet 3D** (deck + parede sul + churrasqueira c/ chaminé + bancada/pia + mesa com bancos + telhado de uma água) — só `v34` | 🔶 Placeholder com resumo |
| **V4** | 🔶 Herda o 2D do V3.2 (mesmo `v3Layers`) | ✅ Herda **tudo do V3.2** + **slider 🏗 de obra com 20 fases na ordem cronológica real** (V1 → cobre esperas → V1.1 muro → V2 garagem → V3 sobrado → pintura) | 🔶 Placeholder com resumo |
| **V0.1–V0.6** | — | ✅ **Fases da obra do V1** (timeline construtiva) — não é versão nova, é o V1 revelado por fase | — |

---

## Fases da obra (V0.1–V0.6) — timeline construtiva do V1

Não são casas novas: é **o V1 (default) revelado fase a fase**, terminando exatamente
no V1 completo. Tudo é o mesmo `buildBuilding3D('v1')` — só muda **o que fica visível**.

**Mecânica (fonte única):** dentro de `buildBuilding3D`, `g.add` é envolto por um override
que **carimba cada objeto com `userData.ph`** (a fase em que ele "existiria" na obra),
lido de uma variável `_ph` setada antes de cada seção. `g.add` é **restaurado ao original
antes de `buildDims3D`** (cotas ficam sem carimbo → sempre visíveis).

| `ph` | Fase | O que entra |
|---|---|---|
| 0 | entorno (sempre visível) | satélite, grama, saia de terra, contorno do lote |
| 1 | **Fundação** | baldrame (`emSides`), manta, contrapiso, escadas externas |
| 2 | **Colunas** | 12 pilares 15×15 (`matEmbase`) |
| 3 | **Vigas** | grade de vigas (`lajeMat`, bloco `VH/VW`) — **sem** a laje plana |
| 4 | **Laje** | laje plana (grupo `roof`) cobrindo as vigas — sem geometria com `_ph` próprio |
| 5 | **Paredes** | `walls.forEach` (alvenaria com vãos recortados) |
| 6 | **Esquadrias** | batentes, peitoris, vidros, folhas de porta |
| 7 | **Acabamento** | mobiliário (`solids`/`FURN3D`) = **V1 completo** |
| `null` | cotas (`buildDims3D`) | sempre visíveis |

- **`applyBuildPhase(v)`** (estado `buildPhase`, default 7): oculta o que tem `ph > buildPhase`.
  Só age no **V1**; outras versões sempre completas (ignoram o carimbo). A **laje** (`roof`)
  aparece da fase **4 (Laje) até 6 (Esquadrias)** e some no acabamento (7) — espelha o default
  do V1 (laje oculta p/ ver o interior). Chamado em `init3D` após `buildBuilding3D`.
- **Slider 🏗 no HUD 3D** (só V1, em `buildHud3D`): `.phase-hud`, range 1–7, empilhado acima
  do HUD de horário. Arrastar = `buildPhase = valor` + `applyBuildPhase`.
- **Rotas `/v0.1`…`/v0.6`** (`PHASE_ROUTES`, `phaseFromPath`): `versionFromPath` devolve `'v1'`;
  o boot abre direto em **Planta 3D**, mantém `/v0.x` na barra e seta `buildPhase`. Clicar numa
  **aba** (`setVersion` com `push=true`) volta à casa completa (`buildPhase=7`); **popstate**
  respeita a fase da rota. `applyBuildPhase` re-sincroniza o slider quando a fase muda por URL.
- **Ao adicionar nova geometria 3D ao V1:** setar `_ph` antes da seção (ou ela herda a fase
  anterior). Geometria de garagem/V2+/floor2 não precisa — fora do escopo do filtro de fase.

### Esperas (arranques do sobrado V3) — V1/V2

Para o V3 (sobrado) ser possível, os pilares do térreo deixam **ferros de espera**
(arranques) projetados acima da laje, dando continuidade estrutural ao pilar do 2º pav.
(`col2c`/`col2`, que começam em `fz0=3,01`). Construídos só no **V1/V2**; no **V3** não
existem — ficam **embutidos** no pilar de cima.

- **Casa:** 12 pilares, no **V1 e V2** (`bv` v1/v2, `!SOLAR`).
- **Garagem:** 12 pilares, **só no V2** (no V3 a garagem vira pilotis e os arranques ficam
  embutidos no `col2`). Total no V2 = **24 esperas** (96 grupos de barra + 24 bonecas).
- **Helper único** `addEspera(cn, e3)` (`cn`=centro mN, `e3`=centro mE já com OE): a casa
  chama no bloco do `roof`; a garagem chama no bloco `if (v==='v2'||…)` (consts `GE0/GEMc/
  GE1c/GN0/GNM/GN1/COL` em escopo). `box3d` dos pilares da garagem é por **canto** → centro
  = `n+COL/2, e+COL/2`. `null` quando a versão não tem esperas.

- **Restrição Caixa:** o V1 é financiado e a Caixa **não aceita ferro de obra aparente**.
  Solução real: o ferro fica embutido numa **boneca de concreto** (`esperasCaps`) sobre a
  laje (casa com cara de pronta); o botão **"Esperas: revelar"** "demole" a proteção e expõe
  o ferro (`esperasBars`) — "na hora certa" de puxar o andar.
- **Geometria** (no grupo `roof`, após o slab; herdam a visibilidade da laje): por pilar,
  4 barras nos cantos (±0,07, Ø~24, sobem 0,45 m do topo do pilar `CEIL3D+CPA=2,85`) com
  dobra no topo + 1 boneca `box3d` 0,24×0,24 (`matEmbase`) cobrindo. Posições = mesmo grid
  das colunas (mE 22,5/25,5/28,5/31,5 × mN 2/4,5/7,5, `+OE`).
- **Visibilidade** (`applyBuildPhase`): ferro cru nas **fases de obra** (`ph<7`) ou quando
  **revelado**; **capeado** (boneca) no **acabamento** (`ph≥7`) e não-revelado. Como são
  filhos de `roof`, só aparecem com a **laje visível** — por isso `roof.visible` no V1 passa
  a incluir `(ph≥7 && espRevealed)`, e `set3DEsperas` força a laje ligada + sincroniza o
  rótulo do botão Laje. Flag `S.espRevealed` (por cena). Botão em V1/V11/V2.

---

## Próximos passos

### V2 — Pendências
- Portão oeste da garagem (mE=GE0=13,5; abertura ~5 m; tipo glassdoor ou aço)
- Cotas 2D/3D da garagem (`dimLine` + `buildDims3D` parametrizado por versão)

**Garagem já implementada:** `GN0=2,0 / GN1=10,5 / GE0=13,5 / GE1=22,5` → 8,5×9,0 m = 76,5 m²  
Depósito sob escada: mN 2,0→3,4 × mE 13,5→15,9 (1,4×2,4 m ≈ 3 m²)  
Escada: 18 degraus, 1,20 m largura, leste→oeste (mE 20,9→15,9 code)

### V3 — Sobrado (pilotis)

**Etapa 1 (feita):** 2º pavimento = **só laje + paredes externas**, em **DUAS estruturas
independentes** (como o térreo): **garagem** (mN 2→10,5 × mE 13,5→GE1j) + **casa**
(mN 2→7,5 × mE 22,5→31,5), separadas pela **MESMA junta de dilatação do V2** (GE1j =
22,5 − EW/2 − GAP = **22,37**; isopor 3 cm até a face oeste da casa em 22,40). NÃO
extrapola o terreno (canto NE/pátio fora). Garagem vira **pilotis**. Sem divisórias internas.

**Padrão das paredes (alinhamento):** face externa de cada parede do 2º piso = face da
estrutura do térreo abaixo. Casa segue a face das **paredes** (centradas → linha∓EW/2);
garagem segue a face das **colunas** (na própria linha). Mesmo padrão da parede do depósito.

**Duas lajes (nomenclatura):** **laje 1** = intermediária (teto do térreo + chão do 2º
piso), tem o **vão da escada** p/ subir; **laje 2** = teto do 2º piso, sólida (cobre tudo).

- **2D:** botão `Piso: térreo ↔ 2º pav.` (`.map-floortoggle`) chama `setV3Floor(btn)`,
  que troca `map._overlay` entre `buildLayers('v3')` (térreo) e `buildFloor2Layers()`.
  A visão do 2º piso mostra: 2 lajes (garagem + casa) + **faixa âmbar da junta "isopor
  3cm"** + 8 paredes externas + **escada + plataforma norte + cotas** (contexto). Consts
  `F2_GE1j`, `F2_WALLS` (8 centerlines), `F2_SLAB_GAR`/`F2_SLAB_CASA`. Escada e plataforma
  vêm de **`stair2D()` / `northPlat2D()`** (fonte única — usadas também no térreo V2/V3).
- **3D:** grupo `floor2` (em `buildBuilding3D`, só `v==='v3'`) = **2 estruturas** (helpers
  locais `addWall`/`addSlab`): garagem (laje 1 c/ vão recortado + 4 paredes, leste = junta
  GE1j) e casa (laje 1 sólida + 4 paredes, oeste = junta em 22,40). Gap físico de 3 cm
  entre elas. **Laje 2** = grupo `roof` (casa + garagem já separados pela junta; sólido no
  V3). `set3DFloor2(v, btn)` mostra/oculta o 2º piso **e** reposiciona a laje 2
  (`roof.position.y = visível ? CEIL3D+0,16 : 0`) — sobe sobre o 2º piso ou volta ao térreo.
- **Botões 3D:** `2º piso: oculto/visível` (`set3DFloor2`) + `Laje: oculta/visível`
  (`set3DRoof`, só alterna `roof.visible`). No **V2** a laje da garagem mantém o vão da escada.

**Estrutura do 2º piso (no grupo `floor2`, some/aparece com o 2º piso):** espelha o
térreo, com caminho de carga vertical contínuo e a junta subindo junto. **Garagem** =
12 colunas (3×3 em mN 2/6,75/10,3 + linha extra em **mN 3,40** junto à escada — todas
alinhadas ao pilotis do térreo, mE 13,5/~17,8/~22,2) da laje 1 (3,01) ao teto do 2º (5,71)
+ grelha de vigas (viga N-S central só ao NORTE da escada, reapoiada em mN 3,40 — como o
térreo); **casa** = 12 colunas nos nós da grade (mE 22,5/25,5/28,5/31,5 × mN 2/4,5/7,5,
centradas, embutidas nas paredes/divisórias — helper `col2c`) + grelha 3×3. Vigas no teto
do 2º (y 5,26→5,71, **VH=0,45** = casa térreo, VW=0,20), sustentando a laje 2. Pórticos
independentes pela junta (vigas da garagem param em GE1j, da casa em 22,5). Helpers locais
`col2`/`col2c`/`beamEW`/`beamNS`.

**Cômodos do 2º piso da casa (grade 2×3, divididos por mN 4,5 / mE 25,5 / mE 28,5):**
- NORTE (mN 4,5→7,5): **acesso** (coluna 1, mE 22,5→25,5) + **quarto da suíte** (colunas
  2+3, mE 25,5→31,5, vão único).
- SUL (mN 2→4,5): **banheiro 2º pav** (col 1) · **banheiro da suíte** (col 2) · **closet**
  (col 3).
- Divisórias internas (IW=0,10, no `floor2` 3D + `buildFloor2Layers` 2D): E-O em mN 4,5
  (mE 22,5→31,5); N-S em mE 25,5 (inteira, mN 2→7,5); N-S em mE 28,5 (só sul, mN 2→4,5).
- **Portas** (`F2_DOORS`, compartilhado 2D arcos + 3D vãos/folhas; helper 3D `intWall`
  recorta vão + verga, base no piso fz0): banheiro 2º pav→acesso (mN 4,5, abre p/ sul);
  closet→quarto (mN 4,5, **dupla**, abre p/ norte); quarto→acesso (mE 25,5, abre p/ leste);
  closet→banh.suíte (mE 28,5, abre p/ leste). Vãos centrados; simples 0,80 m / dupla 2×0,70 m.
- **Janelas** (`F2_WINDOWS`, compartilhado 2D `win` + 3D helper `winWall`: peitoril+vidro+verga,
  sill/head rel. a fz0; `matGlass` sem sombra). QUARTO: **panorâmicas** no norte (parede mN 7,5,
  2 panos entre colunas: mE 25,6–28,4 e 28,6–31,4) e leste (mE 31,5, mN 4,6–7,4), peitoril 0,40
  → viga 2,25. CLOSET: **normais** no sul (mE 29,4–30,6) e leste (mN 2,65–3,85), sill 1,0 / head 2,1.
  BANHEIROS (sul, mN 2,0): banheiro 2º pav (mE 23,5–24,5) e banheiro da suíte (mE 26,5–27,5),
  normais. **Estilo padrão** = grade de caixilho (montantes + travessas, ~0,55 m por pano),
  via `winGrid` dentro do `winWall`. **Cor `matFrame`** (creme, cor original do caixilho — não
  madeira). Mesmo formato aplicado às janelas do **térreo V1/V2/V3** (pipeline GEO) — estilo único.

**Próximas etapas:** ligação acesso↔garagem cruzando a junta; guarda-corpo no vão da
escada; uso do 2º piso da garagem; ficha de medidas V3.

### V3.1 — Sobrado com telhado solar (usina FV)

Variante do V3: **herda todo o sobrado** (2D e 3D) e **troca a laje plana por dois
telhados de uma água independentes** (casa + garagem), respeitando a **mesma junta de
dilatação** — não há cobertura emendada entre os blocos.

- **Aba/rota:** `data-v="v31"`, rota `/v3.1`, painéis `p-v31-2d/3d/med`. Cena `scenes3d['v31']`,
  mapa `maps['v31']` (genéricos por versão; nada hard-coded).
- **Herança:** todo gate `v === 'v3'` (e `v2||v3`, `v11||v2||v3`) também aceita `v === 'v31'`.
  `initMap` e `setV3Floor` usam `v3Layers()`/`maps[ver]` para o V3.1. O 2D é idêntico ao V3.
- **Bioclimática solar (lat −29,96°, hemisfério sul):** água voltada ao **NORTE** (sol).
  Inclinação **~12°** (`PITCH`) — realista para telha metálica (~21%); o ótimo solar seria
  ~28° (≈ latitude), mas 28° fica surreal numa casa, então prioriza-se o realismo (12°
  ainda colhe ~92–95% e auto-limpa com a chuva). Módulos deitam rentes.
- **3D (`buildBuilding3D`, flag `const SOLAR = (v==='v31')`):** telhado de uma água REAL
  (não é a laje plana inclinada): água de telha + 2 empenas apoiadas nas paredes.
  - `tiltedSlab(mat, n0,e0,n1,e1, yEaveN, t)` — água como **box girado** `rotation.x = −PITCH`
    em torno do eixo L-O; `yEaveN` = altura do **beiral norte** (lado baixo); sul sobe `D·tan(PITCH)`.
  - `gableEnd(mE, wn0,wn1, yBot, yTopN0,yTopN1, thk, mat)` — **empena/frontão**: parede fina
    trapezoidal (BufferGeometry) no plano `mE=cte`, do topo da parede (`yBot=yEaveN−0,16`) até a
    água (segue `PITCH`). Material `matGable` = `matWall.clone()` com `side:DoubleSide`.
  - `addShed(grp, n0,e0,n1,e1, yEaveN, wn0,wn1, we0,we1, o={})` — água (`matMetalRoof`, galvalume,
    `DoubleSide`) + 2 empenas (planos das paredes O/L `we0`/`we1`, mN `wn0..wn1`) + **grade de
    módulos FV** (`matPanel`) insetada, cada módulo girado `−PITCH`. `o` = opções da grade FV:
    `o.inset` (recuo das bordas, default 0,55; menor = adensa), `o.panW0`/`o.panW1` (limites O/L
    absolutos da grade em mE de cena, p/ recortar colunas).
  - Casa: `addShed(roof, n0,e0,n1,e1, CEIL3D+CPA+0.16, 2.0,7.5, 22.5+OE,31.5+OE)`.
    Garagem: `addShed(roof, gn0,ge0,gn1,GE1j, GLAJE+0.16, GN0,GN1, GE0,GE1j)`
    (leste para na junta GE1j; **sem platibanda** quando `SOLAR`).
  - **Beiral leste da garagem** (logo após o `addShed` da garagem): por **todo o comprimento**
    (`gn0→gn1`) a água é estendida 0,50 m a leste da empena (junta `GE1j`) com um `tiltedSlab`
    extra (`matMetalRoof`, mesma `yEaveN`/`PITCH` → coplanar e contíguo à água principal), como
    os demais beirais — protege a junta/parede em toda a extensão. Como o telhado da garagem é
    ~0,64 m mais alto que o da casa (vão maior, mN 1,5→11,4 vs 1,5→8,4), esse beiral **oversaila**
    o telhado da casa na junta (detalhe normal de telhados em degrau: o mais alto joga a água
    sobre o mais baixo). A empena leste (`gableEnd` em `we1=GE1j`) fica sob a água — é a parede;
    a água cantilevera 0,50 m além dela.
  - **Distribuição dos painéis FV (sombra da garagem na casa):** o telhado da garagem é ~0,64 m
    mais alto e fica a **oeste** da casa → de tarde, com sol baixo (<~20°, hemisfério sul), projeta
    sombra p/ **leste** sobre a faixa oeste (junta) do telhado da casa. Para concentrar a geração:
    **garagem** `{ inset: 0.45 }` (adensa, +1 coluna ≈ **40 painéis**); **casa**
    `{ panW0: 24.5 + OE }` — painéis começam 2,0 m a leste da junta, fora da sombra, só
    centro/leste (≈ **18 painéis**). Total ≈ 58 (≈ inalterado vs. antes), todos em zona sem sombra.
    No pico do dia (10–15h) a casa fica limpa de qualquer jeito; a sombra só toca a faixa nua oeste.
  - Os sheds ficam no **grupo `roof`** → `set3DFloor2` os ergue sobre o 2º piso (mesmo mecanismo
    da laje) e `set3DRoof` os alterna (botão diz **"Telhado"** quando `v==='v31'`).
  - Beiral norte 0,90 m preservado. V1/V2/V3 inalterados (laje plana nos blocos não-`SOLAR`).

**Próximas etapas V3.1:** cotas do telhado/altura de cumeeira; calha/condutores na borda norte;
ficha de medidas (área de telhado, kWp estimado); opcional realce dos módulos no 2D.

### V3.2 — Pintura da casa (marrom)

Variante do V3.1: **herda tudo** (sobrado + telhado solar) e só **pinta as paredes de marrom**.
Mesmo padrão de aba/rota/painéis (`data-v="v32"`, `/v3.2`, `p-v32-2d/3d/med`); todo gate que
aceita `v31` também aceita `v32` (incl. `SOLAR` e o `noun` do botão "Telhado").

- **Cor (3D):** `const WALL_TINT = (v==='v32') ? 0x7a5230 : 0xffffff;` aplicado no `color` do
  `matWall` (multiplica a textura de reboco `texWall()`). Como `matGable = matWall.clone()`, as
  empenas/fechamentos do telhado também ficam marrom. Embasamento/baldrame/laje mantêm a cor própria.
  Só afeta o `v32` — `matWall` é recriado por versão em `buildBuilding3D(v)`.

### V3.3 — Sistema de calhas / escoamento para a rua

Variante do V3.2: **herda tudo** (sobrado + telhado solar + pintura marrom) e acrescenta o
**sistema de calhas** que escoa a água do telhado para a **frente** (rua/boeiro a oeste, `mE=0`).
Mesmo padrão de aba/rota/painéis (`/v3.3`, `p-v33-2d/3d/med`, `<option value="v33">`); o render
**reusa o V3.2 via `rv`** — em `buildBuilding3D`, `buildLayers`, `buildDims3D` e `initMap` o
gate mapeia `v33 → v32` (igual ao V4). Botão "Telhado" inclui `v33` no `noun`.

- **Por que o telhado não cai para a rua:** o telhado solar é de **uma água caindo para o
  NORTE** (geração FV, `addShed`), perpendicular à rua (oeste). Toda a água do telhado vai para o
  **beiral norte**; quem decide frente×fundos é a **calha + condutor**, não o telhado.
- **Geometria (gate `if (v === 'v33' || v === 'v34')`, após o beiral leste da garagem, dentro de
  `if (SOLAR)`):** dois helpers locais montam o sistema por bloco (casa + garagem):
  - **`calha(nEave, gE0, gE1)`** — `box3d` ao longo do beiral norte (largura `GW=0,14` × altura
    `GD=0,13`, ~2 cm sob a água: `gutTop=eaveL−drop`, `gutBot=gutTop−GD`).
  - **`queda(nEave, gE0, gE1, dN, dE, turnE?)`** — **tubo de queda Ø110 (`PR=0,055`) numa COLUNA**
    `(dN,dE)`: conector da calha ao topo (`pipeBetween`, clamp ao vão), vertical descendo a coluna do
    beiral (~5,7 m) e **leg** N-S levando o pé ao muro (`nWall`). `turnE` (opcional) = X onde o cano
    vira p/ o muro: o trecho horizontal corre **junto à parede** (E-O, em `dN`) até `turnE` e só ali
    sobe — usado na **casa NE** p/ o cano não cruzar o caminho perto da gourmet (vai pela parede até
    a junta, `jUNTA = 22,5+OE+0,30`, e sai junto dos outros dois tubos).
  - **Tronco único Ø150 (`PR2=0,075`):** UM `pipeBetween` rente ao muro norte (`nWall=12,30`), do
    feed mais a leste (casa NE, `X=31,5+OE`) até a **sarjeta da frente** (`X=0`, rua/boeiro).
    Cota do centro `clW(e)=cl0+e·sSar` (`cl0=0,06`, `sSar=0,006`/0,6%) → topo `<GCPA=0,30` (enterrado).
- **4 tubos de queda — um em CADA extremidade de cada calha** (decidido com o cliente):
  - **Garagem:** coluna **NO** (`GN1+0,06, GE0+0,10`) + coluna **NE/junta** (`GN1+0,06, GE1j−0,10`).
  - **Casa:** coluna **NO/junta** (`7,66, 22,5+OE`) + coluna **NE/extremo leste** (`7,66, 31,5+OE`,
    com `turnE=jUNTA`) — esta desce pela coluna NE e corre **junto à parede norte** (enterrado) até a
    junta, saindo junto dos outros (pedido do cliente: não cruzar o caminho da gourmet; invisível).
  - Os 4 legs despejam no **tronco Ø150** (X 0→jUNTA), que os leva juntos pela beirada do muro à rua.
- **Dimensionamento (chuva POA, NBR 10844, i=150 mm/h; tempestade 180):** casa+garagem ≈ 461 L/min
  (553 na tempestade). O **Ø150 a 0,6%** ≈ **750 L/min** → folga ~35 % até na tempestade. (O esquema
  antigo — condutores únicos casa+garagem se unindo num só Ø110 — estourava: ~335 L/min.) Os tubos de
  queda Ø110 e as calhas (14×10) têm folga; o **tronco era o gargalo**, resolvido pelo diâmetro.
- **Tudo ABAIXO DO PISO:** o tronco corre com topo `<GCPA=0,30` (declive baixo porque a sarjeta é
  rasa; a vazão é vencida pelo Ø150, não pelo caimento) → embutido no piso/área norte, descarregando
  na sarjeta no nível da rua. As **quedas** descem do beiral (~6 m) até o tronco.
- **Plantas no chão (escondem os canos):** arbustos (esferas achatadas, verdes variados)
  assentados no **terreno** (`grade(mE)`, faixa de grama sem piso, mN ~12,3, mE 0,9→26,5) ao
  longo do muro norte, sobre o tronco. Ficam no **grupo principal `g`** (no chão — NÃO no `roof`,
  então não flutuam nem sobem com o 2º piso) e são altos o bastante p/ cobrir o cano (que sobe rumo
  ao caimento). PRNG com seed fixa → layout estável entre reaberturas. (Não há canteiro elevado.)
- **Cotas em LOCAL do `roof`** (`wl(yw)=yw−LY`, `LY=CEIL3D+0,16`): as calhas ficam no grupo
  `roof` e **sobem com o 2º piso** (`set3DFloor2`); aparecem/somem com o botão **Telhado** (`set3DRoof`).
  Otimizado para a vista do **sobrado completo** (2º piso + telhado visíveis).
- **Escoamento:** ~100% da água do **telhado** vai para a frente (rua); a água de **quintal**
  (terreno nu) continua para os **fundos** (cota −1,0 m) por gravidade. Ver `p-v33-med`.

> **Nota:** o `OE` real no código é **−5,5** (não −3,5). O bloco de calhas usa as variáveis em
> escopo (`e0/e1/ge0/GE1j`), então acompanha o `OE` automaticamente.

### V3.4 — Área gourmet / churrasqueira (quintal leste)

Variante do V3.3: **herda tudo** (sobrado + telhado solar + pintura marrom + calhas) e acrescenta
uma **área gourmet coberta** no quintal, encostada na **parede leste da casa** (cód. mE 31,6), em
volta da **porta dos fundos** da cozinha. Mesmo padrão de aba/rota/painéis (`/v3.4`, `p-v34-2d/3d/med`,
`<option value="v34">`); o render base reusa o V3.2 via `rv` (`v34 → v32` em `buildLayers`,
`buildBuilding3D`, `buildDims3D`, `initMap`) e **herda as calhas** (gate `v==='v33' || v==='v34'`).

- **Partido (decidido com o cliente):** cobertura de **alvenaria (telhado próprio)**, **encostada na
  casa** (saída da cozinha), pacote **leve** = churrasqueira c/ chaminé + bancada c/ pia + mesa com
  bancos (estilo gaúcho). Cocção na **parede SUL**; convívio aberto ao **norte/leste**.
- **Footprint:** mN 2,0→7,5 (largura COMPLETA da parede leste) × mE 31,6→36,6 ≈ **5,5 × 5,0 = ~27 m²**.
- **2D (`buildChurras2D()`, só no caminho do mapa):** `v3Layers()` anexa as camadas quando
  `ver==='v34'` e `v3floor===1` (térreo). Como `GEO` é null em `initMap`, **não vaza p/ o 3D**
  (`captureModel('v34')` → `buildLayers` remapeia p/ `v32`). Deck + contorno do telhado (tracejado) +
  parede sul (poché) + bancada/pia + churrasqueira/braseiro/grelha/chaminé + mesa E-O com 2 bancos +
  3 colunas na borda leste + `roomLabel`. Coords de CÓDIGO (helpers somam OE).
- **3D (`buildBuilding3D`, gate `if (v==='v34')`, no fim, adicionado ao grupo `g`):** fica no
  **nível do chão** → **não** sobe nem some com os toggles de 2º piso/telhado da casa.
  - **Piso:** `GFL = −0,55` (nível do quintal). Embasamento (`matEmbase`) desce de `GFL` até
    `grade(mE leste)` (cota natural mais baixa) → não flutua, igual casa/garagem; deck por cima.
  - **Telhado de uma água caindo p/ LESTE** (longe da casa): `yt(e) = yWest − slope·(e−E0)`,
    `yWest = GFL+2,95`, `slope = 0,10` (~10%), espessura `RT=0,12`, beiral 0,4 m a N/S/L (rente à
    casa a oeste). Quad extrudado por `quad8()` (BufferGeometry, 8 verts, como o `driveway`).
  - **Parede sul raked** (`quad8`, topo segue `yt(e)−RT`): encosto da cocção, fecha o lado sul.
  - **Colunas** (3, `matEmbase`) na borda leste, da `grade` ao sub-beiral leste (`yt(E1)−RT`).
  - **Churrasqueira** (corpo tijolo + braseiro + 5 barras de grelha + **chaminé** que atravessa o
    telhado + capa), **bancada com pia** (cuba + torneira), **mesa E-O** (tampo + 4 pernas) + **2
    bancos** (assento + pernas). Helpers locais `fb`/`fc` = `fbox`/`fcyl` com OE embutido.
- **Helpers/coords:** `quad8(verts, mat)` monta um sólido extrudado a partir de 8 vértices (mesmas 12
  faces do `driveway`). Cota `y` independe do OE (a inclinação é E-O, OE cancela em `yt`); só o `X(e)=
  e+OE` desloca em mE.

**Escoamento + paisagismo da lateral norte (V3.4, no bloco das calhas `v33||v34`):**
- **Ligação da gourmet ao tronco:** o telhado da gourmet cai p/ LESTE → **calha no beiral leste**
  (baixo) + **tubo de queda Ø110 na coluna NE** (face leste, `gE1+0,10`, **aparente**) descendo até
  o tronco; **leg** N-S até o muro. Só no V3.4 o **tronco Ø150 estende** até a gourmet (`xEast=38+OE`);
  no V3.3 para na junta. O cano fica **~1 m acima do gramado** ali (terreno cai pros fundos, cano cai
  pra rua) — daí o paisagismo o esconder.
- **Canteiro contínuo (lateral norte):** faixa LARGA (mN 10,6→12,35) de arbustos da frente (X0,6) à
  gourmet, ESCALONADOS — baixos na frente do canteiro, **altos junto ao muro** (fórmula `cover` segue
  `clW`) p/ cobrir o cano. Helper **`addShrub(cx,baseY,cz,R,H)`**: arbusto realista = cluster de 4–5
  **lóbulos** (icosaedros jitterados, **flat shading**, cores `leafMats`) empilhados e afunilando.
  Grupo `g` (chão) — alinha com o tronco na vista do sobrado (telhado erguido).
- **Jardineira (gourmet):** bed BAIXO de alvenaria (`matWall`, topo `jTop=−0,40`) — o **cano passa
  ACIMA dela, entre os arbustos** (NÃO embutido na alvenaria). Arbustos plantados no bed cobrem o cano.
- **Anti-bug muro:** `addShrub` clampa cada lóbulo em **mN ≤ `MURO_N`=12,33** (raio efetivo `lr·1,25`
  c/ o jitter) → a folhagem encosta no muro mas **não o atravessa**. (Assinatura aceita `zMax/zMin`
  opcionais p/ clampar os dois lados; default = só o muro norte.)

**Path do corredor SUL (V3.4, gate `v33||v34`, no bloco base — perto do piso, após `grade`):**
- Calçada para dar a **volta na casa** sem molhar os pés. Em **L**: perna SUL (mN 0,30→1,75 — recuo
  sul quase todo, da cerca ao embasamento) de mE 0,3→32,6 + perna LESTE subindo p/ o NORTE
  (mE 32,6→33,9, mN 0,30→10,5, contorna a leste da gourmet até os fundos).
- Helper `pathSlab(nS,nN,xW,xE)` = slab inclinado seguindo o declive (`grade`), no estilo do `driveway`.
- **Z-fight:** SEM `polygonOffset` (empurrava no depth-buffer) + topo **12 cm acima da grama** (`LIP`)
  → assenta nítido sobre o terreno. Material `matPath` (pedra clara).

**Próximas etapas V3.4:** abrir o braseiro na face norte (hoje o corpo lê meio sólido de frente);
cotas 2D/3D da área; ficha de medidas (`p-v34-med`); opcional fechar o leste (privacidade do vizinho
de fundo) e/ou esticar a profundidade; opcional sebe de fundo densa p/ esconder o cano 100%.

### V4 — Evolução cronológica real da obra (20 fases: V1 → V2 → V3 → pintura)

Variante do V3.2: **renderiza idêntico ao V3.2** (sobrado + telhado solar + pintura marrom) e
adiciona o **slider 🏗 de fases da obra**, contando a **evolução cronológica REAL** do projeto em
**blocos sequenciais** — a casa térrea (V1) sobe inteira até ficar pronta, **depois** a garagem (V2)
da fundação à laje, **depois** o sobrado (V3) até o telhado, e **por fim a pintura** marrom de tudo.
Aba `data-v="v4"`, rota `/v4`, painéis `p-v4-2d/3d/med`.

**Cada fase mostra só o que faz sentido nela** (revisado por versão, incl. as X.X):
- **Pintura é a última fase** (V3.2 é acabamento): no V4 as paredes/colunas/empenas **nascem em
  reboco natural** (`WALL_NAT`/`EMBASE_NAT`) e só viram marrom na fase 18. `buildBuilding3D` guarda
  os materiais em `g.userData.paint`; `applyBuildPhase` troca `m.color` p/ marrom quando
  `buildPhase4 ≥ PAINT_PHASE`. (V3.2 segue nascendo marrom — `bornBrown = rv==='v32' && v!=='v4'`.)
- **Esperas = ponta do pilar:** na vida real pilar e espera são a mesma peça (a espera é só a ponta
  do ferro do pilar). `mkEsperas(cMN, cME, topZ)` cria 4 arranques saindo do **topo do pilar**
  (`CEIL3D+CPA` na casa / `GLAJE` na garagem) → aparecem **na fase das colunas** (casa **2**, garagem
  **11**), não depois da laje. A laje depois envolve a base; seguem espetadas até o pilar do 2º pav
  cobri-las (fase 14, ocultos pelo pilar opaco).
- **Cobertura das esperas (Caixa):** a Caixa não aceita ferro de espera aparente numa obra
  concluída → a **fase 8** (entre o V1 pronto e o muro) capeia o ferro dos 12 pilares da casa com
  **bonecas de concreto** (`box3d` 0,19×0,19, `matEmbase`, `_ph = PH.cap`). Boneca **0,19 < pilar
  0,20** → some embutida quando o pilar do 2º pav sobe (fase 14). Para o ferro caber **inteiro**
  dentro da boneca (e do pilar), `mkEsperas` usa `OFF=0,06` e a **dobra do topo bende p/ dentro**
  (senão a ponta saía ±0,17, além da boneca). É a mesma ideia do `esperasCaps` do V1 standalone.
- **Platibanda do V1 (cara de "casa quadrada com telhado embutido"):** o V4 ganha uma mureta
  (0,42 m, = `/v1`) em **todo o perímetro** da casa, na laje 1 (`F2.add`, `_ph = PH.laje1`). Some
  quando o sobrado sobe via **`userData.phEnd = PH.colS`** (o 2º pav a substitui). `applyBuildPhase`
  trata `phEnd`: objeto visível só na janela `[ph, phEnd)`.
  - **Face oeste = junta (sem beiral):** a laje oeste do V4 termina RENTE à parede oeste, na
    junta (`Egar = 22,37`), **desde o V1 standalone** — sem beiral, sem stubs, sem fascia oeste.
    A mureta oeste fica na junta (`pbAdd(cn0, ce0, …, PH.laje1, PH.colS)`) já na fase da laje.
    Isso garante que a laje da casa nunca cavalga a futura garagem, viabilizando a junta de
    dilatação da expansão V2. (Antes, enquanto standalone, o oeste tinha um beiral simétrico de
    0,5 m que sumia quando a garagem anexava — removido.)
- **Escadas das portas da frente (V1):** enquanto a casa é standalone, as portas **principal
  (oeste)** e **da sala (norte)** ganham as MESMAS escadas externas do `/v1` (`extStairs 'W'` e
  `'N'`), com `_phEnd = PH.gFound` — somem quando a plataforma/garagem assume o acesso (V2). O
  `stampAdd` carrega `_phEnd` p/ carimbar a janela de fases também em geometria de helpers.
- **Pivô da porta:** o marcador de dobradiça do `doorArc` (`circ` preto) leva `no3d:true` — senão o
  pipeline o extruda numa **massa preta de 0,45 m** flutuando (corrigido em todas as versões).
- **Muro = V1.1, não V1:** muro frontal + portão + cercas só aparecem **depois do V1 pronto**, na
  **fase 8** (`PH.muro`). Durante a obra do V1 (fases 1–7) o lote fica sem muro.
- **Plataforma de acesso (nível garagem)** sai da fundação da casa e entra no **bloco V2** (`gFound`):
  senão aparecia um "piso norte" antes da garagem existir.
- **Depósito sob a escada** (paredes no GEO a oeste da junta, `mE<16`, + sua porta) é detectado por
  posição em `walls.forEach`/`openings.forEach` e jogado p/ o **bloco V2** (`gLaje`) — não sai mais
  flutuando na alvenaria da casa.
- **Janelas do 2º pav** (vidro + caixilho) entram nas **esquadrias** (17), não na alvenaria (15):
  no `winWall`, o vidro/caixilho recebem `userData.ph = PH.esquadS`; a parede deixa o vão aberto.

- **Clone do V3.2 sem repetir gates:** `buildBuilding3D(v)` define `const rv = v==='v4'?'v32':v;`
  — todos os gates de **renderização** usam `rv` (SOLAR, `WALL_TINT`, `EMBASE_COL`, garagem,
  `floor2`, telhado, muro). `v` continua `'v4'` só para a **identidade** (chave da cena, fases).
  No 2D, `buildLayers` faz `if (v==='v4') v='v32'`; `initMap`/`v3Layers` tratam `v4` junto.
- **`PH` = números de fase por versão.** O mesmo código compartilhado carimba o número certo
  conforme a versão. Chaves: casa (`found,colT,vigaT,laje1,alven,esquad,acab` = 1–7), garagem
  (`gFound,gColT,gVigaT,gLaje` = 8–11), sobrado (`colS,vigaS,laje2,alvenS,telhado,esquadS` = 12–17).
  Demais versões: as chaves da casa = as 7 fases do V1, o resto não é usado.
- **`stampAdd(grp)`:** carimba `userData.ph` também nos grupos `roof` (telhado) e `floor2`
  (2º pav), que têm `.add` próprio. Cada subseção da garagem/`floor2`/`roof` seta `_ph` antes
  dos `add`. **Cuidado:** a cerca dos fundos declara um `const PH = 2,20` (altura do mourão) que
  sombrearia o `PH` das fases — por isso o `_ph = PH.muro` do muro é setado **fora** do bloco.
- **`applyBuildPhase('v4')`** (estado `buildPhase4`, **abre na fase 1/20 — Fundação**; `setVersion`
  reseta `buildPhase4=1` ao clicar a aba, p/ sempre começar do início da obra): percorre **toda** a árvore
  (`traverse`), oculta `userData.ph > buildPhase4`, **ergue o telhado** (`roof.position.y =
  CEIL3D+0.16`), força `roof`/`floor2` **sempre visíveis** (quem some é o filho, pelo `ph`) e
  aplica a **pintura** na última fase (gatilho dinâmico `ph >= PHASE_LABELS_V4.length`). V4 **não
  tem** os botões "2º piso/Telhado" — o slider é o controle único.
- **Slider:** `buildHud3D` monta o `.phase-hud` para `v1` (7) **e** `v4` (20), usando
  `PHASE_LABELS_V4`/`buildPhase4`.
- **Laje de cobertura (forro):** no sobrado solar **não há laje plana** no `roof` (o telhado a
  substitui). Para dar conteúdo à fase 16, o V4 adiciona uma **laje de forro** plana (2 boxes,
  casa + garagem) em `fz1`, **oculta sob as águas** — não muda a aparência final vs. V3.2.
- **A casa do V4 não tem a laje plana + platibanda do V1 standalone:** seu "telhado" no bloco 1 é
  a **laje 1** (intermediária, com fascia `addBorda`), que vira o chão do 2º piso no bloco 3. No
  fim do bloco 1 (fase 7) ela lê como um térreo de telhado plano acabado.
- **Mapeamento das 20 fases → geometria:**
  - **Bloco 1 — casa (V1):** 1 fundação casa · 2 pilares casa (**+ esperas = ponta dos pilares**) ·
    3 vigas casa · 4 laje casa (laje 1 + fascia) · 5 alvenaria casa (paredes térreo) ·
    6 esquadrias casa · 7 acabamento casa (mobiliário) = **V1 pronto** · 8 **cobertura das esperas**
    (bonecas de concreto — Caixa).
  - **V1.1:** 9 **muro frontal + portão + cercas**.
  - **Bloco 2 — garagem (V2):** 10 fundação garagem (acesso, baldrame, piso, **plataforma**) ·
    11 pilares (pilotis) (**+ esperas da garagem**) · 12 vigas · 13 laje da garagem (+ parede sul +
    **depósito** + escada p/ o 2º) = **V2 pronto**.
  - **Bloco 3 — sobrado (V3):** 14 pilares 2º pav · 15 vigas 2º pav · 16 laje de forro ·
    17 alvenaria 2º pav (paredes + divisórias) · 18 telhado solar (águas + empenas + FV) ·
    19 esquadrias 2º pav (vidros + caixilhos + folhas de porta) = **V3 pronto**.
  - **Acabamento final:** 20 **pintura** marrom de toda a casa = **V3.2**.

---

## Pendências conhecidas

- [ ] `@media print` para memorial imprimível
- [ ] Dados da M² Engenharia (CREA) para incluir no app
- [ ] Acabamentos por fase (piso, esquadrias, cobertura)
- [ ] V2: portão oeste da garagem (mE=GE0=13,5+OE; abertura ~5 m; tipo glassdoor ou aço)
- [ ] V2: cotas 2D/3D da garagem (`dimLine` + `buildDims3D` parametrizado por versão)
- [ ] V3: desenhar 2º pavimento no 2D + ativar cena 3D + ficha medidas V3
- [ ] V3: medidas tab — substituir placeholder
