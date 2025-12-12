/**
 * Versión CommonJS/ESM del wrapper React para PhoneLib
 * Para usar con import/require estándar
 */

import PhoneLib from './phone-lib.js';
import './phone-lib.css';

/**
 * Hook de React para PhoneLib
 * @param {Object} options - Opciones de configuración
 * @param {string} options.containerId - ID del contenedor (opcional)
 * @param {string} options.initialCountry - País inicial (default: 'US')
 * @param {Array} options.preferredCountries - Países preferidos
 * @param {boolean} options.showHint - Mostrar hint de validación
 * @param {string} options.layout - 'integrated' o 'separated'
 * @param {boolean} options.showDialCode - Mostrar código de marcación
 * @param {Object} options.customClasses - Clases CSS personalizadas
 * @param {Object} options.customStyles - Estilos inline personalizados
 * @param {Function} options.onCountryChange - Callback cuando cambia el país
 * @param {Function} options.onPhoneChange - Callback cuando cambia el número
 * @param {Function} options.onValidationChange - Callback cuando cambia la validación
 * @returns {Object} - Objeto con ref del contenedor y métodos de PhoneLib
 */
export function usePhoneLib(options = {}) {
  const containerRef = React.useRef(null);
  const phoneLibRef = React.useRef(null);

  React.useEffect(() => {
    if (!containerRef.current) return;

    phoneLibRef.current = new PhoneLib(containerRef.current, options);

    return () => {
      if (phoneLibRef.current) {
        phoneLibRef.current.destroy();
        phoneLibRef.current = null;
      }
    };
  }, []);

  React.useEffect(() => {
    if (!phoneLibRef.current) return;
    phoneLibRef.current.updateOptions(options);
  }, [options]);

  return {
    containerRef,
    phoneLib: phoneLibRef.current,
    // Métodos de acceso rápido
    getCountry: () => phoneLibRef.current?.getCountry(),
    getDialCode: () => phoneLibRef.current?.getDialCode(),
    getRaw: () => phoneLibRef.current?.getRaw(),
    getE164: () => phoneLibRef.current?.getE164(),
    isValid: () => phoneLibRef.current?.isValid(),
    getInfo: () => phoneLibRef.current?.getInfo(),
    setCountry: (iso2) => phoneLibRef.current?.setCountry(iso2),
    setPhoneNumber: (number) => phoneLibRef.current?.setPhoneNumber(number),
    reset: () => phoneLibRef.current?.reset()
  };
}

export default PhoneLib;
