// Simple i18n utility with localStorage persistence
;(function(){
  const STORAGE_KEY = 'mc-lang';
  const DEFAULT_LANG = 'pt';

  const dictionaries = {
    pt: {
      app_title: 'Validador de Payload',
      app_subtitle: 'Ferramenta oficial para validação de JSONs de integração Pix',
      nav_validator: 'Validador',
      nav_example: 'Exemplo',
      docsa55: 'Doc A55',
      docsmicro:'Doc Micro',
      editor_title: 'JSON do Request Body',
      copy: 'Copiar',
      copied: 'Copiado!',
      copy_failed: 'Falhou',
      placeholder: 'Cole aqui o JSON do body...',
      validate: 'Validar JSON',
      format: 'Formatar',
      clear: 'Limpar',
      errors: 'Erros',
      valids: 'Válidos',
      doc_callout_title: 'Documentação oficial Microcash',
      doc_callout_title2:'Documentação oficial A55',
      doc_callout_text: 'Consulte o schema e regras completas do endpoint de Pix dinâmico.',
      doc_callout_link: 'Abrir guia do endpoint →',
      // Example page
      example_title: 'Exemplo de Payload Microcash & A55',
      example_subtitle: 'Modelo de JSON com explicação de campos para integração Pix.',
      example_json_title: 'JSON de Exemplo',
      example_copy: 'Copiar',
      example_copied: 'Copiado!',
      example_failed: 'Falhou',
      example_fields_title: 'Explicação de Campos',
      // Example fields (details and descriptions)
      field_chaveIdempotencia_detail: 'string UUID v4 • obrigatório',
      field_chaveIdempotencia_desc: 'Evita duplicidade de requisições. Deve ser um UUID válido.',
      field_chavePix_detail: 'string UUID v4 • obrigatório',
      field_chavePix_desc: 'Chave Pix vinculada à conta recebedora.',
      field_codigoCategoria_detail: 'string • obrigatório • MCC 4 dígitos',
      field_codigoCategoria_desc: 'Código de categoria do estabelecimento (MCC).',
      field_recebedorNome_detail: 'string • obrigatório • até 25 caracteres',
      field_recebedorNome_desc: 'Nome do recebedor (recomendado até 25 caracteres).',
      field_solicitacaoPagador_detail: 'string | null • opcional',
      field_solicitacaoPagador_desc: 'Mensagem exibida ao pagador na cobrança.',
      field_devedorDocumento_detail: 'string • obrigatório • CPF 11 dígitos ou CNPJ 14',
      field_devedorDocumento_desc: 'Documento do pagador, validado conforme regras oficiais.',
      field_devedorNome_detail: 'string • obrigatório • mínimo 2 caracteres',
      field_devedorNome_desc: 'Nome do pagador.',
      field_cidade_detail: 'string • obrigatório • sem espaços',
      field_cidade_desc: 'Cidade do recebedor (ex.: Aracaju).',
      field_valorOriginal_detail: 'number • obrigatório',
      field_valorOriginal_desc: 'Valor do Pix como número (sem aspas).',
      field_modalidadeAlteracao_detail: 'integer • obrigatório • 0 ou 1',
      field_modalidadeAlteracao_desc: 'Controle de permissão de alteração do valor.',
      field_expiracaoEmSegundos_detail: 'integer • obrigatório • 60 a 86400',
      field_expiracaoEmSegundos_desc: 'Tempo de expiração do QR Code dinâmico.',
      field_reutilizavel_detail: 'boolean • obrigatório',
      field_reutilizavel_desc: 'Indica se o QR Code pode ser reutilizado.',
      field_tid_detail: 'string • obrigatório • mínimo 6 caracteres',
      field_tid_desc: 'Identificador da transação.',
      // Validation errors
      error_field_required: 'O campo "${key}" é obrigatório.',
      error_field_not_allowed: 'Campo "${key}" não é permitido pela documentação.',
      error_chaveIdempotencia_required: 'Campo "chaveIdempotencia" é obrigatório.',
      error_chaveIdempotencia_invalid_uuid: 'Campo "chaveIdempotencia" deve ser um UUID válido.',
      error_chavePix_required: 'Campo "chavePix" é obrigatório.',
      error_chavePix_invalid_uuid: 'Campo "chavePix" deve ser um UUID válido.',
      error_chaveIdempotencia_equals_chavePix: '"chaveIdempotencia" deve ser diferente de "chavePix".',
      error_chaveIdempotencia_duplicate: 'Operação já registrada para esta chaveIdempotencia.',
      error_chavePix_mismatch: 'Chave Pix não corresponde à conta recebedora.',
      error_codigoCategoria_required: 'Campo "codigoCategoria" é obrigatório.',
      error_codigoCategoria_not_string: 'Campo "codigoCategoria" deve ser uma string.',
      error_codigoCategoria_invalid_format: 'Campo "codigoCategoria" deve conter 4 dígitos (MCC).',
      error_codigoCategoria_invalid_mcc: 'Campo "codigoCategoria" deve ser um MCC válido.',
      error_recebedorNome_required: 'Campo "recebedorNome" é obrigatório.',
      error_recebedorNome_min_length: 'Campo "recebedorNome" deve ter no mínimo 2 caracteres.',
      error_recebedorNome_has_diacritics: 'Campo "recebedorNome" não deve conter acentos.',
      error_recebedorNome_max_length: 'Campo "recebedorNome" não pode exceder 25 caracteres.',
      error_solicitacaoPagador_invalid_type: 'Campo "solicitacaoPagador" deve ser string ou null quando enviado.',
      error_devedorDocumento_required: 'Campo "devedorDocumento" é obrigatório.',
      error_devedorDocumento_not_string: 'Campo "devedorDocumento" deve ser string.',
      error_devedorDocumento_invalid_format: 'Campo "devedorDocumento" deve conter apenas dígitos: 11 (CPF) ou 14 (CNPJ).',
      error_devedorDocumento_invalid_cpf: 'Campo "devedorDocumento" deve ser um CPF válido.',
      error_devedorDocumento_invalid_cnpj: 'Campo "devedorDocumento" deve ser um CNPJ válido.',
      error_devedorNome_required: 'Campo "devedorNome" é obrigatório.',
      error_devedorNome_min_length: 'Campo "devedorNome" deve ter no mínimo 2 caracteres.',
      error_devedorNome_has_diacritics: 'Campo "devedorNome" não deve conter acentos.',
      error_cidade_required: 'Campo "cidade" é obrigatório.',
      error_cidade_min_length: 'Campo "cidade" deve ter no mínimo 2 caracteres.',
      error_cidade_has_diacritics: 'Campo "cidade" não deve conter acentos.',
      error_cidade_has_spaces: 'Campo "cidade" não deve conter espaços.',
      warning_cidade_max_length: '⚠️ Campo "cidade" excede 20 caracteres (recomendação).',
      error_valorOriginal_required: 'Campo "valorOriginal" é obrigatório.',
      error_valorOriginal_not_number: 'Campo "valorOriginal" deve ser numérico (sem aspas).',
      error_valorOriginal_invalid: 'Campo "valorOriginal" inválido.',
      error_valorOriginal_too_many_decimals: 'Campo "valorOriginal" deve ter no máximo 2 casas decimais após o ponto.',
      error_modalidadeAlteracao_required: 'Campo "modalidadeAlteracao" é obrigatório.',
      error_modalidadeAlteracao_invalid: 'Campo "modalidadeAlteracao" deve ser inteiro (0 ou 1).',
      error_expiracaoEmSegundos_required: 'Campo "expiracaoEmSegundos" é obrigatório.',
      error_expiracaoEmSegundos_invalid: 'Campo "expiracaoEmSegundos" deve ser um inteiro entre 60 e 86400.',
      error_dadosAdicionais_invalid_type: 'Campo "dadosAdicionais" deve ser um objeto (JSON) ou null quando enviado.',
      error_reutilizavel_required: 'Campo "reutilizavel" é obrigatório.',
      error_reutilizavel_not_boolean: 'Campo "reutilizavel" deve ser booleano.',
      error_tid_required: 'Campo "tid" é obrigatório.',
      error_tid_min_length: 'Campo "tid" deve ter no mínimo 6 caracteres.',
      // Validation success
      valid_chaveIdempotencia: 'Campo "chaveIdempotencia" válido.',
      valid_chavePix: 'Campo "chavePix" válido.',
      valid_codigoCategoria: 'Campo "codigoCategoria" (MCC ${mcc}) permitido.',
      valid_recebedorNome: 'Campo "recebedorNome" válido.',
      valid_solicitacaoPagador_null: 'Campo "solicitacaoPagador" presente como null (aceito).',
      valid_solicitacaoPagador_string: 'Campo "solicitacaoPagador" válido.',
      valid_devedorDocumento_cpf: 'Campo "devedorDocumento" (CPF) válido.',
      valid_devedorDocumento_cnpj: 'Campo "devedorDocumento" (CNPJ) válido.',
      valid_devedorNome: 'Campo "devedorNome" válido.',
      valid_cidade: 'Campo "cidade" válido.',
      valid_cep_null: 'Campo "cep" presente como null (aceito).',
      valid_cep_informed: 'Campo "cep" informado (validação flexível conforme documentação).',
      valid_valorOriginal: 'Campo "valorOriginal" válido.',
      valid_modalidadeAlteracao: 'Campo "modalidadeAlteracao" válido.',
      valid_expiracaoEmSegundos: 'Campo "expiracaoEmSegundos" válido.',
      valid_dadosAdicionais_null: 'Campo "dadosAdicionais" presente como null (aceito).',
      valid_dadosAdicionais_object: 'Campo "dadosAdicionais" (objeto JSON) válido.',
      valid_reutilizavel: 'Campo "reutilizavel" válido.',
      valid_tid: 'Campo "tid" válido.',
    },
    en: {
      app_title: 'Microcash & A55 Payload',
      app_subtitle: 'Official tool to validate Pix integration JSONs',
      nav_validator: 'Validator',
      nav_example: 'Example',
      docsa55: 'Doc A55',
      docsmicro:'Doc Micro',
      editor_title: 'Request Body JSON',
      copy: 'Copy',
      copied: 'Copied!',
      copy_failed: 'Failed',
      placeholder: 'Paste the body JSON here...',
      validate: 'Validate JSON',
      format: 'Format',
      clear: 'Clear',
      errors: 'Errors',
      valids: 'Valid',
      doc_callout_title: 'Official Microcash documentation',
      doc_callout_text: 'See the full schema and rules for the dynamic Pix endpoint.',
      doc_callout_link: 'Open endpoint guide →',
      // Example page
      example_title: 'Microcash & A55 Payload Example',
      example_subtitle: 'JSON template with field explanation for Pix integration.',
      example_json_title: 'Example JSON',
      example_copy: 'Copy',
      example_copied: 'Copied!',
      example_failed: 'Failed',
      example_fields_title: 'Field Explanations',
      // Example fields (details and descriptions)
      field_chaveIdempotencia_detail: 'string UUID v4 • required',
      field_chaveIdempotencia_desc: 'Prevents duplicate requests. Must be a valid UUID.',
      field_chavePix_detail: 'string UUID v4 • required',
      field_chavePix_desc: 'Pix key linked to the recipient account.',
      field_codigoCategoria_detail: 'string • required • MCC 4 digits',
      field_codigoCategoria_desc: 'Merchant Category Code (MCC).',
      field_recebedorNome_detail: 'string • required • up to 25 characters',
      field_recebedorNome_desc: 'Receiver name (recommended up to 25 characters).',
      field_solicitacaoPagador_detail: 'string | null • optional',
      field_solicitacaoPagador_desc: 'Message shown to the payer in the charge.',
      field_devedorDocumento_detail: 'string • required • CPF 11 digits or CNPJ 14',
      field_devedorDocumento_desc: 'Payer document validated according to official rules.',
      field_devedorNome_detail: 'string • required • minimum 2 characters',
      field_devedorNome_desc: 'Payer name.',
      field_cidade_detail: 'string • required • no spaces',
      field_cidade_desc: 'Receiver city (e.g., Aracaju).',
      field_valorOriginal_detail: 'number • required',
      field_valorOriginal_desc: 'Pix amount as a number (no quotes).',
      field_modalidadeAlteracao_detail: 'integer • required • 0 or 1',
      field_modalidadeAlteracao_desc: 'Controls whether the amount can be changed.',
      field_expiracaoEmSegundos_detail: 'integer • required • 60 to 86400',
      field_expiracaoEmSegundos_desc: 'Expiration time of the dynamic QR Code.',
      field_reutilizavel_detail: 'boolean • required',
      field_reutilizavel_desc: 'Indicates if the QR Code can be reused.',
      field_tid_detail: 'string • required • minimum 6 characters',
      field_tid_desc: 'Transaction identifier.',
      // Validation errors
      error_field_required: 'Field "${key}" is required.',
      error_field_not_allowed: 'Field "${key}" is not allowed by the documentation.',
      error_chaveIdempotencia_required: 'Field "chaveIdempotencia" is required.',
      error_chaveIdempotencia_invalid_uuid: 'Field "chaveIdempotencia" must be a valid UUID.',
      error_chavePix_required: 'Field "chavePix" is required.',
      error_chavePix_invalid_uuid: 'Field "chavePix" must be a valid UUID.',
      error_chaveIdempotencia_equals_chavePix: '"chaveIdempotencia" must be different from "chavePix".',
      error_codigoCategoria_required: 'Field "codigoCategoria" is required.',
      error_codigoCategoria_not_string: 'Field "codigoCategoria" must be a string.',
      error_codigoCategoria_invalid_format: 'Field "codigoCategoria" must contain 4 digits (MCC).',
      error_codigoCategoria_invalid_mcc: 'Field "codigoCategoria" must be a valid MCC.',
      error_recebedorNome_required: 'Field "recebedorNome" is required.',
      error_recebedorNome_min_length: 'Field "recebedorNome" must have at least 2 characters.',
      error_recebedorNome_has_diacritics: 'Field "recebedorNome" must not contain diacritics.',
      error_recebedorNome_max_length: 'Field "recebedorNome" cannot exceed 25 characters.',
      error_solicitacaoPagador_invalid_type: 'Field "solicitacaoPagador" must be a string or null when sent.',
      error_devedorDocumento_required: 'Field "devedorDocumento" is required.',
      error_devedorDocumento_not_string: 'Field "devedorDocumento" must be a string.',
      error_devedorDocumento_invalid_format: 'Field "devedorDocumento" must contain only digits: 11 (CPF) or 14 (CNPJ).',
      error_devedorDocumento_invalid_cpf: 'Field "devedorDocumento" must be a valid CPF.',
      error_devedorDocumento_invalid_cnpj: 'Field "devedorDocumento" must be a valid CNPJ.',
      error_devedorNome_required: 'Field "devedorNome" is required.',
      error_devedorNome_min_length: 'Field "devedorNome" must have at least 2 characters.',
      error_devedorNome_has_diacritics: 'Field "devedorNome" must not contain diacritics.',
      error_cidade_required: 'Field "cidade" is required.',
      error_cidade_min_length: 'Field "cidade" must have at least 2 characters.',
      error_cidade_has_diacritics: 'Field "cidade" must not contain diacritics.',
      error_cidade_has_spaces: 'Field "cidade" must not contain spaces.',
      warning_cidade_max_length: '⚠️ Field "cidade" exceeds 20 characters (recommendation).',
      error_valorOriginal_required: 'Field "valorOriginal" is required.',
      error_valorOriginal_not_number: 'Field "valorOriginal" must be numeric (no quotes).',
      error_valorOriginal_invalid: 'Field "valorOriginal" is invalid.',
      error_valorOriginal_too_many_decimals: 'Field "valorOriginal" must have at most 2 decimal places after the point.',
      error_modalidadeAlteracao_required: 'Field "modalidadeAlteracao" is required.',
      error_modalidadeAlteracao_invalid: 'Field "modalidadeAlteracao" must be an integer (0 or 1).',
      error_expiracaoEmSegundos_required: 'Field "expiracaoEmSegundos" is required.',
      error_expiracaoEmSegundos_invalid: 'Field "expiracaoEmSegundos" must be an integer between 60 and 86400.',
      error_dadosAdicionais_invalid_type: 'Field "dadosAdicionais" must be an object (JSON) or null when sent.',
      error_reutilizavel_required: 'Field "reutilizavel" is required.',
      error_reutilizavel_not_boolean: 'Field "reutilizavel" must be boolean.',
      error_tid_required: 'Field "tid" is required.',
      error_tid_min_length: 'Field "tid" must have at least 6 characters.',
      // Validation success
      valid_chaveIdempotencia: 'Field "chaveIdempotencia" valid.',
      valid_chavePix: 'Field "chavePix" valid.',
      valid_codigoCategoria: 'Field "codigoCategoria" (MCC ${mcc}) allowed.',
      valid_recebedorNome: 'Field "recebedorNome" valid.',
      valid_solicitacaoPagador_null: 'Field "solicitacaoPagador" present as null (accepted).',
      valid_solicitacaoPagador_string: 'Field "solicitacaoPagador" valid.',
      valid_devedorDocumento_cpf: 'Field "devedorDocumento" (CPF) valid.',
      valid_devedorDocumento_cnpj: 'Field "devedorDocumento" (CNPJ) valid.',
      valid_devedorNome: 'Field "devedorNome" valid.',
      valid_cidade: 'Field "cidade" valid.',
      valid_cep_null: 'Field "cep" present as null (accepted).',
      valid_cep_informed: 'Field "cep" informed (flexible validation as per documentation).',
      valid_valorOriginal: 'Field "valorOriginal" valid.',
      valid_modalidadeAlteracao: 'Field "modalidadeAlteracao" valid.',
      valid_expiracaoEmSegundos: 'Field "expiracaoEmSegundos" valid.',
      valid_dadosAdicionais_null: 'Field "dadosAdicionais" present as null (accepted).',
      valid_dadosAdicionais_object: 'Field "dadosAdicionais" (JSON object) valid.',
      valid_reutilizavel: 'Field "reutilizavel" valid.',
      valid_tid: 'Field "tid" valid.',
    }
  };

  function getLang(){
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'pt' || saved === 'en') return saved;
    // Fallback by browser
    const nav = (navigator.language || 'pt').toLowerCase();
    return nav.startsWith('en') ? 'en' : 'pt';
  }

  function setLang(lang){
    const next = (lang === 'en') ? 'en' : 'pt';
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.setAttribute('lang', next === 'en' ? 'en' : 'pt-BR');
    translatePage();
  }

  function t(key, replacements = {}) {
    const lang = getLang();
    const dict = dictionaries[lang] || dictionaries[DEFAULT_LANG];
    let text = dict[key] || key;
    // Loop para substituir todos os placeholders
    for (const placeholder in replacements) {
      const value = replacements[placeholder];
      text = text.replace(new RegExp(`\\$\\{${placeholder}\\}`, 'g'), value);
    }
    return text;
  }

  function translatePage(){
    const lang = getLang();
    const dict = dictionaries[lang] || dictionaries[DEFAULT_LANG];
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      const value = dict[key];
      if (value == null) return;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.setAttribute('placeholder', value);
      } else {
        el.textContent = value;
      }
    });
    // Toggle label
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) langToggle.textContent = (lang === 'en') ? 'EN' : 'PT';
  }

  // Expose minimal API globally
  window.i18n = { t, setLang, getLang, translatePage };

  // Initialize on load
  document.addEventListener('DOMContentLoaded', translatePage);
})();


