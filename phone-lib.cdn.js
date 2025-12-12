/**
 * PhoneLib CDN Version
 * Versión para uso directo desde CDN con script tag
 * Carga libphonenumber-js dinámicamente y expone PhoneLib globalmente
 * 
 * Uso:
 * <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@jacksonavila/phone-lib@2.0.1/phone-lib.css">
 * <script src="https://cdn.jsdelivr.net/npm/@jacksonavila/phone-lib@2.0.1/phone-lib.cdn.js"></script>
 * <script>
 *   document.addEventListener('phoneLibReady', () => {
 *     const phoneLib = new PhoneLib('#container', {...});
 *   });
 * </script>
 */

(function () {
  'use strict';

  // Versión del paquete (actualizar cuando se publique nueva versión)
  const PACKAGE_VERSION = '2.0.1';
  const PACKAGE_NAME = '@jacksonavila/phone-lib';

  // URLs de CDN
  const CDN_BASE = `https://cdn.jsdelivr.net/npm/${PACKAGE_NAME}@${PACKAGE_VERSION}`;
  const LIBPHONENUMBER_CDN = 'https://esm.sh/libphonenumber-js@1.11.0';

  // Cargar CSS automáticamente
  function loadCSS() {
    const linkId = 'phone-lib-css';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = `${CDN_BASE}/phone-lib.css`;
      document.head.appendChild(link);
    }
  }

  // Cargar libphonenumber-js y phone-lib.js dinámicamente
  async function loadPhoneLib() {
    try {
      // Cargar libphonenumber-js primero
      const libphonenumber = await import(LIBPHONENUMBER_CDN);

      // Crear un módulo temporal que exponga libphonenumber-js
      // Esto es necesario porque phone-lib.js importa desde 'libphonenumber-js'
      window.__libphonenumberjs = libphonenumber;

      // Crear un import map dinámico para que phone-lib.js pueda importar libphonenumber-js
      if (!document.querySelector('script[type="importmap"]')) {
        const importMap = document.createElement('script');
        importMap.type = 'importmap';
        importMap.textContent = JSON.stringify({
          imports: {
            'libphonenumber-js': LIBPHONENUMBER_CDN
          }
        });
        document.head.appendChild(importMap);
      }

      // Cargar phone-lib.js desde CDN
      const phoneLibModule = await import(`${CDN_BASE}/phone-lib.js`);

      // Exponer PhoneLib globalmente
      window.PhoneLib = phoneLibModule.default || phoneLibModule.PhoneLib;

      // Disparar evento cuando esté listo
      const event = new CustomEvent('phoneLibReady', {
        detail: { PhoneLib: window.PhoneLib }
      });
      document.dispatchEvent(event);

      return window.PhoneLib;
    } catch (error) {
      console.error('Error loading PhoneLib:', error);
      const event = new CustomEvent('phoneLibError', {
        detail: { error }
      });
      document.dispatchEvent(event);
      throw error;
    }
  }

  // Inicializar
  function init() {
    // Cargar CSS primero
    loadCSS();

    // Cargar PhoneLib
    loadPhoneLib().catch(err => {
      console.error('Failed to load PhoneLib:', err);
    });
  }

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
