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
    this.phoneNumber = '';
    this.isValid = false;
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
      'US': 'Estados Unidos',
      'CO': 'Colombia',
      'ES': 'España',
      'MX': 'México',
      'AR': 'Argentina',
      'CL': 'Chile',
      'PE': 'Perú',
      'VE': 'Venezuela',
      'EC': 'Ecuador',
      'BO': 'Bolivia',
      'PY': 'Paraguay',
      'UY': 'Uruguay',
      'CR': 'Costa Rica',
      'PA': 'Panamá',
      'GT': 'Guatemala',
      'HN': 'Honduras',
      'NI': 'Nicaragua',
      'SV': 'El Salvador',
      'DO': 'República Dominicana',
      'CU': 'Cuba',
      'PR': 'Puerto Rico',
      'BR': 'Brasil',
      'CA': 'Canadá',
      'GB': 'Reino Unido',
      'FR': 'Francia',
      'DE': 'Alemania',
      'IT': 'Italia',
      'PT': 'Portugal',
      'NL': 'Países Bajos',
      'BE': 'Bélgica',
      'CH': 'Suiza',
      'AT': 'Austria',
      'SE': 'Suecia',
      'NO': 'Noruega',
      'DK': 'Dinamarca',
      'FI': 'Finlandia',
      'PL': 'Polonia',
      'CZ': 'República Checa',
      'GR': 'Grecia',
      'IE': 'Irlanda',
      'NZ': 'Nueva Zelanda',
      'AU': 'Australia',
      'JP': 'Japón',
      'CN': 'China',
      'IN': 'India',
      'KR': 'Corea del Sur',
      'SG': 'Singapur',
      'MY': 'Malasia',
      'TH': 'Tailandia',
      'PH': 'Filipinas',
      'ID': 'Indonesia',
      'VN': 'Vietnam',
      'AE': 'Emiratos Árabes Unidos',
      'SA': 'Arabia Saudí',
      'IL': 'Israel',
      'TR': 'Turquía',
      'RU': 'Rusia',
      'ZA': 'Sudáfrica',
      'EG': 'Egipto',
      'NG': 'Nigeria',
      'KE': 'Kenia',
      'GH': 'Ghana'
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
    this.updatePhoneNumber();

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

  renderIntegrated() {
    const selectedCountryData = this.countries.find(c => c.iso2 === this.selectedCountry);
    const defaultFlag = this.getFlagImage('UN');

    const wrapperClass = this.applyCustomClasses(
      'phone-lib-wrapper phone-lib-layout-integrated',
      this.options.customClasses?.wrapper
    );
    const wrapperStyle = this.applyCustomStyles(this.options.customStyles?.wrapper);

    const dropdownButtonClass = this.applyCustomClasses(
      'phone-lib-dropdown-button',
      this.options.customClasses?.dropdownButton
    );
    const dropdownButtonStyle = this.applyCustomStyles(this.options.customStyles?.dropdownButton);

    const inputClass = this.applyCustomClasses(
      'phone-lib-input',
      this.options.customClasses?.input
    );
    const inputStyle = this.applyCustomStyles(this.options.customStyles?.input);

    this.container.innerHTML = `
      <div class="${wrapperClass}" ${wrapperStyle ? `style="${wrapperStyle}"` : ''}>
        <div class="phone-lib-dropdown-container">
          <button type="button" class="${dropdownButtonClass}" ${dropdownButtonStyle ? `style="${dropdownButtonStyle}"` : ''} aria-expanded="false" ${this.isDisabled ? 'disabled' : ''} aria-label="${this.options.ariaLabels.dropdownButton}">
            <span class="phone-lib-flag">${selectedCountryData?.flag || defaultFlag}</span>
            ${this.options.showDialCode ? `<span class="phone-lib-dial-code">+${selectedCountryData?.dialCode || ''}</span>` : ''}
            <span class="phone-lib-arrow">▼</span>
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
    const gridColumns = this.options.showDialCode ? '2fr 1fr 2fr' : '1fr 2fr';

    const wrapperClass = this.applyCustomClasses(
      'phone-lib-wrapper phone-lib-layout-separated',
      this.options.customClasses?.wrapper
    );
    const wrapperStyle = this.applyCustomStyles(this.options.customStyles?.wrapper);

    const rowStyle = this.applyCustomStyles(this.options.customStyles?.row);
    const finalRowStyle = `grid-template-columns: ${gridColumns};${rowStyle ? ` ${rowStyle}` : ''}`;

    const dropdownButtonClass = this.applyCustomClasses(
      'phone-lib-dropdown-button-separated',
      this.options.customClasses?.dropdownButton
    );
    const dropdownButtonStyle = this.applyCustomStyles(this.options.customStyles?.dropdownButton);

    const dialCodeInputClass = this.applyCustomClasses(
      'phone-lib-dial-code-input',
      this.options.customClasses?.dialCodeInput
    );
    const dialCodeInputStyle = this.applyCustomStyles(this.options.customStyles?.dialCodeInput);

    const inputClass = this.applyCustomClasses(
      'phone-lib-input-separated',
      this.options.customClasses?.input
    );
    const inputStyle = this.applyCustomStyles(this.options.customStyles?.input);

    this.container.innerHTML = `
      <div class="${wrapperClass}" ${wrapperStyle ? `style="${wrapperStyle}"` : ''}>
        <div class="phone-lib-separated-row" style="${finalRowStyle}">
          <div class="phone-lib-field-group">
            <label class="phone-lib-label">${this.options.countryLabel}</label>
            <div class="phone-lib-dropdown-container">
              <button type="button" class="${dropdownButtonClass}" ${dropdownButtonStyle ? `style="${dropdownButtonStyle}"` : ''} aria-expanded="false" ${this.isDisabled ? 'disabled' : ''} aria-label="${this.options.ariaLabels.dropdownButton}">
                <span class="phone-lib-flag">${selectedCountryData?.flag || defaultFlag}</span>
                <span class="phone-lib-country-name-display">${selectedCountryData?.name || ''}</span>
                <span class="phone-lib-arrow">▼</span>
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
    // Toggle dropdown
    this.dropdownButton.addEventListener('click', (e) => {
      if (this.isDisabled) return;
      e.stopPropagation();
      this.toggleDropdown();
    });

    // Cerrar dropdown al hacer click fuera
    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target)) {
        this.closeDropdown();
      }
    });

    // Seleccionar país
    const countryItems = this.container.querySelectorAll('.phone-lib-country-item');
    countryItems.forEach(item => {
      item.addEventListener('click', () => {
        if (item.classList.contains('disabled')) {
          return; // No permitir seleccionar países deshabilitados
        }
        const iso2 = item.dataset.iso2;
        const dialCode = item.dataset.dialCode;
        this.selectCountry(iso2, dialCode);
      });
    });

    // Input de teléfono
    this.phoneInput.addEventListener('input', (e) => {
      if (this.isDisabled || this.isReadonly) return;
      this.handlePhoneInput(e.target.value);

      // Validación en tiempo real si está habilitada
      if (this.options.validateOnInput) {
        this.validatePhone();
      }
    });

    this.phoneInput.addEventListener('focus', () => {
      this.executeCallback('onFocus');
      this.emitEvent('focus');
    });

    this.phoneInput.addEventListener('blur', () => {
      const isValid = this.validatePhone();
      this.executeCallback('onBlur', this.phoneNumber, isValid);
      this.emitEvent('blur', { phoneNumber: this.phoneNumber, isValid });
    });

    // Navegación por teclado en dropdown
    this.setupKeyboardNavigation();
  }

  /**
   * Configura navegación por teclado
   */
  setupKeyboardNavigation() {
    if (!this.dropdownButton) return;

    this.dropdownButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleDropdown();
      } else if (e.key === 'Escape') {
        this.closeDropdown();
      }
    });

    // Navegación con flechas en el dropdown
    if (this.dropdownMenu) {
      this.dropdownMenu.addEventListener('keydown', (e) => {
        const items = Array.from(this.container.querySelectorAll('.phone-lib-country-item:not([style*="display: none"])'));
        const currentIndex = items.findIndex(item => item.classList.contains('selected'));

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIndex = (currentIndex + 1) % items.length;
          items[nextIndex]?.click();
          items[nextIndex]?.scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
          items[prevIndex]?.click();
          items[prevIndex]?.scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Escape') {
          this.closeDropdown();
        }
      });
    }
  }

  /**
   * Maneja el input del teléfono
   */
  handlePhoneInput(value) {
    const previousNumber = this.phoneNumber;
    this.phoneNumber = value;

    // Detección automática de país si está habilitada
    if (this.options.autoDetectCountry && value) {
      this.autoDetectCountry(value);
    }

    this.updatePhoneNumber();

    // Ejecutar callbacks y eventos (validar sin actualizar visuals para obtener estado actual)
    const isValid = this.phoneNumber ? this.validatePhone(false) : false;
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
    if (!this.phoneNumber) {
      if (this.hintElement) {
        this.hintElement.textContent = '';
      }
      return;
    }

    try {
      const formatter = new AsYouType(this.selectedCountry);
      const formatted = formatter.input(this.phoneNumber);

      if (formatted && formatted !== this.phoneInput.value) {
        this.phoneInput.value = formatted;
        // Actualizar phoneNumber con el valor formateado para mantener sincronización
        this.phoneNumber = formatted;
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
      const previousValid = this.isValid;
      this.isValid = isValid;

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
      this.isValid = false;
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
    const previousCountry = this.selectedCountry;
    this.selectedCountry = iso2;

    // Actualizar botón según el layout
    const countryData = this.countries.find(c => c.iso2 === iso2);

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

    // Actualizar placeholder y formato
    this.phoneInput.placeholder = this.getPlaceholder();
    this.updatePhoneNumber();

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
      isValid: this.isValid,
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

    this.phoneNumber = number;
    if (this.phoneInput) {
      this.phoneInput.value = number;
    }
    this.updatePhoneNumber();

    // Ejecutar callbacks
    const isValid = this.isValid;
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
    // Remover event listeners
    if (this.phoneInput) {
      const newInput = this.phoneInput.cloneNode(true);
      this.phoneInput.parentNode.replaceChild(newInput, this.phoneInput);
    }

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
  }

  /**
   * Actualiza opciones dinámicamente
   */
  updateOptions(newOptions) {
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

    // Re-renderizar si cambió layout u opciones visuales importantes
    if (newOptions.layout || newOptions.showDialCode !== undefined || newOptions.customClasses || newOptions.customStyles) {
      this.render();
      this.attachEventListeners();
    }
  }
}

// Exportar para uso en módulos ES6
export default PhoneLib;

// También exportar para uso global si se carga directamente
if (typeof window !== 'undefined') {
  window.PhoneLib = PhoneLib;
}
