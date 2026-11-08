# Perguntas para a migração do V1

Marque um `[x]` e escreva o que precisar na linha **Resposta**. Pode deixar em branco o que ainda não
souber: nada aqui impede a refatoração, só a camada de migração correspondente.

Os códigos entre parênteses são os itens de [RECONCILIACAO-V1.md](RECONCILIACAO-V1.md).
A indicação **Sugestão** é a minha recomendação; a decisão é sua.

---

## Parte 1 · Para você responder

### Situação do projeto

**1. O projeto R00 já foi protocolado na prefeitura ou enviado à Caixa?**
Define se as respostas da Parte 2 ainda podem mudar o projeto ou só esclarecem o que já está lá.

- [X] Ainda não
- [ ] Protocolado ou enviado, em análise
- [ ] Já aprovado

**Resposta:**

**2. Posso manter tudo na branch `feat/v1-oficial` até o V1 estar completo?**
Durante a migração, V2 e V3 ficam desalinhados. Numa branch separada, o site continua mostrando a versão atual até você dizer "concluído".

- [X] Sim (**Sugestão**)
- [ ] Não, prefiro publicar a cada etapa, aceitando V2/V3 desalinhados no site

**Resposta:**

### Cozinha e estar

**3. Como fica a cozinha? (M1)**
O projeto desenha só uma bancada de 0,60 × 1,20 m na parede norte, sob a janela. A cozinha tem cerca de 3,75 × 2,80 m, com a porta dos fundos na parede leste e a porta do dormitório na parede sul, o que dificulta fechar um U.

- [X] Linear na parede norte: pia sob a janela, fogão, bancada e geladeira (**Sugestão**)
- [ ] Em L, parede norte + parede leste, até a porta dos fundos
- [ ] Manter o U com península, adaptado, mesmo reduzindo a passagem
- [ ] Outra

**Resposta:**

**4. Mantém o canto alemão? (M2)**

- [ ] Sim, adaptado ao novo espaço
- [ ] Trocar por mesa com cadeiras, mais simples de encaixar (**Sugestão**)
- [X] Decidir depois de ver a cozinha no novo layout

**Resposta:**

**5. Sala: mantenho sofá, rack, TV e mesa de centro, reposicionados? (M10)**
O projeto indica ponto de TV na parede oeste, como já é na app.

- [X] Sim, com a TV na parede oeste (**Sugestão**)
- [ ] Mudar. Como:

**Resposta:**

**6. O hall encolhe para 1,15 m. O que fica nele? (M11)**

- [X] Só o tapete; tirar a sapateira (**Sugestão**)
- [ ] Manter tapete e uma sapateira rasa
- [ ] Nada

**Resposta:**

### Dormitório e lavanderia

**7. Dormitório de 3,60 × 2,50 m: mantenho cama de casal e guarda-roupa? (M9)**
As janelas ficam nas paredes leste e sul, e a porta na parede norte, perto do canto oeste.

- [ ] Sim, e me proponha opções de posição (**Sugestão**)
- [X] Sim, com esta disposição:

**Resposta:** Na planta oficial já estão localizadas as tomadas dos criados mudos. Então a posição da cama já está definida lá.

**8. Lavanderia: mantenho o armário alto? (M8)**
O tanque e a máquina passam para a parede oeste, seguindo o projeto. O ambiente tem 1,30 m de largura.

- [X] Remover (**Sugestão**)
- [ ] Manter, raso, na parede leste

**Resposta:**

### Terreno

**9. Perfil do terreno (N3)**
O projeto dá 00 na testada, −0,30 a 17 m e −0,50 a 25,1 m, sem cota nos fundos. A app usa 2,5 % constante, vindo da sua visita (−1,00 m nos fundos).

- [ ] Passar pelos pontos oficiais e manter −1,00 m nos fundos (**Sugestão**)
- [X] Seguir o mesmo declive oficial até os fundos (cerca de −0,80 m)

**Resposta:**

**10. A cisterna continua nos planos? (S5)**
Ela constava nas notas do projeto, mas não aparece na A01 nem no Memorial.

- [ ] Sim, e vou pedir para incluir no projeto
- [X] Sim, mas como etapa futura, fora do projeto atual
- [ ] Não

**Resposta:**

### O que representar na app

**11. Fossa, filtro, sumidouro, caixas de inspeção e de gordura (S1–S4)**

- [X] Só no 2D e na ficha de Medidas, por estarem enterrados (**Sugestão**)
- [ ] Também no 3D, como volumes simples
- [ ] Não representar

**Resposta:** Tambem quero documentado o que é suportado, quantas pessoas esse sistema suporta.

**12. Faixa permeável de 6,00 × 12,50 m nos fundos (L5)**
Ela tem exatamente o mínimo exigido (15 %), então não sobra margem para pavimentar ali.

- [X] Mostrar no 2D e na ficha (**Sugestão**)
- [ ] Não representar

**Resposta:**

**13. Rebaixo do meio-fio no extremo norte da testada (L6)**

- [ ] Mostrar só no 2D (**Sugestão**)
- [ ] Mostrar no 2D e no 3D
- [X] Não representar

**Resposta:**

**14. Tesouras e terças do telhado, sobre a laje (C3)**
Só apareceriam no 3D com a telha oculta.

- [X] Não modelar (**Sugestão**)
- [ ] Modelar de forma simples

**Resposta:**

**15. Calhas (C12)**

- [X] Modelar de forma simples (**Sugestão**)
- [ ] Não modelar

**Resposta:**

**16. Rótulo do quarto na app (D6)**

- [X] "Dormitório", como no projeto (**Sugestão**)
- [ ] "Quarto"

**Resposta:**

---

## Parte 2 · Para levar à arquiteta

**17. A estrutura está dimensionada para o 2º pavimento do V3? (X1) — a mais importante**
A prancha e o memorial não mencionam expansão, esperas ou reforço. Os dados escritos são laje de 10 cm, viga de 15 × 30 cm, ferro de 10 mm e micro estaca com bloco de coroamento. Existe projeto estrutural, já que o RRT registra "projeto de estrutura de concreto"? Ele considera a carga do pavimento superior?

**Resposta:**

**18. O solo junto às faces norte e oeste é −30 ou 00? (N1)**
A planta e a Localização indicam −30; os cortes e as fachadas indicam 00. A cota de 60 cm até o piso só fecha com −30.

**Resposta:**

**19. O volume da caixa d'água fica sobre o banho ou sobre a lavanderia? (C8)**
Localização, hidrossanitária e Corte AA indicam o banho; Corte BB e Fachada Norte, a lavanderia.

**Resposta:**

**20. Qual é a função do prolongamento de 60 cm da parede oeste, além da face sul? (E8)**

**Resposta:**

**21. A linha fina no banho, a 80 cm da parede sul, é o limite do box? (M5)**

**Resposta:**

**22. As janelas 80x60/150 do banho e da lavanderia são de que tipo?**
Correr, basculante ou maxim-ar: o desenho não define.

**Resposta:**

**23. Qual é o término previsto da obra?**
Os documentos divergem entre 2027 e 2028.

**Resposta:**

**24. O plano de resíduos não precisa informar transportador e destino final?**
Esses campos não constam no documento.

**Resposta:**
