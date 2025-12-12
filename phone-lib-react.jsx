import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import PhoneLib from './phone-lib.js';

// Nota: Importa './phone-lib.css' en tu aplicación principal o aquí:
// import './phone-lib.css';

/**
 * Componente React para PhoneLib
 * 
 * @example
 * import PhoneLibReact from './phone-lib-react';
 * 
 * function App() {
 *   return (
 *     <PhoneLibReact
 *       initialCountry="CO"
 *       onCountryChange={(country, dialCode) => console.log(country)}
 *       onPhoneChange={(phone, isValid) => console.log(phone)}
 *     />
 *   );
 * }
 */
const PhoneLibReact = forwardRef((props, ref) => {
  const containerRef = useRef(null);
  const phoneLibRef = useRef(null);

  const {
    containerId,
    containerClassName,
    initialCountry = 'US',
    preferredCountries = [],
    showHint = true,
    layout = 'integrated',
    showDialCode = true,
    customClasses = {},
    customStyles = {},
    autoDetectCountry = false,
    validateOnInput = false,
    disabledCountries = [],
    onlyCountries = [],
    excludeCountries = [],
    readonly = false,
    disabled = false,
    placeholder = null,
    countryLabel = 'País',
    dialCodeLabel = 'Código',
    phoneLabel = 'Número de teléfono',
    messages = {},
    ariaLabels = {},
    onCountryChange,
    onPhoneChange,
    onValidationChange,
    onFocus,
    onBlur,
    ...restProps
  } = props;

  // Inicializar PhoneLib cuando el componente se monta
  useEffect(() => {
    if (!containerRef.current) return;

    // Crear contenedor si no existe
    if (!containerRef.current.id && containerId) {
      containerRef.current.id = containerId;
    }

    // Inicializar PhoneLib
    phoneLibRef.current = new PhoneLib(containerRef.current, {
      initialCountry,
      preferredCountries,
      showHint,
      layout,
      showDialCode,
      customClasses,
      customStyles,
      autoDetectCountry,
      validateOnInput,
      disabledCountries,
      onlyCountries,
      excludeCountries,
      readonly,
      disabled,
      placeholder,
      countryLabel,
      dialCodeLabel,
      phoneLabel,
      messages,
      ariaLabels,
      onCountryChange,
      onPhoneChange,
      onValidationChange,
      onFocus,
      onBlur
    });

    // Cleanup al desmontar
    return () => {
      if (phoneLibRef.current) {
        phoneLibRef.current.destroy();
        phoneLibRef.current = null;
      }
    };
  }, []); // Solo ejecutar una vez al montar

  // Actualizar opciones cuando cambian las props
  useEffect(() => {
    if (!phoneLibRef.current) return;

    phoneLibRef.current.updateOptions({
      initialCountry,
      preferredCountries,
      showHint,
      layout,
      showDialCode,
      customClasses,
      customStyles,
      autoDetectCountry,
      validateOnInput,
      disabledCountries,
      onlyCountries,
      excludeCountries,
      readonly,
      disabled,
      placeholder,
      countryLabel,
      dialCodeLabel,
      phoneLabel,
      messages,
      ariaLabels
    });
  }, [
    initialCountry,
    preferredCountries,
    showHint,
    layout,
    showDialCode,
    customClasses,
    customStyles,
    autoDetectCountry,
    validateOnInput,
    disabledCountries,
    onlyCountries,
    excludeCountries,
    readonly,
    disabled,
    placeholder,
    countryLabel,
    dialCodeLabel,
    phoneLabel,
    messages,
    ariaLabels
  ]);

  // Actualizar callbacks cuando cambian
  useEffect(() => {
    if (!phoneLibRef.current) return;
    phoneLibRef.current.options.onCountryChange = onCountryChange;
    phoneLibRef.current.options.onPhoneChange = onPhoneChange;
    phoneLibRef.current.options.onValidationChange = onValidationChange;
    phoneLibRef.current.options.onFocus = onFocus;
    phoneLibRef.current.options.onBlur = onBlur;
  }, [onCountryChange, onPhoneChange, onValidationChange, onFocus, onBlur]);

  // Exponer métodos de PhoneLib a través del ref
  useImperativeHandle(ref, () => ({
    // Métodos de lectura
    getCountry: () => phoneLibRef.current?.getCountry(),
    getDialCode: () => phoneLibRef.current?.getDialCode(),
    getRaw: () => phoneLibRef.current?.getRaw(),
    getE164: () => phoneLibRef.current?.getE164(),
    isValid: () => phoneLibRef.current?.isValid(),
    formatInternational: () => phoneLibRef.current?.formatInternational(),
    formatNational: () => phoneLibRef.current?.formatNational(),
    formatRFC3966: () => phoneLibRef.current?.formatRFC3966(),
    getNumberType: () => phoneLibRef.current?.getNumberType(),
    getInfo: () => phoneLibRef.current?.getInfo(),
    getCountryMetadata: () => phoneLibRef.current?.getCountryMetadata(),

    // Métodos de control
    setCountry: (iso2) => phoneLibRef.current?.setCountry(iso2),
    setPhoneNumber: (number) => phoneLibRef.current?.setPhoneNumber(number),
    setValue: (country, number) => phoneLibRef.current?.setValue(country, number),
    enable: () => phoneLibRef.current?.enable(),
    disable: () => phoneLibRef.current?.disable(),
    reset: () => phoneLibRef.current?.reset(),
    destroy: () => phoneLibRef.current?.destroy(),
    updateOptions: (options) => phoneLibRef.current?.updateOptions(options),

    // Acceso directo a la instancia
    instance: phoneLibRef.current
  }), []);

  return (
    <div
      ref={containerRef}
      className={containerClassName}
      {...restProps}
    />
  );
});

PhoneLibReact.displayName = 'PhoneLibReact';

export default PhoneLibReact;
