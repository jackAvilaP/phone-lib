import {
  parsePhoneNumber,
  getCountries,
  getCountryCallingCode,
  AsYouType
} from 'libphonenumber-js';

/**
 * Librería PhoneLib - Input de teléfono con selector de país
 */
class PhoneLib {
  constructor(container, options = {}) {
    this.container = typeof container === 'string'
      ? document.querySelector(container)
      : container;

    if (!this.container) {
      throw new Error('El contenedor especificado no existe');
    }

    // Opciones por defecto
    this.options = {
      initialCountry: options.initialCountry || 'US',
      preferredCountries: options.preferredCountries || [],
      showHint: options.showHint !== undefined ? options.showHint : true,
      layout: options.layout || 'integrated', // 'integrated' o 'separated'
      showDialCode: options.showDialCode !== undefined ? options.showDialCode : true, // Mostrar código de marcación
      customClasses: options.customClasses || {}, // Clases CSS personalizadas
      customStyles: options.customStyles || {}, // Estilos inline personalizados
      // Icono de flecha personalizable
      arrowIcon: options.arrowIcon || null, // HTML personalizado para la flecha (ej: SVG, imagen, etc.)
      // Control de anchos
      width: options.width || null, // Ancho del wrapper (ej: '500px', '100%', '50rem')
      maxWidth: options.maxWidth || null, // Ancho máximo del wrapper
      dropdownWidth: options.dropdownWidth || null, // Ancho del selector de país (layout integrado)
      inputWidth: options.inputWidth || null, // Ancho del campo de teléfono (layout integrado)
      // Para layout separado
      gridColumns: options.gridColumns || null, // Columnas del grid (ej: '1fr 1fr 2fr', '2fr 1fr 3fr')
      countryWidth: options.countryWidth || null, // Ancho del campo país (layout separado)
      dialCodeWidth: options.dialCodeWidth || null, // Ancho del campo código (layout separado)
      phoneWidth: options.phoneWidth || null, // Ancho del campo teléfono (layout separado)
      // Callbacks y eventos
      onCountryChange: options.onCountryChange || null,
      onPhoneChange: options.onPhoneChange || null,
      onValidationChange: options.onValidationChange || null,
      onFocus: options.onFocus || null,
      onBlur: options.onBlur || null,
      // Configuración avanzada
      autoDetectCountry: options.autoDetectCountry !== undefined ? options.autoDetectCountry : false,
      validateOnInput: options.validateOnInput !== undefined ? options.validateOnInput : false,
      disabledCountries: options.disabledCountries || [],
      onlyCountries: options.onlyCountries || [],
      excludeCountries: options.excludeCountries || [],
      readonly: options.readonly !== undefined ? options.readonly : false,
      disabled: options.disabled !== undefined ? options.disabled : false,
      // Placeholders y labels personalizables
      placeholder: options.placeholder || null,
      countryLabel: options.countryLabel || 'País',
      dialCodeLabel: options.dialCodeLabel || 'Código',
      phoneLabel: options.phoneLabel || 'Número de teléfono',
      // Mensajes personalizables
      messages: {
        invalid: options.messages?.invalid || 'Ingrese un número válido',
        valid: options.messages?.valid || '✓ Número válido',
        ...options.messages
      },
      // ARIA labels personalizables
      ariaLabels: {
        dropdownButton: options.ariaLabels?.dropdownButton || 'Seleccionar país',
        input: options.ariaLabels?.input || 'Número de teléfono',
        dialCodeInput: options.ariaLabels?.dialCodeInput || 'Código de marcación',
        ...options.ariaLabels
      },
      ...options
    };

    // Estado interno
    this.selectedCountry = this.options.initialCountry;
    this.phoneNumber = options.initialPhoneNumber || '';
    this._isValid = false;
    this.isDisabled = this.options.disabled;
    this.isReadonly = this.options.readonly;
    this.countries = this.getCountriesList();

    // Inicializar
    this.init();
  }

  /**
   * Obtiene la lista de países con sus datos
   */
  getCountriesList() {
    const countries = getCountries();
    let countriesList = countries.map(iso2 => {
      const dialCode = getCountryCallingCode(iso2);
      const flagHtml = this.getCountryFlag(iso2);
      const name = this.getCountryName(iso2);

      return {
        iso2,
        name,
        dialCode,
        flag: flagHtml // Ahora es HTML con imagen
      };
    });

    // Filtrar países según configuración
    if (this.options.onlyCountries.length > 0) {
      countriesList = countriesList.filter(c => this.options.onlyCountries.includes(c.iso2));
    }

    if (this.options.excludeCountries.length > 0) {
      countriesList = countriesList.filter(c => !this.options.excludeCountries.includes(c.iso2));
    }

    if (this.options.disabledCountries.length > 0) {
      countriesList = countriesList.map(c => ({
        ...c,
        disabled: this.options.disabledCountries.includes(c.iso2)
      }));
    }

    // Ordenar por países preferidos primero, luego alfabéticamente
    if (this.options.preferredCountries.length > 0) {
      const preferred = [];
      const others = [];

      countriesList.forEach(country => {
        if (this.options.preferredCountries.includes(country.iso2)) {
          preferred.push(country);
        } else {
          others.push(country);
        }
      });

      // Ordenar preferidos según el orden especificado
      preferred.sort((a, b) => {
        const indexA = this.options.preferredCountries.indexOf(a.iso2);
        const indexB = this.options.preferredCountries.indexOf(b.iso2);
        return indexA - indexB;
      });

      // Ordenar otros alfabéticamente
      others.sort((a, b) => a.name.localeCompare(b.name));

      return [...preferred, ...others];
    }

    return countriesList.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Obtiene la bandera del país usando imágenes PNG desde CDN
   * Compatible con todos los navegadores, incluyendo Brave
   * Usa múltiples CDNs como fallback
   */
  getCountryFlag(iso2) {
    if (!iso2 || iso2.length !== 2) {
      return this.getFlagImage('UN'); // Bandera de la ONU como fallback
    }

    const upperIso2 = iso2.toUpperCase();
    const lowerIso2 = upperIso2.toLowerCase();

    // Múltiples CDNs como fallback para compatibilidad con navegadores que bloquean contenido
    // Usamos diferentes formatos y CDNs para maximizar compatibilidad con Brave
    const cdnUrls = [
      `https://flagcdn.com/w20/${lowerIso2}.png`,
      `https://flagsapi.com/${upperIso2}/flat/32.png`,
      `https://countryflagsapi.com/png/${lowerIso2}`,
      `https://flagcdn.com/w20/${lowerIso2}.svg`, // SVG como alternativa
      `data:image/svg+xml;base64,${this.getFlagSVGBase64(iso2)}` // Fallback SVG inline
    ];

    // Retornar HTML con imagen PNG de bandera desde CDN
    // Usamos múltiples CDNs como fallback para compatibilidad con Brave y otros navegadores
    // El onerror intentará cargar los fallbacks en orden
    return `<img src="${cdnUrls[0]}" 
                 srcset="${cdnUrls[0].replace('w20', 'w40')} 2x"
                 alt="${upperIso2}" 
                 class="phone-lib-flag-img"
                 loading="lazy"
                 crossorigin="anonymous"
                 referrerpolicy="no-referrer"
                 data-fallback-1="${cdnUrls[1]}"
                 data-fallback-2="${cdnUrls[2]}"
                 data-fallback-3="${cdnUrls[3]}"
                 data-fallback-4="${cdnUrls[4]}"
                 onerror="(function(img){img.onerror=null; if(img.dataset.fallback1 && !img.dataset.tried1) { img.src=img.dataset.fallback1; img.dataset.tried1='1'; } else if(img.dataset.fallback2 && !img.dataset.tried2) { img.src=img.dataset.fallback2; img.dataset.tried2='1'; } else if(img.dataset.fallback3 && !img.dataset.tried3) { img.src=img.dataset.fallback3; img.dataset.tried3='1'; } else if(img.dataset.fallback4) { img.src=img.dataset.fallback4; } else { img.style.display='none'; var span=document.createElement('span'); span.style.cssText='font-size:12px;color:#666;'; span.textContent='${upperIso2}'; img.parentElement.replaceChild(span, img); } })(this)">`;
  }

  /**
   * Obtiene la imagen de bandera como HTML
   */
  getFlagImage(iso2) {
    const upperIso2 = (iso2 || 'UN').toUpperCase();
    const lowerIso2 = upperIso2.toLowerCase();

    const cdnUrls = [
      `https://flagcdn.com/w20/${lowerIso2}.png`,
      `https://flagsapi.com/${upperIso2}/flat/32.png`,
      `https://countryflagsapi.com/png/${lowerIso2}`,
      `https://flagcdn.com/w20/${lowerIso2}.svg`,
      `data:image/svg+xml;base64,${this.getFlagSVGBase64(iso2)}`
    ];

    return `<img src="${cdnUrls[0]}" 
                 srcset="${cdnUrls[0].replace('w20', 'w40')} 2x"
                 alt="${upperIso2}" 
                 class="phone-lib-flag-img"
                 loading="lazy"
                 crossorigin="anonymous"
                 referrerpolicy="no-referrer"
                 data-fallback-1="${cdnUrls[1]}"
                 data-fallback-2="${cdnUrls[2]}"
                 data-fallback-3="${cdnUrls[3]}"
                 data-fallback-4="${cdnUrls[4]}"
                 onerror="(function(img){img.onerror=null; if(img.dataset.fallback1 && !img.dataset.tried1) { img.src=img.dataset.fallback1; img.dataset.tried1='1'; } else if(img.dataset.fallback2 && !img.dataset.tried2) { img.src=img.dataset.fallback2; img.dataset.tried2='1'; } else if(img.dataset.fallback3 && !img.dataset.tried3) { img.src=img.dataset.fallback3; img.dataset.tried3='1'; } else if(img.dataset.fallback4) { img.src=img.dataset.fallback4; } else { img.style.display='none'; var span=document.createElement('span'); span.style.cssText='font-size:12px;color:#666;'; span.textContent='${upperIso2}'; img.parentElement.replaceChild(span, img); } })(this)">`;
  }

  /**
   * Genera un SVG básico de bandera como fallback
   */
  getFlagSVGBase64(iso2) {
    // Generar un SVG simple con el código del país como fallback
    const upperIso2 = (iso2 || 'UN').toUpperCase();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 20 15">
      <rect width="20" height="15" fill="#e0e0e0"/>
      <text x="10" y="11" font-family="Arial" font-size="10" fill="#666" text-anchor="middle">${upperIso2}</text>
    </svg>`;
    try {
      return btoa(unescape(encodeURIComponent(svg)));
    } catch (e) {
      // Fallback si btoa no está disponible
      return '';
    }
  }

  /**
   * Intenta cargar la bandera usando fetch para detectar bloqueos
   * Útil para navegadores como Brave que bloquean CDNs
   */
  async checkFlagAvailability(url) {
    try {
      const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Obtiene el nombre del país en español
   */
  getCountryName(iso2) {
    const countryNames = {
      'AD': 'Andorra',
      'AE': 'Emiratos Árabes Unidos',
      'AF': 'Afganistán',
      'AG': 'Antigua y Barbuda',
      'AI': 'Anguila',
      'AL': 'Albania',
      'AM': 'Armenia',
      'AO': 'Angola',
      'AQ': 'Antártida',
      'AR': 'Argentina',
      'AS': 'Samoa Americana',
      'AT': 'Austria',
      'AU': 'Australia',
      'AW': 'Aruba',
      'AX': 'Islas Åland',
      'AZ': 'Azerbaiyán',
      'BA': 'Bosnia y Herzegovina',
      'BB': 'Barbados',
      'BD': 'Bangladesh',
      'BE': 'Bélgica',
      'BF': 'Burkina Faso',
      'BG': 'Bulgaria',
      'BH': 'Baréin',
      'BI': 'Burundi',
      'BJ': 'Benín',
      'BL': 'San Bartolomé',
      'BM': 'Bermudas',
      'BN': 'Brunéi',
      'BO': 'Bolivia',
      'BQ': 'Caribe Neerlandés',
      'BR': 'Brasil',
      'BS': 'Bahamas',
      'BT': 'Bután',
      'BV': 'Isla Bouvet',
      'BW': 'Botsuana',
      'BY': 'Bielorrusia',
      'BZ': 'Belice',
      'CA': 'Canadá',
      'CC': 'Islas Cocos',
      'CD': 'República Democrática del Congo',
      'CF': 'República Centroafricana',
      'CG': 'Congo',
      'CH': 'Suiza',
      'CI': 'Costa de Marfil',
      'CK': 'Islas Cook',
      'CL': 'Chile',
      'CM': 'Camerún',
      'CN': 'China',
      'CO': 'Colombia',
      'CR': 'Costa Rica',
      'CU': 'Cuba',
      'CV': 'Cabo Verde',
      'CW': 'Curazao',
      'CX': 'Isla de Navidad',
      'CY': 'Chipre',
      'CZ': 'República Checa',
      'DE': 'Alemania',
      'DJ': 'Yibuti',
      'DK': 'Dinamarca',
      'DM': 'Dominica',
      'DO': 'República Dominicana',
      'DZ': 'Argelia',
      'EC': 'Ecuador',
      'EE': 'Estonia',
      'EG': 'Egipto',
      'EH': 'Sahara Occidental',
      'ER': 'Eritrea',
      'ES': 'España',
      'ET': 'Etiopía',
      'FI': 'Finlandia',
      'FJ': 'Fiyi',
      'FK': 'Islas Malvinas',
      'FM': 'Micronesia',
      'FO': 'Islas Feroe',
      'FR': 'Francia',
      'GA': 'Gabón',
      'GB': 'Reino Unido',
      'GD': 'Granada',
      'GE': 'Georgia',
      'GF': 'Guayana Francesa',
      'GG': 'Guernsey',
      'GH': 'Ghana',
      'GI': 'Gibraltar',
      'GL': 'Groenlandia',
      'GM': 'Gambia',
      'GN': 'Guinea',
      'GP': 'Guadalupe',
      'GQ': 'Guinea Ecuatorial',
      'GR': 'Grecia',
      'GS': 'Georgia del Sur e Islas Sandwich del Sur',
      'GT': 'Guatemala',
      'GU': 'Guam',
      'GW': 'Guinea-Bisáu',
      'GY': 'Guyana',
      'HK': 'Hong Kong',
      'HM': 'Islas Heard y McDonald',
      'HN': 'Honduras',
      'HR': 'Croacia',
      'HT': 'Haití',
      'HU': 'Hungría',
      'ID': 'Indonesia',
      'IE': 'Irlanda',
      'IL': 'Israel',
      'IM': 'Isla de Man',
      'IN': 'India',
      'IO': 'Territorio Británico del Océano Índico',
      'IQ': 'Irak',
      'IR': 'Irán',
      'IS': 'Islandia',
      'IT': 'Italia',
      'JE': 'Jersey',
      'JM': 'Jamaica',
      'JO': 'Jordania',
      'JP': 'Japón',
      'KE': 'Kenia',
      'KG': 'Kirguistán',
      'KH': 'Camboya',
      'KI': 'Kiribati',
      'KM': 'Comoras',
      'KN': 'San Cristóbal y Nieves',
      'KP': 'Corea del Norte',
      'KR': 'Corea del Sur',
      'KW': 'Kuwait',
      'KY': 'Islas Caimán',
      'KZ': 'Kazajistán',
      'LA': 'Laos',
      'LB': 'Líbano',
      'LC': 'Santa Lucía',
      'LI': 'Liechtenstein',
      'LK': 'Sri Lanka',
      'LR': 'Liberia',
      'LS': 'Lesoto',
      'LT': 'Lituania',
      'LU': 'Luxemburgo',
      'LV': 'Letonia',
      'LY': 'Libia',
      'MA': 'Marruecos',
      'MC': 'Mónaco',
      'MD': 'Moldavia',
      'ME': 'Montenegro',
      'MF': 'San Martín',
      'MG': 'Madagascar',
      'MH': 'Islas Marshall',
      'MK': 'Macedonia del Norte',
      'ML': 'Malí',
      'MM': 'Myanmar',
      'MN': 'Mongolia',
      'MO': 'Macao',
      'MP': 'Islas Marianas del Norte',
      'MQ': 'Martinica',
      'MR': 'Mauritania',
      'MS': 'Montserrat',
      'MT': 'Malta',
      'MU': 'Mauricio',
      'MV': 'Maldivas',
      'MW': 'Malaui',
      'MX': 'México',
      'MY': 'Malasia',
      'MZ': 'Mozambique',
      'NA': 'Namibia',
      'NC': 'Nueva Caledonia',
      'NE': 'Níger',
      'NF': 'Isla Norfolk',
      'NG': 'Nigeria',
      'NI': 'Nicaragua',
      'NL': 'Países Bajos',
      'NO': 'Noruega',
      'NP': 'Nepal',
      'NR': 'Nauru',
      'NU': 'Niue',
      'NZ': 'Nueva Zelanda',
      'OM': 'Omán',
      'PA': 'Panamá',
      'PE': 'Perú',
      'PF': 'Polinesia Francesa',
      'PG': 'Papúa Nueva Guinea',
      'PH': 'Filipinas',
      'PK': 'Pakistán',
      'PL': 'Polonia',
      'PM': 'San Pedro y Miquelón',
      'PN': 'Islas Pitcairn',
      'PR': 'Puerto Rico',
      'PS': 'Palestina',
      'PT': 'Portugal',
      'PW': 'Palaos',
      'PY': 'Paraguay',
      'QA': 'Catar',
      'RE': 'Reunión',
      'RO': 'Rumania',
      'RS': 'Serbia',
      'RU': 'Rusia',
      'RW': 'Ruanda',
      'SA': 'Arabia Saudí',
      'SB': 'Islas Salomón',
      'SC': 'Seychelles',
      'SD': 'Sudán',
      'SE': 'Suecia',
      'SG': 'Singapur',
      'SH': 'Santa Elena',
      'SI': 'Eslovenia',
      'SJ': 'Svalbard y Jan Mayen',
      'SK': 'Eslovaquia',
      'SL': 'Sierra Leona',
      'SM': 'San Marino',
      'SN': 'Senegal',
      'SO': 'Somalia',
      'SR': 'Surinam',
      'SS': 'Sudán del Sur',
      'ST': 'Santo Tomé y Príncipe',
      'SV': 'El Salvador',
      'SX': 'Sint Maarten',
      'SY': 'Siria',
      'SZ': 'Suazilandia',
      'TC': 'Islas Turcas y Caicos',
      'TD': 'Chad',
      'TF': 'Territorios Australes Franceses',
      'TG': 'Togo',
      'TH': 'Tailandia',
      'TJ': 'Tayikistán',
      'TK': 'Tokelau',
      'TL': 'Timor Oriental',
      'TM': 'Turkmenistán',
      'TN': 'Túnez',
      'TO': 'Tonga',
      'TR': 'Turquía',
      'TT': 'Trinidad y Tobago',
      'TV': 'Tuvalu',
      'TW': 'Taiwán',
      'TZ': 'Tanzania',
      'UA': 'Ucrania',
      'UG': 'Uganda',
      'UM': 'Islas Ultramarinas de Estados Unidos',
      'US': 'Estados Unidos',
      'UY': 'Uruguay',
      'UZ': 'Uzbekistán',
      'VA': 'Ciudad del Vaticano',
      'VC': 'San Vicente y las Granadinas',
      'VE': 'Venezuela',
      'VG': 'Islas Vírgenes Británicas',
      'VI': 'Islas Vírgenes de los Estados Unidos',
      'VN': 'Vietnam',
      'VU': 'Vanuatu',
      'WF': 'Wallis y Futuna',
      'WS': 'Samoa',
      'XK': 'Kosovo',
      'YE': 'Yemen',
      'YT': 'Mayotte',
      'ZA': 'Sudáfrica',
      'ZM': 'Zambia',
      'ZW': 'Zimbabue'
    };

    return countryNames[iso2] || iso2;
  }

  /**
   * Emite un evento personalizado del DOM
   */
  emitEvent(eventName, detail = {}) {
    const event = new CustomEvent(`phoneLib:${eventName}`, {
      detail: {
        ...detail,
        instance: this
      },
      bubbles: true,
      cancelable: true
    });
    this.container.dispatchEvent(event);
  }

  /**
   * Ejecuta un callback si existe
   */
  executeCallback(callbackName, ...args) {
    if (this.options[callbackName] && typeof this.options[callbackName] === 'function') {
      try {
        this.options[callbackName](...args);
      } catch (e) {
        console.error(`Error en callback ${callbackName}:`, e);
      }
    }
  }

  /**
   * Inicializa la librería
   */
  init() {
    this.render();
    this.attachEventListeners();

    // Si hay un número inicial, establecerlo después de renderizar
    if (this.phoneNumber) {
      this.setPhoneNumber(this.phoneNumber);
    } else {
      this.updatePhoneNumber();
    }

    // Aplicar estados iniciales
    if (this.isDisabled) {
      this.disable();
    }
    if (this.isReadonly) {
      this.setReadonly(true);
    }
  }

  /**
   * Renderiza el HTML
   */
  render() {
    if (this.options.layout === 'separated') {
      this.renderSeparated();
    } else {
      this.renderIntegrated();
    }
  }

  /**
   * Aplica clases CSS personalizadas a un elemento
   */
  applyCustomClasses(defaultClass, customClass) {
    if (customClass) {
      return `${defaultClass} ${customClass}`;
    }
    return defaultClass;
  }

  /**
   * Aplica estilos inline personalizados
   */
  applyCustomStyles(customStyles) {
    if (!customStyles || typeof customStyles !== 'object') {
      return '';
    }
    return Object.entries(customStyles)
      .map(([key, value]) => {
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        return `${cssKey}: ${value};`;
      })
      .join(' ');
  }

  /**
   * Obtiene el HTML del icono de flecha
   */
  getArrowIcon() {
    // Si hay un icono personalizado, usarlo (validar que sea string)
    if (this.options.arrowIcon && typeof this.options.arrowIcon === 'string') {
      // Sanitización básica: remover scripts potencialmente peligrosos
      // Nota: En producción, considerar usar una librería de sanitización
      const sanitized = this.options.arrowIcon.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      return sanitized;
    }

    // Chevron SVG por defecto (simple, apuntando hacia abajo - solo líneas, sin relleno)
    // Forma de chevron: dos líneas que forman una V apuntando hacia abajo
    // Usa dos líneas separadas para asegurar que se vea como chevron, no triángulo
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="3" y1="5" x2="6" y2="8"/>
      <line x1="6" y1="8" x2="9" y2="5"/>
    </svg>`;
  }

  renderIntegrated() {
    const selectedCountryData = this.countries.find(c => c.iso2 === this.selectedCountry);
    const defaultFlag = this.getFlagImage('UN');

    const wrapperClass = this.applyCustomClasses(
      'phone-lib-wrapper phone-lib-layout-integrated',
      this.options.customClasses?.wrapper
    );

    // Aplicar estilos personalizados y anchos
    let wrapperStyle = this.applyCustomStyles(this.options.customStyles?.wrapper);
    if (this.options.width) {
      wrapperStyle += ` width: ${this.options.width};`;
    }
    if (this.options.maxWidth) {
      wrapperStyle += ` max-width: ${this.options.maxWidth};`;
    }

    const dropdownButtonClass = this.applyCustomClasses(
      'phone-lib-dropdown-button',
      this.options.customClasses?.dropdownButton
    );
    let dropdownButtonStyle = this.applyCustomStyles(this.options.customStyles?.dropdownButton);
    if (this.options.dropdownWidth) {
      dropdownButtonStyle += ` min-width: ${this.options.dropdownWidth}; width: ${this.options.dropdownWidth};`;
    }

    const inputClass = this.applyCustomClasses(
      'phone-lib-input',
      this.options.customClasses?.input
    );
    let inputStyle = this.applyCustomStyles(this.options.customStyles?.input);
    if (this.options.inputWidth) {
      inputStyle += ` width: ${this.options.inputWidth};`;
    }

    this.container.innerHTML = `
      <div class="${wrapperClass}" ${wrapperStyle ? `style="${wrapperStyle}"` : ''}>
        <div class="phone-lib-dropdown-container">
          <button type="button" class="${dropdownButtonClass}" ${dropdownButtonStyle ? `style="${dropdownButtonStyle}"` : ''} aria-expanded="false" ${this.isDisabled ? 'disabled' : ''} aria-label="${this.options.ariaLabels.dropdownButton}">
            <span class="phone-lib-flag">${selectedCountryData?.flag || defaultFlag}</span>
            ${this.options.showDialCode ? `<span class="phone-lib-dial-code">+${selectedCountryData?.dialCode || ''}</span>` : ''}
            <span class="phone-lib-arrow">${this.getArrowIcon()}</span>
          </button>
          <div class="phone-lib-dropdown-menu" style="display: none;">
            <div class="phone-lib-countries-list">
              ${this.countries.map(country => `
                <div 
                  class="phone-lib-country-item ${country.iso2 === this.selectedCountry ? 'selected' : ''} ${country.disabled ? 'disabled' : ''}" 
                  data-iso2="${country.iso2}"
                  data-dial-code="${country.dialCode}"
                  ${country.disabled ? 'style="opacity: 0.5; cursor: not-allowed;"' : ''}
                  role="option"
                  aria-selected="${country.iso2 === this.selectedCountry}"
                >
                  <span class="phone-lib-flag">${country.flag}</span>
                  <span class="phone-lib-country-name">${country.name}</span>
                  ${this.options.showDialCode ? `<span class="phone-lib-country-dial-code">+${country.dialCode}</span>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        <div class="phone-lib-input-container">
          <input 
            type="tel" 
            class="${inputClass}" 
            ${inputStyle ? `style="${inputStyle}"` : ''}
            placeholder="${this.options.placeholder || this.getPlaceholder()}"
            autocomplete="tel"
            ${this.isDisabled ? 'disabled' : ''}
            ${this.isReadonly ? 'readonly' : ''}
            aria-label="${this.options.ariaLabels?.input || 'Número de teléfono'}"
          />
          ${this.options.showHint ? `<div class="phone-lib-hint"></div>` : ''}
        </div>
      </div>
    `;

    this.attachReferences();
  }

  /**
   * Renderiza el layout con campos separados
   */
  renderSeparated() {
    const selectedCountryData = this.countries.find(c => c.iso2 === this.selectedCountry);
    const defaultFlag = this.getFlagImage('UN');

    // Determinar las columnas del grid según si se muestra el código
    let gridColumns = this.options.gridColumns || (this.options.showDialCode ? '2fr 1fr 2fr' : '1fr 2fr');

    const wrapperClass = this.applyCustomClasses(
      'phone-lib-wrapper phone-lib-layout-separated',
      this.options.customClasses?.wrapper
    );

    // Aplicar estilos personalizados y anchos
    let wrapperStyle = this.applyCustomStyles(this.options.customStyles?.wrapper);
    if (this.options.width) {
      wrapperStyle += ` width: ${this.options.width};`;
    }
    if (this.options.maxWidth) {
      wrapperStyle += ` max-width: ${this.options.maxWidth};`;
    }

    const rowStyle = this.applyCustomStyles(this.options.customStyles?.row);
    const finalRowStyle = `grid-template-columns: ${gridColumns};${rowStyle ? ` ${rowStyle}` : ''}`;

    const dropdownButtonClass = this.applyCustomClasses(
      'phone-lib-dropdown-button-separated',
      this.options.customClasses?.dropdownButton
    );
    let dropdownButtonStyle = this.applyCustomStyles(this.options.customStyles?.dropdownButton);
    if (this.options.countryWidth) {
      dropdownButtonStyle += ` width: ${this.options.countryWidth};`;
    }

    const dialCodeInputClass = this.applyCustomClasses(
      'phone-lib-dial-code-input',
      this.options.customClasses?.dialCodeInput
    );
    let dialCodeInputStyle = this.applyCustomStyles(this.options.customStyles?.dialCodeInput);
    if (this.options.dialCodeWidth) {
      dialCodeInputStyle += ` width: ${this.options.dialCodeWidth};`;
    }

    const inputClass = this.applyCustomClasses(
      'phone-lib-input-separated',
      this.options.customClasses?.input
    );
    let inputStyle = this.applyCustomStyles(this.options.customStyles?.input);
    if (this.options.phoneWidth) {
      inputStyle += ` width: ${this.options.phoneWidth};`;
    }

    this.container.innerHTML = `
      <div class="${wrapperClass}" ${wrapperStyle ? `style="${wrapperStyle}"` : ''}>
        <div class="phone-lib-separated-row" style="${finalRowStyle}">
          <div class="phone-lib-field-group">
            <label class="phone-lib-label">${this.options.countryLabel}</label>
            <div class="phone-lib-dropdown-container">
              <button type="button" class="${dropdownButtonClass}" ${dropdownButtonStyle ? `style="${dropdownButtonStyle}"` : ''} aria-expanded="false" ${this.isDisabled ? 'disabled' : ''} aria-label="${this.options.ariaLabels.dropdownButton}">
                <span class="phone-lib-flag">${selectedCountryData?.flag || defaultFlag}</span>
                <span class="phone-lib-country-name-display">${selectedCountryData?.name || ''}</span>
                <span class="phone-lib-arrow">${this.getArrowIcon()}</span>
              </button>
              <div class="phone-lib-dropdown-menu" style="display: none;">
                <div class="phone-lib-countries-list">
                  ${this.countries.map(country => `
                    <div 
                      class="phone-lib-country-item ${country.iso2 === this.selectedCountry ? 'selected' : ''} ${country.disabled ? 'disabled' : ''}" 
                      data-iso2="${country.iso2}"
                      data-dial-code="${country.dialCode}"
                      ${country.disabled ? 'style="opacity: 0.5; cursor: not-allowed;"' : ''}
                      role="option"
                      aria-selected="${country.iso2 === this.selectedCountry}"
                    >
                      <span class="phone-lib-flag">${country.flag}</span>
                      <span class="phone-lib-country-name">${country.name}</span>
                      ${this.options.showDialCode ? `<span class="phone-lib-country-dial-code">+${country.dialCode}</span>` : ''}
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
          
          ${this.options.showDialCode ? `
          <div class="phone-lib-field-group">
            <label class="phone-lib-label">${this.options.dialCodeLabel}</label>
            <input 
              type="text" 
              class="${dialCodeInputClass}" 
              ${dialCodeInputStyle ? `style="${dialCodeInputStyle}"` : ''}
              value="+${selectedCountryData?.dialCode || ''}"
              readonly
              disabled
              aria-label="${this.options.ariaLabels?.dialCodeInput || 'Código de marcación'}"
            />
          </div>
          ` : ''}
          
          <div class="phone-lib-field-group phone-lib-field-group-phone">
            <label class="phone-lib-label">${this.options.phoneLabel}</label>
            <input 
              type="tel" 
              class="${inputClass}" 
              ${inputStyle ? `style="${inputStyle}"` : ''}
              placeholder="${this.options.placeholder || this.getPlaceholder()}"
              autocomplete="tel"
              ${this.isDisabled ? 'disabled' : ''}
              ${this.isReadonly ? 'readonly' : ''}
              aria-label="${this.options.ariaLabels.input}"
            />
            ${this.options.showHint ? `<div class="phone-lib-hint"></div>` : ''}
          </div>
        </div>
      </div>
    `;

    this.attachReferences();
  }

  /**
   * Adjunta las referencias a los elementos del DOM
   */
  attachReferences() {

    // Guardar referencias (compatibles con ambos layouts)
    this.dropdownButton = this.container.querySelector('.phone-lib-dropdown-button') ||
      this.container.querySelector('.phone-lib-dropdown-button-separated');
    this.dropdownMenu = this.container.querySelector('.phone-lib-dropdown-menu');
    this.countriesList = this.container.querySelector('.phone-lib-countries-list');
    this.phoneInput = this.container.querySelector('.phone-lib-input') ||
      this.container.querySelector('.phone-lib-input-separated');
    this.hintElement = this.container.querySelector('.phone-lib-hint');
    this.dialCodeInput = this.container.querySelector('.phone-lib-dial-code-input');
  }

  /**
   * Obtiene el placeholder según el país
   */
  getPlaceholder() {
    try {
      const formatter = new AsYouType(this.selectedCountry);
      const example = formatter.input('1234567890');
      return example || 'Ingrese número telefónico';
    } catch (e) {
      return 'Ingrese número telefónico';
    }
  }

  /**
   * Adjunta los event listeners
   */
  attachEventListeners() {
    // Remover listeners anteriores si existen (para evitar duplicados)
    if (this._boundHandlers) {
      this.removeEventListeners();
    }

    // Guardar referencias a handlers para poder removerlos después
    this._boundHandlers = {
      dropdownClick: (e) => {
        if (this.isDisabled) return;
        e.stopPropagation();
        this.toggleDropdown();
      },
      documentClick: (e) => {
        if (!this.container.contains(e.target)) {
          this.closeDropdown();
        }
      }
    };

    // Toggle dropdown
    if (this.dropdownButton) {
      this.dropdownButton.addEventListener('click', this._boundHandlers.dropdownClick);
    }

    // Cerrar dropdown al hacer click fuera
    document.addEventListener('click', this._boundHandlers.documentClick);

    // Seleccionar país
    const countryItems = this.container.querySelectorAll('.phone-lib-country-item');
    this._countryItemHandlers = [];
    countryItems.forEach(item => {
      const handler = () => {
        if (item.classList.contains('disabled')) {
          return; // No permitir seleccionar países deshabilitados
        }
        const iso2 = item.dataset.iso2;
        const dialCode = item.dataset.dialCode;
        if (iso2 && dialCode) {
          this.selectCountry(iso2, dialCode);
        }
      };
      item.addEventListener('click', handler);
      this._countryItemHandlers.push({ item, handler });
    });

    // Input de teléfono
    if (this.phoneInput) {
      // Handler para prevenir entrada de caracteres no numéricos
      this._boundHandlers.phoneKeyDown = (e) => {
        if (this.isDisabled || this.isReadonly) return;

        // Permitir teclas especiales (Backspace, Delete, Arrow keys, Tab, etc.)
        const allowedKeys = [
          'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
          'Home', 'End', 'Tab', 'Escape', 'Enter'
        ];

        // Permitir Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        if (e.ctrlKey || e.metaKey) {
          if (['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
            return; // Permitir
          }
        }

        // Si es una tecla permitida, dejar pasar
        if (allowedKeys.includes(e.key)) {
          return;
        }

        // Permitir números (0-9)
        if (e.key >= '0' && e.key <= '9') {
          return;
        }

        // Permitir + solo al inicio del input
        if (e.key === '+') {
          const currentValue = e.target.value;
          const selectionStart = e.target.selectionStart;
          // Solo permitir + si está al inicio o si no hay ningún carácter antes de la posición del cursor
          if (selectionStart === 0 || currentValue.substring(0, selectionStart).trim() === '') {
            return;
          }
        }

        // Si llegamos aquí, prevenir la entrada
        e.preventDefault();
      };

      this._boundHandlers.phoneInput = (e) => {
        if (this.isDisabled || this.isReadonly) return;

        // Obtener el valor actual del input
        let inputValue = e.target.value;

        // Filtrar caracteres no numéricos (permitir números y +)
        // Remover cualquier carácter que no sea número o +
        inputValue = inputValue.replace(/[^0-9+]/g, '');

        // Si el valor cambió después de filtrar, actualizar el input
        if (inputValue !== e.target.value) {
          const cursorPosition = e.target.selectionStart;
          e.target.value = inputValue;
          // Restaurar posición del cursor (ajustada por caracteres removidos)
          const newPosition = Math.min(cursorPosition, inputValue.length);
          e.target.setSelectionRange(newPosition, newPosition);
        }

        // Procesar el input
        this.handlePhoneInput(inputValue);

        // Validación en tiempo real si está habilitada
        if (this.options.validateOnInput) {
          this.validatePhone();
        }
      };

      this._boundHandlers.phoneFocus = () => {
        this.executeCallback('onFocus');
        this.emitEvent('focus');
      };

      this._boundHandlers.phoneBlur = () => {
        const isValid = this.validatePhone();
        this.executeCallback('onBlur', this.phoneNumber, isValid);
        this.emitEvent('blur', { phoneNumber: this.phoneNumber, isValid });
      };

      this.phoneInput.addEventListener('keydown', this._boundHandlers.phoneKeyDown);
      this.phoneInput.addEventListener('input', this._boundHandlers.phoneInput);
      this.phoneInput.addEventListener('focus', this._boundHandlers.phoneFocus);
      this.phoneInput.addEventListener('blur', this._boundHandlers.phoneBlur);
    }

    // Navegación por teclado en dropdown
    this.setupKeyboardNavigation();
  }

  /**
   * Remueve los event listeners
   */
  removeEventListeners() {
    // Remover listeners del botón
    if (this.dropdownButton && this._boundHandlers?.dropdownClick) {
      this.dropdownButton.removeEventListener('click', this._boundHandlers.dropdownClick);
    }

    // Remover listener del document
    if (this._boundHandlers?.documentClick) {
      document.removeEventListener('click', this._boundHandlers.documentClick);
    }

    // Remover listeners de items de países
    if (this._countryItemHandlers) {
      this._countryItemHandlers.forEach(({ item, handler }) => {
        item.removeEventListener('click', handler);
      });
      this._countryItemHandlers = [];
    }

    // Remover listeners del input
    if (this.phoneInput && this._boundHandlers) {
      if (this._boundHandlers.phoneKeyDown) {
        this.phoneInput.removeEventListener('keydown', this._boundHandlers.phoneKeyDown);
      }
      if (this._boundHandlers.phoneInput) {
        this.phoneInput.removeEventListener('input', this._boundHandlers.phoneInput);
      }
      if (this._boundHandlers.phoneFocus) {
        this.phoneInput.removeEventListener('focus', this._boundHandlers.phoneFocus);
      }
      if (this._boundHandlers.phoneBlur) {
        this.phoneInput.removeEventListener('blur', this._boundHandlers.phoneBlur);
      }
    }

    // Remover listeners de teclado
    if (this._keyboardHandlers) {
      if (this.dropdownButton && this._keyboardHandlers.buttonKeydown) {
        this.dropdownButton.removeEventListener('keydown', this._keyboardHandlers.buttonKeydown);
      }
      if (this.dropdownMenu && this._keyboardHandlers.menuKeydown) {
        this.dropdownMenu.removeEventListener('keydown', this._keyboardHandlers.menuKeydown);
      }
    }
  }

  /**
   * Configura navegación por teclado
   */
  setupKeyboardNavigation() {
    if (!this.dropdownButton) return;

    // Guardar handlers para poder removerlos después
    this._keyboardHandlers = {
      buttonKeydown: (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleDropdown();
        } else if (e.key === 'Escape') {
          this.closeDropdown();
        }
      },
      menuKeydown: (e) => {
        const items = Array.from(this.container.querySelectorAll('.phone-lib-country-item:not([style*="display: none"])'));
        if (items.length === 0) return;

        const currentIndex = items.findIndex(item => item.classList.contains('selected'));

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIndex = (currentIndex + 1) % items.length;
          const nextItem = items[nextIndex];
          if (nextItem && !nextItem.classList.contains('disabled')) {
            nextItem.click();
            nextItem.scrollIntoView({ block: 'nearest' });
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
          const prevItem = items[prevIndex];
          if (prevItem && !prevItem.classList.contains('disabled')) {
            prevItem.click();
            prevItem.scrollIntoView({ block: 'nearest' });
          }
        } else if (e.key === 'Escape') {
          this.closeDropdown();
        }
      }
    };

    this.dropdownButton.addEventListener('keydown', this._keyboardHandlers.buttonKeydown);

    // Navegación con flechas en el dropdown
    if (this.dropdownMenu) {
      this.dropdownMenu.addEventListener('keydown', this._keyboardHandlers.menuKeydown);
    }
  }

  /**
   * Maneja el input del teléfono
   */
  handlePhoneInput(value) {
    const previousNumber = this.phoneNumber;
    const previousCountry = this.selectedCountry;
    this.phoneNumber = value;

    // Detección automática de país si está habilitada
    // IMPORTANTE: Hacer esto ANTES de formatear para que el formateo use el país correcto
    if (this.options.autoDetectCountry && value) {
      this.autoDetectCountry(value);
    }

    // Actualizar el número formateado (usará el país correcto si se detectó)
    this.updatePhoneNumber();

    // Ejecutar callbacks y eventos (validar sin actualizar visuals para obtener estado actual)
    const isValid = this.phoneNumber ? this.validatePhone(false) : false;

    // Emitir evento de cambio de país si cambió
    if (previousCountry !== this.selectedCountry) {
      const dialCode = this.getDialCode();
      const countryData = this.countries.find(c => c.iso2 === this.selectedCountry);
      this.executeCallback('onCountryChange', this.selectedCountry, dialCode, countryData?.name);
      this.emitEvent('countryChange', {
        country: this.selectedCountry,
        dialCode,
        countryName: countryData?.name,
        previousCountry
      });
    }

    this.executeCallback('onPhoneChange', this.phoneNumber, isValid, this.selectedCountry);
    this.emitEvent('phoneChange', {
      phoneNumber: this.phoneNumber,
      isValid,
      country: this.selectedCountry,
      previousNumber
    });
  }

  /**
   * Detecta automáticamente el país desde el número ingresado
   */
  autoDetectCountry(phoneNumber) {
    try {
      // Intentar parsear el número sin país específico
      // Si el número empieza con +, intentar detectar el país
      if (phoneNumber.startsWith('+')) {
        const parsed = parsePhoneNumber(phoneNumber);
        if (parsed && parsed.country) {
          const detectedCountry = parsed.country;
          // Verificar que el país detectado esté disponible (no deshabilitado/excluido)
          const countryAvailable = this.countries.find(c => c.iso2 === detectedCountry && !c.disabled);
          if (countryAvailable && detectedCountry !== this.selectedCountry) {
            const dialCode = getCountryCallingCode(detectedCountry);
            this.selectCountry(detectedCountry, dialCode, true); // true = sin emitir evento (ya se emitirá en handlePhoneInput)
          }
        }
      }
    } catch (e) {
      // Si no se puede detectar, mantener el país actual
    }
  }

  /**
   * Actualiza el número de teléfono y formatea
   */
  updatePhoneNumber() {
    if (!this.phoneInput) return;

    if (!this.phoneNumber) {
      if (this.phoneInput.value !== '') {
        this.phoneInput.value = '';
      }
      if (this.hintElement) {
        this.hintElement.textContent = '';
      }
      return;
    }

    try {
      // Si el número empieza con +, intentar detectar el país para formatear correctamente
      let countryForFormatting = this.selectedCountry;
      if (this.phoneNumber && this.phoneNumber.startsWith('+')) {
        try {
          const parsed = parsePhoneNumber(this.phoneNumber);
          if (parsed && parsed.country) {
            // Usar el país detectado para formatear, si está disponible
            const detectedCountry = parsed.country;
            const countryAvailable = this.countries.find(c => c.iso2 === detectedCountry && !c.disabled);
            if (countryAvailable) {
              countryForFormatting = detectedCountry;
            }
          }
        } catch (e) {
          // Si no se puede detectar, usar el país seleccionado actual
        }
      }

      const formatter = new AsYouType(countryForFormatting);
      const formatted = formatter.input(this.phoneNumber);

      // Solo actualizar si el valor formateado es diferente
      if (formatted && formatted !== this.phoneInput.value) {
        // Guardar la posición del cursor antes de actualizar
        const cursorPosition = this.phoneInput.selectionStart;
        const inputLength = this.phoneInput.value.length;
        const wasAtEnd = cursorPosition === inputLength;

        // Actualizar el valor
        this.phoneInput.value = formatted;

        // Restaurar la posición del cursor de manera inteligente
        if (wasAtEnd) {
          // Si estaba al final, mantenerlo al final
          this.phoneInput.setSelectionRange(formatted.length, formatted.length);
        } else {
          // Intentar mantener la posición relativa
          // Calcular la nueva posición basada en la diferencia de longitud
          const lengthDiff = formatted.length - inputLength;
          const newPosition = Math.max(0, Math.min(cursorPosition + lengthDiff, formatted.length));
          this.phoneInput.setSelectionRange(newPosition, newPosition);
        }
      }

      // Actualizar hint
      if (this.hintElement) {
        const isValid = this.validatePhone(false); // false = no actualizar clases visuales todavía
        this.hintElement.textContent = isValid
          ? this.options.messages.valid
          : this.options.messages.invalid;
        this.hintElement.className = `phone-lib-hint ${isValid ? 'valid' : 'invalid'}`;
      }
    } catch (e) {
      // Ignorar errores de formato
    }
  }

  /**
   * Valida el número de teléfono
   */
  validatePhone(updateVisuals = true) {
    if (!this.phoneNumber) {
      this.isValid = false;
      if (updateVisuals && this.phoneInput) {
        this.phoneInput.classList.remove('phone-lib-input-invalid', 'phone-lib-input-valid');
      }
      return false;
    }

    try {
      const phoneNumber = parsePhoneNumber(this.phoneNumber, this.selectedCountry);
      const isValid = phoneNumber.isValid();
      const previousValid = this._isValid;
      this._isValid = isValid;

      if (updateVisuals && this.phoneInput) {
        this.phoneInput.classList.toggle('phone-lib-input-invalid', !isValid);
        this.phoneInput.classList.toggle('phone-lib-input-valid', isValid);
      }

      // Emitir evento de cambio de validación solo si cambió
      if (previousValid !== isValid) {
        this.executeCallback('onValidationChange', isValid, this.phoneNumber);
        this.emitEvent('validationChange', { isValid, phoneNumber: this.phoneNumber });
      }

      return isValid;
    } catch (e) {
      this._isValid = false;
      if (updateVisuals && this.phoneInput) {
        this.phoneInput.classList.add('phone-lib-input-invalid');
        this.phoneInput.classList.remove('phone-lib-input-valid');
      }
      return false;
    }
  }

  /**
   * Toggle del dropdown
   */
  toggleDropdown() {
    const isOpen = this.dropdownMenu.style.display !== 'none';
    if (isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  /**
   * Abre el dropdown
   */
  openDropdown() {
    if (this.isDisabled) return;

    this.dropdownMenu.style.display = 'block';
    this.dropdownButton.setAttribute('aria-expanded', 'true');
    this.dropdownButton.classList.add('active');

    // Scroll al país seleccionado
    const selectedItem = this.container.querySelector('.phone-lib-country-item.selected');
    if (selectedItem) {
      selectedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  /**
   * Cierra el dropdown
   */
  closeDropdown() {
    this.dropdownMenu.style.display = 'none';
    this.dropdownButton.setAttribute('aria-expanded', 'false');
    this.dropdownButton.classList.remove('active');
  }

  /**
   * Selecciona un país
   */
  selectCountry(iso2, dialCode, silent = false) {
    // Validar que el país existe
    if (!iso2 || !dialCode) {
      console.warn('PhoneLib: selectCountry requiere iso2 y dialCode válidos');
      return;
    }

    const previousCountry = this.selectedCountry;
    this.selectedCountry = iso2;

    // Actualizar botón según el layout
    const countryData = this.countries.find(c => c.iso2 === iso2);

    // Si el país no se encuentra, usar valores por defecto
    if (!countryData) {
      console.warn(`PhoneLib: País ${iso2} no encontrado en la lista`);
      return;
    }

    if (this.options.layout === 'separated') {
      // Layout separado: actualizar flag, nombre del país y código de marcación (si está visible)
      const flagElement = this.dropdownButton.querySelector('.phone-lib-flag');
      const nameElement = this.dropdownButton.querySelector('.phone-lib-country-name-display');

      if (flagElement && countryData) {
        flagElement.innerHTML = countryData.flag;
      }
      if (nameElement && countryData) {
        nameElement.textContent = countryData.name;
      }
      if (this.dialCodeInput && countryData && this.options.showDialCode) {
        this.dialCodeInput.value = `+${dialCode}`;
      }
    } else {
      // Layout integrado: actualizar flag y código de marcación (si está visible)
      const flagElement = this.dropdownButton.querySelector('.phone-lib-flag');
      const dialCodeElement = this.dropdownButton.querySelector('.phone-lib-dial-code');

      if (flagElement && countryData) {
        flagElement.innerHTML = countryData.flag;
      }
      if (dialCodeElement && this.options.showDialCode) {
        dialCodeElement.textContent = `+${dialCode}`;
      }
    }

    // Actualizar selección en lista
    const countryItems = this.container.querySelectorAll('.phone-lib-country-item');
    countryItems.forEach(item => {
      item.classList.toggle('selected', item.dataset.iso2 === iso2);
    });

    // Cerrar dropdown
    this.closeDropdown();

    // Actualizar placeholder y formato (solo si el input existe)
    if (this.phoneInput) {
      this.phoneInput.placeholder = this.getPlaceholder();
      this.updatePhoneNumber();
    }

    // Ejecutar callbacks y eventos solo si no es silencioso
    if (!silent) {
      this.executeCallback('onCountryChange', iso2, dialCode, countryData?.name);
      this.emitEvent('countryChange', {
        country: iso2,
        dialCode: `+${dialCode}`,
        countryName: countryData?.name,
        previousCountry
      });
    }
  }

  // ========== API PÚBLICA ==========

  /**
   * Devuelve el país seleccionado (ISO2)
   */
  getCountry() {
    return this.selectedCountry;
  }

  /**
   * Devuelve el código de marcación del país
   */
  getDialCode() {
    const countryData = this.countries.find(c => c.iso2 === this.selectedCountry);
    return countryData ? `+${countryData.dialCode}` : '';
  }

  /**
   * Devuelve el número ingresado sin formato (solo dígitos)
   */
  getRaw() {
    if (!this.phoneNumber) {
      return '';
    }
    // Extraer solo los dígitos del número
    return this.phoneNumber.replace(/\D/g, '');
  }

  /**
   * Devuelve el número en formato E.164
   */
  getE164() {
    if (!this.phoneNumber) {
      return '';
    }

    try {
      const phoneNumber = parsePhoneNumber(this.phoneNumber, this.selectedCountry);
      return phoneNumber.number || '';
    } catch (e) {
      return '';
    }
  }

  /**
   * Devuelve true/false según si el número es válido
   */
  isValid() {
    // Usar el estado actual si está disponible, sino validar sin actualizar visuals
    if (this.phoneNumber) {
      return this.validatePhone(false);
    }
    return false;
  }

  /**
   * Devuelve el número en formato internacional
   */
  formatInternational() {
    if (!this.phoneNumber) {
      return '';
    }

    try {
      const phoneNumber = parsePhoneNumber(this.phoneNumber, this.selectedCountry);
      return phoneNumber.formatInternational() || '';
    } catch (e) {
      return '';
    }
  }

  /**
   * Devuelve el número en formato nacional
   */
  formatNational() {
    if (!this.phoneNumber) {
      return '';
    }

    try {
      const phoneNumber = parsePhoneNumber(this.phoneNumber, this.selectedCountry);
      return phoneNumber.formatNational() || '';
    } catch (e) {
      return '';
    }
  }

  /**
   * Devuelve el número en formato RFC3966
   */
  formatRFC3966() {
    if (!this.phoneNumber) {
      return '';
    }

    try {
      const phoneNumber = parsePhoneNumber(this.phoneNumber, this.selectedCountry);
      return phoneNumber.format('RFC3966') || '';
    } catch (e) {
      return '';
    }
  }

  /**
   * Devuelve el tipo de número (MOBILE, FIXED_LINE, etc.)
   */
  getNumberType() {
    if (!this.phoneNumber) {
      return null;
    }

    try {
      const phoneNumber = parsePhoneNumber(this.phoneNumber, this.selectedCountry);
      return phoneNumber.getType() || null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Devuelve información completa del número en un objeto
   */
  getInfo() {
    const countryData = this.countries.find(c => c.iso2 === this.selectedCountry);

    return {
      country: this.selectedCountry,
      dialCode: this.getDialCode(),
      raw: this.getRaw(),
      e164: this.getE164(),
      international: this.formatInternational(),
      national: this.formatNational(),
      rfc3966: this.formatRFC3966(),
      isValid: this._isValid,
      type: this.getNumberType(),
      countryName: countryData?.name || this.selectedCountry
    };
  }

  /**
   * Devuelve metadata del país seleccionado
   */
  getCountryMetadata() {
    const countryData = this.countries.find(c => c.iso2 === this.selectedCountry);
    if (!countryData) {
      return null;
    }

    return {
      iso2: countryData.iso2,
      name: countryData.name,
      dialCode: `+${countryData.dialCode}`,
      flag: countryData.flag
    };
  }

  // ========== MÉTODOS DE CONTROL PROGRAMÁTICO ==========

  /**
   * Establece el país programáticamente
   */
  setCountry(iso2) {
    const countryData = this.countries.find(c => c.iso2 === iso2);
    if (!countryData) {
      console.warn(`País ${iso2} no encontrado`);
      return;
    }

    this.selectCountry(iso2, countryData.dialCode);
  }

  /**
   * Establece el número telefónico programáticamente
   */
  setPhoneNumber(number) {
    if (this.isDisabled || this.isReadonly) {
      return;
    }

    // Filtrar caracteres no numéricos (permitir números y +)
    const filteredNumber = typeof number === 'string' ? number.replace(/[^0-9+]/g, '') : (number || '').toString().replace(/[^0-9+]/g, '');

    this.phoneNumber = filteredNumber;
    if (this.phoneInput) {
      this.phoneInput.value = filteredNumber;
    }
    this.updatePhoneNumber();

    // Ejecutar callbacks
    const isValid = this._isValid;
    this.executeCallback('onPhoneChange', this.phoneNumber, isValid, this.selectedCountry);
    this.emitEvent('phoneChange', {
      phoneNumber: this.phoneNumber,
      isValid,
      country: this.selectedCountry
    });
  }

  /**
   * Establece país y número juntos
   */
  setValue(country, number) {
    this.setCountry(country);
    this.setPhoneNumber(number);
  }

  /**
   * Habilita el componente
   */
  enable() {
    this.isDisabled = false;

    if (this.phoneInput) {
      this.phoneInput.disabled = false;
    }
    if (this.dropdownButton) {
      this.dropdownButton.disabled = false;
    }
    if (this.container) {
      this.container.classList.remove('phone-lib-disabled');
    }
  }

  /**
   * Deshabilita el componente
   */
  disable() {
    this.isDisabled = true;

    if (this.phoneInput) {
      this.phoneInput.disabled = true;
    }
    if (this.dropdownButton) {
      this.dropdownButton.disabled = true;
    }
    if (this.container) {
      this.container.classList.add('phone-lib-disabled');
    }

    this.closeDropdown();
  }

  /**
   * Establece modo solo lectura
   */
  setReadonly(readonly) {
    this.isReadonly = readonly;

    if (this.phoneInput) {
      this.phoneInput.readOnly = readonly;
    }
    if (this.container) {
      this.container.classList.toggle('phone-lib-readonly', readonly);
    }
  }

  /**
   * Resetea a valores iniciales
   */
  reset() {
    this.selectedCountry = this.options.initialCountry;
    this.phoneNumber = '';
    this.isValid = false;

    if (this.phoneInput) {
      this.phoneInput.value = '';
    }

    // Re-renderizar para actualizar visualmente
    this.render();
    this.attachEventListeners();

    // Ejecutar callbacks
    this.executeCallback('onCountryChange', this.selectedCountry, this.getDialCode());
    this.executeCallback('onPhoneChange', '', false, this.selectedCountry);
  }

  /**
   * Destruye la instancia y limpia recursos
   */
  destroy() {
    // Remover todos los event listeners
    this.removeEventListeners();

    // Limpiar contenedor
    if (this.container) {
      this.container.innerHTML = '';
    }

    // Limpiar referencias
    this.dropdownButton = null;
    this.dropdownMenu = null;
    this.phoneInput = null;
    this.hintElement = null;
    this.dialCodeInput = null;
    this.countriesList = null;
    this._boundHandlers = null;
    this._countryItemHandlers = null;
    this._keyboardHandlers = null;
  }

  /**
   * Actualiza opciones dinámicamente
   */
  updateOptions(newOptions) {
    // Preservar el valor actual del teléfono y país antes de cualquier cambio
    const savedPhoneNumber = this.phoneNumber || '';
    const savedCountry = this.selectedCountry || this.options.initialCountry || 'US';

    // Actualizar opciones
    this.options = { ...this.options, ...newOptions };

    // Re-aplicar estados si cambiaron
    if (newOptions.disabled !== undefined) {
      this.isDisabled = newOptions.disabled;
      if (this.isDisabled) {
        this.disable();
      } else {
        this.enable();
      }
    }

    if (newOptions.readonly !== undefined) {
      this.setReadonly(newOptions.readonly);
    }

    // Si cambió el país inicial, actualizar
    if (newOptions.initialCountry && newOptions.initialCountry !== this.selectedCountry) {
      this.setCountry(newOptions.initialCountry);
    }

    // Si se proporciona un número inicial, usarlo
    if (newOptions.initialPhoneNumber !== undefined) {
      this.phoneNumber = newOptions.initialPhoneNumber;
    }

    // Re-renderizar si cambió layout u opciones visuales importantes
    if (newOptions.layout || newOptions.showDialCode !== undefined || newOptions.customClasses || newOptions.customStyles || newOptions.arrowIcon !== undefined) {
      this.render();
      this.attachEventListeners();

      // Restaurar el valor del teléfono después de re-renderizar
      // Si no se proporcionó un nuevo initialPhoneNumber, restaurar el valor guardado
      if (newOptions.initialPhoneNumber === undefined && savedPhoneNumber) {
        this.setPhoneNumber(savedPhoneNumber);
      } else if (newOptions.initialPhoneNumber !== undefined) {
        this.setPhoneNumber(newOptions.initialPhoneNumber);
      }

      // Asegurar que el país también esté correcto
      if (this.selectedCountry !== savedCountry && newOptions.initialCountry === undefined) {
        this.setCountry(savedCountry);
      }
    }
  }
}

// Exportar para uso en módulos ES6
export default PhoneLib;

// También exportar para uso global si se carga directamente
if (typeof window !== 'undefined') {
  window.PhoneLib = PhoneLib;
}
