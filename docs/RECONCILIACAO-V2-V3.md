# Reconciliação V2 e V3 — garagem e sobrado × casa oficial

Inventário do que deixou de encaixar depois da migração do V1 (branch `feat/v1-oficial`). Criado em
2026-11-08. **Estado (2026-11-10):** V2 aplicado (G1 a G8; G9 aceito sem mudança). V3: T1, T2, T9 e T10 aplicados; T8 conferido sem mudança (telhado já assenta nos eixos novos). Pilares e vigas do 2º piso provisórios nas linhas do térreo; 2º piso da casa com a opção B escolhida pelo cliente (T5, T6). Ficha de Medidas do V3 atualizada (T15). Pendentes: G10, G11, T3, T4, T7 e T11 a T14.

**Natureza diferente do V1:** não há projeto oficial de V2 e V3. A referência é a casa oficial já
migrada; o que passa disso continua sendo decisão do cliente. Os valores da coluna "Na app" foram
medidos na própria app, em metros do lote, já com `OE`.

| Código | Significado |
|---|---|
| Decisão | `ajustar` (consequência direta da casa nova) · `decidir` (cliente) · `arquiteta` (depende de resposta dela) |

**Regra física:** o V2 e o V3 são ampliações da casa já construída. Concreto do V1 não muda de lugar:
laje, beirais, pilares e paredes oficiais são dados de entrada, não variáveis.

---

## 1. V2 — garagem

| ID | Item | Na app | Referência | Decisão |
|---|---|---|---|---|
| G1 | Junta casa × garagem | face leste da garagem em 16,87; casa em 17,00; vão de **13 cm** | 3 cm: garagem até **16,97** | ajustar |
| G2 | Fonte da junta | definida à parte no 2D, no 3D e no 2º piso (`GE1j`, `F2_GE1j`) | uma constante, a partir de `FACE.O` | ajustar |
| G3 | Face sul da garagem | parede 1,90→2,10; colunas 2,00→2,20; casa em 2,00 | face em 2,00, alinhada à casa e ao recuo | decidir |
| G4 | Laje da garagem | 0,16 (topo +3,16); casa 0,10 (topo +3,10) | mesma espessura, lajes rentes | decidir |
| G5 | Platibanda da garagem | topo +3,58, espessura 0,12; casa topo +3,95, espessura 0,15 | padrão da casa, ou mais baixa | decidir |
| G6 | Platibanda oeste da casa | a app remove quando há garagem | foi construída no V1 e não some: **mantê-la** | decidir |
| G7 | Escada para o 2º piso | chega em +3,16 | recalcular para o topo da laje escolhida | ajustar |
| G8 | Plataforma norte | mN 7,55→10,55, mE 16,90→19,90: **invade 20 cm** da casa | começar em 7,75 | ajustar |
| G9 | Porta de entrada × escada | porta em mN 2,97→3,87; escada em 2,20→3,40; antes alinhadas | conferir circulação; a porta é oficial | decidir |
| G10 | Esperas nos pilares da casa | 4 barras a ±7 cm, seção de 15 cm | depende do projeto estrutural | arquiteta |
| G11 | Pendências antigas | portão oeste e cotas da garagem | seguem abertas | decidir |

## 2. V3 — sobrado

**Pré-requisito (X1):** a prancha traz laje de 0,10, vigas 15 × 20 e pilares 15 × 25, e não menciona
pavimento superior. A app antiga usava viga de 0,45 justamente para suportar o sobrado. Enquanto a
arquiteta não responder, tudo abaixo é desenho, não verificação estrutural.

| ID | Item | Na app | Referência | Decisão |
|---|---|---|---|---|
| T1 | Envelope do 2º piso da casa | mE 16,90→26,10, mN 1,90→7,60 | casa: mE 17,00→25,10, mN 2,00→7,75. Hoje **sobra 1,00 m a leste** e falta 0,15 ao norte | ajustar |
| T2 | Laje 1 da casa | mE 16,87→26,60, mN 1,40→8,50 | laje construída: mE 17,00→25,70, mN 1,40→8,35 | ajustar |
| T3 | Pilares do 2º piso | 12, grade antiga: **7 sem pilar embaixo** (1,0 a 1,7 m do mais próximo) | continuar os 13 pilares oficiais (`PILARES`) | arquiteta |
| T4 | Vigas do teto do 2º piso | grade antiga, altura 0,45 | apoiar nos novos pilares | arquiteta |
| T5 | Cômodos do 2º piso da casa | grade 3 × 3 m sobre 9,00 m: acesso, suíte, 2 banheiros, closet | envelope de 8,10 m e pilares irregulares: **refazer o layout** | decidir |
| T6 | Portas e janelas do 2º piso | tabelas `F2_DOORS` e `F2_WINDOWS` nas posições antigas | seguem T5 | decidir |
| T7 | Paredes do 2º piso | 0,20 | 0,15 como o térreo, ou o que a estrutura pedir | arquiteta |
| T8 | Telhado solar da casa | calculado em parte pelos eixos novos, em parte pelos beirais antigos (mN 1,565→8,585) | recalcular sobre o envelope novo | ajustar |
| T9 | Calha norte da casa | mN 8,40; beira do telhado em 8,585 | seguir o telhado | ajustar |
| T10 | Prumada da casa | na junta, mE 16,85→16,95 | reposicionar com G1 | ajustar |
| T11 | Descidas e calhas do V1 | duas descidas na face sul, sem uso com o telhado ao norte | ficam, são removidas ou reaproveitadas | decidir |
| T12 | Caixa d'água | o V3 remove o volume e **nenhum reservatório aparece** | onde fica a água do sobrado? | decidir |
| T13 | Prolongamento da parede oeste | "aba" antiga | depende de E8 | arquiteta |
| T14 | Esgoto | sistema da prancha, sem capacidade informada | V3 com 3 dormitórios (térreo vira despensa): **6 pessoas de referência** | arquiteta |
| T15 | Ficha de Medidas do V3 | áreas e cômodos do 2º piso antigos | atualizar depois de T5 | ajustar |

---

## 3. Decisões para o cliente

| Ref. | Pergunta | Sugestão |
|---|---|---|
| G3 | Alinhar a face sul da garagem à da casa (2,00)? | Sim: mantém o recuo de 2,00 m |
| G4, G5 | Garagem no padrão da casa (laje 0,10, platibanda até +3,95)? | Laje igual; platibanda igual, para a fachada ler como um volume só |
| G6 | Manter a platibanda oeste da casa no V2? | Sim: já estará construída |
| G9 | A porta oficial fica 0,47 m ao norte do fim da escada. Aceitável? | Sim: há 1,5 m livres entre o pé da escada e a porta |
| T5 | Refazer o 2º piso da casa: manter o programa (acesso, suíte, 2 banhos, closet) em 8,10 m? | Sim, com proposta numerada depois da resposta X1 |
| T11 | Descidas do V1 no V3? | Remover do modelo |
| T12 | Reservatório no V3? | Perguntar à arquiteta junto com X1 |

## 4. Para acrescentar às perguntas da arquiteta

- **T12:** com o sobrado, onde fica o reservatório, e com qual volume?
- **T7:** a alvenaria do 2º piso pode ter 0,15?

## 5. Ordem proposta

1. **V2:** G1, G2, G7 e G8 agora; G3 a G6 e G9 depois das suas respostas.
2. **V3, parte independente da estrutura:** T1, T2, T8, T9 e T10, para o volume assentar na casa nova.
3. **V3, depois da arquiteta:** T3, T4, T5, T6, T7, T14 e, por fim, T15.
