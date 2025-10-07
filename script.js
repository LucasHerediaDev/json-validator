// Utilidades de validação
function isUUID(str) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}
function isCPF(str) {
  return /^\d{11}$/.test(str);
}
function isCodigoCategoria(str) {
  return /^\d{4}$/.test(str);
}

function validarBody(body) {
  const erros = [];
  const validos = [];

  // chaveIdempotencia
  if (!body.chaveIdempotencia) {
    erros.push('❌ Campo "chaveIdempotencia" é obrigatório.');
  } else if (typeof body.chaveIdempotencia !== 'string' || !isUUID(body.chaveIdempotencia)) {
    erros.push('❌ Campo "chaveIdempotencia" deve ser um UUID válido.');
  } else {
    validos.push('✅ Campo "chaveIdempotencia" válido.');
  }

  // chavePix
  if (!body.chavePix) {
    erros.push('❌ Campo "chavePix" é obrigatório.');
  } else if (typeof body.chavePix !== 'string' || !isUUID(body.chavePix)) {
    erros.push('❌ Campo "chavePix" deve ser um UUID válido.');
  } else {
    validos.push('✅ Campo "chavePix" válido.');
  }

  // codigoCategoria
  if (!body.codigoCategoria) {
    erros.push('❌ Campo "codigoCategoria" é obrigatório.');
  } else if (typeof body.codigoCategoria !== 'string' || !isCodigoCategoria(body.codigoCategoria)) {
    erros.push('❌ Campo "codigoCategoria" deve conter 4 dígitos.');
  } else {
    validos.push('✅ Campo "codigoCategoria" válido.');
  }

  // recebedorNome
  if (!body.recebedorNome) {
    erros.push('❌ Campo "recebedorNome" é obrigatório.');
  } else if (typeof body.recebedorNome !== 'string' || body.recebedorNome.trim().length < 3) {
    erros.push('❌ Campo "recebedorNome" deve ter no mínimo 3 caracteres.');
  } else {
    validos.push('✅ Campo "recebedorNome" válido.');
  }

  // solicitacaoPagador
  if (body.solicitacaoPagador === undefined) {
    erros.push('❌ Campo "solicitacaoPagador" é obrigatório.');
  } else if (typeof body.solicitacaoPagador !== 'string' || body.solicitacaoPagador.trim().length === 0) {
    erros.push('❌ Campo "solicitacaoPagador" não pode ser vazio.');
  } else {
    validos.push('✅ Campo "solicitacaoPagador" válido.');
  }

  // devedorDocumento
  if (!body.devedorDocumento) {
    erros.push('❌ Campo "devedorDocumento" é obrigatório.');
  } else if (typeof body.devedorDocumento !== 'string' || !isCPF(body.devedorDocumento)) {
    erros.push('❌ Campo "devedorDocumento" deve ter 11 dígitos (CPF).');
  } else {
    validos.push('✅ Campo "devedorDocumento" válido.');
  }

  // devedorNome
  if (!body.devedorNome) {
    erros.push('❌ Campo "devedorNome" é obrigatório.');
  } else if (typeof body.devedorNome !== 'string' || body.devedorNome.trim().length < 3) {
    erros.push('❌ Campo "devedorNome" deve ter no mínimo 3 caracteres.');
  } else {
    validos.push('✅ Campo "devedorNome" válido.');
  }

  // cidade
  if (!body.cidade) {
    erros.push('❌ Campo "cidade" é obrigatório.');
  } else if (typeof body.cidade !== 'string' || body.cidade.trim().length === 0) {
    erros.push('❌ Campo "cidade" não pode ser vazio.');
  } else {
    validos.push('✅ Campo "cidade" válido.');
  }

  // cep (opcional)
  if (body.cep !== undefined && body.cep !== null) {
    if (typeof body.cep !== 'string') {
      erros.push('❌ Campo "cep" deve ser string ou null.');
    } else {
      validos.push('✅ Campo "cep" válido.');
    }
  }

  // valorOriginal
  if (body.valorOriginal === undefined) {
    erros.push('❌ Campo "valorOriginal" é obrigatório.');
  } else if (typeof body.valorOriginal !== 'number' || !(body.valorOriginal > 0)) {
    erros.push('❌ Campo "valorOriginal" deve ser um número maior que 0.');
  } else {
    validos.push('✅ Campo "valorOriginal" válido.');
  }

  // modalidadeAlteracao
  if (body.modalidadeAlteracao === undefined) {
    erros.push('❌ Campo "modalidadeAlteracao" é obrigatório.');
  } else if (typeof body.modalidadeAlteracao !== 'number' || ![0,1].includes(body.modalidadeAlteracao)) {
    erros.push('❌ Campo "modalidadeAlteracao" deve ser 0 ou 1.');
  } else {
    validos.push('✅ Campo "modalidadeAlteracao" válido.');
  }

  // expiracaoEmSegundos
  if (body.expiracaoEmSegundos === undefined) {
    erros.push('❌ Campo "expiracaoEmSegundos" é obrigatório.');
  } else if (typeof body.expiracaoEmSegundos !== 'number' || body.expiracaoEmSegundos < 60 || body.expiracaoEmSegundos > 86400) {
    erros.push('❌ Campo "expiracaoEmSegundos" deve ser um número entre 60 e 86400.');
  } else {
    validos.push('✅ Campo "expiracaoEmSegundos" válido.');
  }

  // dadosAdicionais (opcional)
  if (body.dadosAdicionais !== undefined && body.dadosAdicionais !== null) {
    if (!Array.isArray(body.dadosAdicionais)) {
      erros.push('❌ Campo "dadosAdicionais" deve ser um array ou null.');
    } else {
      validos.push('✅ Campo "dadosAdicionais" válido.');
    }
  }

  // reutilizavel
  if (body.reutilizavel === undefined) {
    erros.push('❌ Campo "reutilizavel" é obrigatório.');
  } else if (typeof body.reutilizavel !== 'boolean') {
    erros.push('❌ Campo "reutilizavel" deve ser booleano.');
  } else {
    validos.push('✅ Campo "reutilizavel" válido.');
  }

  // tid
  if (!body.tid) {
    erros.push('❌ Campo "tid" é obrigatório.');
  } else if (typeof body.tid !== 'string' || body.tid.length < 10) {
    erros.push('❌ Campo "tid" deve ter no mínimo 10 caracteres.');
  } else {
    validos.push('✅ Campo "tid" válido.');
  }

  return { erros, validos };
}

// DOM
const input = document.getElementById('json-input');
const validateBtn = document.getElementById('validate-btn');
const formatBtn = document.getElementById('format-btn');
const clearBtn = document.getElementById('clear-btn');
const highlightLayer = document.getElementById('json-highlight');
const resultDiv = document.getElementById('result');

// Novos painéis
const resultErrors = document.getElementById('result-errors');
const resultValid = document.getElementById('result-valid');
const countErros = document.getElementById('count-erros');
const countValidos = document.getElementById('count-validos');

function renderLine(type, text) {
  const div = document.createElement('div');
  div.className = type === 'error' ? 'result-error' : 'result-success';
  div.textContent = text;
  return div;
}

function exibirResultado({ erros, validos }) {
  // compat: limpar bloco antigo se ainda existir
  if (resultDiv) resultDiv.innerHTML = '';
  resultErrors.innerHTML = '';
  resultValid.innerHTML = '';

  erros.forEach(erro => resultErrors.appendChild(renderLine('error', erro)));
  validos.forEach(ok => resultValid.appendChild(renderLine('success', ok)));

  countErros.textContent = String(erros.length);
  countValidos.textContent = String(validos.length);
}

const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
if (sidebar && sidebarToggle) {
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
}

// Toggle de tema com persistência
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;
function applyTheme(theme) {
  if (theme === 'light') {
    root.setAttribute('data-theme', 'light');
    if (themeToggle) themeToggle.textContent = '🌞';
  } else {
    root.removeAttribute('data-theme');
    if (themeToggle) themeToggle.textContent = '🌙';
  }
  localStorage.setItem('mc-theme', theme);
}
(function initTheme() {
  const saved = localStorage.getItem('mc-theme');
  if (saved === 'light' || saved === 'dark') {
    applyTheme(saved);
  } else {
    applyTheme('dark');
  }
})();
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    applyTheme(current === 'light' ? 'dark' : 'light');
  });
}

// Copiar JSON
const copyBtn = document.getElementById('copy-json');
if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(input.value || '');
      copyBtn.textContent = 'Copiado!';
      setTimeout(() => (copyBtn.textContent = 'Copiar'), 1200);
    } catch (e) {
      copyBtn.textContent = 'Falhou';
      setTimeout(() => (copyBtn.textContent = 'Copiar'), 1200);
    }
  });
}

// Highlight simples de JSON (sem dependências)
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function highlightJSON(text) {
  // Mantém vírgulas, chaves e colchetes com classe de pontuação
  let html = escapeHtml(text)
    .replace(/[{}\[\],:]/g, (m) => `<span class="tok-punct">${m}</span>`);

  // Strings com aspas
  html = html.replace(/"([^"\\]|\\.)*"(?=\s*:)/g, (m) => `<span class="tok-key">${m}</span>`); // chaves
  html = html.replace(/(:\s*)"([^"\\]|\\.)*"/g, (m) => m.replace(/"([^"\\]|\\.)*"/, (s) => `<span class="tok-string">${s}</span>`)); // valores string

  // Números
  html = html.replace(/(-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b)/gi, '<span class="tok-number">$1</span>');
  // Booleanos
  html = html.replace(/\b(true|false)\b/g, '<span class="tok-bool">$1</span>');
  // null
  html = html.replace(/\bnull\b/g, '<span class="tok-null">null</span>');
  return html;
}

function syncHighlight() {
  if (!highlightLayer) return;
  const content = input.value || '';
  // Garante quebra de linha final para evitar salto de scroll
  highlightLayer.innerHTML = content ? highlightJSON(content + (content.endsWith('\n') ? '' : '\n')) : '';
}

if (input && highlightLayer) {
  input.addEventListener('input', syncHighlight);
  input.addEventListener('scroll', () => {
    highlightLayer.scrollTop = input.scrollTop;
    highlightLayer.scrollLeft = input.scrollLeft;
  });
  // Formatação ao perder foco
  input.addEventListener('blur', () => {
    try {
      if (!input.value.trim()) return;
      const obj = JSON.parse(input.value);
      input.value = JSON.stringify(obj, null, 2);
      syncHighlight();
    } catch (_) {}
  });
  // Formatação ao colar
  input.addEventListener('paste', (e) => {
    try {
      const text = e.clipboardData && e.clipboardData.getData('text/plain');
      if (!text) return;
      const obj = JSON.parse(text);
      const formatted = JSON.stringify(obj, null, 2);
      e.preventDefault();
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const before = input.value.substring(0, start);
      const after = input.value.substring(end);
      input.value = before + formatted + after;
      // reposiciona o cursor ao fim do trecho colado
      const pos = before.length + formatted.length;
      input.selectionStart = input.selectionEnd = pos;
      syncHighlight();
    } catch (_) {
      // se não for JSON válido, deixa o paste normal
    }
  });
  // Inicializa
  syncHighlight();
}

// Função de formatação com feedback
function formatJsonInTextarea() {
  if (!input) return;
  try {
    if (!input.value.trim()) return;
    const parsed = JSON.parse(input.value);
    input.value = JSON.stringify(parsed, null, 2);
    // limpa mensagens anteriores e conta como sucesso visual
    if (resultErrors) resultErrors.innerHTML = '';
    if (resultValid) {
      resultValid.innerHTML = '';
      resultValid.appendChild(renderLine('success', '✅ JSON formatado com sucesso.'));
    }
    if (countErros) countErros.textContent = '0';
    if (countValidos) countValidos.textContent = '1';
    syncHighlight();
  } catch (e) {
    if (resultValid) resultValid.innerHTML = '';
    if (resultErrors) {
      resultErrors.innerHTML = '';
      resultErrors.appendChild(renderLine('error', '❌ JSON inválido. Corrija a sintaxe e tente novamente.'));
    }
    if (countErros) countErros.textContent = '1';
    if (countValidos) countValidos.textContent = '0';
  }
}

// Botão Formatar
if (formatBtn) {
  formatBtn.addEventListener('click', formatJsonInTextarea);
}

// Atalho: Ctrl+Shift+F para formatar (e Cmd+Shift+F no macOS)
document.addEventListener('keydown', (e) => {
  const isCtrlOrCmd = e.ctrlKey || e.metaKey;
  if (isCtrlOrCmd && e.shiftKey && (e.key === 'F' || e.key === 'f')) {
    e.preventDefault();
    formatJsonInTextarea();
  }
});

validateBtn.addEventListener('click', () => {
  // zera contadores e painéis
  resultErrors.innerHTML = '';
  resultValid.innerHTML = '';
  countErros.textContent = '0';
  countValidos.textContent = '0';

  let json;
  try {
    json = JSON.parse(input.value);
    // formata após parse bem sucedido
    input.value = JSON.stringify(json, null, 2);
    syncHighlight();
  } catch (e) {
    resultErrors.appendChild(renderLine('error', '❌ JSON inválido.'));
    countErros.textContent = '1';
    return;
  }
  const body = json.body ? json.body : json;
  const resultado = validarBody(body);
  exibirResultado(resultado);
});

clearBtn.addEventListener('click', () => {
  input.value = '';
  if (resultDiv) resultDiv.innerHTML = '';
  resultErrors.innerHTML = '';
  resultValid.innerHTML = '';
  countErros.textContent = '0';
  countValidos.textContent = '0';
});
