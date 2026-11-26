/* Gen V: Campus Godolkin — Motor Jogável V0.8.0
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

  const ARQUETIPOS = [
    { id: 'prodigio', nome: 'O Prodígio Ambicioso', tag: 'TOP 10', desc: 'Focado no ranking, competitivo e obcecado por aprovação e patrocínios.' },
    { id: 'cetico', nome: 'O Cético / Rebelde', tag: 'ANTI-VOUGHT', desc: 'Desconfia da diretoria, questiona regras e busca a verdade oculta.' },
    { id: 'estrategico', nome: 'O Estratégico / Frio', tag: 'CALCULISTA', desc: 'Observador e discreto; prefere manipular nos bastidores.' },
    { id: 'protetor', nome: 'O Impulsivo / Protetor', tag: 'ALIADO', desc: 'Age primeiro e pensa depois; coloca amigos acima da própria fama.' },
    { id: 'reservado', nome: 'O Forasteiro / Reservado', tag: 'DISCRETO', desc: 'Evita holofotes e esconde a real extensão dos próprios poderes.' }
  ];

  const PODERES = [
    {
      id: 'hemocinese',
      nome: 'Hemocinese (Controle Sanguíneo)',
      desc: 'Solidifica o próprio sangue em lâminas ou barreiras e detecta batimentos cardíacos à distância.',
      custo: 'Custo: Exige se cortar (perde Vitalidade) e deixa rastros comprometedores.'
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
    { basePos: 2, name: 'Matteo', year: '3º Ano', power: 'Pirocinese', tag: 'ELITE VOUGHT', castId: 'matteo' },
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
    if (romVal >= 20) return { label: 'Interesse Romântico & Química Evidente', cls: 'positive' };
    if (romVal >= 10) return { label: 'Clima de Flerte / Aproximação Especial', cls: 'positive' };
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
        <span class="header-status">${screen === 'menu' ? 'VOUGHT // DOSSIÊ' : 'PRÓLOGO · V0.8.0'}</span>
        <button class="menu-btn" data-action="drawer" aria-expanded="${drawerOpen}">
          <span class="menu-btn-bars">${drawerOpen ? '✕' : '☰'}</span>
          <span>${drawerOpen ? 'FECHAR' : 'MENU'}</span>
        </button>
      </div>
    </header>
    ${drawerOpen ? `<nav class="drawer" aria-label="Menu do jogo">
      ${save ? '<button data-action="resume">Retomar a história</button>' : ''}
      ${save ? '<button data-action="dossier">Ficha do Meu Aluno</button>' : ''}
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
    return html;
  }

  function scheduleToastDismiss() {
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
      'Etapa 1 de 4 • Identidade & Arquétipo',
      'Etapa 2 de 4 • Mutação Exclusiva (Composto V)',
      'Etapa 3 de 4 • 8 Características',
      'Etapa 4 de 4 • 5 Atributos (7 Pontos)'
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
        <p class="fine">Escolha uma das 5 mutações exclusivas. Nenhum colega do seu grupo possui o mesmo poder que você — e cada habilidade tem sua própria história na infância e adolescência.</p>
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
      canAdvance = count === 8;
      nextLabel = count === 8 ? 'Próximo: Atributos ›' : `Escolha ${8 - count} restante(s)`;
      stepHtml = `
        <div class="sticky-counter">
          <span>Características do Personagem</span>
          <b>${count} / 8</b>
        </div>
        <p class="fine">Selecione exatamente 8 traços (entre talentos sociais, físicos e falhas dramáticas).</p>
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
      nextLabel = left === 0 ? 'INICIAR PRÓLOGO DE ORIGEM ›' : `Distribua ${left} ponto(s)`;
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

    layout(`<main class="panel-view">
      <div class="panel">
        <div class="stepper">
          ${[1, 2, 3, 4].map(i => `<div class="step-pill ${i < creatorStep ? 'done' : i === creatorStep ? 'active' : ''}"></div>`).join('')}
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
      version: '0.8.0',
      slot,
      node: DATA.meta.start,
      perfil: {
        nome: draft.nome.trim(),
        idade: draft.idade,
        ano: '1º Ano (Calouro)',
        pronomes: draft.pronomes,
        arquetipo: draft.arquetipo,
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

  function evaluateChoice(c) {
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
    if (!SCENES[to]) return;
    chainFlash = null;
    rankFlash = null;
    if (!save.romance) save.romance = { ...BASE_ROMANCE };

    if (choice) {
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
          const from = save.romance[id] ?? 0;
          const toVal = Math.max(0, Math.min(100, from + delta));
          save.romance[id] = toVal;
          if (toVal !== from) {
            const name = CAST.find(x => x.id === id)?.name || id;
            changes.push({ name: `${name} (Atração)`, from, to: toVal, type: 'romance' });
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

    const baseTextHtml = n.text ? formatNarrative(n.text) : '';
    const extraTextHtml = (n.dynamic || [])
      .filter(d => d.flag && save.flags[d.flag])
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
          if (labelText.startsWith('[Flerte]')) {
            labelText = labelText.replace(/^\[Flerte\]\s*/i, '');
            badge = '<span class="choice-tag romance">♥ FLERTE</span>';
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

    const pct = save.node === 'end' ? 100 : Math.min(97, Math.max(5, Math.round((save.visited.length / 26) * 100)));

    layout(`<main class="play-view">
      <div class="play-content">
        <div class="hud-bar">
          <div class="hud-player">
            <span>${safe(firstName)}</span>
            <button type="button" class="hud-rank-btn" data-action="ranking" title="Abrir Ranking Oficial (#1–#100)">RANK #${save.perfil.ranking_campus} ↗</button>
            <span class="fine">(${safe(podObj ? podObj.nome.split(' ')[0] : '')})</span>
          </div>
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
          ${choicesHtml}
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
        <h2>Mutação Registrada</h2>
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
            <h2>Intimidade &amp; Atração no Campus</h2>
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
                  <label>♥ Atração</label>
                  <div class="meter romance-meter"><i style="width:${rom}%"></i></div>
                  <b>${rom}</b>
                </div>` : ''}
              </div>`;
            }).join('')}
          </section>
          <section>
            <h2>Decisões Registradas (${save.history.length})</h2>
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
                <em>Intimidade: ${bVal}/100${c.romanceable && rVal > 0 ? ` · ♥ Atração: ${rVal}/100` : ''}</em>
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

          <h2>Relação com ${safe(playerFirstName)}</h2>
          <div class="cast-rel-list">
            <div class="cast-rel-item player-rel">
              <strong>${safe(playerFirstName)} • ${safe(relStatus.label)}</strong>
              <div class="rel-meter-row">
                <div class="meter"><i style="width:${playerBond}%"></i></div>
                <b>${playerBond}</b>
              </div>
              ${sel.romanceable ? `
                <div style="font-size:11px;color:#f9a8d4;font-weight:800;margin-top:6px;">♥ INTERESSE ROMÂNTICO / ATRAÇÃO</div>
                <div class="rel-meter-row">
                  <div class="meter romance-meter"><i style="width:${playerRom}%"></i></div>
                  <b>${playerRom}</b>
                </div>
              ` : `<div style="font-size:11px;color:#a1a1aa;margin-top:4px;">Status: ${safe(sel.relationshipStatus || 'Compromissado(a)')}</div>`}
              <span>${save
                ? (playerBond >= 55
                    ? `${sel.name} já demonstra confiança real em ${playerFirstName} e compartilha informações sem rodeios.`
                    : playerBond >= 36
                    ? `${sel.name} começa a se aproximar e enxerga ${playerFirstName} como um colega promissor no campus.`
                    : `${sel.name} ainda vê ${playerFirstName} como um calouro recém-chegado — a confiança precisa ser conquistada passo a passo.`)
                : 'Inicie uma partida para construir laços e aumentar sua intimidade com este personagem.'}</span>
            </div>
          </div>

          <h2>Relações &amp; Afinidade com os Outros Alunos</h2>
          <div class="cast-rel-list">
            ${(sel.relations || []).map(r => {
              const aff = typeof r.affinity === 'number' ? r.affinity : 50;
              return `<div class="cast-rel-item">
                <strong>${safe(r.target)} • ${safe(r.label)}</strong>
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

  function ending() {
    if (!save) { menu(); return; }
    screen = 'ending';
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
        <h1>A VERDADE SOB GODOLKIN</h1>
        <p>Da infância até o primeiro toque de recolher como calouro, a jornada de <strong>${safe(firstName)}</strong> (${safe(save.perfil.nome)}) está apenas começando.</p>
        <div class="end-summary">
          <h2>RESUMO DO SEU DOSSIÊ</h2>
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

    if (btn.hasAttribute('data-rank-filter')) {
      rankingFilter = btn.dataset.rankFilter;
      rankingView();
      return;
    }
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
      else if (draft.caracteristicas.length < 8) draft.caracteristicas.push(id);
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
      if (c) move(c.to, c);
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
        if (creatorStep < 4) { creatorStep++; creator(); }
        else finishCreation();
        break;
      case 'resume': drawerOpen = false; if (!save) enter(); if (save) game(); else menu(); break;
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
