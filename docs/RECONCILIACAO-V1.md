# Reconciliação V1 — app × projeto oficial

Inventário de discrepâncias entre a app (tag `pre-v1-oficial`) e o projeto oficial
(`docs/reais/`, só local). Criado em 2026-11-08. **Nenhuma mudança na app foi feita a partir dele
ainda.** Sem dados pessoais: este arquivo é versionado.

**Regra:** no V1, o documento oficial vence. O que os documentos não definem continua sendo
decisão do cliente.

**Ordem:** inventário → refatoração média (retrato idêntico) → migração por camadas → depois V2 e V3. Inventário e refatoração concluídos em 2026-11-08. **Camadas migradas: D, L, I, P, J, N, E, C, S e M (móveis).** Provisório até a arquiteta responder: solo −0,30 nas faces norte e oeste (N1), "aba" sudoeste antiga (E8), caixa d'água sobre o banho (C8) e limite do box (M5). M2 decidido: península com banquetas no lugar da mesa; geladeira na parede leste. A medida da placa do piso (0,45 m) é suposição: o Memorial só diz cerâmico PEI 4. Passeio e circulação externa de concreto (M12) não foram modelados. V2 e V3 ainda não foram adaptados.

## Como ler

Coordenadas em metros do lote, como renderizadas na app (já com `OE`): `mN` a partir da divisa sul,
`mE` a partir da testada. Conversão da A01: `mN = 7,75 − n` e `mE = 25,10 − e`, com `n` e `e` medidos
das faces externas norte e leste da casa.

**Atenção à convenção:** a app posiciona paredes pela **linha de centro**; a A01 cota pelas **faces**.
Por isso os valores abaixo são sempre de face, salvo onde indicado.

| Código | Significado |
|---|---|
| **A01·c** | cota escrita na prancha, lida igual pelos dois leitores |
| **A01·m** | sem cota escrita; medida na geometria vetorial, igual nos dois leitores (±1 cm) |
| **A01·?** | duvidoso, contraditório na própria prancha |
| **Mem / Mat / RRT** | Memorial / Matrícula / RRT |
| Impacto | em V1.1/V2/V3: `—` nenhum · `A` ajustável · `Q` quebra algo construído à mão |
| Decisão | `adotar` · `manter` · `perguntar` (arquiteta) · `decidir` (cliente) |

---

## 1. O que já está igual

Não precisa de ação; registrado para não ser mexido por engano.

| Item | Valor | Fonte |
|---|---|---|
| Lote | 12,50 × 40,00 m = 500 m², frente a oeste | Mat, A01·c |
| Vizinhança da planta | Serviços ao sul; estar e cozinha ao norte; dormitório no canto sudeste | A01·c |
| Sequência oeste→leste na faixa sul | hall, banho, lavanderia, dormitório | A01·c |
| Piso acabado | +0,30 sobre a calçada (`CPA = 0.30` no código) | A01·c |
| Pé-direito | 2,70 m (`CEIL3D`) | A01·c |
| Dormitório | 9,00 m² | A01·c |
| Conceito da cobertura | laje + telha embutida atrás de platibanda, caindo para o sul | A01·c, Mem |
| Caixa d'água | elevada, em volume construído sobre a laje | A01·c |
| Pluvial | desce ao sul, corre pela divisa sul até a rede pública | A01·c, Mem |
| Ausência de hall fechado | hall aberto para o estar | A01·c |

**Conformidade Caixa, conferida na A01:** área 46,57 m² ≥ 36 ✓ · menor dimensão do dormitório
2,50 ≥ 2,40 ✓ · janela do dormitório 1,40 × 1,20 = 1,68 m² ≥ 1,50 ✓ · lavanderia coberta com tanque ✓.

---

## 2. Discrepâncias por camada

A ordem das camadas é a ordem de execução. Dentro de cada uma, os itens não dependem entre si,
salvo indicação.

### D · Dados sem geometria (aquecimento do processo)

| ID | Item | App | Oficial | Fonte | Dep. | Impacto | Decisão |
|---|---|---|---|---|---|---|---|
| D1 | Área construída | ~49,5 m² (doc.) | **46,57 m²** | A01·c, Mem, RRT | — | — | adotar |
| D2 | Área útil na ficha | ~44 m² | **40,38 m²** (soma dos ambientes) | A01·c | — | A | adotar |
| D3 | Banho | 3,9 m² | **3,25 m²** | A01·c | — | A | adotar |
| D4 | Lavanderia | "Á. Serviço", 3,9 m² | **"Lavanderia", 3,25 m²** | A01·c | — | A | adotar |
| D5 | Sala + cozinha | ~14 + ~11 m², separados | **ambiente único, 24,88 m²** | A01·c | — | A | adotar |
| D6 | Nome do quarto | "Quarto" | "Dormitório" | A01·c | — | A | **Dormitório** |
| D7 | Responsável técnica | pendência "M² Engenharia (CREA)" | arquiteta com registro CAU | RRT, A01·c | — | — | adotar |

### L · Lote e implantação

| ID | Item | App (face) | Oficial (face) | Fonte | Dep. | Impacto | Decisão |
|---|---|---|---|---|---|---|---|
| L1 | Face oeste | mE 16,90 | **mE 17,00** | A01·c | — | Q | adotar |
| L2 | Face leste | mE 26,10 | **mE 25,10** | A01·c | — | A | adotar |
| L3 | Face sul | mN 1,90 | **mN 2,00** | A01·c | — | Q | adotar |
| L4 | Face norte | mN 7,60 | **mN 7,75** | A01·c | — | A | adotar |
| L5 | Faixa permeável | não modelada | 6,00 m × 12,50 m nos fundos, 75 m² | A01·c | — | — | 2D e ficha |
| L6 | Rebaixo do meio-fio | não modelado | extremo norte da testada, ≈3 m | A01·m | — | — | não representar |

Recuos oficiais, todos fechando: frente 17,00 · fundos 14,90 · norte 4,75 · sul 2,00.

### N · Níveis e terreno

| ID | Item | App | Oficial | Fonte | Dep. | Impacto | Decisão |
|---|---|---|---|---|---|---|---|
| N1 | Solo junto às faces norte e oeste | `grade(17)` = −0,43 | **−0,30** na planta, **00** em cortes e fachadas | A01·? | — | A | **perguntar** |
| N2 | Solo na face leste | `grade(25,1)` = −0,63 | **−0,50** | A01·c | — | A | adotar |
| N3 | Declive | 2,5 % constante até os fundos | 00 na testada → −0,30 a 17 m → −0,50 a 25,1 m; fundos sem cota | A01·c | N1 | A | pontos oficiais até 25,1 m, depois até **−0,80** nos fundos |
| N4 | Rua | não modelada | −0,15 | A01·c | — | — | manter |
| N5 | Escada oeste (entrada) | largura 1,20, em mN 2,15 | **0,98**, mN 2,93→3,91; 4 espelhos de 15, 3 pisos de 30 | A01·c/m | P1, N1 | — | adotar |
| N6 | Escada norte | largura 2,00, em mE 17,5 | **1,60**, mE 17,65→19,25; 4 espelhos de 15, 3 pisos de 30 | A01·c/m | P6, N1 | A | adotar |
| N7 | Escada leste | largura 1,20, em mN 4,70 | **0,88**, mN 4,86→5,74; 5 espelhos de 16, 4 pisos de 30 | A01·c/m | P5 | — | adotar |

### E · Envelope e estrutura

| ID | Item | App | Oficial | Fonte | Dep. | Impacto | Decisão |
|---|---|---|---|---|---|---|---|
| E1 | Paredes externas | 0,20 | **0,15** | A01·c | L1–L4 | Q | adotar |
| E2 | Pilares | 12 de 0,20 × 0,20, grade regular | **13 de 0,15 × 0,25**, ver tabela abaixo | A01·m | L1–L4, I1–I4 | Q | adotar |
| E3 | Vigas | altura 0,45, largura 0,20 | **0,20 abaixo da laje**, largura 0,15 | A01·c/m | E2 | Q | adotar |
| E4 | Viga aparente no estar | não existe | mE 21,20→21,35, atravessa o estar de norte a sul, entre P4 e P5 | A01·m | E2 | A | adotar |
| E5 | Viga sobre o hall | não existe | mN 4,65→4,80, mE 17,15→18,30 | A01·m | E2, I1 | A | adotar |
| E6 | Laje | 0,16 | **0,10** | A01·c | — | Q | adotar |
| E7 | Fundação | embasamento e baldrame esquemáticos | micro estaca + bloco de coroamento (≈0,40 × 0,40) + viga 15 × 30 | Mem, A01·m | L1–L4 | A | adotar |
| E8 | Prolongamento da parede oeste | "aba" SW de 0,29 × 0,32 | **parede de 0,15 prolongada 0,60 ao sul** (mN 1,40→2,00), altura total | A01·c | L1, L3 | A | **perguntar** a função |

**Pilares oficiais** (faces, em metros do lote):

| Pilar | Local | mN | mE |
|---|---|---|---|
| P1 | canto NE | 7,60→7,75 | 24,85→25,10 |
| P2 | leste, encontro da longitudinal | 4,65→4,80 | 24,85→25,10 |
| P3 | canto SE | 2,00→2,15 | 24,85→25,10 |
| P4 | parede norte | 7,60→7,75 | 21,20→21,45 |
| P5 | longitudinal × dorm./lav. | 4,55→4,80 | 21,20→21,35 |
| P6 | sul × dorm./lav. | 2,00→2,25 | 21,20→21,35 |
| P7 | longitudinal × lav./banho | 4,55→4,80 | 19,75→19,90 |
| P8 | sul × lav./banho | 2,00→2,25 | 19,75→19,90 |
| P9 | longitudinal, ponta oeste | 4,65→4,80 | 18,30→18,55 |
| P10 | sul × banho/hall | 2,00→2,25 | 18,30→18,45 |
| P11 | canto NO | 7,60→7,75 | 17,00→17,25 |
| P12 | canto SO | 2,00→2,15 | 17,00→17,25 |
| P13 | oeste, eixo da longitudinal | 4,55→4,80 | 17,00→17,15 |

### I · Divisórias internas

Todas com 0,15 de espessura, como na app. Eixo = linha de centro, que é o que o código usa.

| ID | Parede | App (eixo) | Oficial (eixo) | Fonte | Dep. | Impacto | Decisão |
|---|---|---|---|---|---|---|---|
| I1 | Longitudinal, sala × serviços | mN 4,70 | **mN 4,725** | A01·c | L4 | A | adotar |
| I2 | Banho × hall | mE 18,85 | **mE 18,375** | A01·c | L1 | A | adotar |
| I3 | Banho × lavanderia | mE 20,55 | **mE 19,825** | A01·c | L1 | A | adotar |
| I4 | Lavanderia × dormitório | mE 22,25 | **mE 21,275** | A01·c | L2 | A | adotar |
| I5 | Ponta oeste da longitudinal | mE 18,85 | **mE 18,30** | A01·c | I2 | A | adotar |

Hall resultante: 1,15 m de largura, contra ≈1,68 m na app.

### P · Portas (largura × posição do vão livre)

Todas com 2,10 de altura, como na app.

| ID | Porta | App | Oficial | Fonte | Dep. | Impacto | Decisão |
|---|---|---|---|---|---|---|---|
| P1 | Entrada, oeste | 0,90 · mN 2,30→3,20 | 0,90 · **mN 2,97→3,87** · dobradiça sul, abre p/ dentro | A01·c/m | L1, E1 | — | adotar |
| P2 | Banho | 0,80 · mN 2,90→3,70 | **0,60** · **mN 3,95→4,55** · dobradiça norte, abre p/ o banho | A01·c/m | I2 | A | adotar |
| P3 | Lavanderia | 0,90 · mE 20,95→21,85 | **0,70** · **mE 20,40→21,10** · dobradiça leste, abre p/ sul | A01·c/m | I1 | A | adotar |
| P4 | Dormitório | 0,90 · mE 23,10→24,00 | **0,80** · **mE 21,45→22,25** · dobradiça oeste, abre p/ sul | A01·c/m | I1 | A | adotar |
| P5 | Fundos, leste | 0,90 · mN 4,70→5,60 | **0,80** · **mN 4,90→5,70** · dobradiça sul, abre p/ dentro | A01·c/m | L2, E1 | — | adotar |
| P6 | Norte, vidro | correr 4 painéis, 2,00 · mE 17,5→19,5 | **correr 2 folhas, 1,60** · **mE 17,65→19,25** | A01·c/m | L4, E1 | A | adotar |

### J · Janelas (largura × altura / peitoril)

| ID | Janela | App | Oficial | Fonte | Dep. | Impacto | Decisão |
|---|---|---|---|---|---|---|---|
| J1 | Hall, sul | 1,00 × 1,10 / 1,00 | **não existe** | A01·c | — | A | adotar (remover) |
| J2 | Banho, sul | 0,80 × 1,10 / 1,00 · mE 19,0→19,8 | **0,80 × 0,60 / 1,50** · **mE 18,70→19,50** | A01·c/m | I2, I3 | A | adotar |
| J3 | Lavanderia, sul | 0,80 × 1,10 / 1,00 · mE 21,0→21,8 | **0,80 × 0,60 / 1,50** · **mE 20,13→20,93** | A01·c/m | I3, I4 | A | adotar |
| J4 | Dormitório, sul | 1,20 × 1,10 / 1,00 · mE 23,5→24,7 | **1,40 × 1,20 / 0,90** · **mE 22,45→23,85** | A01·c/m | I4, L2 | A | adotar |
| J5 | Dormitório, leste | 1,40 × 1,10 / 1,00 · mN 2,65→4,05 | **1,40 × 1,20 / 0,90** · **mN 2,70→4,10** | A01·c/m | L2, E1 | — | adotar |
| J6 | Sala, norte | 1,80 × 1,10 / 1,00 · mE 20,6→22,4 | **1,20 × 1,00 / 1,10** · **mE 20,00→21,20** | A01·c | L4, E1 | A | adotar |
| J7 | Cozinha, norte | 1,60 × 0,60 / 1,00 · mE 23,7→25,3 | **1,20 × 0,50 / 1,10** · **mE 23,15→24,35** | A01·c | L4, E1 | A | adotar |
| J8 | Tipo e material | caixilho creme em grade | **alumínio branco**, de correr; as de 0,80 × 0,60 sem tipo definido | Mem, A01·m | — | A | adotar |
| J9 | Portas internas | madeira | madeira, esmalte fosco | Mem | — | — | manter |

### C · Cobertura e caixa d'água

| ID | Item | App | Oficial | Fonte | Dep. | Impacto | Decisão |
|---|---|---|---|---|---|---|---|
| C1 | Telha | metálica trapezoidal terracota | **fibrocimento ondulada** | Mem, A01·m | — | — | adotar |
| C2 | Inclinação | ≈4 % | **≈10 %** (sem cota escrita) | A01·m | — | — | adotar |
| C3 | Estrutura do telhado | sem | tesouras e terças sobre a laje | A01·m | — | — | não modelar |
| C4 | Beirais | N 0,90 · S 0,50 · L 0,50 · O 0 | **N 0,60 · S 0,60 · L 0,60 · O 0** | A01·m | E1 | A | adotar |
| C5 | Platibanda | 0,12 esp., 0,42 acima da laje | **0,15 esp., 0,85 acima da laje** | A01·c | E6 | Q | adotar |
| C6 | Topo da platibanda | +3,58 | **+3,95** | A01·c | C5, E6 | Q | adotar |
| C7 | Volume da caixa d'água | 1,40 × 1,40, topo +4,40, centro da laje | **2,80 (N-S) × 1,60 (L-O)**, mN 2,00→4,80, topo **+5,50** | A01·c/m | C8 | A | adotar |
| C8 | Posição L-O do volume | mE 21,5 | **mE 18,30→19,90 (sobre o banho)** na Localização, hidrossanitária e Corte AA; **mE 19,75→21,35 (sobre a lavanderia)** no Corte BB e Fachada Norte | A01·? | — | A | **perguntar** |
| C9 | Reservatório | ~1000 L | **500 L**, sobre laje de apoio +1,00 acima da laje | A01·c | C8 | — | adotar |
| C10 | Descidas pluviais | 1 prumada Ø100, SW | **2 × Ø100 na face sul**, mE ≈20,07 e ≈17,22 | A01·c/m | E8 | A | adotar |
| C11 | Coletor pluvial | em mN 0,40 | em mN ≈0,20 (a 16–22 cm da divisa) | A01·m | — | — | manter |
| C12 | Calhas | sem | 3 rótulos, ao longo da platibanda sul e no volume da caixa | A01·c/m | C7 | — | modelar simples |

### S · Saneamento no terreno (hoje não modelado)

| ID | Item | Oficial | Fonte | Dep. | Decisão |
|---|---|---|---|---|---|
| S1 | Fossa séptica | Ø0,80, h 1,20 · centro mN 1,90, mE 30,50 | A01·c/m, Mem | — | 2D e ficha |
| S2 | Filtro anaeróbio | Ø0,80, h 1,20 · centro mN 3,10, mE 30,50 | A01·c/m, Mem | — | 2D e ficha |
| S3 | Sumidouro | Ø1,00, h 1,50 · centro mN 4,30, mE 30,60 | A01·c/m, Mem | — | 2D e ficha |
| S4 | Caixas de inspeção e de gordura | 7 CI + gordura externa na face norte, mE ≈23,75 | A01·m | — | 2D e ficha |
| S5 | Cisterna | **não consta** nos documentos; prevista nas notas do projeto | A01, Mem | — | etapa futura, fora do projeto atual; não entra no V1 |

**S6 · O que o sistema suporta** (pedido do cliente, com destaque para a ficha de Medidas):

A prancha e o Memorial **não informam** número de pessoas, contribuição diária, volume útil, intervalo
de limpeza nem teste de percolação do solo. A capacidade não pode ser afirmada a partir deles.

| Unidade | Dimensões na A01 | Volume geométrico |
|---|---|---|
| Fossa séptica | Ø0,80 × 1,20 | ≈603 L |
| Filtro anaeróbio | Ø0,80 × 1,20 | ≈603 L |
| Sumidouro | Ø1,00 × 1,50 | ≈1.178 L; parede ≈4,7 m² + fundo ≈0,8 m² |

- **Ocupação de referência:** 2 pessoas por dormitório, logo **2 pessoas** no V1, conforme prática citada
  para a NBR 7229. Não é número escrito no projeto.
- **Alerta para a arquiteta:** pela NBR 7229/1993, `V = 1000 + N(CT + K·Lf)` dá mais de 1.000 L para
  qualquer ocupação, e o diâmetro interno mínimo citado é 1,10 m. A fossa desenhada tem ≈603 L e
  Ø0,80, supondo que essas cotas sejam internas e a altura seja útil.
- **Norma vigente:** a NBR 17076:2024 substituiu as NBR 7229 e 13969. Não tive acesso aos seus valores,
  e o código municipal também se aplica. Por isso é pergunta (Parte 2, nº 25), não erro confirmado.
- **Ficha da app:** mostrar dimensões, ocupação de projeto e a fonte. Enquanto a arquiteta não
  confirmar, indicar "capacidade a confirmar".

### M · Móveis e materiais

A A01 só desenha o que é fixo. **Sala e dormitório não têm mobília no projeto: continuam sendo
decisão do cliente**, mas tudo precisa caber nos ambientes novos.

| ID | Item | App | Oficial | Fonte | Dep. | Decisão |
|---|---|---|---|---|---|---|
| M1 | Cozinha | em U, com península, fogão, coifa, geladeira | só bancada 0,60 × 1,20 na parede norte, sob J7 | A01·c | J7 | **linear na parede norte**: pia sob J7, fogão, bancada, geladeira |
| M2 | Canto alemão, mesa | presentes | sem mobília indicada | A01 | I1, J6 | **em aberto**: decidir ao ver a cozinha no novo layout |
| M3 | Banho: lavatório | 0,95 × 0,32, parede norte | **0,90 × 0,45**, canto nordeste | A01·m | I1, I3 | adotar |
| M4 | Banho: vaso | mN 3,30, parede leste | parede leste, **mN 3,16→3,53** | A01·m | I3 | adotar |
| M5 | Banho: box | 1,00 × 1,00, canto SE | linha fina em mN 2,95; lado sul livre, ≈0,80 × 1,30 | A01·? | I2, I3 | **perguntar** |
| M6 | Lavanderia: tanque | parede sul | parede oeste, **mN 3,90→4,37** | A01·m | I3 | adotar |
| M7 | Lavanderia: máquina | parede sul | parede oeste, **mN 2,87→3,41** | A01·m | I3 | adotar |
| M8 | Lavanderia: armário alto | presente | não indicado | A01 | I3, I4 | remover |
| M9 | Dormitório: cama e guarda-roupa | presentes | não indicados; ambiente 3,60 × 2,50 | A01 | I4, P4 | manter; **cama definida pelas tomadas**, ver seção 3 |
| M10 | Sala: sofá, rack, TV, centro | presentes | não indicados; ponto de TV na parede oeste | A01·m | I1, I2, P1 | manter; TV na parede oeste |
| M11 | Hall: sapateira, tapete | presentes em ≈1,68 m | hall de 1,15 m | A01 | I2, P1 | só o tapete; tirar a sapateira |
| M12 | Piso | textura genérica | cerâmico, PEI 4; calçada de concreto | Mem | — | adotar |
| M13 | Banheiro | sem azulejo | azulejo cerâmico até o forro | Mem | — | adotar |
| M14 | Paredes | textura genérica | reboco e tinta acrílica | Mem | — | manter |

---

## 3. Perguntas abertas

**Para a arquiteta** (só ela resolve; os documentos não dizem ou se contradizem):

| Ref. | Pergunta |
|---|---|
| **X1** | **A estrutura está dimensionada para o 2º pavimento do V3?** Nem a A01 nem o Memorial mencionam expansão, esperas ou reforço. Laje de 0,10, viga de 15 × 30 e ferro de 10 mm são os únicos dados escritos. Há projeto estrutural (o RRT registra "projeto de estrutura de concreto")? |
| N1 | O solo junto às faces norte e oeste é −0,30 ou 00? A cota de 0,60 até o piso só fecha com −0,30. |
| C8 | O volume da caixa d'água fica sobre o banho ou sobre a lavanderia? |
| E8 | Qual é a função do prolongamento de 0,60 da parede oeste ao sul? Hipótese: esconder a descida pluvial, como a "aba" da app. |
| M5 | A linha em mN 2,95 no banho é o box? |
| S6 | Para quantas pessoas fossa, filtro e sumidouro foram dimensionados, e por qual norma? |

**Decisões do cliente (2026-11-08, em [PERGUNTAS-V1.md](PERGUNTAS-V1.md)):** já anotadas nas tabelas
acima. O projeto R00 **ainda não foi protocolado** nem enviado à Caixa, então as respostas da
arquiteta ainda podem alterá-lo. A migração fica na branch `feat/v1-oficial` até o V1 estar completo.

**Perfil do terreno (N3):** segmentos retos por 00 (testada) → −0,30 (mE 17,00) → −0,50 (mE 25,10) →
−0,80 (mE 40,00). O último trecho mantém os cerca de 2 % do conjunto oficial. O ponto de 17 m depende de N1.

**Dormitório (M9), posição lida da planta elétrica (±5 cm, conferir na geometria ao migrar):**

| Ponto | Parede | mE | Leitura |
|---|---|---|---|
| Tomada baixa + ponto "H" | norte | ≈24,64 | criado-mudo leste |
| 2 tomadas baixas | norte | ≈22,67 | criado-mudo oeste |
| Ponto "H" | norte | ≈22,40 | junto ao criado-mudo oeste |
| TV a 1,20 m + AC | sul | ≈24,1 | em frente à cama |

Daí resulta **cabeceira na parede norte, pés para o sul**:

| Item | mN | mE | Situação |
|---|---|---|---|
| Cama de casal 1,40 × 1,90 | 2,68→4,58 | 22,90→24,30 | definida pelas tomadas |
| Criado-mudo leste | ≈4,20→4,58 | 24,30→24,75 | definida pelas tomadas |
| Criado-mudo oeste | ≈4,20→4,58 | 22,45→22,90 | definida pelas tomadas |
| Guarda-roupa, portas para leste | 2,15→3,75 | 21,35→21,95 | **proposta**, a confirmar na camada M |

Sobram cerca de 0,53 m entre os pés da cama e a parede sul, e 0,95 m entre o guarda-roupa e a cama.
O guarda-roupa termina antes da folha da porta aberta (mN 3,85).

**Fora da app, para acompanhar com a arquiteta:** os RRTs divergem no término previsto da obra
(2028 × 2027), e o documento de resíduos não informa transportador nem destino final.

---

## 4. Destino de cada elemento no V3

Preliminar: o V3 existe a partir das versões da app; o projeto oficial não fala dele.

| Elemento | V3 | Base |
|---|---|---|
| Pilares, vigas, laje | permanece (depende de X1) | cliente, X1 |
| Telhado de fibrocimento e tesouras | removido | cliente |
| Volume e reservatório da caixa d'água | removido | cliente |
| Platibanda | a definir | — |
| Prolongamento da parede oeste | permanece (já é assim na "aba" da app) | hipótese |
| Descidas e coletor sul | a definir: o telhado solar cai para o norte | CLAUDE.md |
| Fossa, filtro, sumidouro | **a redimensionar**: o V3 tem mais dormitórios e banheiros | S6 |

---

## 5. Efeito na refatoração

O inventário confirma o nível médio:

- **A topologia não mudou.** Os ambientes continuam na mesma sequência, então eixos nomeados
  resolvem paredes, recuos e vãos.
- **A estrutura precisa virar dado.** Pilares deixam de ser grade regular (13, com seções
  orientadas), e a estrutura de dados deve prever isso.
- **Convenção de face × eixo** precisa ser decidida no início: a A01 cota faces, a app usa linhas
  de centro, e a diferença é de 2,5 a 10 cm conforme a parede.
- **Espessura externa 0,15** aparece fixa em muitos pontos do 3D manual e precisa virar constante.
- **Cotas verticais** (laje, viga, platibanda, topo da caixa) também viram constantes nomeadas.
- **`CLAUDE.md` tem valores obsoletos** (`CPA` 0,15, garagem, cozinha), a limpar na migração.

---

## 6. Impactos para as fases V2 e V3

Só para registro; não bloqueiam o V1.

- A junta da garagem (`GE1j` = mE 16,87) precisa acompanhar a nova face oeste (17,00).
- A face sul da casa passa de 1,90 para 2,00; conferir o alinhamento com a garagem.
- As paredes e a grade de pilares do 2º piso (`F2_WALLS`, `col2c`) seguem o envelope antigo de
  9,00 × 5,50 m e precisam ser refeitas sobre o novo envelope e os 13 pilares.
- O muro frontal (V1.1) não depende da casa; o rebaixo do meio-fio oficial é coerente com o portão
  ao norte.
