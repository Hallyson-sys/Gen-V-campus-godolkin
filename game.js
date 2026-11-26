/* Gen V: Campus Godolkin — Motor Jogável V0.4.0
 * Inclui: Primeiro nome nos diálogos, Ato I (Infância & Adolescência) expandido em 2 partes por poder,
 * 5 Poderes Exclusivos, Calouro (1º Ano), Escolhas Bloqueadas sem Spoiler,
 * Ficha Interativa dos 6 Alunos de Godolkin com Barras de Afinidade Cruzadas e Reação em Cadeia.
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
      id: 'holofotes',
      title: 'Olhos da Vought',
      teaser: 'A atenção da mídia abre portas, mas elimina sua privacidade no campus.',
      steps: [
        { when: f => f.aproximou_elite || f.alianca_vip_inicial, description: 'Você chamou a atenção de Matteo e Zoe logo na chegada ao pátio.' },
        { when: f => f.controle_impecavel || f.usou_poder_arena, description: 'Sua performance na Arena consolidou sua reputação perante os patrocinadores.' }
      ]
    },
    {
      id: 'arena_marca',
      title: 'O Teste de Fogo',
      teaser: 'Quem você protege — ou deixa para trás — define quem confia em você.',
      steps: [
        { when: f => f.salvou_clara || f.hesitou_arena, description: 'Sua reação diante do drone na Arena marcou seu primeiro dia entre os calouros.' },
        { when: f => f.escondeu_poder || f.usou_poder_arena, description: 'O modo como você lidou com seus poderes já entrou nos relatórios do Prof. Brinker.' }
      ]
    },
    {
      id: 'pacto_godolkin',
      title: 'Sinais da Floresta',
      teaser: 'Na Torre Norte, você descobriu o que acontece com alunos apagados do Ranking.',
      steps: [
        { when: f => f.viu_cameras_internas || f.viu_elevador_subsolo || f.mapeou_drones, description: 'Você notou movimentações suspeitas da segurança interna logo nas primeiras horas.' },
        { when: f => f.pacto_investigacao || f.pacto_duplo || f.pacto_silencio, description: 'Sua decisão na varanda da Torre Norte definiu suas alianças para o Capítulo 1.' }
      ]
    }
  ];

  let slot = 1;
  let save = null;
  let screen = 'menu';
  let drawerOpen = false;
  let castSelected = CAST[0]?.id || 'matteo';
  let chainSelected = null;
  let chainFlash = null;
  let chainTimer = null;

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

  function getAttrLabel(attrId) {
    return ATRIBUTOS_INFO.find(a => a.id === attrId)?.nome || attrId;
  }

  function getTraitLabel(traitId) {
    return CARACTERISTICAS.find(c => c.id === traitId)?.nome || traitId;
  }

  function getRelationshipStatus(val) {
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
        <span class="header-status">PRÓLOGO · V0.4.0</span>
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

  function menu() {
    screen = 'menu';
    drawerOpen = false;
    chainFlash = null;
    const hasSave = !!enter();
    const firstName = hasSave ? getFirstName(save.perfil.nome) : '';
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
        <p class="menu-lead">Crie seu estudante, reviva o despertar dos seus poderes na infância e enfrente seu primeiro ano em Godolkin.</p>
        <div class="torn-quote-box">
          <p>“No Campus Godolkin, ser o número um salva sua vida — ou coloca um alvo nas suas costas.”</p>
          <span class="torn-quote-watermark">V7</span>
        </div>
        <div class="menu-stack-buttons">
          ${hasSave ? `<button class="primary" data-action="resume">CONTINUAR COMO ${safe(firstName.toUpperCase())} <span>›</span></button>` : ''}
          <button class="${hasSave ? 'secondary' : 'primary'}" data-action="new">${hasSave ? 'NOVO ALUNO (RECOMEÇAR)' : 'CRIAR ALUNO E INICIAR'} <span>›</span></button>
          <button class="secondary" data-action="slots">PARTIDAS E SLOTS</button>
          <button class="secondary" data-action="cast">ALUNOS DE GODOLKIN</button>
          <button class="secondary" data-action="chain">REAÇÃO EM CADEIA</button>
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
      version: '0.4.0',
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

    const firstName = getFirstName(save.perfil.nome);
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
          if (!evalRes.enabled) {
            return `<button class="choice locked-spoiler-free" disabled>
              <span class="choice-num">${String(i + 1).padStart(2, '0')}</span>
              <span class="locked-req-label">[${safe(evalRes.lockText)}]</span>
              <span class="choice-arrow">🔒</span>
            </button>`;
          }

          let badge = '';
          if (c.requirePower) badge = '<span class="choice-tag power">PODER</span>';
          else if (c.requireTrait) badge = '<span class="choice-tag trait">CARACTERÍSTICA</span>';
          else if (c.requireAttr) badge = '<span class="choice-tag">ATRIBUTO</span>';

          return `<button class="choice" data-choice-idx="${idx}">
            <span class="choice-num">${String(i + 1).padStart(2, '0')}</span>
            <span>${badge}${safe(c.label)}</span>
            <span class="choice-arrow">↗</span>
          </button>`;
        }).join('')}</div>`
      : `<div class="button-row"><button class="primary" data-action="end">VER RESULTADO DO PRÓLOGO <span>›</span></button></div>`;

    const pct = save.node === 'end' ? 100 : Math.min(95, Math.max(10, save.visited.length * 14));

    layout(`<main class="play-view">
      <div class="play-content">
        <div class="hud-bar">
          <div class="hud-player">
            <span>${safe(firstName)}</span>
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
            <div class="kicker">PRÓLOGO · ${safe(firstName.toUpperCase())}</div>
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
          <span>CAMPUS GODOLKIN · CALOURO (1º ANO)</span>
          <span>${save.visited.length} cenas visitadas</span>
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
        <p class="fine">Ano Letivo: <strong>1º Ano (Calouro)</strong> • Pronomes: <strong>${safe(save.perfil.pronomes)}</strong> • Ranking Atual: <strong>#${save.perfil.ranking_campus}</strong> • Arquétipo: <strong>${safe(arq?.nome || '')}</strong></p>
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
            <h2>Intimidade &amp; Relações no Campus</h2>
            ${CAST.map(c => {
              const val = save.bonds[c.id] ?? BASE_BONDS[c.id] ?? 28;
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
    const relStatus = getRelationshipStatus(playerBond);
    const playerFirstName = save ? getFirstName(save.perfil.nome) : 'Você (Calouro)';

    layout(`<main class="panel-view">
      <div class="panel">
        <div class="kicker">CORPO DISCENTE // TOQUE EM UM ALUNO PARA INSPECIONAR</div>
        <h1>Alunos de Godolkin</h1>
        <p class="fine">Selecione o card de cada estudante para ver sua personalidade, poderes, o nível de intimidade com <strong>${safe(playerFirstName)}</strong> e as barras de afinidade com os outros alunos.</p>

        <div class="cast-grid">
          ${CAST.map(c => {
            const isSel = c.id === sel.id;
            const bVal = save ? (save.bonds[c.id] ?? BASE_BONDS[c.id] ?? 28) : (BASE_BONDS[c.id] ?? 28);
            return `<button type="button" class="cast-card-btn ${isSel ? 'selected' : ''}" data-pick-cast="${c.id}">
              <div class="cast-avatar">${safe(c.name[0])}</div>
              <div class="cast-info">
                <strong>${safe(c.name)}</strong>
                <small>${safe(c.role)}</small>
                <span>${safe(c.age)} • ${safe(c.archetype)}</span>
                <em>Intimidade com ${safe(playerFirstName)}: ${bVal}/100</em>
              </div>
            </button>`;
          }).join('')}
        </div>

        <section class="cast-dossier" aria-live="polite">
          <div class="cast-dossier-header">
            <div>
              <div class="kicker">DOSSIÊ INDIVIDUAL · ${safe(sel.age.toUpperCase())}</div>
              <h2 style="font-family:'Anton',sans-serif;font-size:28px;color:#fff;margin:4px 0;">${safe(sel.name)} — ${safe(sel.role)}</h2>
              <span class="opt-badge">${safe(sel.archetype)}</span>
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
              <p>${s ? `Calouro • Rank #${s.perfil.ranking_campus} • ${safe(SCENES[s.node]?.title || '')}` : 'Nenhum aluno matriculado'}</p>
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
      ? 'Você jurou ao lado de Maya, Luka e Clara investigar os desaparecimentos da Floresta.'
      : f.pacto_duplo
      ? 'Você decidiu manter as aparências perto de Matteo e Zoe enquanto coleta provas contra a Vought.'
      : 'Você escolheu o silêncio e a autopreservação acima das conspirações do campus.';

    layout(`<main class="end-view">
      <section class="end-card">
        <div class="kicker">FIM DO PRÓLOGO</div>
        <h1>A VERDADE SOB GODOLKIN</h1>
        <p>Da infância até o primeiro toque de recolher como calouro, a jornada de <strong>${safe(firstName)}</strong> (${safe(save.perfil.nome)}) está apenas começando.</p>
        <div class="end-summary">
          <h2>RESUMO DO SEU DOSSIÊ</h2>
          <p>• Aluno Matriculado: <strong>${safe(save.perfil.nome)}</strong></p>
          <p>• Situação Acadêmica: <strong>Calouro (1º Ano) · ${save.perfil.idade} anos</strong></p>
          <p>• Ranking Atual no Campus: <strong>#${save.perfil.ranking_campus}</strong></p>
          <p>• Vitalidade: <strong>${save.recursos.vitalidade}%</strong> | Estresse de Poder: <strong>${save.recursos.estresse}%</strong></p>
          <p>• Postura no Pacto: ${safe(pactText)}</p>
        </div>
        <div class="torn-quote-box"><p>“Eles nos criaram para serem heróis na TV. Ninguém perguntou o que acontece quando desligam as câmeras.”</p><span class="torn-quote-watermark">V7</span></div>
        <div class="button-row">
          <button class="primary" data-action="export">EXPORTAR SAVE DO PRÓLOGO</button>
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
