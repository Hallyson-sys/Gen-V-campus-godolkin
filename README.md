# Gen V: Campus Godolkin — 0.9.0

Abra index.html ou publique os arquivos na raiz do repositório. Não crie pasta assets: campus.webp e grain.webp ficam junto do CSS.

## Novidades
- 54 cenas, incluindo recepção, dormitórios, dois intervalos exploráveis e encontros opcionais.
- Mapa esquemático interativo com 13 locais e posições narrativas dos seis alunos principais e protagonista. Deslocamento nos intervalos liberados.
- Memórias individuais e notificações de escolhas relevantes, registradas no diário; consequências do favor de Clara e regras do quarto reaparecem em cenas posteriores.
- Dois encontros pela manhã; até três atividades à tarde (duas se aceitar o favor).
- Diálogos de abertura revisados e títulos sem numeração de turnos.
- Chaves de saves anteriores preservadas. Para experimentar as novas cenas, comece uma partida nova em outro slot.

## Verificação
Sintaxe JS, destinos de cenas e teste de lógica em Node com DOM simulado. Navegação real no navegador de teste bloqueada pelo ambiente; verificar visual e demais caminhos no Render.

## 0.10.0 — Ficha de matrícula
- 6 etapas de criação; 7 arquétipos, 11 poderes, 5 qualidades e 3 defeitos.
- Histórico familiar, motivação e revisão documental; escolhas exclusivas em cenas selecionadas.
- Personalidade atual pode mudar por decisões marcadas; perfil inicial permanece no dossiê.
- Saves antigos continuam usando a mesma chave; origem e motivação não registradas aparecem como tal. Comece em outro slot para experimentar a nova matrícula.
- Mapa e imagens na raiz preservados.

## 0.11.0 — Elenco e vínculos
- Seis histórias pessoais opcionais com confidências, escolhas, memórias e retornos na festa.
- Afinidade, confiança, respeito, rivalidade e proximidade; dossiês com campos desbloqueáveis.
- Rotinas narrativas no mapa, conversa opcional entre Clara e Matteo e evento independente de Luka e Otávio.
- Novas opções de convivência nos dormitórios. As histórias são introduções, não arcos completos; o prólogo conserva o limite de atividades, incentivando outras partidas.
- Saves antigos mantêm os dados e recebem indicadores iniciais na primeira interação.

## 0.12.0 — Celular, Vought+ e finais
- Matteo Valença no elenco e ranking; diálogos mantêm o primeiro nome.
- Celular liberado na chegada ao campus, mensagens condicionais e respostas predefinidas com efeitos de confiança; contatos, agenda, mapa, ranking, notícias, arquivos e perfil.
- Vought+ local e fictícia: publicações, curtidas, comentários e seguir contatos, salvos por slot. Reputação calculada a partir das decisões e atividade; não há servidor social real.
- Seis resultados do prólogo, calculados por escolhas, vínculos, reputação e pistas; retrospectiva e resultado preservado no save. Capítulo I ainda não implementado.
- Testes estáticos de sintaxe e integridade; teste visual e todas as combinações ainda pendentes.

## 0.13.0 — Vínculos e relacionamentos
- Afinidade e indicadores sociais recalibrados; ganhos normais de 1–3, excepcionais de 4. Respostas por mensagem dão no máximo 1 de confiança.
- Escolhas de amizade independentes e equivalentes, sem penalidade por encerrar histórias pessoais. Interesse opcional apenas no final do prólogo, sem namoro automático ou reciprocidade presumida. Matteo e Zoe continuam comprometidos.
- Saves anteriores preservam seus valores; comece em novo slot para avaliar o ritmo. Relacionamentos completos ficam para capítulos futuros.

## 0.14.0 — Imersão e continuidade
- Respostas específicas por mensagem, armazenadas como exibidas.
- Interface de conversas e Vought+ renovada.
- Apresentações condicionadas aos colegas de dormitório.
- Encerramentos dos encontros matinais retornam ao pátio; a arena permanece uma escolha explícita.
- Mantidos limites de exploração e progressão social da 0.13.0.

## 0.15.0 — Convivência e continuidade
- Três mesas/alternativas de almoço, conversa coletiva, até duas conversas individuais sem repetição, respostas narrativas próprias, despedida e retorno à exploração.
- O aviso do tablet ocorre após o intervalo; mapa visual preservado.
- Contexto de dormitório, encontros, arena e respostas de Otávio no celular.
- Novos ganhos sociais de 0–1 por resposta. Saves que já passaram do almoço não são reiniciados.


## 0.16.0 — Continuidade e diálogos
- 114 cenas; seis histórias pessoais com respostas próprias, reações e uma segunda decisão; novos momentos no bar, no almoço e nos dormitórios.
- Diálogos antigos com fala separada da narração; remoção de reações repetidas e correção das memórias na varanda.
- Mapa e CSS mantidos; scripts com identificador 0.16.0. Saves anteriores continuam no mesmo slot; cenas já concluídas não são repetidas automaticamente.
- Testes: sintaxe, grafo de destinos e consistência das novas condições. Não foi realizado teste integral em navegador.
- Reação do grupo antes de voltar ao alojamento; o final permanece calculado pelas escolhas anteriores.
