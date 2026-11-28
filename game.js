/* Gen V: Campus Godolkin — Motor Jogável V0.16.0
 * Inclui:
 * - Ranking Oficial Completo (#1 ao #100) com Elenco Principal, 92 NPCs da Universidade e o Protagonista
 * - Aba "RANKING" no Menu Principal e no Drawer com filtros (Top 10, Perto de Você, Calouros, Todos #1–#100)
 * - Notificação instantânea na tela sempre que o jogador sobe ou desce no Ranking!
 */
(() => {
  'use strict';

  const DATA = window.GV_STORY;
  if (!DATA?.scenes) {
    document.getElementById('app').textContent = 'Erro ao carregar story.js. Verifique se todos os arquivos foram extraídos juntos.';
    return;
  }

  const SCENES = DATA.scenes;
  const CAST = DATA.cast;
  const root = document.getElementById('app');
  const SAVE_KEY = 'genv_godolkin_v03_slot_';

  const ARQUETIPOS = [{"id": "prodigio", "nome": "O Prodígio Ambicioso", "tag": "Reconhecimento", "desc": "Vantagem: Reconhecimento. Desafio: Pressão por resultados."}, {"id": "cetico", "nome": "O Rebelde", "tag": "Questionamento", "desc": "Vantagem: Questionamento. Desafio: Atritos com a diretoria."}, {"id": "estrategico", "nome": "O Estrategista", "tag": "Leitura de pistas", "desc": "Vantagem: Leitura de pistas. Desafio: Confiança conquistada aos poucos."}, {"id": "protetor", "nome": "O Protetor", "tag": "Cooperação", "desc": "Vantagem: Cooperação. Desafio: Dilemas de lealdade."}, {"id": "reservado", "nome": "O Forasteiro", "tag": "Observação", "desc": "Vantagem: Observação. Desafio: Integração gradual."}, {"id": "carismatico", "nome": "O Carismático", "tag": "Conexões sociais", "desc": "Vantagem: Conexões sociais. Desafio: Exposição pública."}, {"id": "idealista", "nome": "O Idealista", "tag": "Integridade", "desc": "Vantagem: Integridade. Desafio: Decepções institucionais."}];

  const PODERES = [
    {
      id: 'hemocinese',
      nome: 'Hemocinese (Controle Sanguíneo)',
      desc: 'Solidifica o próprio sangue em lâminas ou barreiras e detecta batimentos cardíacos à distância.',
      custo: 'Custo: consome energia e exige controle.'
    },
    {
      id: 'superforca',
      nome: 'Superforça & Invulnerabilidade',
      desc: 'Força física descomunal e resistência extrema a impactos pesados, quedas e disparos.',
      custo: 'Custo: Risco constante de destruir o ambiente ou revelar força excessiva.'
    },
    {
      id: 'tecnopatia',
      nome: 'Tecnopatia (Mimetismo Digital)',
      desc: 'Invade sistemas eletrônicos, câmeras, drones e servidores pelo toque ou proximidade.',
      custo: 'Custo: Sem vantagem física direta; vulnerável a sobrecargas elétricas.'
    },
    {
      id: 'telecinese',
      nome: 'Telecinese (Manipulação Cinética)',
      desc: 'Move, arremessa ou esmaga objetos e alvos à distância usando apenas a mente.',
      custo: 'Custo: Exige Controle alto; emoções fortes causam ondas de choque acidentais.'
    },
    {
      id: 'troca_corpo',
      nome: 'Troca de Corpo / Fluidez',
      desc: 'Alterna entre uma forma densa ultra-resistente e outra forma ágil de alta mobilidade.',
      custo: 'Custo: Alto desgaste metabólico e dificuldade de estabilizar transições sob estresse.'
    }
  ];

  PODERES.push(...[{"id": "eletrocinese", "nome": "Eletrocinese", "desc": "Pequenos campos elétricos luminosos", "custo": "Limitação: Concentração prolongada"}, {"id": "umbracinese", "nome": "Umbracinese", "desc": "Formas feitas de sombra", "custo": "Limitação: Luz intensa limita o alcance"}, {"id": "criocinese", "nome": "Criocinese", "desc": "Formação de cristais de gelo", "custo": "Limitação: Mudanças rápidas cansam"}, {"id": "campos_forca", "nome": "Campos de força", "desc": "Barreiras luminosas", "custo": "Limitação: Duração limitada"}, {"id": "duplicacao", "nome": "Duplicação", "desc": "Cópias temporárias", "custo": "Limitação: Atenção dividida"}, {"id": "ilusionismo", "nome": "Ilusionismo", "desc": "Imagens sensoriais fictícias", "custo": "Limitação: Exige foco contínuo"}]);
  const ORIGENS = [{"id": "influente", "nome": "Família influente", "desc": "Em casa, o sobrenome abria portas, mas também trazia expectativas."}, {"id": "comum", "nome": "Família comum", "desc": "Em casa, o cotidiano era simples e os holofotes pareciam distantes."}, {"id": "legado", "nome": "Legado de super-heróis", "desc": "As histórias de antigos heróis faziam parte das conversas de família."}, {"id": "estrela", "nome": "Ex-estrela juvenil", "desc": "Você conhecia os bastidores das câmeras antes mesmo de entender a fama."}, {"id": "anti", "nome": "Família anti-Vought", "desc": "Em casa, as campanhas da Vought eram recebidas com perguntas, não aplausos."}, {"id": "confidencial", "nome": "Passado confidencial", "desc": "Havia lacunas nos registros da sua infância que ninguém explicava."}];
  const MOTIVOS = [{"id": "sete", "nome": "Integrar os Sete"}, {"id": "segredos", "nome": "Descobrir os segredos da Vought"}, {"id": "controle", "nome": "Aprender a controlar os poderes"}, {"id": "independencia", "nome": "Conquistar independência"}, {"id": "ajudar", "nome": "Ajudar outras pessoas"}, {"id": "valor", "nome": "Provar seu valor"}, {"id": "indefinida", "nome": "Ainda não sabe o que deseja"}];
  const labelOf = (list,id) => list.find(x=>x.id===id)?.nome || "Não registrado";
  const CARACTERISTICAS = [
    { id: 'carismatico', nome: 'Carismático', sub: 'Atrai aliados e agrada câmeras', tipo: 'normal' },
    { id: 'manipulador', nome: 'Manipulador', sub: 'Explora inseguranças em diálogos', tipo: 'normal' },
    { id: 'observador', nome: 'Observador', sub: 'Nota pistas ocultas e mentiras', tipo: 'normal' },
    { id: 'leal', nome: 'Leal', sub: 'Ganha confiança profunda de amigos', tipo: 'normal' },
    { id: 'sarcastico', nome: 'Sarcástico', sub: 'Respostas afiadas sob pressão', tipo: 'normal' },
    { id: 'paranoico', nome: 'Paranoico', sub: 'Difícil de emboscar, mas desconfiado', tipo: 'normal' },
    { id: 'estudioso', nome: 'Estudioso', sub: 'Conhece a biologia do Composto V', tipo: 'normal' },
    { id: 'influencer', nome: 'Influencer', sub: 'Já entra com base de seguidores', tipo: 'normal' },
    { id: 'empatico', nome: 'Empático', sub: 'Lê emoções e acalma aliados', tipo: 'normal' },
    { id: 'frio_pressao', nome: 'Frio sob Pressão', sub: 'Não entra em pânico no caos', tipo: 'normal' },
    { id: 'atletico', nome: 'Atlético', sub: 'Ótimo em fugas, saltos e esquivas', tipo: 'normal' },
    { id: 'briguento', nome: 'Briguento', sub: 'Luta suja mesmo sem poderes', tipo: 'normal' },
    { id: 'tolerancia_dor', nome: 'Tolerância à Dor', sub: 'Aguenta ferimentos graves de pé', tipo: 'normal' },
    { id: 'furtivo', nome: 'Furtivo', sub: 'Age em silêncio à noite', tipo: 'normal' },
    { id: 'metabolismo', nome: 'Metabolismo Rápido', sub: 'Recupera vitalidade entre cenas', tipo: 'normal' },
    { id: 'intimidador', nome: 'Intimidador', sub: 'Impõe respeito pela postura', tipo: 'normal' },
    { id: 'maos_firmes', nome: 'Mãos Firmes', sub: 'Precisão cirúrgica com poderes', tipo: 'normal' },
    { id: 'resistente', nome: 'Resistente', sub: 'Suporta sedativos e toxinas', tipo: 'normal' },
    { id: 'agil', nome: 'Ágil', sub: 'Reage primeiro em emboscadas', tipo: 'normal' },
    { id: 'voz_comando', nome: 'Voz de Comando', sub: 'Coordena equipes em crise', tipo: 'normal' },
    { id: 'pavio_curto', nome: 'Pavio Curto', sub: 'Risco de surto ao ser provocado', tipo: 'flaw' },
    { id: 'segredo_sombrio', nome: 'Segredo Sombrio', sub: 'Esconde um incidente do passado', tipo: 'flaw' },
    { id: 'insonia', nome: 'Insônia', sub: 'Alerta à noite, exausto de dia', tipo: 'flaw' },
    { id: 'adrenalina', nome: 'Viciado em Risco', sub: 'Foca no perigo, entedia-se fácil', tipo: 'flaw' },
    { id: 'alvo_midia', nome: 'Alvo da Mídia', sub: 'Imprensa vigia cada passo seu', tipo: 'flaw' },
    { id: 'culpa', nome: 'Hesitação Moral', sub: 'Evita usar força letal', tipo: 'flaw' },
    { id: 'aprovacao', nome: 'Busca Aprovação', sub: 'Vulnerável a figuras de autoridade', tipo: 'flaw' },
    { id: 'instavel', nome: 'Poder Instável', sub: 'Oscila com raiva ou medo intenso', tipo: 'flaw' },
    { id: 'rebelde', nome: 'Insubordinado', sub: 'Dificuldade em aceitar ordens', tipo: 'flaw' },
    { id: 'lealdade_dividida', nome: 'Lealdade Dividida', sub: 'Contatos externos cobram favores', tipo: 'flaw' }
  ];

  CARACTERISTICAS.push(...[{"id": "orgulho", "nome": "Orgulho", "sub": "Dificuldade em admitir erros", "tipo": "flaw"}, {"id": "desconfiado", "nome": "Desconfiança", "sub": "Demora a aceitar ajuda", "tipo": "flaw"}, {"id": "competitivo", "nome": "Competitividade excessiva", "sub": "Pressão por resultados", "tipo": "flaw"}, {"id": "teimoso", "nome": "Teimosia", "sub": "Dificuldade em mudar de ideia", "tipo": "flaw"}, {"id": "medo_fracasso", "nome": "Medo do fracasso", "sub": "Hesita diante de expectativas", "tipo": "flaw"}]);
  const traitCount = (kind) => draft.caracteristicas.filter(id=>CARACTERISTICAS.find(t=>t.id===id)?.tipo===kind).length;
  const ATRIBUTOS_INFO = [
    { id: 'potencia', nome: 'Potência', desc: 'Força física bruta e impacto destrutivo do poder.' },
    { id: 'controle', nome: 'Controle', desc: 'Precisão técnica, furtividade e estabilidade emocional.' },
    { id: 'intelecto', nome: 'Intelecto', desc: 'Investigação, estratégia, tecnologia e leitura de pistas.' },
    { id: 'carisma', nome: 'Carisma', desc: 'Persuasão natural, mídia, liderança e imagem pública.' },
    { id: 'vigor', nome: 'Vigor', desc: 'Resistência física e fôlego para pagar o custo dos poderes.' }
  ];

  const BASE_BONDS = {
    matteo: 25,
    maya: 28,
    clara: 32,
    otavio: 30,
    zoe: 25,
    luka: 30
  };

  const BASE_ROMANCE = {
    maya: 0,
    clara: 0,
    otavio: 0,
    luka: 0
  };

  // Banco completo de 100 alunos do Ranking Oficial de Godolkin (Top 1 ao #100)
  const CAMPUS_ROSTER_BASE = [
    { basePos: 1, name: 'Dante Mercer', year: '3º Ano', power: 'Fotocinese Solar', tag: 'ELITE VOUGHT', castId: null },
    { basePos: 2, name: 'Matteo Valença', year: '3º Ano', power: 'Pirocinese', tag: 'ELITE VOUGHT', castId: 'matteo' },
    { basePos: 3, name: 'Valerie Cross', year: '3º Ano', power: 'Criocinese & Blindagem', tag: 'ELITE VOUGHT', castId: null },
    { basePos: 4, name: 'Zoe Lee', year: '2º Ano', power: 'Eletrocinese', tag: 'ELITE VOUGHT', castId: 'zoe' },
    { basePos: 5, name: 'Maya Dunlap', year: '2º Ano', power: 'Persuasão Tátil', tag: 'ELITE VOUGHT', castId: 'maya' },
    { basePos: 6, name: '[REGISTRO BLOQUEADO · F-01]', year: '2º Ano', power: 'Transferência Sigilosa', tag: 'SUSPENSO', castId: null, missing: true },
    { basePos: 7, name: 'kieran Thorne', year: '3º Ano', power: 'Grito Sônico', tag: 'ELITE VOUGHT', castId: null },
    { basePos: 8, name: "Otávio O'Connor", year: '2º Ano', power: 'Empatia & Absorção Cinética', tag: 'ELITE VOUGHT', castId: 'otavio' },
    { basePos: 9, name: 'Sienna Park', year: '2º Ano', power: 'Invisibilidade Óptica', tag: 'ELITE VOUGHT', castId: null },
    { basePos: 10, name: 'Marcus Sterling', year: '3º Ano', power: 'Voo & Densidade Óssea', tag: 'ELITE VOUGHT', castId: null },
    { basePos: 11, name: 'Elena Rostova', year: '2º Ano', power: 'Magnetismo', tag: 'DESTAQUE', castId: null },
    { basePos: 12, name: 'Devon Brooks', year: '3º Ano', power: 'Elasticidade', tag: 'DESTAQUE', castId: null },
    { basePos: 13, name: 'Camila Navarro', year: '2º Ano', power: 'Projeção Astral', tag: 'DESTAQUE', castId: null },
    { basePos: 14, name: 'Luka Lancelloti', year: '1º Ano (Calouro)', power: 'Supervelocidade', tag: 'DESTAQUE', castId: 'luka' },
    { basePos: 15, name: 'Hector Alvarez', year: '2º Ano', power: 'Pele Metálica', tag: 'DESTAQUE', castId: null },
    { basePos: 16, name: 'Chloe Bennett', year: '3º Ano', power: 'Manipulação de Gravidade', tag: 'DESTAQUE', castId: null },
    { basePos: 17, name: 'Tariq Hassan', year: '2º Ano', power: 'Teletransporte Curto', tag: 'DESTAQUE', castId: null },
    { basePos: 18, name: 'Bianca Moretti', year: '2º Ano', power: 'Feromônios', tag: 'DESTAQUE', castId: null },
    { basePos: 19, name: 'Clara Vance', year: '1º Ano (Caloura)', power: 'Manipulação de Tamanho', tag: 'DESTAQUE', castId: 'clara' },
    { basePos: 20, name: 'Julian Pierce', year: '3º Ano', power: 'Visão Térmica', tag: 'DESTAQUE', castId: null },
    { basePos: 21, name: 'Naomi Takahashi', year: '2º Ano', power: 'Reflexos Preditivos', tag: 'DESTAQUE', castId: null },
    { basePos: 22, name: 'Rafael Costa', year: '2º Ano', power: 'Hidrocinese', tag: 'DESTAQUE', castId: null },
    { basePos: 23, name: 'Tessa Gallagher', year: '3º Ano', power: 'Regeneração Acelerada', tag: 'DESTAQUE', castId: null },
    { basePos: 24, name: 'Andre Whitaker', year: '2º Ano', power: 'Ondas Sísmicas', tag: 'DESTAQUE', castId: null },
    { basePos: 25, name: 'Sofia Lindqvist', year: '1º Ano (Caloura)', power: 'Campos de Força', tag: 'DESTAQUE', castId: null },
    { basePos: 26, name: 'Malik Henderson', year: '2º Ano', power: 'Mimetismo de Rocha', tag: 'DESTAQUE', castId: null },
    { basePos: 27, name: 'Isadora Lima', year: '2º Ano', power: 'Ilusão Sensorial', tag: 'DESTAQUE', castId: null },
    { basePos: 28, name: 'Connor Walsh', year: '3º Ano', power: 'Força Bruta', tag: 'DESTAQUE', castId: null },
    { basePos: 29, name: 'Mei-Ling Zhou', year: '2º Ano', power: 'Manipulação de Sombras', tag: 'DESTAQUE', castId: null },
    { basePos: 30, name: 'Gavin O’Malley', year: '2º Ano', power: 'Secreção Ácida', tag: 'DESTAQUE', castId: null },
    { basePos: 31, name: 'Larissa Mendes', year: '1º Ano (Caloura)', power: 'Geocinese', tag: 'INTERMEDIÁRIO', castId: null },
    { basePos: 32, name: 'Caleb Dawson', year: '2º Ano', power: 'Salto Propulsivo', tag: 'INTERMEDIÁRIO', castId: null },
    { basePos: 33, name: 'Amara Okafor', year: '2º Ano', power: 'Cura Celular', tag: 'INTERMEDIÁRIO', castId: null },
    { basePos: 34, name: 'enzo Pellegrini', year: '1º Ano (Calouro)', power: 'Aerocinese', tag: 'INTERMEDIÁRIO', castId: null },
    { basePos: 35, name: 'Hannah Kowalski', year: '2º Ano', power: 'Visão de Raio-X', tag: 'INTERMEDIÁRIO', castId: null },
    { basePos: 36, name: 'Diego Santoro', year: '3º Ano', power: 'Combustão de Toque', tag: 'INTERMEDIÁRIO', castId: null },
    { basePos: 37, name: 'Nadia Petrova', year: '2º Ano', power: 'Elasticidade Térmica', tag: 'INTERMEDIÁRIO', castId: null },
    { basePos: 38, name: 'Lucas Ferreira', year: '1º Ano (Calouro)', power: 'Sentidos Aguçados', tag: 'INTERMEDIÁRIO', castId: null },
    { basePos: 39, name: 'Jade Montgomery', year: '2º Ano', power: 'Camuflagem Camaleônica', tag: 'INTERMEDIÁRIO', castId: null },
    { basePos: 40, name: 'Owen Gallagher', year: '2º Ano', power: 'Endurecimento Epidérmico', tag: 'INTERMEDIÁRIO', castId: null },
    { basePos: 41, name: 'Beatriz Rocha', year: '1º Ano (Caloura)', power: 'Pulsos Estáticos', tag: 'INTERMEDIÁRIO', castId: null },
    { basePos: 42, name: 'Trevor Hayes', year: '2º Ano', power: 'Garras Ósseas', tag: 'INTERMEDIÁRIO', castId: null },
    { basePos: 43, name: 'Yumi Sato', year: '2º Ano', power: 'Equilíbrio Absoluto', tag: 'INTERMEDIÁRIO', castId: null },
    { basePos: 44, name: 'Mateus Oliveira', year: '1º Ano (Calouro)', power: 'Detecção de Calor', tag: 'INTERMEDIÁRIO', castId: null },
    { basePos: 45, name: 'Kira Volkov', year: '2º Ano', power: 'Duplicação Breve', tag: 'INTERMEDIÁRIO', castId: null },
    { basePos: 46, name: 'Noah Sinclair', year: '1º Ano (Calouro)', power: 'Pele de Quartzo', tag: 'INTERMEDIÁRIO', castId: null },
    { basePos: 47, name: 'Alice Carvalho', year: '1º Ano (Caloura)', power: 'Manipulação de Fumaça', tag: 'INTERMEDIÁRIO', castId: null },
    { basePos: 48, name: 'Brandon Cole', year: '1º Ano (Calouro)', power: 'Salto Cinético', tag: 'INTERMEDIÁRIO', castId: null },
    { basePos: 49, name: 'Samira Haddad', year: '2º Ano', power: 'Ressonância Vocal', tag: 'INTERMEDIÁRIO', castId: null },
    { basePos: 50, name: 'Thiago Ribeiro', year: '1º Ano (Calouro)', power: 'Força Muscular Leve', tag: 'INTERMEDIÁRIO', castId: null },
    { basePos: 51, name: 'Mila Novak', year: '2º Ano', power: 'Memória Fotográfica', tag: 'INTERMEDIÁRIO', castId: null },
    { basePos: 52, name: 'Davi Nogueira', year: '1º Ano (Calouro)', power: 'Toque Congelante', tag: 'INTERMEDIÁRIO', castId: null },
    { basePos: 53, name: 'Paige Turner', year: '2º Ano', power: 'Visão Noturna', tag: 'INTERMEDIÁRIO', castId: null },
    { basePos: 54, name: 'Samuel Boateng', year: '1º Ano (Calouro)', power: 'Resistência Térmica', tag: 'INTERMEDIÁRIO', castId: null },
    { basePos: 55, name: 'Clara Monteiro', year: '2º Ano', power: 'Controle de Planta', tag: 'INTERMEDIÁRIO', castId: null },
    { basePos: 56, name: 'Liam Gallagher', year: '1º Ano (Calouro)', power: 'Impulso Elástico', tag: 'INTERMEDIÁRIO', castId: null },
    { basePos: 57, name: 'Renata Barros', year: '2º Ano', power: 'Aderência em Paredes', tag: 'INTERMEDIÁRIO', castId: null },
    { basePos: 58, name: 'Victor Krum', year: '2º Ano', power: 'Sopro de Vendaval', tag: 'INTERMEDIÁRIO', castId: null },
    { basePos: 59, name: 'Helena Duarte', year: '1º Ano (Caloura)', power: 'Luminescência', tag: 'INTERMEDIÁRIO', castId: null },
    { basePos: 60, name: 'Joon-Ho Kim', year: '2º Ano', power: 'Reflexo Acústico', tag: 'INTERMEDIÁRIO', castId: null },
    { basePos: 61, name: 'pedro Alencar', year: '1º Ano (Calouro)', power: 'Mimetismo de Madeira', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 62, name: 'Zara Mensah', year: '1º Ano (Caloura)', power: 'Faíscas Estáticas', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 63, name: 'Dylan Harper', year: '2º Ano', power: 'Fôlego Anfíbio', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 64, name: 'Laura Siqueira', year: '1º Ano (Caloura)', power: 'Telepatia de Curto Alcance', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 65, name: 'Omar Farooq', year: '1º Ano (Calouro)', power: 'Velocidade de Corrida', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 66, name: 'tessa Vance-Kerr', year: '2º Ano', power: 'Visão Telescópica', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 67, name: 'Bruno Teixeira', year: '1º Ano (Calouro)', power: 'Dentes Retráteis', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 68, name: 'Chloe Moreau', year: '1º Ano (Caloura)', power: 'Neblina Local', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 69, name: 'kaio Santana', year: '1º Ano (Calouro)', power: 'Pele Borrachosa', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 70, name: 'Freya Lindholm', year: '2º Ano', power: 'Toque Febril', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 71, name: 'Arthur Melo', year: '1º Ano (Calouro)', power: 'Saliva Adesiva', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 72, name: 'Nina Dobrev-Lee', year: '1º Ano (Caloura)', power: 'Eco Localização', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 73, name: 'Hugo Vasconcelos', year: '2º Ano', power: 'Peso Aumentado', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 74, name: 'Maya Lin', year: '1º Ano (Caloura)', power: 'Coloração Capilar', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 75, name: 'Igor Sokolov', year: '1º Ano (Calouro)', power: 'Tolerância ao Frio', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 76, name: 'Camille Laurent', year: '1º Ano (Caloura)', power: 'Sussurro Direcional', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 77, name: 'Felipe Cardoso', year: '1º Ano (Calouro)', power: 'Unhas de Queratina', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 78, name: 'Sara Benitez', year: '2º Ano', power: 'Cheiro Aprimorado', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 79, name: 'leo Lombardi', year: '1º Ano (Calouro)', power: 'Micro-vibracão', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 80, name: 'Aisha Rahman', year: '1º Ano (Caloura)', power: 'Bússola Interna', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 81, name: 'Guilherme Pinto', year: '1º Ano (Calouro)', power: 'Flexibilidade Articular', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 82, name: 'Eva Lindstrom', year: '1º Ano (Caloura)', power: 'Piscar Estroboscópico', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 83, name: 'Henrique Farias', year: '1º Ano (Calouro)', power: 'Audição Seletiva', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 84, name: 'Talia Cohen', year: '2º Ano', power: 'Mudança de Voz', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 85, name: 'Victor Hugo Moraes', year: '1º Ano (Calouro)', power: 'Digestão Metálica', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 86, name: 'Clara Oswald', year: '1º Ano (Caloura)', power: 'Levitação de 10cm', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 87, name: 'Rodrigo Neves', year: '1º Ano (Calouro)', power: 'Brilho Ocular', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 88, name: 'Soraia Pires', year: '1º Ano (Caloura)', power: 'Suor Ácido Leve', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 89, name: 'benjamin Ross', year: '1º Ano (Calouro)', power: 'Prender Respiração 15m', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 90, name: 'Livia Castro', year: '1º Ano (Caloura)', power: 'Estática Capilar', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 91, name: 'Matias Silva', year: '1º Ano (Calouro)', power: 'Tato Amplificado', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 92, name: 'Giselle Paiva', year: '1º Ano (Caloura)', power: 'Imitação Gestual', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 93, name: 'Nicolas Prado', year: '1º Ano (Calouro)', power: 'Pulso Acelerado', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 94, name: 'Yara Fonseca', year: '1º Ano (Caloura)', power: 'Visão Periférica', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 95, name: 'cauã Rezende', year: '1º Ano (Calouro)', power: 'Pele Pigmentada', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 96, name: 'Estela Ramos', year: '1º Ano (Caloura)', power: 'Assovio Ultrassônico', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 97, name: 'danilo Borges', year: '1º Ano (Calouro)', power: 'Equilíbrio em Corda', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 98, name: 'Brenda Soares', year: '1º Ano (Caloura)', power: 'Calor nas Palmas', tag: 'ZONA DE CORTE', castId: null },
    { basePos: 99, name: 'Otávio Augusto', year: '1º Ano (Calouro)', power: 'Mimetismo de Cor', tag: 'ZONA DE CORTE', castId: null }
  ].map(item => ({
    ...item,
    name: item.name.startsWith('[') ? item.name : item.name.charAt(0).toUpperCase() + item.name.slice(1)
  }));

  const CHAIN_REACTIONS = [
    {
      id: 'origem_cicatriz',
      title: 'Marcas da Infância & Adolescência',
      teaser: 'O modo como você reagiu ao despertar do seu poder e viveu seus anos ocultos ainda ecoa no seu comportamento.',
      steps: [
        { when: f => f.infancia_escondeu || f.infancia_impos || f.infancia_descontrole || f.infancia_maestria, description: 'Você enfrentou o despertar do Composto V na infância e carregou essa marca pela adolescência.' },
        { when: f => f.adolescencia_cautela || f.adolescencia_treino || f.adolescencia_investigou, description: 'Seus anos ocultos moldaram seu preparo antes mesmo da chegada dos executivos da Vought.' },
        { when: f => f.motivacao_ambicao || f.motivacao_verdade || f.motivacao_controle || f.motivacao_negociador, description: 'Sua postura diante da Reitoria selou os termos da sua matrícula em Godolkin.' }
      ]
    },
    {
      id: 'olhar_reitoria',
      title: 'No Radar da Reitoria',
      teaser: 'Ser chamado ao gabinete do Diretor Victor Caldwell no primeiro dia colocou você sob observação direta.',
      steps: [
        { when: f => f.t2_dir_ambicioso || f.t2_dir_controle || f.t2_dir_questionou || f.t2_dir_diplomatico, description: 'Você ficou cara a cara com o Diretor Caldwell e definiu como ele enxerga o seu perfil.' },
        { when: f => f.t4_contou_tudo || f.t4_resumiu || f.t4_brincou, description: 'Sua decisão sobre revelar ou guardar o aviso das "transferências" moldou a confiança de Maya e Otávio.' }
      ]
    },
    {
      id: 'noite_torre_norte',
      title: 'Noite na Torre Norte',
      teaser: 'Na festa da cobertura, você circulou entre a elite do Ranking e os segredos da varanda.',
      steps: [
        { when: f => f.f2_matteo_honesto || f.f2_matteo_misterio || f.f2_matteo_desafiou, description: 'Você conversou longe das câmeras com Matteo e entendeu o peso do Top 2.' },
        { when: f => f.f5_usou_poder || f.f5_discreto, description: 'Sua postura durante o tumulto na pista definiu sua visibilidade antes da reunião na varanda.' },
        { when: f => f.pacto_investigacao || f.pacto_duplo || f.pacto_silencio, description: 'O pacto selado sob as estrelas definiu o rumo do grupo para o Capítulo 1.' }
      ]
    },
    {
      id: 'primeiros_coracoes',
      title: 'Fagulhas no Campus',
      teaser: 'Mesmo entre treinos e conspirações, gestos próximos e flertes começaram a criar conexões além da amizade.',
      steps: [
        { when: f => f.t5_flerte_maya || f.t5_flerte_clara || f.t5_flerte_otavio || f.t5_flerte_luka, description: 'Você demonstrou interesse romântico sutil durante o almoço no Refeitório Central.' },
        { when: f => f.f6_flerte_maya || f.f6_flerte_clara || f.f6_flerte_otavio || f.f6_flerte_luka, description: 'Na festa da Torre Norte, o clima a dois ficou ainda mais evidente antes da reunião na varanda.' }
      ]
    }
  ];

  let slot = 1;
  let save = null;
  let screen = 'menu';
  let drawerOpen = false;
  let castSelected = CAST[0]?.id || 'matteo';
  let chainSelected = null;
  let rankingFilter = 'all'; // 'all' | 'top10' | 'near' | 'freshmen'
  let chainFlash = null;
  let chainTimer = null;
  let rankFlash = null;
  let rankTimer = null;
  let memoryFlash = [], memoryTimer, mapSelected = null;

  let creatorStep = 1;
  let draft = null;

  const safe = (s) => String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

  function getFirstName(fullName) {
    const clean = String(fullName || '').trim();
    if (!clean) return 'Calouro';
    return clean.split(/\s+/)[0];
  }

  function resetDraft() {
    draft = {
      nome: '',
      idade: 18,
      pronomes: 'ele/dele',
      arquetipo: 'prodigio',
      origem: 'comum', motivacao: 'indefinida',
      poder_id: 'hemocinese',
      caracteristicas: [],
      atributos: { potencia: 1, controle: 1, intelecto: 1, carisma: 1, vigor: 1 }
    };
    creatorStep = 1;
  }

  function getRankTier(pos) {
    if (pos <= 10) return 'ELITE VOUGHT';
    if (pos <= 30) return 'DESTAQUE';
    if (pos <= 60) return 'INTERMEDIÁRIO';
    return 'ZONA DE CORTE';
  }

  // Monta a tabela dinâmica de 100 posições (#1 a #100) inserindo o jogador na sua posição exata
  function buildFullRankingList() {
    const playerRank = save ? Math.max(1, Math.min(100, save.perfil.ranking_campus)) : 48;
    const playerDelta = save ? (save.lastRankDelta || 0) : 0;
    const playerPowerObj = save ? PODERES.find(p => p.id === save.perfil.poder_id) : null;
    const playerPowerShort = playerPowerObj ? playerPowerObj.nome.split(' (')[0] : 'Mutação Composto V';

    const list = [];
    let npcIdx = 0;
    for (let pos = 1; pos <= 100; pos++) {
      if (pos === playerRank) {
        list.push({
          pos,
          name: save ? save.perfil.nome : 'Seu Aluno (Calouro)',
          year: '1º Ano (Calouro)',
          power: playerPowerShort,
          tag: getRankTier(pos),
          isPlayer: true,
          delta: playerDelta
        });
      } else {
        const npc = CAMPUS_ROSTER_BASE[npcIdx++] || {
          name: `Estudante #${pos}`,
          year: '1º Ano (Calouro)',
          power: 'Habilidade Latente',
          tag: getRankTier(pos),
          castId: null
        };
        list.push({
          pos,
          name: npc.name,
          year: npc.year,
          power: npc.power,
          tag: npc.tag,
          castId: npc.castId || null,
          missing: !!npc.missing,
          isPlayer: false,
          delta: 0
        });
      }
    }
    return list;
  }

  function chainStage(def, f) {
    let level = 0;
    for (let i = 0; i < def.steps.length; i++) {
      if (def.steps[i].when(f)) level = i + 1;
    }
    return level;
  }

  function readSlot(n) {
    try {
      const raw = localStorage.getItem(SAVE_KEY + n);
      if (!raw) return null;
      const obj = JSON.parse(raw);
      if (obj && obj.game === 'genv-campus-godolkin' && SCENES[obj.node]) {
        if (!obj.romance) obj.romance = { ...BASE_ROMANCE };
        if (typeof obj.lastRankDelta !== 'number') obj.lastRankDelta = 0;
        return obj;
      }
      return null;
    } catch {
      return null;
    }
  }

  function store() {
    if (!save) return;
    save.updated = Date.now();
    try {
      localStorage.setItem(SAVE_KEY + slot, JSON.stringify(save));
    } catch (e) {
      console.warn('Erro ao salvar no localStorage', e);
    }
  }

  function enter() {
    save = readSlot(slot);
    return save;
  }

  function getAttrLabel(attrId) {
    return ATRIBUTOS_INFO.find(a => a.id === attrId)?.nome || attrId;
  }

  function getTraitLabel(traitId) {
    return CARACTERISTICAS.find(c => c.id === traitId)?.nome || traitId;
  }

  function getRelationshipStatus(val, romVal = 0) {
    // Interest is separate from friendship; it never establishes a relationship.
    if (val >= 75) return { label: 'Confiança Plena / Aliado Próximo', cls: 'positive' };
    if (val >= 55) return { label: 'Amigável / Boa Intimidade', cls: 'positive' };
    if (val >= 40) return { label: 'Colega de Campus / Aproximando-se', cls: '' };
    if (val >= 25) return { label: 'Recém-Conhecidos / Cautela Inicial', cls: '' };
    return { label: 'Tensão / Desconfiança Aberta', cls: 'negative' };
  }

  function wordmark(hero = false) {
    return `<span class="gv-wordmark${hero ? ' gv-wordmark--hero' : ''}">
      <span class="gv-wordmark-top">CAMPUS GODOLKIN</span>
      <span class="gv-wordmark-bottom">GEN<span class="gv-wordmark-v">V</span></span>
    </span>`;
  }

  function header() {
    return `<header class="app-header">
      <button class="brand" data-action="menu" aria-label="Menu principal">${wordmark()}</button>
      <div class="header-right">
        <span class="header-status">${screen === 'menu' ? 'VOUGHT // DOSSIÊ' : 'PRÓLOGO · V0.16.0'}</span>
        <button class="menu-btn" data-action="drawer" aria-expanded="${drawerOpen}">
          <span class="menu-btn-bars">${drawerOpen ? '✕' : '☰'}</span>
          <span>${drawerOpen ? 'FECHAR' : 'MENU'}</span>
        </button>
      </div>
    </header>
    ${drawerOpen ? `<nav class="drawer" aria-label="Menu do jogo">
      ${save ? '<button data-action="resume">Retomar a história</button>' : ''}
      ${save ? '<button data-action="dossier">Ficha do Meu Aluno</button>' : ''}
      ${save ? '<button data-action="map">Mapa de Godolkin</button>' : ''}
      <button data-action="ranking">Ranking Oficial (#1–#100)</button>
      ${save ? '<button data-action="journal">Diário de Escolhas</button>' : ''}
      <button data-action="chain">Reação em Cadeia</button>
      <button data-action="cast">Alunos de Godolkin</button>
      <button data-action="slots">Partidas e Slots</button>
      <button data-action="export">Exportar Save (JSON)</button>
      <button data-action="import">Importar Save</button>
      <button data-action="menu">Tela Inicial</button>
    </nav>` : ''}`;
  }

  function toastsHtml() {
    if (screen !== 'game') return '';
    let html = '';
    if (rankFlash) {
      const up = rankFlash.diff > 0;
      html += `<div class="rank-toast ${up ? 'is-up' : 'is-down'}" id="rank-toast" role="status" title="Toque para ver o Ranking">
        <span class="rk-arrow">${up ? '▲' : '▼'}</span>
        <span>
          <b>${up ? `SUBIU NO RANKING (+${rankFlash.diff})` : `CAIU NO RANKING (${rankFlash.diff})`}</b>
          <small>#${rankFlash.from} → #${rankFlash.to} · ${safe(getRankTier(rankFlash.to))}</small>
        </span>
      </div>`;
    }
    if (chainFlash) {
      html += `<div class="butterfly-notice" id="bf-toast" role="status" style="${rankFlash ? 'top:154px;' : ''}" title="Toque para fechar">
        <span class="bf-icon">🧬</span>
        <span>
          <b>${safe(chainFlash.isNew ? 'Nova Reação em Cadeia' : 'Reação em Cadeia Atualizada')}</b>
          <small>${safe(chainFlash.title)}</small>
        </span>
      </div>`;
    }
    if (memoryFlash.length) html += `<div class="memory-toast" role="status">◈ ${memoryFlash.map(id => safe(getFirstName(CAST.find(x=>x.id===id)?.name || id))).join(' e ')} ${memoryFlash.length>1?'se lembrarão':'se lembrará'} disso.</div>`;
    return html;
  }

  function scheduleToastDismiss() {
    if (memoryTimer) clearTimeout(memoryTimer);
    if (memoryFlash.length) memoryTimer=setTimeout(()=>{memoryFlash=[];document.querySelector(".memory-toast")?.remove();},5500);
    if (chainTimer) clearTimeout(chainTimer);
    if (rankTimer) clearTimeout(rankTimer);
    if (chainFlash) {
      chainTimer = setTimeout(() => {
        chainFlash = null;
        document.getElementById('bf-toast')?.remove();
      }, 4200);
    }
    if (rankFlash) {
      rankTimer = setTimeout(() => {
        rankFlash = null;
        document.getElementById('rank-toast')?.remove();
      }, 4600);
    }
  }

  function layout(body) {
    root.innerHTML = `<div class="layout${screen === 'menu' ? ' layout--home' : ''}">
      ${header()}
      ${body}
      ${toastsHtml()}
      <footer class="app-footer">
        <span>GEN V: CAMPUS GODOLKIN · PRÓLOGO INTERATIVO</span>
        <span class="vought-footer-mark">V7 VOUGHT</span>
      </footer>
    </div>`;
    scheduleToastDismiss();
  }

  function menu(keepDrawer = false) {
    screen = 'menu';
    if (!keepDrawer) drawerOpen = false;
    chainFlash = null;
    rankFlash = null;
    memoryFlash = [];

    const hasSave = !!enter();
    const firstName = hasSave ? getFirstName(save.perfil.nome) : '';
    layout(`<main class="menu-view">
      <div class="menu-art" aria-hidden="true"></div>
      <div class="menu-body">
        <div class="kicker">UNIVERSIDADE GODOLKIN • CALOUROS</div>
        <h1 class="menu-wordmark">${wordmark(true)}</h1>
        <div><span class="torn-strip">PODER, RANKING E SEGREDOS SOB O CAMPUS.</span></div>
        <p class="menu-lead">Crie seu estudante, descubra suas habilidades e explore os segredos da Vought enquanto disputa uma posição no Ranking Oficial de Godolkin.</p>
        <div class="torn-quote-box">
          <p>“No Campus Godolkin, ser o número um salva sua vida — ou coloca um alvo nas suas costas.”</p>
          <span class="torn-quote-watermark">V7</span>
        </div>
        <div class="menu-stack-buttons">
          ${hasSave ? `<button class="primary" data-action="resume">CONTINUAR COMO ${safe(firstName.toUpperCase())} (RANK #${save.perfil.ranking_campus}) <span>›</span></button>` : ''}
          <button class="${hasSave ? 'secondary' : 'primary'}" data-action="new">${hasSave ? 'NOVO ALUNO (RECOMEÇAR)' : 'CRIAR ALUNO E INICIAR'} <span>›</span></button>
          <button class="secondary" data-action="slots">PARTIDAS E SLOTS</button>
          <button class="secondary" data-action="cast">ELENCO DO CAMPUS</button>
          <button class="secondary" data-action="chain">REAÇÃO EM CADEIA</button>
          <button class="secondary" data-action="ranking">RANKING OFICIAL (#1–#100)</button>
          <button class="quiet" data-action="import">IMPORTAR SAVE</button>
        </div>
      </div>
    </main>`);
  }

  function creator() {
    screen = 'creator';
    drawerOpen = false;
    if (!draft) resetDraft();

    const stepTitles = [
      'Etapa 1 de 6 • Identidade & Arquétipo',
      'Etapa 2 de 6 • Mutação Exclusiva (Composto V)',
      'Etapa 3 de 6 • 8 Características',
      'Etapa 4 de 6 • 5 Atributos (7 Pontos)',
      'Etapa 5 de 6 • Origem e motivação',
      'Etapa 6 de 6 • Revisão da matrícula'
    ];

    let stepHtml = '';
    let canAdvance = false;
    let nextLabel = 'Próximo ›';

    if (creatorStep === 1) {
      canAdvance = draft.nome.trim().length >= 2;
      nextLabel = 'Próximo: Poder ›';
      stepHtml = `
        <div class="field-group">
          <label for="inp-nome">Nome Completo do Estudante *</label>
          <input id="inp-nome" class="field-input" type="text" maxlength="28" placeholder="Ex: Gabriel Vance" value="${safe(draft.nome)}">
          <small class="fine">Nos diálogos do dia a dia, os alunos chamarão você pelo seu primeiro nome.</small>
        </div>
        <div class="form-grid-2">
          <div class="field-group">
            <label for="sel-idade">Idade (Ingresso como Calouro · 1º Ano)</label>
            <select id="sel-idade" class="field-input">
              <option value="18" ${draft.idade === 18 ? 'selected' : ''}>18 anos (Calouro · 1º Ano)</option>
              <option value="19" ${draft.idade === 19 ? 'selected' : ''}>19 anos (Calouro · 1º Ano)</option>
              <option value="20" ${draft.idade === 20 ? 'selected' : ''}>20 anos (Calouro · 1º Ano)</option>
            </select>
          </div>
          <div class="field-group">
            <label for="sel-pronomes">Pronomes</label>
            <select id="sel-pronomes" class="field-input">
              <option value="ele/dele" ${draft.pronomes === 'ele/dele' ? 'selected' : ''}>Ele / Dele</option>
              <option value="ela/dela" ${draft.pronomes === 'ela/dela' ? 'selected' : ''}>Ela / Dela</option>
              <option value="elu/delu" ${draft.pronomes === 'elu/delu' ? 'selected' : ''}>Elu / Delu</option>
            </select>
          </div>
        </div>
        <h2>Personalidade / Arquétipo</h2>
        <div class="option-cards">
          ${ARQUETIPOS.map(a => `
            <button type="button" class="opt-card ${draft.arquetipo === a.id ? 'selected' : ''}" data-pick-arq="${a.id}">
              <div class="opt-card-top">
                <span class="opt-card-title">${safe(a.nome)}</span>
                <span class="opt-badge">${safe(a.tag)}</span>
              </div>
              <span class="opt-card-desc">${safe(a.desc)}</span>
            </button>
          `).join('')}
        </div>
      `;
    } else if (creatorStep === 2) {
      canAdvance = !!draft.poder_id;
      nextLabel = 'Próximo: Características ›';
      stepHtml = `
        <p class="fine">Escolha uma das 11 mutações. Cada habilidade tem sua própria história na infância e adolescência.</p>
        <div class="option-cards">
          ${PODERES.map(p => `
            <button type="button" class="opt-card ${draft.poder_id === p.id ? 'selected' : ''}" data-pick-pod="${p.id}">
              <span class="opt-card-title">${safe(p.nome)}</span>
              <span class="opt-card-desc">${safe(p.desc)}</span>
              <span class="opt-card-cost">${safe(p.custo)}</span>
            </button>
          `).join('')}
        </div>
      `;
    } else if (creatorStep === 3) {
      const count = draft.caracteristicas.length;
      canAdvance = traitCount("normal")===5 && traitCount("flaw")===3;
      nextLabel = count === 8 ? 'Próximo: Atributos ›' : `Escolha ${8 - count} restante(s)`;
      stepHtml = `
        <div class="sticky-counter">
          <span>Características do Personagem</span>
          <b>${traitCount("normal")} / 5 qualidades · ${traitCount("flaw")} / 3 defeitos</b>
        </div>
        <p class="fine">Selecione 5 qualidades e 3 defeitos.</p>
        <div class="traits-grid">
          ${CARACTERISTICAS.map(t => {
            const active = draft.caracteristicas.includes(t.id);
            return `<button type="button" class="trait-btn ${t.tipo === 'flaw' ? 'flaw' : ''} ${active ? 'selected' : ''}" data-toggle-trait="${t.id}">
              <strong>${safe(t.nome)}</strong>
              <small>${safe(t.sub)}</small>
            </button>`;
          }).join('')}
        </div>
      `;
    } else if (creatorStep === 4) {
      const used = Object.values(draft.atributos).reduce((a, b) => a + b, 0) - 5;
      const left = 7 - used;
      canAdvance = left === 0;
      nextLabel = left === 0 ? 'Próximo: Histórico ›' : `Distribua ${left} ponto(s)`;
      stepHtml = `
        <div class="sticky-counter">
          <span>Pontos Livres Restantes</span>
          <b>${left}</b>
        </div>
        <p class="fine">Todos os atributos começam em 1. Distribua os 7 pontos livres (máximo 4 na criação).</p>
        <div class="attr-list">
          ${ATRIBUTOS_INFO.map(a => {
            const val = draft.atributos[a.id];
            return `<div class="attr-item">
              <div class="attr-item-info">
                <strong>${safe(a.nome)}</strong>
                <span>${safe(a.desc)}</span>
              </div>
              <div class="attr-stepper">
                <button type="button" class="step-circle" data-attr="${a.id}" data-delta="-1" ${val <= 1 ? 'disabled' : ''}>-</button>
                <span class="attr-num">${val}</span>
                <button type="button" class="step-circle" data-attr="${a.id}" data-delta="1" ${(val >= 4 || left <= 0) ? 'disabled' : ''}>+</button>
              </div>
            </div>`;
          }).join('')}
        </div>
        ${draft.atributos.controle === 1 ? '<div class="warning-banner">⚠️ Alerta Vought: Com Controle em nível 1, você corre maior risco de perder o controle dos poderes sob pressão.</div>' : ''}
      `;
    }

    if (creatorStep === 5) {
      canAdvance = true; nextLabel = 'Revisar matrícula ›';
      stepHtml = `<h2>Histórico familiar</h2><div class="option-cards">${ORIGENS.map(o=>`<button class="opt-card ${draft.origem===o.id?'selected':''}" data-origin="${o.id}"><strong>${safe(o.nome)}</strong><small>${safe(o.desc)}</small></button>`).join('')}</div><h2>Motivação pessoal</h2><div class="option-cards">${MOTIVOS.map(o=>`<button class="opt-card ${draft.motivacao===o.id?'selected':''}" data-motive="${o.id}">${safe(o.nome)}</button>`).join('')}</div>`;
    } else if (creatorStep === 6) {
      canAdvance = true; nextLabel = 'Confirmar matrícula e iniciar ›';
      stepHtml = `<section class="admission-record"><div class="kicker">VOUGHT INTERNATIONAL // DOCUMENTO CONFIDENCIAL</div><h2>${safe(draft.nome)}</h2><p>${draft.idade} anos · ${safe(draft.pronomes)} · 1º ano · Ranking inicial #48</p><p><b>Arquétipo:</b> ${safe(labelOf(ARQUETIPOS,draft.arquetipo))}</p><p><b>Mutação:</b> ${safe(labelOf(PODERES,draft.poder_id))}</p><p><b>Origem:</b> ${safe(labelOf(ORIGENS,draft.origem))}</p><p><b>Motivação:</b> ${safe(labelOf(MOTIVOS,draft.motivacao))}</p>${ATRIBUTOS_INFO.map(a=>`<div class="admission-attr"><span>${safe(a.nome)}</span><meter min="0" max="4" value="${draft.atributos[a.id]}"></meter><b>${draft.atributos[a.id]}/4</b></div>`).join('')}<p><b>Características:</b> ${safe(draft.caracteristicas.map(getTraitLabel).join(' · '))}</p><div class="kicker">SITUAÇÃO: ADMITIDO</div></section>`;
    }
    layout(`<main class="panel-view">
      <div class="panel">
        <div class="stepper">
          ${[1, 2, 3, 4, 5, 6].map(i => `<div class="step-pill ${i < creatorStep ? 'done' : i === creatorStep ? 'active' : ''}"></div>`).join('')}
        </div>
        <div class="kicker">${stepTitles[creatorStep - 1]}</div>
        <h1>Ficha de Matrícula</h1>
        ${stepHtml}
        <div class="button-row">
          <button type="button" class="secondary" data-action="creator-back">${creatorStep === 1 ? 'Cancelar' : '‹ Voltar'}</button>
          <button type="button" class="primary" id="btn-creator-next" data-action="creator-next" ${canAdvance ? '' : 'disabled'}>${nextLabel}</button>
        </div>
      </div>
    </main>`);
  }

  function finishCreation() {
    save = {
      game: 'genv-campus-godolkin',
      version: '0.16.0',
      slot,
      node: DATA.meta.start,
      perfil: {
        nome: draft.nome.trim(),
        idade: draft.idade,
        ano: '1º Ano (Calouro)',
        pronomes: draft.pronomes,
        arquetipo: draft.arquetipo,
        origem: draft.origem, motivacao: draft.motivacao, personalidade: draft.arquetipo,
        poder_id: draft.poder_id,
        caracteristicas: [...draft.caracteristicas],
        ranking_campus: 48
      },
      lastRankDelta: 0,
      atributos: { ...draft.atributos },
      recursos: {
        vitalidade: 100,
        vitalidade_max: 100,
        estresse: 0,
        estresse_max: 100
      },
      flags: {},
      personalidadePontos: {[draft.arquetipo]: 2},
      bonds: { ...BASE_BONDS },
      romance: { ...BASE_ROMANCE },
      history: [],
      visited: [DATA.meta.start],
      updated: Date.now()
    };
    store();
    screen = 'game';
    render();
  }

  function formatNarrative(raw) {
    const fullName = save?.perfil?.nome || 'Calouro';
    const firstName = getFirstName(fullName);
    const text = String(raw || '')
      .replaceAll('{NOME_COMPLETO}', fullName)
      .replaceAll('{NOME}', firstName);
    return text.split(/\n\s*\n|\n/g).map(s => s.trim()).filter(Boolean).map(s => {
      const m = s.match(/^([^:]{2,28}):\s*(—\s*.+)$/u);
      if (m) return `<div class="line spoken"><strong>${safe(m[1])}</strong><span>${safe(m[2])}</span></div>`;
      if (/^(PRIMEIRO DIA|FIM DO PRÓLOGO|\[COMUNICADO)/.test(s)) return `<p class="line big-emphasis">${safe(s)}</p>`;
      return `<p class="line narration">${safe(s)}</p>`;
    }).join('');
  }

  const clampSocial=v=>Math.max(0,Math.min(100,v));
  function socialFor(id){
    const base=BASE_BONDS[id]??28;
    if(!save)return {trust:base,respect:30,rivalry:10,closeness:15};
    save.social ||= {};
    return save.social[id] ||= {trust:save.bonds?.[id]??base,respect:30,rivalry:10,closeness:15};
  }
  function peerScore(id,r){return clampSocial((r.affinity??50)+(save?.peerChanges?.[id+':'+r.targetId]||0));}
  function advancePeers(to,choice){
    save.peerChanges ||= {}; save.peerEvents ||= [];
    const changes=[...(choice?.peerChanges||[])];
    if(to==='tarde_7'&&!save.peerEvents.includes('luka_otavio')){changes.push(['luka','otavio',4],['otavio','luka',4]);save.peerEvents.push('luka_otavio');}
    for(const [a,b,d] of changes){const k=a+':'+b;save.peerChanges[k]=(save.peerChanges[k]||0)+d;}
  }
  function romanceAvailable(id){const npc=CAST.find(x=>x.id===id);return !!(npc?.romanceable && /^Solteir[oa]/i.test(npc.relationshipStatus||''));}
  function evaluateChoice(c) {
    if(c.romanceTarget && (!romanceAvailable(c.romanceTarget) || (save.romance?.[c.romanceTarget]||0)>0)) return {visible:false};
    if(c.lunchPick && ["clara","luka","maya","otavio"].filter(id=>save.visited.includes("almoco_"+id)).length>=2)return {visible:false};
    if(c.requireFlag&&!save.flags[c.requireFlag])return {visible:false};
    if(c.requireTrust&&socialFor(c.requireTrust.id).trust<c.requireTrust.min)return {visible:true,enabled:false,lockText:'Requer confiança '+c.requireTrust.min};
    if (c.requireArq && c.requireArq !== (save.perfil.personalidade || save.perfil.arquetipo)) return {visible:false};
    if (c.requireOrigin && c.requireOrigin !== save.perfil.origem) return {visible:false};
    if (c.requireMotive && c.requireMotive !== save.perfil.motivacao) return {visible:false};
    if (c.room && ((save.perfil.pronomes === "ele/dele" && c.room !== "m") || (save.perfil.pronomes === "ela/dela" && c.room !== "f"))) return {visible:false};
    if (c.once && save.visited.includes(c.once)) return {visible:false};
    if (SCENES[save.node]?.hub === "morning" && c.once && morningCount() >= 2) return {visible:false};
    if (SCENES[save.node]?.hub === "afternoon" && c.once && afternoonCount() >= (save.flags.favor_aceito ? 2 : 3)) return {visible:false};
    if (c.requirePower && save.perfil.poder_id !== c.requirePower) {
      return { visible: false };
    }
    if (Array.isArray(c.notPowers) && c.notPowers.includes(save.perfil.poder_id)) {
      return { visible: false };
    }

    if (c.requireTrait && !save.perfil.caracteristicas.includes(c.requireTrait)) {
      return {
        visible: true,
        enabled: false,
        lockText: `Requer Característica: ${getTraitLabel(c.requireTrait)}`
      };
    }

    if (c.requireAttr) {
      const current = save.atributos[c.requireAttr.attr] || 1;
      if (current < c.requireAttr.min) {
        return {
          visible: true,
          enabled: false,
          lockText: `Requer ${getAttrLabel(c.requireAttr.attr)}: ${c.requireAttr.min}`
        };
      }
    }

    return { visible: true, enabled: true };
  }

  function move(to, choice) {
    if(to==='tarde_6' && (save.flags.tablet_concluido || save.flags.t6_plano_zoe || save.flags.t6_plano_grupo)) to='tarde_7';
    if (!SCENES[to]) return;
    for(const c of CAST) socialFor(c.id);
    const repeated=!!choice && (save.history||[]).some(h=>h.from===save.node && h.label===choice.label);
    if(repeated) choice={...choice,social:{},peerChanges:[],memory:[],effects:{...choice.effects,bonds:{},romance:{}}};
    if(choice?.memory && Array.isArray(SCENES[save.node]?.people)) {
      const present=SCENES[save.node].people;
      choice={...choice,memory:choice.memory.filter(id=>present.includes(id))};
    }
    advancePeers(to,choice);
    for(const [id,stats] of Object.entries(choice?.social||{})){const a=socialFor(id);for(const [key,delta] of Object.entries(stats))if(key in a)a[key]=clampSocial(a[key]+delta);}
    for(const [id,delta] of Object.entries(choice?.effects?.bonds||{})){if(choice?.social?.[id])continue;const a=socialFor(id);a.closeness=clampSocial(a.closeness+Math.sign(delta));if(choice?.memory?.includes(id))a.trust=clampSocial(a.trust+Math.sign(delta));}
    memoryFlash=[];
    save.memories ||= [];
    if(choice?.memory?.length){ memoryFlash=[...new Set(choice.memory)]; save.memories.push({people:memoryFlash,scene:save.node,label:choice.label}); }
    chainFlash = null;
    rankFlash = null;
    if (!save.romance) save.romance = { ...BASE_ROMANCE };

    if (choice) {
      if (choice.personality) { const points = save.personalidadePontos ||= {[save.perfil.arquetipo]:2}; points[choice.personality]=(points[choice.personality]||0)+1; const current=save.perfil.personalidade||save.perfil.arquetipo; if(points[choice.personality] >= (points[current]||0)+2) save.perfil.personalidade=choice.personality; }
      const oldStages = CHAIN_REACTIONS.map(d => chainStage(d, save.flags));
      const changes = [];

      if (choice.cost) {
        if (choice.cost.vitalidade) {
          save.recursos.vitalidade = Math.max(0, Math.min(100, save.recursos.vitalidade + choice.cost.vitalidade));
        }
        if (choice.cost.estresse) {
          save.recursos.estresse = Math.max(0, Math.min(100, save.recursos.estresse + choice.cost.estresse));
        }
      }

      if (choice.effects) {
        for (const [k, v] of Object.entries(choice.effects.flags || {})) {
          save.flags[k] = v;
        }
        for (const [id, delta] of Object.entries(choice.effects.bonds || {})) {
          const from = save.bonds[id] ?? 30;
          const toVal = Math.max(0, Math.min(100, from + delta));
          save.bonds[id] = toVal;
          if (toVal !== from) {
            const name = CAST.find(x => x.id === id)?.name || id;
            changes.push({ name, from, to: toVal, type: 'bond' });
          }
        }
        for (const [id, delta] of Object.entries(choice.effects.romance || {})) {
          if(!romanceAvailable(id) || choice.romanceTarget!==id) continue;
          const from = save.romance[id] ?? 0;
          const toVal = Math.max(0, Math.min(1, from + Math.sign(delta)));
          save.romance[id] = toVal;
          if (toVal !== from) {
            const name = CAST.find(x => x.id === id)?.name || id;
            changes.push({ name: `${name} (Interesse sinalizado)`, from, to: toVal, type: 'romance' });
          }
        }
        if (choice.effects.rank) {
          const oldRank = save.perfil.ranking_campus;
          const newRank = Math.max(1, Math.min(100, oldRank + choice.effects.rank));
          save.perfil.ranking_campus = newRank;
          const climbed = oldRank - newRank; // positivo = subiu posições (ex: #48 -> #42 = +6)
          if (climbed !== 0) {
            save.lastRankDelta = climbed;
            rankFlash = { from: oldRank, to: newRank, diff: climbed };
            changes.push({
              name: climbed > 0 ? `Ranking Oficial (▲ +${climbed})` : `Ranking Oficial (▼ ${climbed})`,
              from: `#${oldRank}`,
              to: `#${newRank}`,
              type: 'rank',
              improved: climbed > 0
            });
          }
        }
      }

      save.history.push({
        from: save.node,
        to,
        label: choice.label,
        time: SCENES[save.node]?.time || '',
        changes
      });

      for (let i = 0; i < CHAIN_REACTIONS.length; i++) {
        const after = chainStage(CHAIN_REACTIONS[i], save.flags);
        if (after > oldStages[i]) {
          chainFlash = { title: CHAIN_REACTIONS[i].title, isNew: oldStages[i] === 0 };
          break;
        }
      }
    }

    save.node = to;
    if (!save.visited.includes(to)) save.visited.push(to);
    store();
    screen = 'game';
    drawerOpen = false;
    render();
    window.scrollTo?.(0, 0);
  }

  const LUNCH_REPLIES={"clara": ["Clara: — Justo. Vamos descobrir juntos, então.", "Clara: — Pelo menos você não comprou o discurso de boas-vindas.", "Clara: — É, temos bastante tempo ainda."], "luka": ["Luka: — Finalmente alguém entende minhas prioridades.", "Luka: — Fechado. Biblioteca e café, nessa ordem.", "Luka: — Boa sorte. Se perder faz parte do pacote."], "maya": ["Maya: — Exatamente. Não precisamos ter pressa.", "Maya: — Pode ajudar, desde que a gente aceite mudar de ideia.", "Maya: — Claro. O que achou da comida?"], "otavio": ["Otávio: — Imagina. Almoço é para isso mesmo.", "Otávio: — Normal. Um dia de cada vez.", "Otávio: — Tranquilo. Vamos aproveitar o almoço."]};
  function encounterText(n){
    const v=save.visited||[];
    if(n.id==='almoco_amigos'){
      let extra=[];
      if(save.flags.dorm_m)extra.push('Luka: — Guardei um lugar para nosso colega de quarto.');
      if(save.flags.dorm_f)extra.push('Clara: — Aqui, colega de quarto. A Maya guardou sua cadeira.');
      if(save.phone?.replies?.some(r=>r.id==='otavio1'&&r.kind===0))extra.push('Otávio: — Que bom que você aceitou o convite pelo celular!');
      if(save.phone?.replies?.some(r=>r.id==='otavio1'&&r.kind===2))extra.push('Otávio: — Mudou de ideia sobre almoçar sozinho? Fique à vontade.');
      if(save.flags.salvou_clara)extra.push('Clara: — Ainda estou pensando no que aconteceu na arena. Obrigada pela ajuda.');
      else if(save.flags.hesitou_arena)extra.push('Otávio: — A avaliação foi confusa. Pelo menos agora temos um intervalo.');
      return n.text+'\n\n'+extra.join('\n\n');
    }
    if(n.id==='almoco_clara'&&v.includes('calouros_1'))return 'Clara: — Depois daquela conversa nas escadarias, fiquei curiosa. '+n.text.replace('Clara: — ','');
    if(n.id==='almoco_luka'&&v.includes('dorm_m'))return 'Luka: — Quando voltarmos ao quarto, preciso organizar minhas coisas. '+n.text.replace('Luka: — ','');
    if(n.id==='almoco_maya'&&v.includes('arcadas_1'))return 'Maya: — Lembra da conversa nas arcadas? '+n.text.replace('Maya: — ','');
    if(n.id==='almoco_otavio'&&v.includes('dorm_m'))return 'Otávio: — Espero que tenha gostado do quarto. '+n.text.replace('Otávio: — ','');
    if(n.id==='almoco_elite_fim')return ['Matteo: — Gosto de ouvir música quando ninguém está pedindo fotos.\n\nZoe: — E eu gosto de ter uma tarde livre.','Zoe: — É uma apresentação tanto quanto uma avaliação. Nem todo mundo gosta disso.','Matteo: — Pelo menos a comida não exige entrevista.'][save.flags.almoco_elite_resposta]||n.text;
    if(n.id.startsWith('almoco_resposta_')){const id=n.id.replace('almoco_resposta_','');return LUNCH_REPLIES[id]?.[save.flags['almoco_'+id+'_resposta']]||n.text;}
    if(n.id==='almoco_saida')return (save.flags.almoco_mesa_amigos?'Otávio: — A gente se vê mais tarde.\n\n':save.flags.almoco_mesa_elite?'Zoe: — Até mais. Aproveite o intervalo.\n\n':'')+n.text;
    const known=id=>v.includes('dorm_m')&&['luka','otavio'].includes(id)||v.includes('dorm_f')&&['clara','maya'].includes(id);
    if(n.id==='calouros_1'&&(known('clara')||known('luka'))){return known('luka')?`Luka reconhece você e fecha o caderno. Clara olha de um para o outro.\n\nLuka: — Olha quem saiu do nosso quarto! Clara, esse é {NOME}, meu colega de dormitório.\n\nClara: — Prazer. Espero que ele não tenha te obrigado a ler o regulamento inteiro.\n\nLuka: — Ainda não. Mas o ranking aqui mede audiência, não só habilidade.`:`Clara acena ao reconhecer você do dormitório. Luka fecha o caderno.\n\nClara: — {NOME}! Esse é o Luka, meu amigo.\n\nLuka: — Prazer. Dica de quem leu o regulamento: o ranking aqui mede audiência, não só habilidade.`;}
    if(n.id==='arcadas_1'&&(known('maya')||known('otavio'))){return known('otavio')?`Otávio reconhece você do quarto e oferece uma garrafa de água.\n\nOtávio: — E aí, colega! Essa é a Maya. Ela está contando as câmeras.\n\nMaya: — Sete. Três são da segurança interna, não da Vought+. Prazer, {NOME}.`:`Maya reconhece você do dormitório e faz um aceno. Otávio oferece uma garrafa de água.\n\nMaya: — {NOME}, esse é o Otávio. Estamos observando o movimento.\n\nOtávio: — Prazer! Quer água?\n\nMaya: — Sete câmeras. Três são da segurança interna, não da Vought+.`;}
    return n.text;
  }
  function game() {
    if (!save) { menu(); return; }
    screen = 'game';
    const n = SCENES[save.node];
    if (!n) { menu(); return; }

    const firstName = getFirstName(save.perfil.nome);
    const podObj = PODERES.find(p => p.id === save.perfil.poder_id);
    const visibleChoices = (n.choices || [])
      .map((c, idx) => ({ c, idx, evalRes: evaluateChoice(c) }))
      .filter(x => x.evalRes.visible);

    const baseTextHtml = n.text ? formatNarrative(encounterText(n)) : '';
    const extraTextHtml = (n.dynamic || [])
      .filter(d => (d.equals && save.flags[d.equals.key] === d.equals.value) || (d.flag && save.flags[d.flag]) || (d.origin && d.origin===save.perfil.origem) || (d.motive && d.motive===save.perfil.motivacao) || (d.arq && d.arq===(save.perfil.personalidade||save.perfil.arquetipo)))
      .map(d => formatNarrative(d.text))
      .join('');
    const afterDynamicHtml = n.textAfterDynamic ? formatNarrative(n.textAfterDynamic) : '';

    const choicesHtml = visibleChoices.length
      ? `<div class="choices">${visibleChoices.map(({ c, idx, evalRes }, i) => {
          if (!evalRes.enabled) {
            return `<button class="choice locked-spoiler-free" disabled>
              <span class="choice-num">${String(i + 1).padStart(2, '0')}</span>
              <span class="locked-req-label">[${safe(evalRes.lockText)}]</span>
              <span class="choice-arrow">🔒</span>
            </button>`;
          }

          let labelText = c.label;
          let badge = '';
          if (labelText.startsWith('[Interesse]')) {
            labelText = labelText.replace(/^\[Interesse\]\s*/i, '');
            badge = '<span class="choice-tag romance">♥ OPCIONAL</span>';
          } else if (c.requireArq) {
            badge = '<span class="choice-tag trait">ARQUÉTIPO</span>';
          } else if (c.requireMotive || c.requireOrigin) {
            badge = '<span class="choice-tag trait">HISTÓRICO</span>';
          } else if (c.requirePower) {
            badge = '<span class="choice-tag power">PODER</span>';
          } else if (c.requireTrait) {
            badge = '<span class="choice-tag trait">CARACTERÍSTICA</span>';
          } else if (c.requireAttr) {
            badge = '<span class="choice-tag">ATRIBUTO</span>';
          }

          return `<button class="choice" data-choice-idx="${idx}">
            <span class="choice-num">${String(i + 1).padStart(2, '0')}</span>
            <span>${badge}${safe(labelText)}</span>
            <span class="choice-arrow">↗</span>
          </button>`;
        }).join('')}</div>`
      : `<div class="button-row"><button class="primary" data-action="end">VER RESULTADO DO PRÓLOGO <span>›</span></button></div>`;

    const hub = n.id==='almoco_escolher' ? `<div class="explore-status">Conversas disponíveis: ${Math.max(0,2-['clara','luka','maya','otavio'].filter(id=>save.visited.includes('almoco_'+id)).length)}</div>` : n.hub ? `<div class="explore-status">${n.hub==='morning'?`Encontros disponíveis: ${Math.max(0,2-morningCount())}`:`Atividades disponíveis: ${Math.max(0,(save.flags.favor_aceito?2:3)-afternoonCount())}`} · <button data-action="map">Abrir mapa ↗</button></div>` : "";
    const pct = save.node === 'end' ? 100 : Math.min(97, Math.max(5, Math.round((save.visited.length / 26) * 100)));

    layout(`<main class="play-view">
      <div class="play-content">
        <div class="hud-bar">
          <div class="hud-player">
            <span>${safe(firstName)}</span>
            <button type="button" class="hud-rank-btn" data-action="ranking" title="Abrir Ranking Oficial (#1–#100)">RANK #${save.perfil.ranking_campus} ↗</button>
            <span class="fine">(${safe(podObj ? podObj.nome.split(' ')[0] : '')})</span>
          </div>
          ${phoneReady()?`<button class="map-icon" data-action="phone">▣ CELULAR ${unreadPhone()||""}</button>`:""}<button class="map-icon" data-action="map" aria-label="Mapa de Godolkin">▧ MAPA</button>
          <div class="hud-meters">
            <span class="hud-hp">VITALIDADE: ${save.recursos.vitalidade}%</span>
            <span class="hud-stress">ESTRESSE: ${save.recursos.estresse}%</span>
          </div>
        </div>

        <div class="story-meta">
          <div>
            <div class="kicker">PRÓLOGO · ${safe(firstName.toUpperCase())}</div>
            <h2>${safe(n.title)}</h2>
            <p>${safe(n.stage)} • ${safe(n.time)}</p>
          </div>
        </div>

        <section class="story-window">
          <div class="story-scroll">${baseTextHtml}${extraTextHtml}${afterDynamicHtml}</div>
          ${hub}${choicesHtml}
          <div class="story-bottom">
            <span>◉ Slot ${slot} · <button data-action="ranking">RANKING #1–#100</button></span>
            <button data-action="journal">DIÁRIO &amp; VÍNCULOS ↗</button>
          </div>
        </section>

        <div class="progress-track"><i style="width:${pct}%"></i></div>
        <div class="progress-caption">
          <span>CAMPUS GODOLKIN · CALOURO (1º ANO)</span>
          <span>${save.visited.length} cenas jogadas</span>
        </div>
      </div>
    </main>`);
  }


  const morningCount=()=>['calouros_1','elite_1','arcadas_1','favor_clara','biblioteca_m'].filter(k=>save.visited.includes(k)).length;
  const afternoonCount=()=>['clara_retorno','maya_tarde','dorm_tarde','grupo_conversa',...CAST.map(c=>'pessoal_'+c.id)].filter(k=>save.visited.includes(k)).length;
  const MAP_PLACES=[['gate','Portões / recepção',50,91],['male','Dormitório masculino',16,70],['female','Dormitório feminino',83,70],['single','Alojamento individual',50,76],['patio','Pátio central',50,51],['stairs','Escadarias',17,48],['library','Biblioteca',16,25],['arcade','Arcadas',83,47],['vip','Área VIP',83,25],['arena','Pavilhão B / arena',50,27],['office','Reitoria',50,9],['food','Refeitório',16,9],['tower','Torre Norte',83,9]];
  const scenePlace=k=>SCENES[k]?.place|| (k==='chegada_campus'||k==='dorm_escolha'?'gate':k==='dorm_m'?'male':k==='dorm_f'?'female':k==='dorm_ind'?'single':k==='dorm_tarde'||k==='tarde_7'?(save.flags.dorm_m?'male':save.flags.dorm_f?'female':'single'):k.startsWith('calouros')||k==='favor_clara'?'stairs':k.startsWith('elite')?'vip':k.startsWith('arcadas')?'arcade':k.startsWith('arena')?'arena':k==='biblioteca_m'||k==='maya_tarde'?'library':/^tarde_[234]$/.test(k)?'office':/^tarde_[56]$/.test(k)?'food':k.startsWith('festa')||k==='end'?'tower':k.startsWith('explorar')||k==='clara_retorno'||k==='tarde_1'?'patio':null);
  function campusPositions(){
    const k=save.node, here=scenePlace(k); if(!here)return {};
    let pos={clara:'stairs',luka:'stairs',maya:'arcade',otavio:'arcade',matteo:'vip',zoe:'vip'};
    if(k==='dorm_m')Object.assign(pos,{luka:'male',otavio:'male'});
    if(k==='dorm_f')Object.assign(pos,{clara:'female',maya:'female'});
    if(k.startsWith('arena'))Object.keys(pos).forEach(id=>pos[id]='arena');
    if(k.startsWith('tarde')||k==='explorar_tarde'||k==='maya_tarde'||k==='clara_retorno'||k==='dorm_tarde')pos={clara:'patio',maya:'library',luka:'male',otavio:'male',matteo:'vip',zoe:'vip'};
    if(k==='tarde_5'||k.startsWith('almoco_'))Object.keys(pos).forEach(id=>pos[id]='food');
    if(k==='dorm_tarde'||k==='tarde_7')Object.assign(pos,{clara:'female',maya:'female',luka:'male',otavio:'male'});
    if(here==='tower')Object.keys(pos).forEach(id=>pos[id]='tower');
    if(k==='explorar_tarde')for(const c of CAST)pos[c.id]=c.depth.routine.afternoon;
    if(k==='explorar_manha')for(const c of CAST)pos[c.id]=c.depth.routine.morning;
    if(k==='grupo_conversa')Object.assign(pos,{clara:'stairs',matteo:'stairs'});
    for(const id of SCENES[k]?.people||[])pos[id]=here;
    return {...pos,player:here};
  }
  function mapView(){
    if(!save){menu();return;} screen='map';drawerOpen=false;
    const positions=campusPositions(), selected=MAP_PLACES.find(p=>p[0]===mapSelected), names=id=>id==='player'?getFirstName(save.perfil.nome)+' (você)':getFirstName(CAST.find(x=>x.id===id)?.name||id);
    const choices=SCENES[save.node]?.choices||[];
    const access=selected&&SCENES[save.node]?.hub?choices.map((c,i)=>({c,i})).filter(({c})=>scenePlace(c.to)===selected[0]&&evaluateChoice(c).visible&&evaluateChoice(c).enabled):[];
    layout(`<main class="play-view"><div class="play-content"><div class="kicker">GODOLKIN // GUIA DO CAMPUS</div><h2>Mapa da universidade</h2><p class="fine">${safe(SCENES[save.node]?.time)} · Localização narrativa do grupo. Toque em um prédio.</p><div class="campus-map"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M50 92V9 M16 9V70 M83 9V70 M16 25H83 M16 48H83 M16 70H83 M16 9H83" fill="none" stroke="#8d8059" stroke-width="1.7" stroke-dasharray="2 1"/></svg>${MAP_PLACES.map(([id,label,x,y])=>{const people=Object.keys(positions).filter(k=>positions[k]===id);return `<button class="campus-pin ${people.includes('player')?'here':''} ${mapSelected===id?'selected':''}" data-map-pin="${id}" style="left:${x}%;top:${y}%"><span>${safe(label)}</span><small>${people.map(k=>safe(names(k).slice(0,1))).join(' · ')||'◇'}</small></button>`}).join('')}</div><section class="map-detail"><h3>${selected?safe(selected[1]):'Onde está o grupo?'}</h3>${(selected?Object.entries(positions).filter(([k,v])=>v===selected[0]):Object.entries(positions)).map(([k,v])=>`<div class="map-person"><b>${safe(names(k))}</b><span>${safe(MAP_PLACES.find(p=>p[0]===v)?.[1])}</span></div>`).join('')||'<p>Nenhuma localização conhecida neste ponto da história.</p>'}${access.map(({c,i})=>`<button class="choice" data-map-choice="${i}">${safe(c.label)} ↗</button>`).join('')}${selected&&!access.length?'<p class="fine">Deslocamento disponível apenas nos intervalos e destinos liberados.</p>':''}</section><button class="primary" data-action="resume">← VOLTAR À HISTÓRIA</button></div></main>`);
  }

  function rankingView() {
    if (!save) enter();
    screen = 'ranking';
    drawerOpen = false;
    const fullList = buildFullRankingList();
    const playerPos = save ? save.perfil.ranking_campus : 48;
    const playerDelta = save ? (save.lastRankDelta || 0) : 0;

    let filtered = fullList;
    if (rankingFilter === 'top10') {
      filtered = fullList.filter(r => r.pos <= 10);
    } else if (rankingFilter === 'near') {
      filtered = fullList.filter(r => Math.abs(r.pos - playerPos) <= 8);
    } else if (rankingFilter === 'freshmen') {
      filtered = fullList.filter(r => r.year.includes('1º Ano') || r.isPlayer);
    }

    layout(`<main class="panel-view">
      <div class="panel">
        <div class="kicker">PAINEL OFICIAL VOUGHT+ // ATUALIZAÇÃO EM TEMPO REAL</div>
        <h1>Ranking Oficial (#1 – #100)</h1>
        <p class="fine">A classificação oficial dos 100 melhores estudantes da Universidade Godolkin. Suas decisões na Arena, diante dos patrocinadores e nos eventos do campus fazem você subir ou cair em tempo real.</p>

        <div class="rank-hero-card">
          <div>
            <span class="kicker">SUA POSIÇÃO ATUAL</span>
            <div class="rank-hero-num">#${playerPos} <small>/ 100</small></div>
            <span class="opt-badge">${safe(getRankTier(playerPos))}</span>
          </div>
          <div class="rank-hero-meta">
            <strong>${safe(save ? save.perfil.nome : 'Calouro Não Matriculado')}</strong>
            <span>${save ? `1º Ano (Calouro) · ${safe(PODERES.find(p => p.id === save.perfil.poder_id)?.nome.split(' (')[0] || '')}` : 'Inicie uma partida para entrar no placar'}</span>
            ${playerDelta !== 0
              ? `<em class="rank-delta-pill ${playerDelta > 0 ? 'up' : 'down'}">${playerDelta > 0 ? `▲ Subiu ${playerDelta} posição(ões) recentemente` : `▼ Caiu ${Math.abs(playerDelta)} posição(ões) recentemente`}</em>`
              : `<em class="rank-delta-pill neutral">— Posição inicial do semestre</em>`}
          </div>
        </div>

        <div class="rank-filters">
          <button type="button" class="filter-chip ${rankingFilter === 'all' ? 'active' : ''}" data-rank-filter="all">TODOS (#1–#100)</button>
          <button type="button" class="filter-chip ${rankingFilter === 'top10' ? 'active' : ''}" data-rank-filter="top10">TOP 10 · ELITE</button>
          <button type="button" class="filter-chip ${rankingFilter === 'near' ? 'active' : ''}" data-rank-filter="near">PERTO DE VOCÊ (#${Math.max(1, playerPos - 8)}–#${Math.min(100, playerPos + 8)})</button>
          <button type="button" class="filter-chip ${rankingFilter === 'freshmen' ? 'active' : ''}" data-rank-filter="freshmen">CALOUROS (1º ANO)</button>
        </div>

        <div class="ranking-table-wrap">
          <table class="ranking-table">
            <thead>
              <tr>
                <th>POS</th>
                <th>ESTUDANTE</th>
                <th>ANO</th>
                <th>PODER / STATUS</th>
                <th>FAIXA</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map(row => {
                const rowCls = row.isPlayer ? 'is-player' : row.castId ? 'is-cast' : row.missing ? 'is-missing' : '';
                const deltaTag = row.isPlayer && row.delta !== 0
                  ? `<span class="row-delta ${row.delta > 0 ? 'up' : 'down'}">${row.delta > 0 ? `▲ +${row.delta}` : `▼ ${row.delta}`}</span>`
                  : '';
                return `<tr class="${rowCls}" ${row.castId ? `data-open-cast="${row.castId}" style="cursor:pointer" title="Clique para ver dossiê"` : ''}>
                  <td class="col-pos">#${row.pos} ${deltaTag}</td>
                  <td class="col-name">
                    <strong>${safe(row.name)}</strong>
                    ${row.isPlayer ? '<span class="you-pill">VOCÊ</span>' : ''}
                    ${row.castId ? '<span class="cast-pill">ELENCO ↗</span>' : ''}
                  </td>
                  <td class="col-year">${safe(row.year)}</td>
                  <td class="col-power">${safe(row.power)}</td>
                  <td class="col-tier"><span class="tier-badge tier-${row.pos <= 10 ? 'elite' : row.pos <= 30 ? 'top' : row.pos <= 60 ? 'mid' : 'cut'}">${safe(row.tag)}</span></td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>

        <div class="button-row">
          <button class="primary" data-action="${save ? 'resume' : 'menu'}">${save ? 'VOLTAR À HISTÓRIA' : 'VOLTAR AO MENU'}</button>
          <button class="secondary" data-action="cast">VER DOSSIÊ DOS ALUNOS</button>
        </div>
      </div>
    </main>`);
  }

  function dossier() {
    if (!save) { menu(); return; }
    screen = 'dossier';
    drawerOpen = false;
    const arq = ARQUETIPOS.find(a => a.id === save.perfil.arquetipo);
    const pod = PODERES.find(p => p.id === save.perfil.poder_id);
    const traits = save.perfil.caracteristicas.map(id => CARACTERISTICAS.find(c => c.id === id)?.nome || id);

    layout(`<main class="panel-view">
      <div class="panel">
        <div class="kicker">ARQUIVO VOUGHT // CALOURO (1º ANO)</div>
        <h1>${safe(save.perfil.nome)} (${save.perfil.idade} anos)</h1>
        <p class="fine">Ano Letivo: <strong>1º Ano (Calouro)</strong> • Pronomes: <strong>${safe(save.perfil.pronomes)}</strong> • Ranking Atual: <strong>#${save.perfil.ranking_campus}/100 (${safe(getRankTier(save.perfil.ranking_campus))})</strong> • Arquétipo: <strong>${safe(arq?.nome || '')}</strong></p>
        <p>Origem: <b>${safe(labelOf(ORIGENS,save.perfil.origem))}</b> · Motivação: <b>${safe(labelOf(MOTIVOS,save.perfil.motivacao))}</b></p><p>Personalidade atual: <b>${safe(labelOf(ARQUETIPOS,save.perfil.personalidade||save.perfil.arquetipo))}</b></p><h2>Mutação Registrada</h2>
        <p><strong>${safe(pod?.nome || '')}</strong> — ${safe(pod?.desc || '')}</p>
        <h2>Atributos</h2>
        <div class="button-row">
          ${ATRIBUTOS_INFO.map(a => `<span class="opt-badge">${safe(a.nome.toUpperCase())}: ${save.atributos[a.id]}</span>`).join('')}
        </div>
        <h2>Características (8)</h2>
        <div class="button-row">
          ${traits.map(t => `<span class="opt-badge">${safe(t)}</span>`).join('')}
        </div>
        <div class="button-row">
          <button class="primary" data-action="resume">VOLTAR À HISTÓRIA</button>
          <button class="secondary" data-action="ranking">VER RANKING #1–#100</button>
          <button class="secondary" data-action="journal">DIÁRIO DE ESCOLHAS</button>
        </div>
      </div>
    </main>`);
  }

  function journal() {
    if (!save) { menu(); return; }
    screen = 'journal';
    drawerOpen = false;
    const entries = (save.history || []).slice().reverse().map(h => `
      <li>
        <small>${safe(h.time)}</small>
        <span>${safe(h.label)}</span>
        ${(h.changes || []).length ? `<div class="affinity-changes">${h.changes.map(c => {
          const isUp = c.type === 'rank' ? c.improved : (c.to > c.from);
          return `<span class="affinity-change ${isUp ? 'positive' : 'negative'}">${safe(c.name)} <strong>${c.from} ${isUp ? '↗' : '↘'} ${c.to}</strong></span>`;
        }).join('')}</div>` : ''}
      </li>
    `).join('');

    layout(`<main class="panel-view">
      <div class="panel">
        <div class="kicker">REGISTRO DO CAMPUS</div>
        <h1>Diário de Consequências</h1>
        <div class="dashboard">
          <section>
            <h2>Afinidade e vínculos no campus</h2>
            ${CAST.map(c => {
              const val = save.bonds[c.id] ?? BASE_BONDS[c.id] ?? 28;
              const rom = c.romanceable ? (save.romance?.[c.id] ?? 0) : 0;
              return `<div class="bond-block">
                <div class="bond">
                  <label>${safe(c.name)}</label>
                  <div class="meter"><i style="width:${val}%"></i></div>
                  <b>${val}</b>
                </div>
                ${c.romanceable && rom > 0 ? `<div class="bond romance-sub">
                  <label>♥ Interesse sinalizado · reciprocidade não definida</label>
                </div>` : ''}
              </div>`;
            }).join('')}
          </section>
          <section>
            <h2>Memórias dos personagens (${(save.memories||[]).length})</h2><ol class="history">${(save.memories||[]).slice().reverse().map(m=>`<li><small>${m.people.map(id=>safe(getFirstName(CAST.find(c=>c.id===id)?.name||id))).join(' · ')}</small><span>${safe(m.label)}</span></li>`).join('')||'<li>Nenhuma memória registrada ainda.</li>'}</ol><h2>Decisões Registradas (${save.history.length})</h2>
            <ol class="history">${entries || '<li>Suas escolhas aparecerão aqui conforme você avança.</li>'}</ol>
          </section>
        </div>
        <div class="button-row">
          <button class="primary" data-action="resume">VOLTAR À HISTÓRIA</button>
          <button class="secondary" data-action="ranking">VER RANKING #1–#100</button>
          <button class="secondary" data-action="cast">VER PERFIL DOS ALUNOS</button>
        </div>
      </div>
    </main>`);
  }

  function chainView() {
    if (!save) enter();
    screen = 'chain';
    drawerOpen = false;
    const flags = save?.flags || {};
    const unlockedCount = CHAIN_REACTIONS.filter(d => chainStage(d, flags) > 0).length;

    const tiles = CHAIN_REACTIONS.map(def => {
      const lv = chainStage(def, flags);
      const unlocked = lv > 0;
      return `<button class="butterfly-tile ${unlocked ? 'is-unlocked' : 'is-locked'}" data-chain="${def.id}">
        <b>🧬 ${safe(unlocked ? def.title : '???')}</b>
        <small>${unlocked ? `ATIVO · ESTÁGIO ${lv}/${def.steps.length}` : 'BLOQUEADO'}</small>
      </button>`;
    }).join('');

    const sel = CHAIN_REACTIONS.find(d => d.id === chainSelected);
    const detail = sel && chainStage(sel, flags) > 0
      ? `<div class="butterfly-detail">
          <div class="kicker">EFEITO EM ANDAMENTO</div>
          <h2 style="margin:6px 0;">${safe(sel.title)}</h2>
          <p class="fine">${safe(sel.teaser)}</p>
          <ol>${sel.steps.map(st => `<li>
            <strong>${st.when(flags) ? '✦ Consequência Registrada' : 'Ainda em aberto'}</strong>
            <span>${st.when(flags) ? safe(st.description) : 'Suas próximas decisões definirão este desdobramento.'}</span>
          </li>`).join('')}</ol>
        </div>`
      : '<p class="fine">Toque em uma Reação em Cadeia desbloqueada para inspecionar como suas escolhas estão moldando o campus.</p>';

    layout(`<main class="panel-view">
      <div class="panel">
        <div class="kicker">SISTEMA DE CONSEQUÊNCIAS</div>
        <h1>Reação em Cadeia</h1>
        <p class="fine">Em Godolkin, nenhuma ação fica isolada. Cada escolha altera sua reputação, alianças e o rumo da investigação (${unlockedCount}/${CHAIN_REACTIONS.length} descobertas).</p>
        <div class="butterfly-grid">${tiles}</div>
        ${detail}
        <div class="button-row">
          <button class="primary" data-action="${save ? 'resume' : 'menu'}">${save ? 'VOLTAR À HISTÓRIA' : 'VOLTAR AO MENU'}</button>
        </div>
      </div>
    </main>`);
  }

  function castView() {
    if (!save) enter();
    screen = 'cast';
    drawerOpen = false;
    const sel = CAST.find(c => c.id === castSelected) || CAST[0];
    const playerBond = save ? (save.bonds[sel.id] ?? BASE_BONDS[sel.id] ?? 28) : (BASE_BONDS[sel.id] ?? 28);
    const playerRom = (save && sel.romanceable) ? (save.romance?.[sel.id] ?? 0) : 0;
    const relStatus = getRelationshipStatus(playerBond, playerRom);
    const playerFirstName = save ? getFirstName(save.perfil.nome) : 'Você (Calouro)';

    layout(`<main class="panel-view">
      <div class="panel">
        <div class="kicker">CORPO DISCENTE // TOQUE EM UM ALUNO PARA INSPECIONAR</div>
        <h1>Alunos de Godolkin</h1>
        <p class="fine">Selecione o card de cada estudante para ver sua personalidade, status de relacionamento, intimidade com <strong>${safe(playerFirstName)}</strong> e as barras de afinidade com os outros alunos.</p>

        <div class="cast-grid">
          ${CAST.map(c => {
            const isSel = c.id === sel.id;
            const bVal = save ? (save.bonds[c.id] ?? BASE_BONDS[c.id] ?? 28) : (BASE_BONDS[c.id] ?? 28);
            const rVal = (save && c.romanceable) ? (save.romance?.[c.id] ?? 0) : 0;
            return `<button type="button" class="cast-card-btn ${isSel ? 'selected' : ''}" data-pick-cast="${c.id}">
              <div class="cast-avatar">${safe(c.name[0])}</div>
              <div class="cast-info">
                <strong>${safe(c.name)}</strong>
                <small>${safe(c.role)}</small>
                <span>${safe(c.age)} • ${safe(c.relationshipStatus || '')}</span>
                <em>Afinidade: ${bVal}/100${c.romanceable && rVal > 0 ? ` · ♥ Interesse sinalizado` : ''}</em>
              </div>
            </button>`;
          }).join('')}
        </div>

        <section class="cast-dossier" aria-live="polite">
          <div class="cast-dossier-header">
            <div>
              <div class="kicker">DOSSIÊ INDIVIDUAL · ${safe(sel.age.toUpperCase())}</div>
              <h2 style="font-family:'Anton',sans-serif;font-size:28px;color:#fff;margin:4px 0;">${safe(sel.name)} — ${safe(sel.role)}</h2>
              <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:4px;">
                <span class="opt-badge">${safe(sel.archetype)}</span>
                <span class="opt-badge" style="background:${sel.romanceable ? '#ec4899' : '#3f3f46'};color:#fff;">${safe(sel.relationshipStatus || '')}</span>
              </div>
            </div>
          </div>

          <p><strong>Poder Exclusivo:</strong> ${safe(sel.powerDesc)}</p>
          <p><strong>Personalidade:</strong> ${safe(sel.personality)}</p>
          <p class="fine">${safe(sel.bio)}</p>

          <section class="depth-panel"><h2>Arquivo em descoberta</h2>
            <p><strong>História pessoal:</strong> ${safe(sel.depth.title)}</p>
            <p><strong>Rotina habitual:</strong> ${Object.entries(sel.depth.routine).map(([t,l])=>safe(({morning:'Manhã',afternoon:'Tarde',night:'Noite'})[t])+': '+safe(MAP_PLACES.find(p=>p[0]===l)?.[1])).join(' · ')}</p>
            ${[['Histórico',sel.depth.history],['Maior medo',sel.depth.fear],['Contradição',sel.depth.contradiction],['Confidência',sel.depth.secret]].map(([label,value])=>`<div class="depth-entry"><b>${safe(label)}</b><p>${save?.flags?.['revelado_'+sel.id]?safe(value):'🔒 Descubra durante a história pessoal.'}</p></div>`).join('')}
            <h3>Memórias com você</h3>${(save?.memories||[]).filter(m=>m.people.includes(sel.id)).map(m=>`<p class="fine">${safe(m.label)}</p>`).join('')||'<p class="fine">Nenhuma memória registrada.</p>'}
          </section>
          <h2>Relação com ${safe(playerFirstName)}</h2>
          <div class="depth-panel">${[['Afinidade',playerBond],...Object.entries(socialFor(sel.id)).map(([k,v])=>[({trust:'Confiança',respect:'Respeito',rivalry:'Rivalidade',closeness:'Proximidade'})[k],v])].map(([label,v])=>`<div class="depth-entry"><b>${safe(label)} · ${v}/100</b><div class="meter"><i style="width:${v}%"></i></div></div>`).join('')}</div>
          <div class="cast-rel-list">
            <div class="cast-rel-item player-rel">
              <strong>${safe(playerFirstName)} • ${safe(relStatus.label)}</strong>
              <div class="rel-meter-row">
                <div class="meter"><i style="width:${playerBond}%"></i></div>
                <b>${playerBond}</b>
              </div>
              ${romanceAvailable(sel.id) ? `
                <div style="font-size:11px;color:#f9a8d4;font-weight:800;margin-top:6px;">${playerRom>0?'♥ Interesse sinalizado · reciprocidade não definida':'Vínculo de amizade · interesse opcional'}</div>
              ` : `<div style="font-size:11px;color:#a1a1aa;margin-top:4px;">Status: ${safe(sel.relationshipStatus || 'Compromissado(a)')}</div>`}
              <span>${save
                ? (socialFor(sel.id).trust >= 55
                    ? `${sel.name} já demonstra confiança real em ${playerFirstName} e compartilha informações sem rodeios.`
                    : socialFor(sel.id).trust >= 36
                    ? `${sel.name} começa a se aproximar e enxerga ${playerFirstName} como um colega promissor no campus.`
                    : `${sel.name} ainda vê ${playerFirstName} como um calouro recém-chegado — a confiança precisa ser conquistada passo a passo.`)
                : 'Inicie uma partida para construir laços e aumentar sua intimidade com este personagem.'}</span>
            </div>
          </div>

          <h2>Relações &amp; Afinidade com os Outros Alunos</h2>
          <div class="cast-rel-list">
            ${(sel.relations || []).map(r => {
              const aff = peerScore(sel.id,r);
              return `<div class="cast-rel-item">
                <strong>${safe(r.target)} • ${safe(r.label)}${aff!==(r.affinity??50)?` · ${aff>(r.affinity??50)?'aproximação':'atrito'}`:''}</strong>
                <div class="rel-meter-row">
                  <div class="meter"><i style="width:${aff}%"></i></div>
                  <b>${aff}</b>
                </div>
                <span>${safe(r.desc)}</span>
              </div>`;
            }).join('')}
          </div>
        </section>

        <div class="button-row">
          <button class="primary" data-action="${save ? 'resume' : 'menu'}">${save ? 'VOLTAR À HISTÓRIA' : 'VOLTAR AO MENU'}</button>
          <button class="secondary" data-action="ranking">VER RANKING #1–#100</button>
        </div>
      </div>
    </main>`);
  }

  function slotsView() {
    screen = 'slots';
    drawerOpen = false;
    layout(`<main class="panel-view">
      <div class="panel">
        <div class="kicker">LINHAS DO TEMPO</div>
        <h1>Partidas e Slots</h1>
        <p class="fine">Gerencie até 3 estudantes diferentes no mesmo navegador.</p>
        <div class="slot-grid">
          ${[1, 2, 3].map(n => {
            const s = readSlot(n);
            return `<div class="slot-card ${n === slot ? 'active' : ''}">
              <small>SLOT ${n} ${n === slot ? '· ATIVO' : ''}</small>
              <h2>${s ? safe(s.perfil.nome) : 'Vazio'}</h2>
              <p>${s ? `Calouro • Rank #${s.perfil.ranking_campus}/100 • ${safe(SCENES[s.node]?.title || '')}` : 'Nenhum aluno matriculado'}</p>
              <button class="${n === slot ? 'primary' : 'secondary'}" data-slot="${n}">${n === slot ? 'SLOT SELECIONADO' : 'USAR ESTE SLOT'}</button>
            </div>`;
          }).join('')}
        </div>
        <div class="button-row">
          <button class="secondary" data-action="export">EXPORTAR SAVE</button>
          <button class="secondary" data-action="import">IMPORTAR SAVE</button>
          <button class="primary" data-action="menu">MENU PRINCIPAL</button>
        </div>
      </div>
    </main>`);
  }

  let phoneApp='home', phoneContact='';
  const phoneApps=[['messages','✉','Mensagens'],['feed','V+','Vought+'],['contacts','☷','Contatos'],['map','▧','Mapa'],['agenda','◷','Agenda'],['ranking','★','Ranking'],['news','▤','Notícias'],['files','▣','Arquivos'],['profile','◉','Perfil']];
  const phoneReady=()=>save?.visited?.includes('chegada_campus');
  const reputation=()=>{const f=save.flags||{}, p=phoneData(); const rank=save.perfil.ranking_campus; const count=ks=>ks.filter(k=>f[k]).length; return {popularidade:clampSocial(22+Math.round((100-rank)/2)+p.posts.length*2+count(['salvou_clara','f5_usou_poder'])*5),aprovacao:clampSocial(35+count(['t2_dir_ambicioso','t2_dir_diplomatico','t3_dir_concordou','ar2_confirmou_zoe'])*12-count(['t2_dir_questionou','f4_zoe_confronto'])*9),credibilidade:clampSocial(40+count(['t4_contou_tudo','f2_matteo_honesto','salvou_clara'])*9+p.replies.filter(r=>r.kind===0).length*3),controversia:clampSocial(10+count(['t2_dir_questionou','ar2_criticou_matteo','f4_zoe_confronto','f2_matteo_desafiou'])*13+p.posts.filter(x=>x.kind===1).length*5)};};
  function phoneData(){return save.phone ||= {read:[],replies:[],likes:[],following:[],posts:[],comments:{}};}
  function phoneMessages(){const v=save.visited, f=save.flags; const m=[]; const add=(id,who,text)=>m.push({id,who,text});
    if(v.includes('chegada_campus'))add('welcome','group','Godolkin: bem-vindos! Confiram a agenda da recepção.');
    if(v.includes('calouros_1')||v.includes('dorm_f'))add('clara1','clara','E aí, já conseguiu se localizar?');
    if(v.includes('calouros_1')||v.includes('dorm_m'))add('luka1','luka','A recepção parece um comercial interminável, né?');
    if(v.includes('arcadas_1')||v.includes('dorm_f'))add('maya1','maya','Se precisar de um lugar tranquilo, a biblioteca costuma estar vazia.');
    if(v.includes('arcadas_1')||v.includes('dorm_m'))add('otavio1','otavio','Se quiser companhia no almoço, me avisa.');
    if(v.includes('elite_1')||v.includes('arena_2'))add('zoe1','zoe','Primeiras impressões contam. Nos vemos na Torre Norte.');
    if(v.includes('elite_1')||v.includes('festa_2'))add('matteo1','matteo','Espero que esteja se adaptando. Godolkin não é só o ranking.');
    if(f.salvou_clara)add('clara2','clara','Sobre a arena… obrigada por ter pensado em mim.');
    if(f.favor_aceito||f.favor_recusado)add('clara3','clara',f.favor_aceito?'Obrigada por me ouvir mais cedo.':'Ainda estou pensando na nossa conversa.');
    if(v.includes('almoco_saida')||v.includes('tarde_6'))add('lunch','group','Otávio: alguém vai passar no dormitório antes da festa?');
    if(v.includes('festa_7'))add('mystery','group','Maya: precisamos conversar sobre o que descobrimos hoje.');
    return m;
  }
  const phoneReplyOptions={"welcome": ["Valeu! Vou conferir a agenda.", "Onde fica a recepção?", "Vou me organizar por aqui."], "clara1": ["Mais ou menos. Esse campus é enorme.", "Já sim! Valeu por perguntar.", "Ainda estou explorando, depois te conto."], "luka1": ["Sim! Parece que estamos num anúncio.", "Achei interessante, até.", "Só quero saber quando acaba."], "maya1": ["Valeu pela dica. Gosto de lugares tranquilos.", "Talvez eu passe por lá mais tarde.", "Por enquanto vou ficar no pátio."], "otavio1": ["Boa ideia! Podemos almoçar juntos.", "Valeu pelo convite, vou ver meu horário.", "Hoje vou almoçar por conta própria."], "zoe1": ["Até a Torre Norte, então.", "Prefiro que me conheçam aos poucos.", "Ainda não decidi se vou."], "matteo1": ["Estou me adaptando. Obrigado por perguntar.", "Interessante ouvir isso de você.", "Ainda estou formando minha opinião."], "clara2": ["Fico feliz que esteja bem.", "Foi uma decisão de equipe.", "Podemos conversar sobre isso depois."], "clara3": ["Também fiquei pensando nisso.", "Espero que entenda minha decisão.", "Podemos conversar com calma depois."], "lunch": ["Vou passar no quarto antes da festa.", "Ainda tenho algumas coisas para fazer.", "Encontro vocês mais tarde."], "mystery": ["Concordo. Vamos conversar com calma.", "Precisamos separar fatos de rumores.", "Prefiro deixar essa conversa para amanhã."]};
  const replyOptions=m=>phoneReplyOptions[m.id]||["Entendi.","Vamos conversar depois."];
  const phoneName=id=>id==='group'?'Grupo Godolkin':CAST.find(c=>c.id===id)?.name||id;
  const unreadPhone=()=>phoneReady()?phoneMessages().filter(m=>!phoneData().read.includes(m.id)).length:0;
  function feedPosts(){const v=save.visited,f=save.flags;const posts=[{id:'welcome',name:'Godolkin Oficial',text:'Bem-vindos à nova turma! A avaliação acontece no Pavilhão B.',likes:2486},{id:'m0',name:'Matteo Valença',text:'Novo semestre. O trabalho continua, mesmo longe das câmeras.',likes:12800},{id:'z0',name:'Zoe Lee',text:'Boa sorte aos novos estudantes. Primeiras impressões importam.',likes:8294}];if(v.includes('arena_2'))posts.push({id:'arena',name:'Godolkin Oficial',text:f.salvou_clara?'A avaliação dos calouros chamou atenção pela cooperação entre estudantes.':'A avaliação dos calouros foi concluída. Acompanhem o ranking oficial.',likes:1300});if(v.includes('festa_1'))posts.push({id:'tower',name:'Clara Vance',text:'A Torre Norte está lotada. Será que alguém veio só pela conversa?',likes:482});return [...posts,...phoneData().posts.map((p,i)=>({id:'player'+i,name:save.perfil.nome,text:p.text,likes:12+i*3}))].reverse();}
  function phoneView(){if(!phoneReady()){game();return;}screen='phone';drawerOpen=false;const p=phoneData(), msgs=phoneMessages(), rep=reputation();const btn=(label,attr)=>`<button class="phone-btn" ${attr}>${safe(label)}</button>`;let content='';
    if(phoneApp==='home')content=`<h2>${safe(SCENES[save.node]?.time||'Godolkin')}</h2><p>Primeiro dia · Godolkin</p><div class="phone-grid">${phoneApps.map(([id,icon,name])=>`<button data-phone-app="${id}"><strong>${icon}</strong>${name}${id==='messages'&&unreadPhone()?` <small>${unreadPhone()}</small>`:''}</button>`).join('')}</div>`;
    else if(phoneApp==='messages'){if(!phoneContact){const latest=[...new Map(msgs.map(m=>[m.who,m])).values()].reverse();content=`<div class="phone-app-title"><h2>Conversas</h2><small>${unreadPhone()} não lidas</small></div>`+latest.map(m=>`<button class="phone-thread" data-phone-contact="${m.who}"><span class="phone-avatar">${safe(phoneName(m.who).slice(0,1))}</span><span class="thread-body"><b>${safe(phoneName(m.who))}</b><span>${safe(m.text)}</span></span>${msgs.some(x=>x.who===m.who&&!p.read.includes(x.id))?'<small>●</small>':''}</button>`).join('');}else content=`<div class="chat-head"><span class="phone-avatar">${safe(phoneName(phoneContact).slice(0,1))}</span><div><h3>${safe(phoneName(phoneContact))}</h3><small>Godolkin Mobile</small></div></div><div class="chat-date">Primeiro dia · Godolkin</div>`+msgs.filter(m=>m.who===phoneContact).map(m=>{const r=p.replies.find(x=>x.id===m.id);return `<div class="phone-message">${safe(m.text)}<small>Recebida</small></div>${r?`<div class="phone-message outgoing">${safe(r.text)}<small>Enviada ✓</small></div>`:`<div class="phone-actions"><small>ESCOLHA UMA RESPOSTA</small>${replyOptions(m).map((t,i)=>btn(t,`data-phone-reply="${m.id}:${i}"`)).join('')}</div>`}`;}).join('')+btn('‹ Conversas','data-phone-app="messages"');}
    else if(phoneApp==='feed')content=`<div class="phone-app-title feed-brand"><h2>VOUGHT<span>+</span></h2><small>Campus • Feed</small></div><div class="phone-compose"><textarea id="phone-post" maxlength="240" placeholder="Compartilhe algo sobre seu dia"></textarea>${btn('Publicar','data-phone-publish="1"')}</div>`+feedPosts().map(x=>`<article class="phone-post"><div class="post-author"><span class="phone-avatar">${safe(x.name.slice(0,1))}</span><div><b>${safe(x.name)}</b><small>Campus · Primeiro dia</small></div></div><p>${safe(x.text)}</p>${btn(`${p.likes.includes(x.id)?'♥':'♡'} ${x.likes+(p.likes.includes(x.id)?1:0)}`,`data-phone-like="${x.id}"`)}<div>${(p.comments[x.id]||[]).map(t=>`<p class="fine">${safe(save.perfil.nome)}: ${safe(t)}</p>`).join('')}</div><input id="comment-${x.id}" maxlength="120" placeholder="Comentar">${btn('Enviar',`data-phone-comment="${x.id}"`)}</article>`).join('');
    else if(phoneApp==='contacts')content=CAST.filter(c=>msgs.some(m=>m.who===c.id)).map(c=>`<article class="phone-post"><b>${safe(c.name)}</b>${btn(p.following.includes(c.id)?'Seguindo':'Seguir',`data-phone-follow="${c.id}"`)}${btn('Mensagem',`data-phone-contact="${c.id}"`)}</article>`).join('')||'<p>Conheça alunos para desbloquear contatos.</p>';
    else if(phoneApp==='agenda')content=['08:00 — Recepção','09:00 — Dormitórios e exploração','10:00 — Avaliação','12:00 — Almoço','20:00 — Torre Norte'].map(t=>`<p>${safe(t)}</p>`).join('');
    else if(phoneApp==='news')content=feedPosts().filter(x=>x.name==='Godolkin Oficial').map(x=>`<article class="phone-post">${safe(x.text)}</article>`).join('');
    else if(phoneApp==='files')content=`<p>F-01 · ${save.visited.includes('festa_7')?'Código registrado':'Acesso restrito'}</p>${btn('Abrir diário','data-action="journal"')}`;
    else if(phoneApp==='profile')content=`<h3>${safe(save.perfil.nome)}</h3><p>${Math.max(0,Math.round(rep.popularidade*25))} seguidores · ${p.following.length} seguindo · #${save.perfil.ranking_campus}</p>${Object.entries(rep).map(([k,v])=>`<p>${safe(k)}: ${v}/100</p><progress max="100" value="${v}"></progress>`).join('')}`;
    layout(`<main class="play-view"><section class="virtual-phone"><header><span>${safe(SCENES[save.node]?.time||"Godolkin")}</span><strong>GODOLKIN</strong><span>◉ ▰</span></header>${phoneApp!=='home'?btn('‹ Início','data-phone-app="home"'):''}<div class="phone-content">${content}</div>${btn('Fechar celular','data-action="resume"')}</section></main>`);
  }
  function endingResult(){const f=save.flags||{},r=reputation(), trust=['clara','maya','luka','otavio'].reduce((a,id)=>a+socialFor(id).trust,0)/4;const clues=['mural_visto','viu_cameras_internas','t3_dir_perguntou_transf','f7_perguntou_codigo','detectou_espiao'].filter(k=>f[k]).length;const count=ks=>ks.filter(k=>f[k]).length;const scores=[['A Estrela da Vought',r.aprovacao/10+r.popularidade/10+count(['t2_dir_ambicioso','t3_dir_concordou','f1_centro_salao'])*3,'Uma mensagem da assessoria chega: seu nome entrou na lista de talentos para campanhas. O próximo semestre começa sob os holofotes.'],['O Inconformado',r.controversia/5+count(['t2_dir_questionou','ar2_criticou_matteo','f4_zoe_confronto'])*4,'A direção solicita uma nova reunião. Alguns estudantes começam a questionar as regras ao seu lado.'],['O Estrategista',count(['pacto_duplo','t2_dir_diplomatico','f7_sugeriu_fachada','f4_zoe_perspicaz'])*5+socialFor('zoe').respect/10+socialFor('matteo').trust/10,'Dois grupos enviam convites diferentes. Você terá de administrar alianças e expectativas.'],['O Fantasma',count(['pacto_silencio','f5_discreto','t3_dir_silencio','f2_matteo_misterio'])*5+(100-r.popularidade)/10,'Seu nome quase não aparece no feed. A discrição abre espaço para observar o que outros não percebem.'],['O Pacto',trust/5+count(['pacto_investigacao','t4_contou_tudo','t6_plano_grupo','f7_perguntou_codigo'])*3,'O grupo confirma que estará ao seu lado. A investigação do F-01 será uma responsabilidade compartilhada.']];if(clues>=4&&f.pacto_investigacao)return ['A Anomalia',0,'Um registro confidencial menciona uma inconsistência na sua matrícula. A origem do arquivo permanece desconhecida.',clues];return [...scores.sort((a,b)=>b[1]-a[1])[0],clues];}

  function ending() {
    if (!save) { menu(); return; }
    screen = 'ending';
    if(save.node!=='end'){game();return;}
    const result=save.prologueEnding ||= endingResult(); store();
    const f = save.flags || {};
    const firstName = getFirstName(save.perfil.nome);
    const pactText = f.pacto_investigacao
      ? 'Você jurou ao lado de Maya, Luka, Clara e Otávio investigar os registros secretos do subnível F-01.'
      : f.pacto_duplo
      ? 'Você decidiu manter as aparências perto de Matteo e Zoe enquanto coleta provas contra a Vought.'
      : 'Você escolheu o silêncio e a ascensão no Ranking antes de enfrentar o Diretor Caldwell.';

    layout(`<main class="end-view">
      <section class="end-card">
        <div class="kicker">FIM DO PRÓLOGO</div>
        <h1>${safe(result[0])}</h1><p>${safe(result[2])}</p>
        <p>Da infância até o primeiro toque de recolher como calouro, a jornada de <strong>${safe(firstName)}</strong> (${safe(save.perfil.nome)}) está apenas começando.</p>
        <div class="end-summary">
          <h2>RESUMO DO SEU DOSSIÊ</h2><p>Seguidores: ${Math.round(reputation().popularidade*25)} · Memórias: ${(save.memories||[]).length} · Histórias pessoais: ${CAST.filter(c=>save.visited.includes("pessoal_"+c.id)).length}/6 · Pistas: ${result[3]}/5</p><p>Personalidade: ${safe(labelOf(ARQUETIPOS,save.perfil.personalidade||save.perfil.arquetipo))}</p><p>Decisões recentes:</p>${save.history.slice(-4).map(h=>`<p>• ${safe(h.label)}</p>`).join("")}
          <p>• Aluno Matriculado: <strong>${safe(save.perfil.nome)}</strong></p>
          <p>• Situação Acadêmica: <strong>Calouro (1º Ano) · ${save.perfil.idade} anos</strong></p>
          <p>• Ranking Atual no Campus: <strong>#${save.perfil.ranking_campus} / 100 (${safe(getRankTier(save.perfil.ranking_campus))})</strong></p>
          <p>• Vitalidade: <strong>${save.recursos.vitalidade}%</strong> | Estresse de Poder: <strong>${save.recursos.estresse}%</strong></p>
          <p>• Postura no Pacto: ${safe(pactText)}</p>
        </div>
        <div class="torn-quote-box"><p>“Eles nos criaram para serem heróis na TV. Ninguém perguntou o que acontece quando desligam as câmeras.”</p><span class="torn-quote-watermark">V7</span></div>
        <div class="button-row">
          <button class="primary" data-action="ranking">VER RANKING OFICIAL (#1–#100)</button>
          <button class="secondary" data-action="export">EXPORTAR SAVE DO PRÓLOGO</button>
          <button class="secondary" data-action="cast">VER RELAÇÕES COM ALUNOS</button>
          <button class="secondary" data-action="menu">MENU PRINCIPAL</button>
        </div>
      </section>
    </main>`);
  }

  function exportSave() {
    if (!save) enter();
    if (!save) { alert('Nenhuma partida ativa para exportar.'); return; }
    const blob = new Blob([JSON.stringify(save, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GenV_Godolkin_${save.perfil.nome.replace(/\s+/g, '_')}_Slot${slot}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function importSave() {
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = '.json,application/json';
    inp.onchange = async () => {
      const f = inp.files?.[0];
      if (!f) return;
      try {
        const obj = JSON.parse(await f.text());
        if (obj.game !== 'genv-campus-godolkin' || !SCENES[obj.node]) {
          throw new Error('Arquivo incompatível com Gen V: Campus Godolkin.');
        }
        if (!obj.romance) obj.romance = { ...BASE_ROMANCE };
        if (typeof obj.lastRankDelta !== 'number') obj.lastRankDelta = 0;
        save = { ...obj, slot };
        store();
        screen = 'game';
        render();
      } catch (err) {
        alert('Erro ao importar: ' + err.message);
      }
    };
    inp.click();
  }

  function render() {
    if (screen === 'creator') creator();
    else if (screen === 'game') game();
    else if (screen === 'phone') phoneView();
    else if (screen === 'map') mapView();
    else if (screen === 'ranking') rankingView();
    else if (screen === 'dossier') dossier();
    else if (screen === 'journal') journal();
    else if (screen === 'chain') chainView();
    else if (screen === 'cast') castView();
    else if (screen === 'slots') slotsView();
    else if (screen === 'ending') ending();
    else menu();
  }

  root.addEventListener('input', (e) => {
    if (e.target.id === 'inp-nome' && draft) {
      draft.nome = e.target.value;
      const btn = document.getElementById('btn-creator-next');
      if (btn) btn.disabled = draft.nome.trim().length < 2;
    }
  });

  root.addEventListener('change', (e) => {
    if (!draft) return;
    if (e.target.id === 'sel-idade') draft.idade = Number(e.target.value);
    if (e.target.id === 'sel-pronomes') draft.pronomes = e.target.value;
  });

  root.addEventListener('click', (e) => {
    const pin=e.target.closest('[data-map-pin]');
    if(pin){mapSelected=pin.dataset.mapPin;mapView();return;}
    const travel=e.target.closest('[data-map-choice]');
    if(travel){const c=SCENES[save?.node]?.choices?.[Number(travel.dataset.mapChoice)];if(c&&evaluateChoice(c).visible&&evaluateChoice(c).enabled)move(c.to,c);return;}
    const rToast = e.target.closest('#rank-toast');
    if (rToast) {
      rankFlash = null;
      if (rankTimer) clearTimeout(rankTimer);
      rankingView();
      return;
    }
    const toast = e.target.closest('#bf-toast');
    if (toast) {
      chainFlash = null;
      if (chainTimer) clearTimeout(chainTimer);
      toast.remove();
      return;
    }
    const castRow = e.target.closest('[data-open-cast]');
    if (castRow) {
      castSelected = castRow.dataset.openCast;
      castView();
      return;
    }
    const btn = e.target.closest('button');
    if (!btn) return;

    if(phoneReady() && Object.keys(btn.dataset).some(k=>k.startsWith('phone'))){const d=btn.dataset,p=phoneData();if(d.phoneApp){phoneContact='';if(d.phoneApp==='map'){mapSelected=null;mapView();return;}if(d.phoneApp==='ranking'){rankingView();return;}phoneApp=d.phoneApp;}if(d.phoneContact){phoneContact=d.phoneContact;phoneApp='messages';for(const m of phoneMessages().filter(m=>m.who===phoneContact))if(!p.read.includes(m.id))p.read.push(m.id);}if(d.phoneReply){const [id,k]=d.phoneReply.split(':'),m=phoneMessages().find(x=>x.id===id);if(m&&!p.replies.some(x=>x.id===id)){const kind=Number(k),text=replyOptions(m)[kind];if(typeof text!=='string')return;p.replies.push({id,kind,text});if(m.who!=='group'){const a=socialFor(m.who);a.trust=clampSocial(a.trust+(kind===0?1:0));}}}if(d.phoneLike){p.likes=p.likes.includes(d.phoneLike)?p.likes.filter(x=>x!==d.phoneLike):[...p.likes,d.phoneLike];}if(d.phoneFollow){p.following=p.following.includes(d.phoneFollow)?p.following.filter(x=>x!==d.phoneFollow):[...p.following,d.phoneFollow];}if(d.phonePublish){const t=document.getElementById('phone-post')?.value.trim();if(t&&p.posts.length<20)p.posts.push({text:t.slice(0,240),kind:0});}if(d.phoneComment){const t=document.getElementById('comment-'+d.phoneComment)?.value.trim();const list=p.comments[d.phoneComment]||=[];if(t&&list.length<10)list.push(t.slice(0,120));}store();phoneView();return;}
    if (btn.hasAttribute('data-rank-filter')) {
      rankingFilter = btn.dataset.rankFilter;
      rankingView();
      return;
    }
    if(btn.dataset.origin){draft.origem=btn.dataset.origin;creator();return;}
    if(btn.dataset.motive){draft.motivacao=btn.dataset.motive;creator();return;}
    if (btn.hasAttribute('data-pick-arq')) {
      draft.arquetipo = btn.dataset.pickArq;
      creator();
      return;
    }
    if (btn.hasAttribute('data-pick-pod')) {
      draft.poder_id = btn.dataset.pickPod;
      creator();
      return;
    }
    if (btn.hasAttribute('data-toggle-trait')) {
      const id = btn.dataset.toggleTrait;
      const idx = draft.caracteristicas.indexOf(id);
      if (idx > -1) draft.caracteristicas.splice(idx, 1);
      else { const kind=CARACTERISTICAS.find(t=>t.id===id)?.tipo; if(kind && traitCount(kind)<(kind==='flaw'?3:5)) draft.caracteristicas.push(id); }
      creator();
      return;
    }
    if (btn.hasAttribute('data-attr')) {
      const attr = btn.dataset.attr;
      const delta = Number(btn.dataset.delta);
      const used = Object.values(draft.atributos).reduce((a, b) => a + b, 0) - 5;
      const left = 7 - used;
      const next = draft.atributos[attr] + delta;
      if (next >= 1 && next <= 4 && (delta < 0 || left > 0)) {
        draft.atributos[attr] = next;
        creator();
      }
      return;
    }
    if (btn.hasAttribute('data-choice-idx')) {
      const n = SCENES[save?.node];
      const c = n?.choices?.[Number(btn.dataset.choiceIdx)];
      if (c && evaluateChoice(c).visible && evaluateChoice(c).enabled) move(c.to, c);
      return;
    }
    if (btn.hasAttribute('data-pick-cast')) {
      castSelected = btn.dataset.pickCast;
      castView();
      return;
    }
    if (btn.hasAttribute('data-chain')) {
      chainSelected = btn.dataset.chain;
      chainView();
      return;
    }
    if (btn.hasAttribute('data-slot')) {
      slot = Number(btn.dataset.slot);
      save = readSlot(slot);
      slotsView();
      return;
    }

    switch (btn.dataset.action) {
      case 'drawer': drawerOpen = !drawerOpen; if (screen === 'menu') menu(true); else render(); break;
      case 'menu': menu(); break;
      case 'new':
        if (enter() && !confirm('Substituir o aluno atual deste slot?')) return;
        resetDraft();
        creator();
        break;
      case 'creator-back':
        if (creatorStep > 1) { creatorStep--; creator(); }
        else menu();
        break;
      case 'creator-next':
        if (creatorStep < 6) { creatorStep++; creator(); }
        else finishCreation();
        break;
      case 'resume': drawerOpen = false; if (!save) enter(); if (save) game(); else menu(); break;
      case 'phone': phoneApp='home';phoneContact='';phoneView();break;
      case 'map': mapSelected=null; mapView(); break;
      case 'ranking': rankingView(); break;
      case 'dossier': dossier(); break;
      case 'journal': journal(); break;
      case 'chain': chainView(); break;
      case 'cast': castView(); break;
      case 'slots': slotsView(); break;
      case 'end': ending(); break;
      case 'export': exportSave(); break;
      case 'import': importSave(); break;
    }
  });

  menu();
})();
