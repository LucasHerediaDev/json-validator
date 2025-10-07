// Utilidades de validação
function isUUID(str) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}
function isCPF(str) {
  // Validação de CPF com dígitos verificadores
  if (!/^\d{11}$/.test(str)) return false;
  const allEqual = /^(\d)\1{10}$/.test(str);
  if (allEqual) return false;
  const nums = str.split('').map((n) => parseInt(n, 10));
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += nums[i] * (10 - i);
  let d1 = (sum * 10) % 11;
  if (d1 === 10) d1 = 0;
  if (d1 !== nums[9]) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += nums[i] * (11 - i);
  let d2 = (sum * 10) % 11;
  if (d2 === 10) d2 = 0;
  return d2 === nums[10];
}
function isCNPJ(cnpj) {
  cnpj = cnpj.replace(/[^\d]+/g, '');
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado !== Number(digitos.charAt(0))) return false;
  tamanho += 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  return resultado === Number(digitos.charAt(1));
}
// MCCs permitidos (códigos de 4 dígitos)
const ALLOWED_MCCS = new Set([
  '0742','0763','0780','1520','1711','1731','1740','1750','1761','1771','1799','2741','2791','2842','4111','4119','4121','4214','4225','4457','4511','4582','4722','4784','4789','4812','4814','4816','4821','4829','4899','4900','5013','5021','5039','5044','5045','5046','5047','5051','5065','5072','5074','5085','5094','5099','5111','5122','5131','5137','5139','5169','5172','5192','5193','5198','5199','5211','5231','5251','5261','5300','5309','5311','5331','5399','5411','5422','5441','5451','5462','5499','5511','5521','5531','5532','5533','5541','5542','5551','5571','5592','5598','5611','5621','5631','5641','5651','5655','5661','5681','5691','5697','5698','5699','5712','5713','5714','5718','5719','5722','5732','5733','5734','5735','5811','5812','5813','5814','5912','5921','5931','5932','5935','5937','5940','5941','5942','5943','5944','5945','5946','5947','5948','5949','5950','5960','5961','5962','5963','5964','5965','5966','5967','5968','5969','5970','5971','5972','5973','5975','5976','5977','5978','5983','5992','5993','5994','5995','5996','5997','5998','5999','6010','6011','6012','6051','6211','6300','7311','7321','7333','7338','7342','7349','7361','7372','7379','7392','7393','7394','7395','7911','7922','7929','7932','7933','7941','7991','7994','7995','7996','7997','7998','7999','8011','8021','8031','8043','8049','8050','8062','8071','8099','8111','8211','8220','8244','8249','8299','8351','8398','8641','8651','8661','8675','8699','8734','8911','8931','8999','9211','9222','9223','9311','9399','9402','9405','9700','9950'
]);
function isCodigoCategoria(str) {
  const value = String(str).trim();
  return /^\d{4}$/.test(value) && ALLOWED_MCCS.has(value);
}

function validarBody(body) {
  const erros = [];
  const validos = [];
  
  // Campos permitidos pela documentação (extras não devem ser enviados)
  const allowedKeys = [
    'chaveIdempotencia',
    'chavePix',
    'codigoCategoria',
    'recebedorNome',
    'devedorDocumento',
    'devedorNome',
    'cidade',
    'valorOriginal',
    'modalidadeAlteracao',
    'expiracaoEmSegundos',
    'reutilizavel',
    'tid',
    // opcionais
    'solicitacaoPagador',
    'cep',
    'dadosAdicionais'
  ];
  Object.keys(body || {}).forEach((key) => {
    if (!allowedKeys.includes(key)) {
      erros.push(`❌ Campo "${key}" não é permitido pela documentação.`);
    }
  });

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

  // Regra: chaveIdempotencia deve ser diferente de chavePix
  if (typeof body.chaveIdempotencia === 'string' && typeof body.chavePix === 'string') {
    if (body.chaveIdempotencia.toLowerCase() === body.chavePix.toLowerCase()) {
      erros.push('❌ "chaveIdempotencia" deve ser diferente de "chavePix".');
    }
  }

  // codigoCategoria (MCC - 4 dígitos, deve estar na lista permitida)
  if (body.codigoCategoria === undefined || body.codigoCategoria === null || body.codigoCategoria === '') {
    erros.push('❌ Campo "codigoCategoria" é obrigatório.');
  } else {
    const mcc = String(body.codigoCategoria).trim();
    if (!/^\d{4}$/.test(mcc)) {
      erros.push('❌ Campo "codigoCategoria" deve conter 4 dígitos (MCC).');
    } else if (!isCodigoCategoria(mcc)) {
      erros.push('❌ Campo "codigoCategoria" deve ser um MCC válido.');
    } else {
      validos.push(`✅ Campo "codigoCategoria" (MCC ${mcc}) permitido.`);
    }
  }

  // recebedorNome
  if (!body.recebedorNome) {
    erros.push('❌ Campo "recebedorNome" é obrigatório.');
  } else if (typeof body.recebedorNome !== 'string' || body.recebedorNome.trim().length < 2) {
    erros.push('❌ Campo "recebedorNome" deve ter no mínimo 2 caracteres.');
  } else {
    const nome = body.recebedorNome.trim();
    if (nome.length > 25) {
      erros.push('❌ Campo "recebedorNome" não pode exceder 25 caracteres.');
    } else {
      validos.push('✅ Campo "recebedorNome" válido.');
    }
  }

  // solicitacaoPagador (opcional - valida somente se existir, aceita null)
  if (Object.prototype.hasOwnProperty.call(body, 'solicitacaoPagador')) {
    if (body.solicitacaoPagador === null) {
      validos.push('✅ Campo "solicitacaoPagador" presente como null (aceito).');
    } else {
      // Não aplicar validações rígidas; apenas verificar tipo básico se informado
      if (typeof body.solicitacaoPagador === 'string') {
        validos.push('✅ Campo "solicitacaoPagador" válido.');
      } else {
        // Não falhar de forma rígida: mensagem mais branda
        erros.push('❌ Campo "solicitacaoPagador" deve ser string ou null quando enviado.');
      }
    }
  }

  // devedorDocumento (CPF ou CNPJ válido)
  if (!body.devedorDocumento) {
    erros.push('❌ Campo "devedorDocumento" é obrigatório.');
  } else if (typeof body.devedorDocumento !== 'string') {
    erros.push('❌ Campo "devedorDocumento" deve ser string.');
  } else {
    // Normaliza para apenas dígitos para aceitar entradas com pontuação
    const doc = String(body.devedorDocumento).replace(/\D+/g, '');
    if (!/^\d{11}$/.test(doc) && !/^\d{14}$/.test(doc)) {
      erros.push('❌ Campo "devedorDocumento" deve conter 11 dígitos (CPF) ou 14 dígitos (CNPJ).');
    } else if (/^\d{11}$/.test(doc)) {
      if (!isCPF(doc)) {
        erros.push('❌ Campo "devedorDocumento" deve ser um CPF válido.');
      } else {
        validos.push('✅ Campo "devedorDocumento" (CPF) válido.');
      }
    } else if (/^\d{14}$/.test(doc)) {
      if (!isCNPJ(doc)) {
        erros.push('❌ Campo "devedorDocumento" deve ser um CNPJ válido.');
      } else {
        validos.push('✅ Campo "devedorDocumento" (CNPJ) válido.');
      }
    }
  }

  // devedorNome
  if (!body.devedorNome) {
    erros.push('❌ Campo "devedorNome" é obrigatório.');
  } else if (typeof body.devedorNome !== 'string' || body.devedorNome.trim().length < 2) {
    erros.push('❌ Campo "devedorNome" deve ter no mínimo 2 caracteres.');
  } else {
    validos.push('✅ Campo "devedorNome" válido.');
  }

  // cidade
  if (!body.cidade) {
    erros.push('❌ Campo "cidade" é obrigatório.');
  } else if (typeof body.cidade !== 'string' || body.cidade.trim().length < 2) {
    erros.push('❌ Campo "cidade" deve ter no mínimo 2 caracteres.');
  } else {
    const cidadeVal = body.cidade.trim();
    if (/\s/.test(cidadeVal)) {
      erros.push('❌ Campo "cidade" não deve conter espaços.');
    } else {
      validos.push('✅ Campo "cidade" válido.');
      if (cidadeVal.length > 20) {
        validos.push('⚠️ Campo "cidade" excede 20 caracteres (recomendação).');
      }
    }
  }

  // cep (opcional - valida somente se existir, aceita null; sem validações rígidas)
  if (Object.prototype.hasOwnProperty.call(body, 'cep')) {
    if (body.cep === null) {
      validos.push('✅ Campo "cep" presente como null (aceito).');
    } else {
      validos.push('✅ Campo "cep" informado (validação flexível conforme documentação).');
    }
  }

  // valorOriginal
  if (body.valorOriginal === undefined) {
    erros.push('❌ Campo "valorOriginal" é obrigatório.');
  } else if (typeof body.valorOriginal !== 'number' || Number.isNaN(body.valorOriginal)) {
    erros.push('❌ Campo "valorOriginal" deve ser numérico (sem aspas).');
  } else {
    validos.push('✅ Campo "valorOriginal" válido.');
  }

  // modalidadeAlteracao (inteiro 0 ou 1)
  if (body.modalidadeAlteracao === undefined) {
    erros.push('❌ Campo "modalidadeAlteracao" é obrigatório.');
  } else if (typeof body.modalidadeAlteracao !== 'number' || !Number.isInteger(body.modalidadeAlteracao) || ![0,1].includes(body.modalidadeAlteracao)) {
    erros.push('❌ Campo "modalidadeAlteracao" deve ser inteiro (0 ou 1).');
  } else {
    validos.push('✅ Campo "modalidadeAlteracao" válido.');
  }

  // expiracaoEmSegundos (inteiro entre 60 e 86400)
  if (body.expiracaoEmSegundos === undefined) {
    erros.push('❌ Campo "expiracaoEmSegundos" é obrigatório.');
  } else if (typeof body.expiracaoEmSegundos !== 'number' || !Number.isInteger(body.expiracaoEmSegundos) || body.expiracaoEmSegundos < 60 || body.expiracaoEmSegundos > 86400) {
    erros.push('❌ Campo "expiracaoEmSegundos" deve ser um inteiro entre 60 e 86400.');
  } else {
    validos.push('✅ Campo "expiracaoEmSegundos" válido.');
  }

  // dadosAdicionais (opcional - valida somente se existir, aceita null)
  if (Object.prototype.hasOwnProperty.call(body, 'dadosAdicionais')) {
    if (body.dadosAdicionais === null) {
      validos.push('✅ Campo "dadosAdicionais" presente como null (aceito).');
    } else if (!Array.isArray(body.dadosAdicionais)) {
      erros.push('❌ Campo "dadosAdicionais" deve ser um array ou null quando enviado.');
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

  // tid (string, mínimo 6 caracteres conforme exemplo oficial)
  if (!body.tid) {
    erros.push('❌ Campo "tid" é obrigatório.');
  } else if (typeof body.tid !== 'string' || body.tid.length < 6) {
    erros.push('❌ Campo "tid" deve ter no mínimo 6 caracteres.');
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
  // Padronizar: sem emoji no texto, apenas ícone à esquerda
  let title = type === 'error' ? 'Erro' : 'Sucesso';
  let message = text.replace(/^([✔️❌✅⚠️]+)\s*/, '');
  return Object.assign(document.createElement('div'), {
    className: type === 'error' ? 'result-error' : 'result-success',
    innerHTML: `
      <span class="log-icon" aria-hidden="true">${type === 'error' ? '✖' : '✔'}</span>
      <span class="log-content">
        <span class="log-title">${title}</span>
        <span class="log-message">${message}</span>
      </span>
    `
  });
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
  syncHighlight(); // Garante que o destaque do JSON também seja limpo
});
