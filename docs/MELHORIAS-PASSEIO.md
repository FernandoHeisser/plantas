# Melhorias encontradas no passeio em 1ª pessoa

Tour feito em 2026-11-18 com o botão **Caminhar** (V1, V2 e V3), cômodo por cômodo.
Medidas em metros, coordenadas de código (sem `OE`) quando citadas.

## Casa

| # | Onde | O que foi visto | Proposta | Prioridade |
|---|---|---|---|---|
| C1 | Estar × península (V1/V2/V3) | Encosto do sofá (mE 25,20) a **~0,40 m** das banquetas (mE ~25,6). Quem senta fica com as costas no sofá; não há passagem entre os dois | Puxar sofá, mesa de centro e rack **0,30 m p/ oeste** (TV continua a ~2,2 m do sofá) → folga de ~0,70 m; ou tirar a banqueta do meio | **feito** (sem mesa de centro, sofá 0,30 m p/ oeste) |
| C2 | Escada da garagem (V2/V3) | Lado norte da escada **aberto, sem corrimão nem guarda-corpo**. No alto, a queda chega a ~2,8 m | Guarda-corpo de 1,10 m no lado aberto + corrimão (NBR 9077) | **feito** (guarda-corpo 1,10 m com montantes a ≤ 0,11 m + corrimãos a 0,90 m nos dois lados) |
| C3 | Laje da garagem (V2) | No V2 a escada termina na laje de cobertura; o vão na laje não tem proteção | Guarda-corpo em volta do vão na laje (ou alçapão), até o V3 | média |
| C4 | Sala íntima (V3, 2º piso) | Sofá a ~1,65 m da TV | Bom para TV até ~43"; para 50"+ trocar o sofá por um mais raso ou usar poltronas | baixa |
| C5 | Quarto 2 e escritório (V3, 2º piso) | Janelas panorâmicas a **oeste** (sol da tarde, reflexo na tela do escritório) | Janela menor ou brise vertical/veneziana (já levantado na análise do 2º piso) | média |
| C6 | Despensa (V3) | Torre quente (forno + micro-ondas) num cômodo que fecha | Garantir tomada 220 V dedicada e ventilação (as janelas leste e sul ajudam) | baixa |
| C7 | Banheiro dos quartos (V3) | Janela de 1,00 m sobre o box | Modelo maxim-ar (não deixa entrar chuva no box) | baixa |

## Passeio (a própria ferramenta)

| # | O que foi visto | Proposta |
|---|---|---|
| P1 | Passa por vãos estreitos (ex.: 0,40 m entre sofá e banquetas): a colisão só olha p/ frente, não p/ os ombros | Raios também nas laterais do corpo (±0,25 m) |
| P2 | Pontos de partida ruins: "Estar" nasce atrás do sofá, "Dormitório" de cara para o guarda-roupa, "Lavanderia" com o nariz na parede | Reposicionar e reorientar em `walkPlaces` |
| P3 | À noite, as paredes externas ficam claras demais (reflexo de ambiente da cena) | Baixar a intensidade do ambiente junto com o sol |
