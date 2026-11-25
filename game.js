/* Gen V: Campus Godolkin — Motor Jogável V0.2.1
 * Inclui: Criação de Personagem (4 passos), 3 Slots, Diário de Consequências,
 * Fichas de Elenco, Sistema "Reação em Cadeia" (Efeito Borboleta) e Exportação/Importação.
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
  const SAVE_KEY = 'genv_godolkin_v01_slot_';

  const ARQUETIPOS = [
    { id: 'prodigio', nome: 'O Prodígio Ambicioso', tag: 'TOP 10', desc: 'Focado no ranking, competitivo e obcecado por aprovação e patrocínios.' },
    { id: 'cetico', nome: 'O Cético / Rebelde', tag: 'ANTI-VOUGHT', desc: 'Desconfia da diretoria, questiona regras e busca a verdade oculta.' },
    { id: 'estrategico', nome: 'O Estratégico / Frio', tag: 'CALCULISTA', desc: 'Observador e discreto; prefere manipular nos bastidores.' },
    { id: 'protetor', nome: 'O Impulsivo / Protetor', tag: 'ALIADO', desc: 'Age primeiro e pensa depois; coloca amigos acima da própria fama.' },
    { id: 'reservado', nome: 'O Forasteiro / Reservado', tag: 'DISCRETO', desc: 'Evita holofotes e esconde a real extensão dos próprios poderes.' }
  ];

  const PODERES = [
    { id: 'hemocinese', nome: 'Hemocinese (Controle Sanguíneo)', desc: 'Solidifica o próprio sangue em lâminas/chicotes e detecta batimentos cardíacos.', custo: 'Custo: Exige se cortar (perde Vitalidade) e deixa rastros comprometedores.' },
    { id: 'telecinese', nome: 'Telecinese (Manipulação Cinética)', desc: 'Move, arremessa ou esmaga objetos e pessoas à distância com a mente.', custo: 'Custo: Exige Controle alto; sustos causam ondas de choque acidentais.' },
    { id: 'superforca', nome: 'Superforça & Invulnerabilidade', desc: 'Força física descomunal e resistência a impactos pesados e disparos.', custo: 'Custo: Risco constante de destruir pistas ou ferir aliados sem querer.' },
    { id: 'pirocinese', nome: 'Pirocinese / Combustão Corporal', desc: 'Envolve o corpo em chamas intensas, dispara rajadas e ganha propulsão.', custo: 'Custo: Zero furtividade; dispara alarmes e causa danos colaterais.' },
    { id: 'tamanho', nome: 'Manipulação de Tamanho', desc: 'Encolhe a centímetros para infiltração ou cresce em combate aberto.', custo: 'Custo: Alto desgaste metabólico e vulnerabilidade após uso intenso.' },
    { id: 'troca_corpo', nome: 'Troca de Forma / Fluidez', desc: 'Alterna entre uma forma ultra-resistente e outra ágil com rajadas de energia.', custo: 'Custo: Gera dilemas sociais e tratamento diferente pela mídia.' },
    { id: 'persuasao', nome: 'Persuasão Tátil', desc: 'Ao tocar a pele de alguém, implanta comandos mentais irresistíveis.', custo: 'Custo: Exige contato direto sem luvas; uso excessivo causa hemorragias.' },
    { id: 'tecnopatia', nome: 'Tecnopatia (Mimetismo Digital)', desc: 'Invade sistemas eletrônicos, câmeras e apaga registros pelo toque.', custo: 'Custo: Sem força física direta; vulnerável a sobrecargas elétricas.' }
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

  const BASE_BONDS = { maya: 50, dante: 48, clara: 56, marcus: 52, elena: 50 };

  /* SISTEMA PERSONALIZADO: REAÇÃO EM CADEIA (EFEITO BORBOLETA) */
  const CHAIN_REACTIONS = [
    {
      id: 'holofotes',
      title: 'Olhos da Vought',
      teaser: 'A atenção da mídia abre portas, mas elimina sua privacidade no campus.',
      steps: [
        { when: f => f.chamou_atencao_midia || f.contato_top10, description: 'Você chamou a atenção das câmeras e dos veteranos logo na chegada.' },
        { when: f => f.dano_colateral_arena || f.controle_impecavel, description: 'Sua performance na Arena consolidou sua reputação perante os patrocinadores.' }
      ]
    },
    {
      id: 'arena_marca',
      title: 'O Teste de Fogo',
      teaser: 'Quem você protege — ou deixa para trás — define quem confia em você.',
      steps: [
        { when: f => f.salvou_clara || f.hesitou_arena, description: 'Sua reação diante do drone na Arena marcou seu primeiro dia.' },
        { when: f => f.escondeu_poder || f.usou_poder_arena, description: 'O modo como você usou (ou ocultou) seu poder já está nos relatórios do Prof. Brinker.' }
      ]
    },
    {
      id: 'subsolo',
      title: 'Sinais da Floresta',
      teaser: 'Algumas portas em Godolkin nunca deveriam ser abertas.',
      steps: [
        { when: f => f.viu_elevador_subsolo || f.descobriu_monitoramento_maya, description: 'Você notou movimentações suspeitas da segurança e do servidor interno.' },
        { when: f => f.identificou_floresta || f.detectou_grampo, description: 'Você encontrou provas concretas de que a Vought vigia e transfere alunos em segredo.' }
      ]
    },
    {
      id: 'pacto_godolkin',
      title: 'O Primeiro Pacto',
      teaser: 'Na Torre Norte, o grupo decidiu como encarar o desaparecimento do Rank #6.',
      steps: [
        { when: f => f.apoiou_investigacao || f.investigacao_cautelosa || f.recusou_investigacao, description: 'Você tomou posição quando Maya revelou os arquivos secretos na festa.' },
        { when: f => f.pacto_investigacao || f.pacto_duplo || f.pacto_silencio, description: 'O juramento feito na varanda selou sua aliança — ou isolamento — para o Capítulo 1.' }
      ]
    }
  ];

  let slot = 1;
  let save = null;
  let screen = 'menu';
  let drawerOpen = false;
  let castSelected = null;
  let chainSelected = null;
  let chainFlash = null;
  let chainTimer = null;

  // Estado temporário da Criação de Personagem
  let creatorStep = 1;
  let draft = null;

  const safe = (s) => String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

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
      return obj && obj.game === 'genv-campus-godolkin' && SCENES[obj.node] ? obj : null;
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
        <span class="header-status">PRÓLOGO · V0.2</span>
        <button class="menu-btn" data-action="drawer" aria-expanded="${drawerOpen}">
          <span class="menu-btn-bars">${drawerOpen ? '✕' : '☰'}</span>
          <span>${drawerOpen ? 'FECHAR' : 'MENU'}</span>
        </button>
      </div>
    </header>
    ${drawerOpen ? `<nav class="drawer" aria-label="Menu do jogo">
      ${save ? '<button data-action="resume">Retomar a história</button>' : ''}
      ${save ? '<button data-action="dossier">Ficha do Meu Aluno</button>' : ''}
      ${save ? '<button data-action="journal">Diário de Escolhas</button>' : ''}
      <button data-action="chain">Reação em Cadeia</button>
      <button data-action="cast">Alunos de Godolkin</button>
      <button data-action="slots">Partidas e Slots</button>
      <button data-action="export">Exportar Save (JSON)</button>
      <button data-action="import">Importar Save</button>
      <button data-action="menu">Tela Inicial</button>
    </nav>` : ''}`;
  }

  function chainNotice() {
    if (screen !== 'game' || !chainFlash) return '';
    return `<div class="butterfly-notice" id="bf-toast" role="status" title="Toque para fechar">
      <span class="bf-icon">🧬</span>
      <span>
        <b>${safe(chainFlash.isNew ? 'Nova Reação em Cadeia' : 'Reação em Cadeia Atualizada')}</b>
        <small>${safe(chainFlash.title)}</small>
      </span>
    </div>`;
  }

  function scheduleChainDismiss() {
    if (chainTimer) clearTimeout(chainTimer);
    if (!chainFlash) return;
    chainTimer = setTimeout(() => {
      chainFlash = null;
      const el = document.getElementById('bf-toast');
      if (el) el.remove();
    }, 3800);
  }

  function layout(body) {
    root.innerHTML = `<div class="layout">
      ${header()}
      ${body}
      ${chainNotice()}
      <footer class="app-footer">
        <span>GEN V: CAMPUS GODOLKIN · PRÓLOGO INTERATIVO</span>
        <span class="vought-footer-mark">V7 VOUGHT</span>
      </footer>
    </div>`;
    scheduleChainDismiss();
  }

  /* ============================================================
     TELA INICIAL
  ============================================================ */
  function menu() {
    screen = 'menu';
    drawerOpen = false;
    chainFlash = null;
    const hasSave = !!enter();
    layout(`<main class="menu-view">
      <div class="menu-art" aria-hidden="true">
        <svg class="menu-art-svg" viewBox="0 0 600 720" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M180 120L390 45L590 120V560H180V120Z" fill="#27272A"/>
          <rect x="210" y="140" width="24" height="360" fill="#18181B"/>
          <rect x="265" y="140" width="24" height="360" fill="#18181B"/>
          <rect x="320" y="140" width="24" height="360" fill="#18181B"/>
          <rect x="375" y="140" width="24" height="360" fill="#18181B"/>
          <rect x="430" y="140" width="24" height="360" fill="#18181B"/>
          <rect x="485" y="140" width="24" height="360" fill="#18181B"/>
          <rect x="310" y="480" width="230" height="240" fill="#141417"/>
          <path d="M385 245C385 225 402 210 422 210C442 210 458 225 458 245C458 262 446 276 430 279L475 330L515 480H335L365 330L412 279C396 276 385 262 385 245Z" fill="#09090B"/>
        </svg>
      </div>
      <div class="menu-body">
        <div class="kicker">UNIVERSIDADE GODOLKIN • CALOUROS</div>
        <h1 class="menu-wordmark">${wordmark(true)}</h1>
        <div><span class="torn-strip">PODER, RANKING E SEGREDOS SOB O CAMPUS.</span></div>
        <p class="menu-lead">Crie seu estudante, domine suas habilidades do Composto V e descubra até onde a Vought vai para proteger sua imagem.</p>
        <div class="torn-quote-box">
          <p>“No Campus Godolkin, ser o número um salva sua vida — ou coloca um alvo nas suas costas.”</p>
          <span class="torn-quote-watermark">V7</span>
        </div>
        <div class="menu-stack-buttons">
          ${hasSave ? `<button class="primary" data-action="resume">CONTINUAR COMO ${safe(save.perfil.nome.toUpperCase())} <span>›</span></button>` : ''}
          <button class="${hasSave ? 'secondary' : 'primary'}" data-action="new">${hasSave ? 'NOVO ALUNO (RECOMEÇAR)' : 'CRIAR ALUNO E INICIAR'} <span>›</span></button>
          <button class="secondary" data-action="slots">PARTIDAS E SLOTS</button>
          <button class="secondary" data-action="cast">ELENCO DO CAMPUS</button>
          <button class="secondary" data-action="chain">REAÇÃO EM CADEIA</button>
          <button class="quiet" data-action="import">IMPORTAR SAVE</button>
        </div>
      </div>
    </main>`);
  }

  /* ============================================================
     CRIAÇÃO DE PERSONAGEM (4 PASSOS)
  ============================================================ */
  function creator() {
    screen = 'creator';
    drawerOpen = false;
    if (!draft) resetDraft();

    const stepTitles = [
      'Etapa 1 de 4 • Identidade & Arquétipo',
      'Etapa 2 de 4 • Mutação Composto V',
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
          <label for="inp-nome">Nome do Estudante *</label>
          <input id="inp-nome" class="field-input" type="text" maxlength="28" placeholder="Ex: Lucas Vance" value="${safe(draft.nome)}">
        </div>
        <div class="form-grid-2">
          <div class="field-group">
            <label for="sel-idade">Idade</label>
            <select id="sel-idade" class="field-input">
              <option value="18" ${draft.idade === 18 ? 'selected' : ''}>18 anos (Calouro)</option>
              <option value="19" ${draft.idade === 19 ? 'selected' : ''}>19 anos (2º Ano)</option>
              <option value="20" ${draft.idade === 20 ? 'selected' : ''}>20 anos (Veterano)</option>
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
        <p class="fine">Escolha sua habilidade principal. Cada poder desbloqueia opções únicas e cobra um preço físico ou social.</p>
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
      nextLabel = left === 0 ? 'CONCLUIR MATRÍCULA E JOGAR ›' : `Distribua ${left} ponto(s)`;
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
      version: '0.2.1',
      slot,
      node: DATA.meta.start,
      perfil: {
        nome: draft.nome.trim(),
        idade: draft.idade,
        pronomes: draft.pronomes,
        arquetipo: draft.arquetipo,
        poder_id: draft.poder_id,
        caracteristicas: [...draft.caracteristicas],
        ranking_campus: 48
      },
      atributos: { ...draft.atributos },
      recursos: {
        vitalidade: 100,
        vitalidade_max: 100,
        estresse: 0,
        estresse_max: 100
      },
      flags: {},
      bonds: { ...BASE_BONDS },
      history: [],
      visited: [DATA.meta.start],
      updated: Date.now()
    };
    store();
    screen = 'game';
    render();
  }

  /* ============================================================
     MOTOR DE CENAS E ESCOLHAS
  ============================================================ */
  function formatNarrative(raw) {
    const nome = save?.perfil?.nome || 'Calouro';
    const text = String(raw || '').replaceAll('{NOME}', nome);
    return text.split(/\n\s*\n|\n/g).map(s => s.trim()).filter(Boolean).map(s => {
      const m = s.match(/^([^:]{2,26}):\s*(—\s*.+)$/u);
      if (m) return `<div class="line spoken"><strong>${safe(m[1])}</strong><span>${safe(m[2])}</span></div>`;
      if (/^(PRIMEIRO DIA|FIM DO PRÓLOGO|\[COMUNICADO)/.test(s)) return `<p class="line big-emphasis">${safe(s)}</p>`;
      return `<p class="line narration">${safe(s)}</p>`;
    }).join('');
  }

  function evaluateChoice(c) {
    if (c.requirePower && save.perfil.poder_id !== c.requirePower) return { visible: false };
    if (Array.isArray(c.notPowers) && c.notPowers.includes(save.perfil.poder_id)) return { visible: false };
    if (c.requireTrait && !save.perfil.caracteristicas.includes(c.requireTrait)) return { visible: false };

    if (c.requireAttr) {
      const current = save.atributos[c.requireAttr.attr] || 1;
      if (current < c.requireAttr.min) {
        return { visible: true, enabled: false };
      }
    }
    return { visible: true, enabled: true };
  }

  function move(to, choice) {
    if (!SCENES[to]) return;
    chainFlash = null;

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
          const from = save.bonds[id] ?? 50;
          const toVal = Math.max(0, Math.min(100, from + delta));
          save.bonds[id] = toVal;
          if (toVal !== from) {
            const name = CAST.find(x => x.id === id)?.name || id;
            changes.push({ name, from, to: toVal });
          }
        }
        if (choice.effects.rank) {
          save.perfil.ranking_campus = Math.max(1, save.perfil.ranking_campus + choice.effects.rank);
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

    const podObj = PODERES.find(p => p.id === save.perfil.poder_id);
    const visibleChoices = (n.choices || [])
      .map((c, idx) => ({ c, idx, evalRes: evaluateChoice(c) }))
      .filter(x => x.evalRes.visible);

    const extraText = (n.dynamic || [])
      .filter(d => d.flag && save.flags[d.flag])
      .map(d => formatNarrative(d.text))
      .join('');

    const choicesHtml = visibleChoices.length
      ? `<div class="choices">${visibleChoices.map(({ c, idx, evalRes }, i) => {
          let badge = '';
          if (c.requirePower || c.notPowers) badge = '<span class="choice-tag power">PODER</span>';
          else if (c.requireTrait) badge = '<span class="choice-tag trait">TRAÇO</span>';
          else if (c.requireAttr) badge = '<span class="choice-tag">ATRIBUTO</span>';

          return `<button class="choice ${evalRes.enabled ? '' : 'locked'}" data-choice-idx="${idx}" ${evalRes.enabled ? '' : 'disabled'}>
            <span class="choice-num">${String(i + 1).padStart(2, '0')}</span>
            <span>${badge}${safe(c.label)}</span>
            <span class="choice-arrow">${evalRes.enabled ? '↗' : '🔒'}</span>
          </button>`;
        }).join('')}</div>`
      : `<div class="button-row"><button class="primary" data-action="end">VER RESULTADO DO PRÓLOGO <span>›</span></button></div>`;

    const pct = save.node === 'end' ? 100 : Math.min(95, Math.max(12, save.visited.length * 22));

    layout(`<main class="play-view">
      <div class="play-content">
        <div class="hud-bar">
          <div class="hud-player">
            <span>${safe(save.perfil.nome)}</span>
            <span class="hud-rank">RANK #${save.perfil.ranking_campus}</span>
            <span class="fine">(${safe(podObj ? podObj.nome.split(' ')[0] : '')})</span>
          </div>
          <div class="hud-meters">
            <span class="hud-hp">VITALIDADE: ${save.recursos.vitalidade}%</span>
            <span class="hud-stress">ESTRESSE: ${save.recursos.estresse}%</span>
          </div>
        </div>

        <div class="story-meta">
          <div>
            <div class="kicker">PRÓLOGO · ${safe(save.perfil.nome.toUpperCase())}</div>
            <h2>${safe(n.title)}</h2>
            <p>${safe(n.stage)} • ${safe(n.time)}</p>
          </div>
        </div>

        <section class="story-window">
          <div class="story-scroll">${formatNarrative(n.text)}${extraText}</div>
          ${choicesHtml}
          <div class="story-bottom">
            <span>◉ Progresso salvo no Slot ${slot}</span>
            <button data-action="journal">DIÁRIO &amp; VÍNCULOS ↗</button>
          </div>
        </section>

        <div class="progress-track"><i style="width:${pct}%"></i></div>
        <div class="progress-caption">
          <span>CAMPUS GODOLKIN · SEMESTRE DE OUTONO</span>
          <span>${save.visited.length} cenas visitadas</span>
        </div>
      </div>
    </main>`);
  }

  /* ============================================================
     TELAS SECUNDÁRIAS: FICHA, DIÁRIO, REAÇÃO EM CADEIA, ELENCO, SLOTS
  ============================================================ */
  function dossier() {
    if (!save) { menu(); return; }
    screen = 'dossier';
    drawerOpen = false;
    const arq = ARQUETIPOS.find(a => a.id === save.perfil.arquetipo);
    const pod = PODERES.find(p => p.id === save.perfil.poder_id);
    const traits = save.perfil.caracteristicas.map(id => CARACTERISTICAS.find(c => c.id === id)?.nome || id);

    layout(`<main class="panel-view">
      <div class="panel">
        <div class="kicker">ARQUIVO VOUGHT // ESTUDANTE</div>
        <h1>${safe(save.perfil.nome)} (${save.perfil.idade} anos)</h1>
        <p class="fine">Pronomes: <strong>${safe(save.perfil.pronomes)}</strong> • Ranking Atual: <strong>#${save.perfil.ranking_campus}</strong> • Arquétipo: <strong>${safe(arq?.nome || '')}</strong></p>
        <h2>Mutação Registrada</h2>
        <p><strong>${safe(pod?.nome || '')}</strong> — ${safe(pod?.desc || '')}</p>
        <h2>Atributos</h2>
        <div class="button-row">
          ${ATRIBUTOS_INFO.map(a => `<span class="vought-pill">${safe(a.nome.toUpperCase())}: ${save.atributos[a.id]}</span>`).join('')}
        </div>
        <h2>Características (8)</h2>
        <div class="button-row">
          ${traits.map(t => `<span class="opt-badge">${safe(t)}</span>`).join('')}
        </div>
        <div class="button-row">
          <button class="primary" data-action="resume">VOLTAR À HISTÓRIA</button>
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
        ${(h.changes || []).length ? `<div class="affinity-changes">${h.changes.map(c => `<span class="affinity-change ${c.to > c.from ? 'positive' : 'negative'}">${safe(c.name)} <strong>${c.from} ${c.to > c.from ? '↗' : '↘'} ${c.to}</strong></span>`).join('')}</div>` : ''}
      </li>
    `).join('');

    layout(`<main class="panel-view">
      <div class="panel">
        <div class="kicker">REGISTRO DO CAMPUS</div>
        <h1>Diário de Consequências</h1>
        <div class="dashboard">
          <section>
            <h2>Relações no Campus</h2>
            ${CAST.map(c => {
              const val = save.bonds[c.id] ?? 50;
              return `<div class="bond">
                <label>${safe(c.name)}</label>
                <div class="meter"><i style="width:${val}%"></i></div>
                <b>${val}</b>
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
          <button class="secondary" data-action="chain">VER REAÇÃO EM CADEIA</button>
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
    layout(`<main class="panel-view">
      <div class="panel">
        <div class="kicker">CORPO DISCENTE</div>
        <h1>Alunos de Godolkin</h1>
        <p class="fine">Os principais estudantes que cruzam o seu caminho durante o semestre.</p>
        <div class="cast-grid">
          ${CAST.map(c => `<div class="cast-card">
            <div class="cast-avatar">${safe(c.name[0])}</div>
            <div class="cast-info">
              <strong>${safe(c.name)}</strong>
              <small>${safe(c.role)}</small>
              <span>${safe(c.bio)}</span>
              ${save ? `<em>Afinidade atual: ${save.bonds[c.id] ?? 50}/100</em>` : ''}
            </div>
          </div>`).join('')}
        </div>
        <div class="button-row">
          <button class="primary" data-action="${save ? 'resume' : 'menu'}">${save ? 'VOLTAR À HISTÓRIA' : 'VOLTAR AO MENU'}</button>
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
              <p>${s ? `Rank #${s.perfil.ranking_campus} • ${safe(SCENES[s.node]?.title || '')}` : 'Nenhum aluno matriculado'}</p>
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
    const pactText = f.pacto_investigacao
      ? 'Você jurou ao lado de Maya e Clara investigar os desaparecimentos da Floresta.'
      : f.pacto_duplo
      ? 'Você decidiu manter as aparências no Top 10 enquanto coleta provas contra a Vought.'
      : 'Você escolheu o silêncio e a autopreservação acima das conspirações do campus.';

    layout(`<main class="end-view">
      <section class="end-card">
        <div class="kicker">FIM DO PRÓLOGO</div>
        <h1>A VERDADE SOB GODOLKIN</h1>
        <p>O primeiro dia terminou, mas o semestre está apenas começando para <strong>${safe(save.perfil.nome)}</strong>.</p>
        <div class="end-summary">
          <h2>RESUMO DO SEU DOSSIÊ</h2>
          <p>• Ranking Atual no Campus: <strong>#${save.perfil.ranking_campus}</strong></p>
          <p>• Vitalidade: <strong>${save.recursos.vitalidade}%</strong> | Estresse de Poder: <strong>${save.recursos.estresse}%</strong></p>
          <p>• Postura no Pacto: ${safe(pactText)}</p>
        </div>
        <div class="torn-quote-box"><p>“Eles nos criaram para serem heróis na TV. Ninguém perguntou o que acontece quando desligam as câmeras.”</p><span class="torn-quote-watermark">V7</span></div>
        <div class="button-row">
          <button class="primary" data-action="export">EXPORTAR SAVE DO PRÓLOGO</button>
          <button class="secondary" data-action="journal">VER DIÁRIO</button>
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
    else if (screen === 'dossier') dossier();
    else if (screen === 'journal') journal();
    else if (screen === 'chain') chainView();
    else if (screen === 'cast') castView();
    else if (screen === 'slots') slotsView();
    else if (screen === 'ending') ending();
    else menu();
  }

  /* EVENTOS GLOBAIS */
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
    const toast = e.target.closest('#bf-toast');
    if (toast) {
      chainFlash = null;
      if (chainTimer) clearTimeout(chainTimer);
      toast.remove();
      return;
    }
    const btn = e.target.closest('button');
    if (!btn) return;

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
      case 'drawer': drawerOpen = !drawerOpen; render(); break;
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
