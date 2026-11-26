# Gen V: Campus Godolkin — Prólogo Completo V0.3.1

## Correção nesta atualização (V0.3.1)
- **Correção da Tela Preta:** Corrigido um erro de sintaxe na expressão regular da função `formatNarrative` dentro de `game.js` (`/\n\s*\n|\n/g` havia sido salvo com quebras de linha literais dentro da regex, impedindo a execução do script).
- **Cache Busting:** Atualizados os parâmetros `?v=0.3.1` em `index.html` para garantir recarregamento imediato no Render e dispositivos móveis.

## Recursos da V0.3.x
1. **5 Poderes Exclusivos do Protagonista:** Hemocinese, Superforça & Invulnerabilidade, Tecnopatia, Telecinese e Troca de Corpo (nenhum NPC repete seu poder).
2. **Calouro Sempre no 1º Ano:** Independentemente de escolher 18, 19 ou 20 anos, o protagonista entra como Calouro do 1º ano.
3. **Prólogo de Origem em 3 Atos:**
   - **Ato I (Infância):** Cena exclusiva para cada um dos 5 poderes.
   - **Ato II (Os De Cima):** O recrutamento pela Vought e o contrato com a sua família.
   - **Ato III (Chegada ao Campus):** Introdução gradual aos 6 alunos (Matteo, Maya, Clara, Otávio, Zoe e Luka) com intimidade começando baixa.
4. **Escolhas Bloqueadas Sem Spoiler:** Quando falta atributo ou característica, exibe apenas `[Requer Controle: 3]` (ou o traço exigido) sem revelar a ação secreta.
5. **Alunos de Godolkin Interativo:** Clique no card de qualquer um dos 6 personagens para abrir seu dossiê completo, nível de intimidade com o seu personagem e relações cruzadas com os outros 5 alunos.
