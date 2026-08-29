# Residência Heisser — Diretrizes de Sustentabilidade e Autossuficiência

**Objetivo:** consolidar a visão de uma casa que opere o mais próximo possível de um **ciclo
fechado** (água, esgoto, energia e resíduos), amarrando cada sistema às **restrições reais do
lote**, ao que a **arquiteta já projetou** (plantas hidráulica e elétrica entregues) e ao que a
planta 3D (V1/V2/V3) já tem modelado.

> **Legenda de status:** ✅ *já modelado* (existe na planta 3D `index.html`) · 📐 *projetado pela
> arquiteta* (está nas plantas hidráulica/elétrica, mas **ainda não modelado no 3D**) · 🔨 *a
> trabalhar* (ideia/planejamento, sem projeto ainda).

> **Contexto do lote (fonte: `CLAUDE.md`):** Charqueadas/RS · 12,5 × 40 m = 500 m² · lat −29,96°
> (hemisfério sul, Zona Bioclimática 3) · **sol sempre do NORTE** · **declive ~2,5 %** descendo da
> frente/calçada (oeste, mE 0) para os fundos (leste, mE 40). Frente = ponto **alto**; fundos =
> ponto **baixo**. **Charqueadas NÃO tem rede pública de esgoto** → saneamento próprio.
> Todo o saneamento é resolvido por **gravidade**, aproveitando o caimento natural do terreno.

---

## 0. Por que estas escolhas casam com este lote

| Restrição do lote | Consequência de projeto |
|---|---|
| **Sol do norte** o ano todo | Telhado com água ao norte = melhor face para **FV + aquecimento solar/bomba de calor**. Já é o caso no V3 (telhado de uma água caindo p/ o norte + usina FV). |
| **Declive frente→fundo (2,5 %)** | Água corre por gravidade para os **fundos (leste)**. Fossa, tratamento, sumidouro, círculo de bananeiras e composteira vão nos **fundos** (ponto baixo, quintal amplo). Cisterna pluvial também no fundo. |
| **Quintal amplo nos fundos** (mE 31,5 → 40, ~8,5 m de profundidade) | Espaço para o "cluster" hidráulico do fundo (fossa + tratamento + sumidouro + cisterna) + bananeiras + composteira + horta/pomar — longe da casa e no ponto baixo. |
| **Sem rede de esgoto na cidade** | Sistema autossuficiente: fossa + águas cinzas + caixa de gordura + tratamento químico → sumidouro. Já **projetado pela arquiteta**. |
| **Frente drena p/ rede PLUVIAL pública** (mE 0) | Só a **água de chuva** tem conexão pública (na testada). O dreno atual (`drainV3`) leva a água do telhado até a caixa de ligação. A cisterna se insere nessa linha (ver §1). |

---

## 1. Água da chuva — captação e reúso 🔨

### O que a planta já tem ✅
- **Calhas + prumadas + coletor** no V3 (grupo `drainV3`): os dois telhados caem p/ o norte,
  a água é coletada nos beirais norte e levada por um coletor Ø150 rente à divisa norte até a
  **caixa de ligação na frente** (rede pluvial pública). No V1/V2, prumada SW + dreno sul.
- Dimensionamento pluvial já pensado (NBR 10844, i=150 mm/h): garagem ~270 L/min + casa ~190 L/min
  ≈ **460 L/min** de pico no V3.

### Conceito — cisterna por gravidade (vasos comunicantes)
Aproveitar que **o terreno cai para o fundo** e a **rede pluvial pública fica na frente**:
1. A água do telhado desce (o telhado está a ~6 m → muita carga) e vai **primeiro encher a
   cisterna no fundo** (ponto baixo) — **só por gravidade, sem bomba**.
2. Com o cano da prumada e a cisterna **cheios** (afogados), o sistema vira um **vaso comunicante**:
   a água que continua chegando do telhado **empurra** o excedente, que é obrigado a **sair pela
   frente**, caindo na rede pluvial pública. Uma **só conexão pública** no lote.

### ⚠️ A regra que manda em tudo: a água foge pelo ponto ABERTO mais baixo
O terreno cai **só 1 m em 40 m**, então o **fundo (~−0,93 m)** fica praticamente no **mesmo nível
do fundo da caixa de ligação pública na frente (~−0,90 m, cota do modelo)**. Se a cisterna tiver
**qualquer ladrão/respiro aberto no fundo mais baixo que −0,90 m**, a água escapa ali no fundo e
**nunca chega à frente**. Para garantir que ela saia pela frente, duas versões — ambas por
gravidade, sem bomba:

- **Versão A — cano/cisterna selados (sifão):** prumada + cisterna totalmente cheias e **fechadas**,
  sem ladrão aberto no fundo. A carga do telhado empurra a água pela frente **mesmo com a cisterna
  enterrada**. É a ideia literal do cliente e funciona. ⚠️ *Porém:* risco de **bolha de ar (air
  lock)** quebrar o sifão, e ao parar de chover o cano esvazia e precisa **reencher/reprimar**.
- **Versão B (recomendada) — cisterna semi-enterrada, ladrão alto:** topo/ladrão da cisterna
  **acima de −0,90 m** (~0,5 m acima do solo do fundo). Assim o **ponto aberto mais baixo é a
  frente** e a água vai pra lá sozinha, **sem depender do cano ficar afogado**. Sem air lock, sem
  reprimar — à prova de falhas. Entrega o mesmo resultado que o cliente quer.

**Plano B de destino (se a rede pública for rasa demais):** em vez de voltar à frente, o transbordo
vai para um **poço de infiltração pluvial no fundo** (o ponto baixo já quer receber água; recarrega
o lençol). ⚠️ **Separado do sumidouro do esgoto** — não misturar chuva com efluente tratado.

**O número que decide:** confirmar a **cota real da rede pluvial pública** na rua (profundidade da
galeria/boca de lobo). O modelo assume −0,90 m; se a rede real for mais funda, a Versão B fica
ainda mais folgada.

### O que planejar (futuro)
- [ ] **First flush** (desvio de primeira água) no pé de cada prumada, antes da cisterna.
- [ ] **Dimensionar a cisterna** (área de telhado × pluviometria de Charqueadas × dias de autonomia).
- [ ] **Rede hidráulica não-potável separada** (cor/tubulação distintas) para: descargas dos vasos,
      tanque, máquina de lavar, irrigação, lavagem de piso/veículo.
- [ ] **Reroteirizar o `drainV3`** para passar pela cisterna no fundo, com o extravasor (ladrão alto,
      Versão B) voltando ao coletor → caixa de ligação; alternativa: poço de infiltração no fundo.

> **Impacto na modelagem 3D:** futuro grupo `cistern`/`firstFlush` ancorado ao solo no fundo,
> extravasor conectado ao coletor existente. Seguir o padrão do `drainV3` (`mkPipe3`, cotas
> absolutas a partir do solo).

---

## 2. Esgoto — 📐 PROJETADO PELA ARQUITETA

**Confirmado:** Charqueadas **não tem rede de esgoto** → sistema autossuficiente completo, já nas
plantas hidráulicas. Tudo por **gravidade** (caimento natural do terreno para o fundo). Ainda
**não está modelado no 3D** — é o próximo grande bloco de infra a representar na planta.

### Sistema projetado (fluxo)
- **Águas negras** (vasos) → **fossa séptica** → **tratamento (parte química)** → **sumidouro**.
- **Águas cinzas** (torneiras + chuveiros) → sistema próprio de águas cinzas.
- **Cozinha** → **caixa de gordura** dedicada antes de seguir no sistema.
- **Tudo termina no sumidouro**, no fundo do terreno.

### Adição do cliente
- **Círculo de bananeiras no sumidouro** 🔨 — ajuda a evapotranspirar o efluente e absorver
  nutrientes. Plantar no **entorno** da zona de transbordo, **nunca sobre a alvenaria** do
  sumidouro (raízes danificam a estrutura).

### Notas de projeto/operação
- **Papel higiênico:** o usado é o clássico brasileiro **folha dupla/tripla** (não se desmancha
  fácil) → **não** é adequado jogar no vaso; vai para **cesto**. A fossa é dimensionada nesse
  pressuposto (menos carga de celulose, limpeza menos frequente).
- **Caixa de gordura:** manutenção (remoção da crosta) a cada **3–6 meses**; preferir modelo com
  **cesto coletor removível**.
- **Triturador de pia:** ❌ **não usar** (aumentaria carga orgânica na fossa e gordura no
  sumidouro). O destino dos orgânicos é a composteira (§3).

---

## 3. Resíduos orgânicos — composteira 🔨

- **Composteira doméstica no fundo** (substitui triturador de pia):
  - Aceita: cascas de fruta/legume, borra de café, podas, folhas secas.
  - Produz: **húmus** (horta/pomar) + **biofertilizante líquido** (chorume diluível).
- ⚠️ **Escolher bem a localização:** o fundo do terreno concentra o "cluster" hidráulico
  (sumidouro + cisterna + fossa + tratamento). O fundo é grande (~8,5 m de profundidade), então há
  espaço — mas posicionar a composteira **afastada** desses elementos (acesso fácil, sem
  contaminação cruzada, sem competir com o campo de infiltração/bananeiras).

---

## 4. Energia e aquecimento de água

### O que a planta já tem ✅
- **Usina fotovoltaica no telhado do V3** (`SOLAR`, telhado de uma água p/ norte, ~12°, grade de
  módulos `matPanel`). Casa + garagem com águas independentes.

### Aquecimento de água — por versão (decisão do cliente)
- **V1 (MVP simples):** **chuveiro elétrico + torneira elétrica**. Sem solar térmico / sem bomba de
  calor — mantém o V1 barato e financiável.
- **V3:** **bomba de calor (*heat pump*)** para melhor aproveitamento energético e qualidade dos
  banhos (reduz consumo de aquecimento em até ~70 % vs. resistência pura, sem picos severos).

### A trabalhar / a decidir 🔨
- [ ] **Inversor híbrido + baterias LiFePO4** (autonomia em queda de rede). Local sugerido:
      depósito da garagem (V2/V3). Priorizar cargas críticas no backup (geladeira, iluminação,
      internet, bombas d'água) — **não** jogar chuveiro/bomba de calor no backup (picos altos).
- [ ] **Cocção por indução × gás** (indução ~90 % de eficiência, dispensa GLP). Hoje a cozinha tem
      `stove` (fogão) + `hood` (coifa) — decidir antes de fechar o elétrico.

---

## 5. Arquitetura do sistema (ciclo fechado)

```
  [Chuva no telhado] → [First flush] → [Cisterna semi-enterrada, fundo]  (vasos comunicantes)
        └─(enche por gravidade)          └─(transbordo, ladrão alto)→ [rede pluvial pública, frente]
                                                                   └→ [poço infiltração, fundo] (plano B)
      Cisterna cheia → usos não potáveis: bacias, tanque, máquina, irrigação

  [Torneiras / chuveiros]  (cinza) → [sistema de águas cinzas] ──┐
  [Pia da cozinha]         (cinza) → [caixa de gordura] ─────────┴→ (destino projetado)

  [Vasos] (negra) → [fossa séptica] → [tratamento químico] → [SUMIDOURO] ← círculo de bananeiras

  [Restos orgânicos] → [composteira] → [húmus + biofertilizante] → horta/pomar

  [Sol do norte] → [Painéis FV] → [Inversor híbrido] → [Casa + baterias LiFePO4]
  V1: chuveiro + torneira elétricos      V3: bomba de calor (água quente)
```

---

## 6. Roadmap por versão

| Sistema | V1 (MVP / financiável) | V2 (+garagem) | V3 (sobrado, render final) |
|---|---|---|---|
| **Pluvial (dreno)** | ✅ prumada SW + dreno sul | ✅ idem | ✅ `drainV3` (calhas norte + coletor + caixa) |
| **Cisterna + reúso** | 🔨 espera de infra | — | 🔨 semi-enterrada no fundo, extravasor no `drainV3` |
| **Esgoto (fossa+tratamento+sumidouro)** | 📐 projetado (modelar 3D) | 📐 idem | 📐 idem |
| **Águas cinzas** | 📐 projetado | — | — |
| **Caixa de gordura** | 📐 projetado | — | — |
| **Círculo de bananeiras** | 🔨 (fundo/sumidouro) | — | — |
| **Composteira** | 🔨 (fundo, afastada do cluster) | — | — |
| **FV** | — | — | ✅ usina modelada |
| **Inversor híbrido + LiFePO4** | — | 🔨 (depósito) | 🔨 |
| **Aquecimento de água** | chuveiro + torneira elétricos | — | 🔨 bomba de calor |
| **Cocção** | a decidir (indução × gás) | — | atualizar `stove` se for indução |

---

## 7. Pendências / decisões em aberto

- [ ] Confirmar a **cota real da rede pluvial pública** na rua → confirma a folga da cisterna de
      ladrão alto (Versão B) e o destino do transbordo (frente × infiltração no fundo) (§1)
- [ ] Pluviometria de Charqueadas + área de telhado → **dimensionar a cisterna**
- [ ] Definir **localização exata da composteira** no fundo (afastada do cluster hidráulico)
- [ ] **Cocção: indução × gás** — decidir antes de fechar o projeto elétrico
- [ ] **Inversor híbrido + baterias LiFePO4** — dimensionar e definir cargas críticas
- [ ] Modelar no 3D a infra **já projetada** pela arquiteta (fossa, águas cinzas, caixa de gordura,
      tratamento, sumidouro) + a futura (cisterna, bananeiras, composteira) — padrão `drainV3`

> **Resolvidas:** rede de esgoto (não existe → sistema próprio) · papel higiênico (folha dupla/tripla
> → cesto, fossa dimensionada) · esgoto/águas cinzas/caixa de gordura (projetados pela arquiteta) ·
> aquecimento (V1 elétrico, V3 bomba de calor).

---

*Fonte da visão: conversa de referência sobre infraestrutura sustentável + decisões do cliente e
plantas hidráulica/elétrica da arquiteta. Ver `CLAUDE.md` para orientação bioclimática, coordenadas
do lote e o pipeline 2D→3D.*
