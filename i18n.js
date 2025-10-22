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

  function t(key){
    const lang = getLang();
    const dict = dictionaries[lang] || dictionaries[DEFAULT_LANG];
    return dict[key] || key;
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


