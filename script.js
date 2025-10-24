// Utilidades de validação
function isUUID(str) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}
function hasDiacritics(str) {
  // Detecta acentos/diacríticos em Unicode combinando após NFD
  // Ex.: "José" → 'Jose' + diacríticos; a regex pega os diacríticos
  return /[\u0300-\u036f]/.test(str.normalize('NFD'));
}
function getDecimalPlaces(n) {
  const s = String(n);
  if (/e/i.test(s)) {
    // Converte para decimal fixo e remove zeros à direita
    const fixed = Number(n).toFixed(20);
    const frac = (fixed.split('.')[1] || '').replace(/0+$/, '');
    return frac.length;
  }
  return (s.split('.')[1] || '').length;
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
  const usedIdempotencyKeys = new Set(); // Para simular a unicidade por sessão

    // Definição dos campos obrigatórios e opcionais
    const requiredKeys = [
      'chaveIdempotencia', 'chavePix', 'codigoCategoria', 'recebedorNome',
      'devedorDocumento', 'devedorNome', 'cidade', 'valorOriginal',
      'modalidadeAlteracao', 'expiracaoEmSegundos', 'reutilizavel', 'tid'
    ];
  
    const optionalKeys = ['solicitacaoPagador', 'cep', 'dadosAdicionais'];
    const allowedKeys = [...requiredKeys, ...optionalKeys];
    const bodyKeys = new Set(Object.keys(body || {}));
  
    // 1. Valida se todos os campos obrigatórios estão presentes
    for (const key of requiredKeys) {
      if (!bodyKeys.has(key)) {
        erros.push(window.i18n.t('error_field_required', { key }));
      }
    }
  
    // 2. Valida se não há campos não permitidos
    for (const key of bodyKeys) {
      if (!allowedKeys.includes(key)) {
        erros.push(window.i18n.t('error_field_not_allowed', { key }));
      }
    }
  
    // Se houver erros estruturais, podemos parar aqui para evitar mais erros
    if (erros.length > 0) {
      return { erros, validos };
    }
  

  // chaveIdempotencia
  if (!body.chaveIdempotencia) {
    erros.push(window.i18n.t('error_chaveIdempotencia_required'));
  } else if (typeof body.chaveIdempotencia !== 'string' || !isUUID(body.chaveIdempotencia)) {
    erros.push(window.i18n.t('error_chaveIdempotencia_invalid_uuid'));
  } else if (usedIdempotencyKeys.has(body.chaveIdempotencia)) {
    erros.push(window.i18n.t('error_chaveIdempotencia_duplicate'));
  } else {
    usedIdempotencyKeys.add(body.chaveIdempotencia);
    validos.push(window.i18n.t('valid_chaveIdempotencia'));
  }

  // chavePix
  if (!body.chavePix) {
    erros.push(window.i18n.t('error_chavePix_required'));
  } else if (typeof body.chavePix !== 'string') {
    erros.push(window.i18n.t('error_chavePix_not_string'));
  } else if (body.chavePix.toLowerCase() === body.chaveIdempotencia.toLowerCase()) {
    erros.push(window.i18n.t('error_chaveIdempotencia_equals_chavePix'));
  } else {
    // Simulação de validação de chave Pix com a conta recebedora
    // Em um ambiente real, você faria uma consulta a um serviço para verificar isso.
    if (body.chavePix === 'chave-pix-nao-corresponde') { // Exemplo de chave que não corresponde
      erros.push(window.i18n.t('error_chavePix_mismatch'));
    } else {
      validos.push(window.i18n.t('valid_chavePix'));
    }
  }

  // Regra: chaveIdempotencia deve ser diferente de chavePix
  if (typeof body.chaveIdempotencia === 'string' && typeof body.chavePix === 'string') {
    if (body.chaveIdempotencia.toLowerCase() === body.chavePix.toLowerCase()) {
      erros.push(window.i18n.t('error_chaveIdempotencia_equals_chavePix'));
    }
  }

  // codigoCategoria (MCC - deve ser string de 4 dígitos e estar na lista permitida)
  if (body.codigoCategoria === undefined || body.codigoCategoria === null || body.codigoCategoria === '') {
    erros.push(window.i18n.t('error_codigoCategoria_required'));
  } else if (typeof body.codigoCategoria !== 'string') {
    erros.push(window.i18n.t('error_codigoCategoria_not_string'));
  } else {
    const mcc = body.codigoCategoria.trim();
    if (!/^\d{4}$/.test(mcc)) {
      erros.push(window.i18n.t('error_codigoCategoria_invalid_format'));
    } else if (!isCodigoCategoria(mcc)) {
      erros.push(window.i18n.t('error_codigoCategoria_invalid_mcc'));
    } else {
      validos.push(window.i18n.t('valid_codigoCategoria', { mcc }));
    }
  }

  // recebedorNome
  if (!body.recebedorNome) {
    erros.push(window.i18n.t('error_recebedorNome_required'));
  } else if (typeof body.recebedorNome !== 'string' || body.recebedorNome.trim().length < 2) {
    erros.push(window.i18n.t('error_recebedorNome_min_length'));
  } else {
    let nome = body.recebedorNome.trim();
    nome = nome.replace(/\s+/g, ' '); // Normaliza múltiplos espaços para um único
    if (hasDiacritics(nome)) {
      erros.push(window.i18n.t('error_recebedorNome_has_diacritics'));
    } else if (nome.length > 25) {
      erros.push(window.i18n.t('error_recebedorNome_max_length'));
    } else {
      validos.push(window.i18n.t('valid_recebedorNome'));
    }
  }

  // solicitacaoPagador (opcional - valida somente se existir, aceita null)
  if (Object.prototype.hasOwnProperty.call(body, 'solicitacaoPagador')) {
    if (body.solicitacaoPagador === null) {
      validos.push(window.i18n.t('valid_solicitacaoPagador_null'));
    } else if (typeof body.solicitacaoPagador === 'string') {
      validos.push(window.i18n.t('valid_solicitacaoPagador_string'));
    } else {
      erros.push(window.i18n.t('error_solicitacaoPagador_invalid_type'));
    }
  }

  // devedorDocumento (CPF ou CNPJ válido) - aceitar apenas dígitos (sem pontuação)
  if (!body.devedorDocumento) {
    erros.push(window.i18n.t('error_devedorDocumento_required'));
  } else if (typeof body.devedorDocumento !== 'string') {
    erros.push(window.i18n.t('error_devedorDocumento_not_string'));
  } else if (!/^\d{11}$/.test(body.devedorDocumento) && !/^\d{14}$/.test(body.devedorDocumento)) {
    erros.push(window.i18n.t('error_devedorDocumento_invalid_format'));
  } else if (/^\d{11}$/.test(body.devedorDocumento)) {
    if (!isCPF(body.devedorDocumento)) {
      erros.push(window.i18n.t('error_devedorDocumento_invalid_cpf'));
    } else {
      validos.push(window.i18n.t('valid_devedorDocumento_cpf'));
    }
  } else if (/^\d{14}$/.test(body.devedorDocumento)) {
    if (!isCNPJ(body.devedorDocumento)) {
      erros.push(window.i18n.t('error_devedorDocumento_invalid_cnpj'));
    } else {
      validos.push(window.i18n.t('valid_devedorDocumento_cnpj'));
    }
  }

  // devedorNome
  if (!body.devedorNome) {
    erros.push(window.i18n.t('error_devedorNome_required'));
  } else if (typeof body.devedorNome !== 'string' || body.devedorNome.trim().length < 2) {
    erros.push(window.i18n.t('error_devedorNome_min_length'));
  } else {
    let nomeDev = body.devedorNome.trim();
    nomeDev = nomeDev.replace(/\s+/g, ' '); // Normaliza múltiplos espaços para um único
    if (hasDiacritics(nomeDev)) {
      erros.push(window.i18n.t('error_devedorNome_has_diacritics'));
    } else {
      validos.push(window.i18n.t('valid_devedorNome'));
    }
  }

  // cidade
  if (!body.cidade) {
    erros.push(window.i18n.t('error_cidade_required'));
  } else if (typeof body.cidade !== 'string' || body.cidade.trim().length < 2) {
    erros.push(window.i18n.t('error_cidade_min_length'));
  } else {
    let cidadeVal = body.cidade.trim();
    cidadeVal = cidadeVal.replace(/\s+/g, ''); // Remove todos os espaços
    if (hasDiacritics(cidadeVal)) {
      erros.push(window.i18n.t('error_cidade_has_diacritics'));
    } else if (/\s/.test(cidadeVal)) {
      erros.push(window.i18n.t('error_cidade_has_spaces'));
    } else {
      validos.push(window.i18n.t('valid_cidade'));
      if (cidadeVal.length > 20) {
        validos.push(window.i18n.t('warning_cidade_max_length'));
      }
    }
  }

  // cep (opcional - valida somente se existir, aceita null; sem validações rígidas)
  if (Object.prototype.hasOwnProperty.call(body, 'cep')) {
    if (body.cep === null) {
      validos.push(window.i18n.t('valid_cep_null'));
    } else {
      validos.push(window.i18n.t('valid_cep_informed'));
    }
  }

  // valorOriginal
  if (body.valorOriginal === undefined) {
    erros.push(window.i18n.t('error_valorOriginal_required'));
  } else if (typeof body.valorOriginal !== 'number' || Number.isNaN(body.valorOriginal)) {
    erros.push(window.i18n.t('error_valorOriginal_not_number'));
  } else {
    const v = body.valorOriginal;
    // Permitir no máximo 2 casas decimais (após o ponto)
    if (!Number.isFinite(v)) {
      erros.push(window.i18n.t('error_valorOriginal_invalid'));
    } else if (getDecimalPlaces(v) > 2) {
      erros.push(window.i18n.t('error_valorOriginal_too_many_decimals'));
    } else {
      validos.push(window.i18n.t('valid_valorOriginal'));
    }
  }

  // modalidadeAlteracao (inteiro 0 ou 1)
  if (body.modalidadeAlteracao === undefined) {
    erros.push(window.i18n.t('error_modalidadeAlteracao_required'));
  } else if (typeof body.modalidadeAlteracao !== 'number' || !Number.isInteger(body.modalidadeAlteracao) || ![0,1].includes(body.modalidadeAlteracao)) {
    erros.push(window.i18n.t('error_modalidadeAlteracao_invalid'));
  } else {
    validos.push(window.i18n.t('valid_modalidadeAlteracao'));
  }

  // expiracaoEmSegundos (inteiro entre 60 e 86400)
  if (body.expiracaoEmSegundos === undefined) {
    erros.push(window.i18n.t('error_expiracaoEmSegundos_required'));
  } else if (typeof body.expiracaoEmSegundos !== 'number' || !Number.isInteger(body.expiracaoEmSegundos) || body.expiracaoEmSegundos < 60 || body.expiracaoEmSegundos > 86400) {
    erros.push(window.i18n.t('error_expiracaoEmSegundos_invalid'));
  } else {
    validos.push(window.i18n.t('valid_expiracaoEmSegundos'));
  }

  // dadosAdicionais (opcional) → deve ser objeto JSON ou null quando enviado
  if (Object.prototype.hasOwnProperty.call(body, 'dadosAdicionais')) {
    const da = body.dadosAdicionais;
    if (da === null) {
      validos.push(window.i18n.t('valid_dadosAdicionais_null'));
    } else if (typeof da === 'object' && !Array.isArray(da)) {
      validos.push(window.i18n.t('valid_dadosAdicionais_object'));
    } else {
      erros.push(window.i18n.t('error_dadosAdicionais_invalid_type'));
    }
  }

  // reutilizavel
  if (body.reutilizavel === undefined) {
    erros.push(window.i18n.t('error_reutilizavel_required'));
  } else if (typeof body.reutilizavel !== 'boolean') {
    erros.push(window.i18n.t('error_reutilizavel_not_boolean'));
  } else {
    validos.push(window.i18n.t('valid_reutilizavel'));
  }

  // tid (string, mínimo 6 caracteres conforme exemplo oficial)
  if (!body.tid) {
    erros.push(window.i18n.t('error_tid_required'));
  } else if (typeof body.tid !== 'string' || body.tid.length < 6) {
    erros.push(window.i18n.t('error_tid_min_length'));
  } else {
    validos.push(window.i18n.t('valid_tid'));
  }

  // solicitacaoPagador (opcional - valida somente se existir, aceita null)
  if (Object.prototype.hasOwnProperty.call(body, 'solicitacaoPagador')) {
    if (body.solicitacaoPagador === null) {
      validos.push(window.i18n.t('valid_solicitacaoPagador_null'));
    } else {
      // Não aplicar validações rígidas; apenas verificar tipo básico se informado
      if (typeof body.solicitacaoPagador === 'string') {
        validos.push(window.i18n.t('valid_solicitacaoPagador_string'));
      } else {
        // Não falhar de forma rígida: mensagem mais branda
        erros.push(window.i18n.t('error_solicitacaoPagador_invalid_type'));
      }
    }
  }

  // devedorDocumento (CPF ou CNPJ válido) - aceitar apenas dígitos (sem pontuação)
  if (!body.devedorDocumento) {
    erros.push(window.i18n.t('error_devedorDocumento_required'));
  } else if (typeof body.devedorDocumento !== 'string') {
    erros.push(window.i18n.t('error_devedorDocumento_not_string'));
  } else if (!/^\d{11}$/.test(body.devedorDocumento) && !/^\d{14}$/.test(body.devedorDocumento)) {
    erros.push(window.i18n.t('error_devedorDocumento_invalid_format'));
  } else if (/^\d{11}$/.test(body.devedorDocumento)) {
    if (!isCPF(body.devedorDocumento)) {
      erros.push(window.i18n.t('error_devedorDocumento_invalid_cpf'));
    } else {
      validos.push('✅ Campo "devedorDocumento" (CPF) válido.');
    }
  } else if (/^\d{14}$/.test(body.devedorDocumento)) {
    if (!isCNPJ(body.devedorDocumento)) {
      erros.push(window.i18n.t('error_devedorDocumento_invalid_cnpj'));
    } else {
      validos.push('✅ Campo "devedorDocumento" (CNPJ) válido.');
    }
  }

  // devedorNome
  if (!body.devedorNome) {
    erros.push(window.i18n.t('error_devedorNome_required'));
  } else if (typeof body.devedorNome !== 'string' || body.devedorNome.trim().length < 2) {
    erros.push(window.i18n.t('error_devedorNome_min_length'));
  } else {
    let nomeDev = body.devedorNome.trim();
    nomeDev = nomeDev.replace(/\s+/g, ' '); // Normaliza múltiplos espaços para um único
    if (hasDiacritics(nomeDev)) {
      erros.push(window.i18n.t('error_devedorNome_has_diacritics'));
    } else {
      validos.push('✅ Campo "devedorNome" válido.');
    }
  }

  // cidade
  if (!body.cidade) {
    erros.push(window.i18n.t('error_cidade_required'));
  } else if (typeof body.cidade !== 'string' || body.cidade.trim().length < 2) {
    erros.push(window.i18n.t('error_cidade_min_length'));
  } else {
    let cidadeVal = body.cidade.trim();
    cidadeVal = cidadeVal.replace(/\s+/g, ''); // Remove todos os espaços
    if (hasDiacritics(cidadeVal)) {
      erros.push(window.i18n.t('error_cidade_has_diacritics'));
    } else if (/\s/.test(cidadeVal)) {
      erros.push(window.i18n.t('error_cidade_has_spaces'));
    } else {
      validos.push('✅ Campo "cidade" válido.');
      if (cidadeVal.length > 20) {
        validos.push(window.i18n.t('warning_cidade_max_length'));
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
    erros.push(window.i18n.t('error_valorOriginal_required'));
  } else if (typeof body.valorOriginal !== 'number' || Number.isNaN(body.valorOriginal)) {
    erros.push(window.i18n.t('error_valorOriginal_not_number'));
  } else {
    const v = body.valorOriginal;
    // Permitir no máximo 2 casas decimais (após o ponto)
    if (!Number.isFinite(v)) {
      erros.push(window.i18n.t('error_valorOriginal_invalid'));
    } else if (getDecimalPlaces(v) > 2) {
      erros.push(window.i18n.t('error_valorOriginal_too_many_decimals'));
    } else {
      validos.push('✅ Campo "valorOriginal" válido.');
    }
  }

  // modalidadeAlteracao (inteiro 0 ou 1)
  if (body.modalidadeAlteracao === undefined) {
    erros.push(window.i18n.t('error_modalidadeAlteracao_required'));
  } else if (typeof body.modalidadeAlteracao !== 'number' || !Number.isInteger(body.modalidadeAlteracao) || ![0,1].includes(body.modalidadeAlteracao)) {
    erros.push(window.i18n.t('error_modalidadeAlteracao_invalid'));
  } else {
    validos.push('✅ Campo "modalidadeAlteracao" válido.');
  }

  // expiracaoEmSegundos (inteiro entre 60 e 86400)
  if (body.expiracaoEmSegundos === undefined) {
    erros.push(window.i18n.t('error_expiracaoEmSegundos_required'));
  } else if (typeof body.expiracaoEmSegundos !== 'number' || !Number.isInteger(body.expiracaoEmSegundos) || body.expiracaoEmSegundos < 60 || body.expiracaoEmSegundos > 86400) {
    erros.push(window.i18n.t('error_expiracaoEmSegundos_invalid'));
  } else {
    validos.push('✅ Campo "expiracaoEmSegundos" válido.');
  }

  // dadosAdicionais (opcional) → deve ser objeto JSON ou null quando enviado
  if (Object.prototype.hasOwnProperty.call(body, 'dadosAdicionais')) {
    const da = body.dadosAdicionais;
    if (da === null) {
      validos.push('✅ Campo "dadosAdicionais" presente como null (aceito).');
    } else if (typeof da === 'object' && !Array.isArray(da)) {
      validos.push('✅ Campo "dadosAdicionais" (objeto JSON) válido.');
    } else {
      erros.push(window.i18n.t('error_dadosAdicionais_invalid_type'));
    }
  }

  // reutilizavel
  if (body.reutilizavel === undefined) {
    erros.push(window.i18n.t('error_reutilizavel_required'));
  } else if (typeof body.reutilizavel !== 'boolean') {
    erros.push(window.i18n.t('error_reutilizavel_not_boolean'));
  } else {
    validos.push('✅ Campo "reutilizavel" válido.');
  }

  // tid (string, mínimo 6 caracteres conforme exemplo oficial)
  if (!body.tid) {
    erros.push(window.i18n.t('error_tid_required'));
  } else if (typeof body.tid !== 'string' || body.tid.length < 6) {
    erros.push(window.i18n.t('error_tid_min_length'));
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
  let title = type === 'error' ? window.i18n.t('errors') : window.i18n.t('valids');
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

  // Logs no console para cada mensagem exibida
  try {
    if (typeof console !== 'undefined') {
      if (erros.length || validos.length) {
        console.groupCollapsed('[Validação] Resultado');
        if (erros.length) {
          console.groupCollapsed(`Erros (${erros.length})`);
          erros.forEach((e) => console.error(e));
          console.groupEnd();
        }
        if (validos.length) {
          console.groupCollapsed(`Válidos/Avisos (${validos.length})`);
          validos.forEach((v) => {
            // Avisos costumam começar com ⚠️; logar como warn
            if (/^[⚠️]/.test(v)) console.warn(v); else console.log(v);
          });
          console.groupEnd();
        }
        console.groupEnd();
      }
    }
  } catch (_) {}
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
      copyBtn.textContent = (window.i18n ? window.i18n.t('copied') : 'Copiado!');
      setTimeout(() => (copyBtn.textContent = (window.i18n ? window.i18n.t('copy') : 'Copiar')), 1200);
    } catch (e) {
      copyBtn.textContent = (window.i18n ? window.i18n.t('copy_failed') : 'Falhou');
      setTimeout(() => (copyBtn.textContent = (window.i18n ? window.i18n.t('copy') : 'Copiar')), 1200);
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
      resultValid.appendChild(renderLine('success', '✅ ' + ((window.i18n && window.i18n.getLang() === 'en') ? 'JSON formatted successfully.' : 'JSON formatado com sucesso.')));
    }
    if (countErros) countErros.textContent = '0';
    if (countValidos) countValidos.textContent = '1';
    syncHighlight();
  } catch (e) {
    if (resultValid) resultValid.innerHTML = '';
    if (resultErrors) {
      resultErrors.innerHTML = '';
      const msg = '❌ JSON inválido. Corrija a sintaxe e tente novamente.';
      resultErrors.appendChild(renderLine('error', msg));
      try { if (typeof console !== 'undefined') console.error(msg); } catch(_) {}
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
    const msg = (window.i18n && window.i18n.getLang() === 'en') ? '❌ Invalid JSON.' : '❌ JSON inválido.';
    resultErrors.appendChild(renderLine('error', msg));
    try { if (typeof console !== 'undefined') console.error(msg); } catch(_) {}
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


