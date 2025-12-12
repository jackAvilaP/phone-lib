# PhoneLib 📱

Modern JavaScript library to easily integrate a phone input with country selector, flags, and phone number validation. **Compatible with Vanilla JavaScript and React**.

Librería JavaScript moderna para integrar fácilmente un input de teléfono con selector de país, banderas y validación de números telefónicos. **Compatible con Vanilla JavaScript y React**.

[![npm version](https://img.shields.io/npm/v/@jacksonavila/phone-lib.svg)](https://www.npmjs.com/package/@jacksonavila/phone-lib)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features / Características

- ✅ **Country dropdown** / **Dropdown de países** showing name, ISO2 code, dial code, and flag
- ✅ **Tel input** / **Input tipo tel** with automatic formatting based on selected country
- ✅ **Phone number validation** / **Validación de números** using `libphonenumber-js`
- ✅ **Complete public API** / **API pública completa** with methods to get number information
- ✅ **Vanilla JavaScript and React support** / **Soporte para Vanilla JavaScript y React**
- ✅ **Two layouts available** / **Dos layouts disponibles**: integrated and separated
- ✅ **Customizable events and callbacks** / **Eventos y callbacks** personalizables
- ✅ **Full programmatic control** / **Control programático** completo
- ✅ **Automatic country detection** / **Detección automática** de país
- ✅ **Country filtering** / **Filtrado de países** (include/exclude/disable)
- ✅ **Readonly/disabled mode** / **Modo readonly/disabled**
- ✅ **Modern responsive CSS** / **Estilos CSS modernos** y responsivos
- ✅ **Improved accessibility** / **Accesibilidad mejorada** (ARIA labels, keyboard navigation)

---

## 📦 Installation / Instalación

### Option 1: npm / Opción 1: npm

```bash
npm install @jacksonavila/phone-lib
```

### Option 2: CDN (No npm required) / Opción 2: CDN (Sin npm)

Use directly from CDN / Usar directamente desde CDN - see [Using from CDN / Usar desde CDN](#-using-from-cdn--usar-desde-cdn) section below / ver sección abajo.

### Dependencies / Dependencias

```bash
# For React projects / Para proyectos React
npm install react react-dom

# libphonenumber-js is installed automatically
# libphonenumber-js se instala automáticamente
```

---

## 🌐 Using from CDN / Usar desde CDN

You can use PhoneLib directly from CDN without npm / Puedes usar PhoneLib directamente desde CDN sin npm.

### Method 1: Import Maps (Modern Browsers) / Método 1: Import Maps (Navegadores Modernos)

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@jacksonavila/phone-lib@2.0.1/phone-lib.css">
</head>
<body>
  <div id="phone-container"></div>

  <script type="importmap">
    {
      "imports": {
        "@jacksonavila/phone-lib": "https://cdn.jsdelivr.net/npm/@jacksonavila/phone-lib@2.0.1/phone-lib.js",
        "libphonenumber-js": "https://esm.sh/libphonenumber-js@1.11.0"
      }
    }
  </script>

  <script type="module">
    import PhoneLib from '@jacksonavila/phone-lib';

    const phoneLib = new PhoneLib('#phone-container', {
      initialCountry: 'CO',
      layout: 'integrated',
      showDialCode: true
    });
  </script>
</body>
</html>
```

**CDN URLs / URLs de CDN:**
- **jsDelivr:** `https://cdn.jsdelivr.net/npm/@jacksonavila/phone-lib@2.0.1/`
- **unpkg:** `https://unpkg.com/@jacksonavila/phone-lib@2.0.1/`

### Method 2: Script Tag (All Browsers) / Método 2: Script Tag (Todos los Navegadores)

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@jacksonavila/phone-lib@2.0.1/phone-lib.css">
</head>
<body>
  <div id="phone-container"></div>

  <script src="https://cdn.jsdelivr.net/npm/@jacksonavila/phone-lib@2.0.1/phone-lib.cdn.js"></script>
  
  <script>
    let phoneLib = null;

    // Wait for PhoneLib to be ready / Esperar a que PhoneLib esté listo
    document.addEventListener('phoneLibReady', () => {
      phoneLib = new PhoneLib('#phone-container', {
        initialCountry: 'CO',
        layout: 'integrated',
        showDialCode: true
      });
    });

    // Handle errors / Manejar errores
    document.addEventListener('phoneLibError', (e) => {
      console.error('Error loading PhoneLib:', e.detail.error);
    });
  </script>
</body>
</html>
```

**⚠️ Important / Importante:** You need an HTTP server / Necesitas un servidor HTTP (doesn't work with `file://` / no funciona con `file://`)

📖 **Complete CDN guide / Guía completa de CDN:** See [USO-SIN-NPM.md](./USO-SIN-NPM.md) / Ver [USO-SIN-NPM.md](./USO-SIN-NPM.md)

---

## 🚀 Quick Start / Inicio Rápido

### Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="node_modules/@jacksonavila/phone-lib/phone-lib.css">
</head>
<body>
  <div id="phone-container"></div>

  <script type="module">
    import PhoneLib from '@jacksonavila/phone-lib';

    const phoneLib = new PhoneLib('#phone-container', {
      initialCountry: 'CO',
      layout: 'integrated',
      showDialCode: true
    });

    // Get number information / Obtener información del número
    const info = phoneLib.getInfo();
    console.log(info);
  </script>
</body>
</html>
```

### React

```jsx
import React from 'react';
import PhoneLibReact from '@jacksonavila/phone-lib/react';
import '@jacksonavila/phone-lib/css';

function App() {
  return (
    <PhoneLibReact
      initialCountry="CO"
      layout="integrated"
      showDialCode={true}
    />
  );
}

export default App;
```

---

## 📖 Complete Usage Guide / Guía de Uso Completa

### Vanilla JavaScript

#### Basic Example / Ejemplo Básico

```javascript
import PhoneLib from '@jacksonavila/phone-lib';
import '@jacksonavila/phone-lib/css';

const phoneLib = new PhoneLib('#phone-container', {
  initialCountry: 'CO',
  preferredCountries: ['CO', 'US', 'ES'],
  showHint: true,
  layout: 'integrated',
  showDialCode: true
});
```

#### With Events and Callbacks / Con Eventos y Callbacks

```javascript
import PhoneLib from '@jacksonavila/phone-lib';
import '@jacksonavila/phone-lib/css';

const phoneLib = new PhoneLib('#phone-container', {
  initialCountry: 'CO',
  
  // Callbacks
  onCountryChange: (country, dialCode, countryName) => {
    console.log('Country changed / País cambiado:', country, dialCode, countryName);
  },
  
  onPhoneChange: (phoneNumber, isValid, country) => {
    console.log('Number / Número:', phoneNumber, 'Valid / Válido:', isValid);
    if (isValid) {
      const info = phoneLib.getInfo();
      console.log('Complete info / Información completa:', info);
    }
  },
  
  onValidationChange: (isValid, phoneNumber) => {
    console.log('Validation / Validación:', isValid ? 'Valid / Válido' : 'Invalid / Inválido');
  },
  
  onFocus: () => console.log('Input focused / Input enfocado'),
  onBlur: () => console.log('Input blurred / Input perdió foco')
});

// Listen to custom DOM events / Escuchar eventos DOM personalizados
document.getElementById('phone-container').addEventListener('phoneLib:countryChange', (e) => {
  console.log('DOM event / Evento DOM:', e.detail);
});
```

#### Programmatic Control / Control Programático

```javascript
// Set values / Establecer valores
phoneLib.setCountry('ES');
phoneLib.setPhoneNumber('+34600123456');
phoneLib.setValue('US', '5551234567');

// Control state / Controlar estado
phoneLib.enable();
phoneLib.disable();
phoneLib.reset();

// Get information / Obtener información
const country = phoneLib.getCountry();        // 'CO'
const dialCode = phoneLib.getDialCode();      // '+57'
const raw = phoneLib.getRaw();                // '3001234567'
const e164 = phoneLib.getE164();              // '+573001234567'
const isValid = phoneLib.isValid();           // true/false
const info = phoneLib.getInfo();              // Complete object / Objeto completo
```

#### Form Integration / Integración con Formularios

```html
<form id="contact-form">
  <div id="phone-container"></div>
  <button type="submit">Submit / Enviar</button>
</form>

<script type="module">
  import PhoneLib from '@jacksonavila/phone-lib';
  import '@jacksonavila/phone-lib/css';

  const phoneLib = new PhoneLib('#phone-container', {
    initialCountry: 'CO',
    validateOnInput: true
  });

  document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const phoneInfo = phoneLib.getInfo();
    
    if (!phoneInfo.isValid) {
      alert('Please enter a valid number / Por favor ingrese un número válido');
      return;
    }

    // Send data / Enviar datos
    const formData = {
      phone: phoneInfo.e164,
      country: phoneInfo.country,
      // ... other fields / otros campos
    };

    console.log('Sending / Enviando:', formData);
  });
</script>
```

### React

#### Basic Example / Ejemplo Básico

```jsx
import React from 'react';
import PhoneLibReact from '@jacksonavila/phone-lib/react';
import '@jacksonavila/phone-lib/css';

function App() {
  return (
    <PhoneLibReact
      initialCountry="CO"
      layout="integrated"
      showDialCode={true}
    />
  );
}

export default App;
```

#### With Ref and Methods / Con Ref y Métodos

```jsx
import React, { useRef } from 'react';
import PhoneLibReact from '@jacksonavila/phone-lib/react';
import '@jacksonavila/phone-lib/css';

function App() {
  const phoneLibRef = useRef(null);

  const handleSubmit = () => {
    const info = phoneLibRef.current.getInfo();
    
    if (!info.isValid) {
      alert('Invalid number / Número inválido');
      return;
    }

    console.log('Send / Enviar:', info.e164);
  };

  return (
    <div>
      <PhoneLibReact
        ref={phoneLibRef}
        initialCountry="CO"
        layout="integrated"
        onPhoneChange={(phone, isValid) => {
          console.log('Number / Número:', phone, 'Valid / Válido:', isValid);
        }}
      />
      <button onClick={handleSubmit}>Submit / Enviar</button>
    </div>
  );
}
```

#### With React State / Con Estado de React

```jsx
import React, { useState, useRef } from 'react';
import PhoneLibReact from '@jacksonavila/phone-lib/react';
import '@jacksonavila/phone-lib/css';

function PhoneForm() {
  const phoneLibRef = useRef(null);
  const [phoneData, setPhoneData] = useState(null);

  const handleGetData = () => {
    const info = phoneLibRef.current.getInfo();
    setPhoneData(info);
  };

  return (
    <div>
      <PhoneLibReact
        ref={phoneLibRef}
        initialCountry="CO"
        onPhoneChange={(phone, isValid) => {
          if (isValid) {
            const info = phoneLibRef.current.getInfo();
            setPhoneData(info);
          }
        }}
      />
      
      {phoneData && (
        <div>
          <p>Country / País: {phoneData.country}</p>
          <p>Number / Número: {phoneData.e164}</p>
          <p>Valid / Válido: {phoneData.isValid ? 'Yes / Sí' : 'No'}</p>
        </div>
      )}
    </div>
  );
}
```

#### React Form Integration / Integración con Formularios React

```jsx
import React, { useRef } from 'react';
import PhoneLibReact from '@jacksonavila/phone-lib/react';
import '@jacksonavila/phone-lib/css';

function ContactForm() {
  const phoneLibRef = useRef(null);
  const formRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const phoneInfo = phoneLibRef.current.getInfo();
    
    if (!phoneInfo.isValid) {
      alert('Please enter a valid number / Por favor ingrese un número válido');
      return;
    }

    const formData = {
      name: formRef.current.name.value,
      email: formRef.current.email.value,
      phone: phoneInfo.e164,
      country: phoneInfo.country
    };

    // Send data / Enviar datos
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <input name="name" placeholder="Name / Nombre" required />
      <input name="email" type="email" placeholder="Email" required />
      
      <PhoneLibReact
        ref={phoneLibRef}
        initialCountry="CO"
        validateOnInput={true}
      />
      
      <button type="submit">Submit / Enviar</button>
    </form>
  );
}
```

---

## 🎨 Available Layouts / Layouts Disponibles

### Integrated Layout / Layout Integrado (Default)

The country selector and input are on the same line / El selector de país y el input están en la misma línea:

```javascript
const phoneLib = new PhoneLib('#container', {
  layout: 'integrated',
  showDialCode: true  // Shows +57 in button / Muestra +57 en el botón
});
```

**With code visible / Con código visible:**
- Shows / Muestra: `[🇨🇴 +57 ▼] [300 123 4567]`

**Without code visible / Sin código visible:**
```javascript
const phoneLib = new PhoneLib('#container', {
  layout: 'integrated',
  showDialCode: false  // Only shows flag / Solo muestra la bandera
});
```
- Shows / Muestra: `[🇨🇴 ▼] [300 123 4567]`

### Separated Layout / Layout Separado

Fields are separated in a row / Los campos están separados en una fila:

```javascript
const phoneLib = new PhoneLib('#container', {
  layout: 'separated',
  showDialCode: true  // Shows separate "Code" field / Muestra campo "Código" separado
});
```

**With code visible / Con código visible:**
- Shows / Muestra: `[Country / País: 🇨🇴 Colombia ▼] [Code / Código: +57] [Number / Número: 300 123 4567]`

**Without code visible / Sin código visible:**
```javascript
const phoneLib = new PhoneLib('#container', {
  layout: 'separated',
  showDialCode: false  // Only shows Country and Number / Solo muestra País y Número
});
```
- Shows / Muestra: `[Country / País: 🇨🇴 Colombia ▼] [Number / Número: 300 123 4567]`

---

## ⚙️ Configuration Options / Opciones de Configuración

### Basic Options / Opciones Básicas

```javascript
{
  initialCountry: 'CO',              // Initial country / País inicial (ISO2)
  preferredCountries: ['CO', 'US'],  // Countries that appear first / Países que aparecen primero
  showHint: true,                    // Show validation hint / Mostrar hint de validación
  layout: 'integrated',              // 'integrated' or 'separated' / 'integrated' o 'separated'
  showDialCode: true                 // Show dial code / Mostrar código de marcación
}
```

### Advanced Options / Opciones Avanzadas

```javascript
{
  // Detection and validation / Detección y validación
  autoDetectCountry: true,            // Auto-detect country / Detectar país automáticamente
  validateOnInput: false,             // Validate while typing / Validar mientras se escribe
  
  // Country filtering / Filtrado de países
  onlyCountries: ['CO', 'US', 'ES'],  // Only these countries / Solo estos países
  disabledCountries: ['CU', 'KP'],    // Disable these / Deshabilitar estos
  excludeCountries: ['XX'],           // Exclude these / Excluir estos
  
  // States / Estados
  readonly: false,                   // Read-only mode / Modo solo lectura
  disabled: false,                   // Disabled component / Componente deshabilitado
  
  // Customization / Personalización
  placeholder: 'Enter your number',   // Custom placeholder / Placeholder personalizado
  countryLabel: 'Country',            // Label for selector / Label para selector
  dialCodeLabel: 'Code',             // Label for code / Label para código
  phoneLabel: 'Phone number',         // Label for number / Label para número
  
  // Messages / Mensajes
  messages: {
    invalid: 'Invalid number',
    valid: '✓ Valid number'
  },
  
  // Styles / Estilos
  customClasses: {
    wrapper: 'my-class',
    input: 'my-input'
  },
  customStyles: {
    input: {
      borderColor: '#4a90e2'
    }
  }
}
```

### Callbacks and Events / Callbacks y Eventos

```javascript
{
  onCountryChange: (country, dialCode, countryName) => {
    // Country changed / País cambiado
  },
  onPhoneChange: (phoneNumber, isValid, country) => {
    // Number changed / Número cambiado
  },
  onValidationChange: (isValid, phoneNumber) => {
    // Validation changed / Validación cambiada
  },
  onFocus: () => {
    // Input focused / Input enfocado
  },
  onBlur: () => {
    // Input blurred / Input perdió foco
  }
}
```

---

## 📚 Public API

### Reading Methods / Métodos de Lectura

#### `getCountry()`
Returns the ISO2 code of the selected country / Devuelve el código ISO2 del país seleccionado.

```javascript
const country = phoneLib.getCountry(); // 'CO'
```

#### `getDialCode()`
Returns the dial code of the selected country / Devuelve el código de marcación del país seleccionado.

```javascript
const dialCode = phoneLib.getDialCode(); // '+57'
```

#### `getRaw()`
Returns the entered number without formatting (digits only) / Devuelve el número ingresado sin formato (solo dígitos).

```javascript
const raw = phoneLib.getRaw(); // '3001234567'
```

#### `getE164()`
Returns the number in E.164 format / Devuelve el número en formato E.164.

```javascript
const e164 = phoneLib.getE164(); // '+573001234567'
```

#### `isValid()`
Returns `true` if the number is valid, `false` otherwise / Devuelve `true` si el número es válido, `false` en caso contrario.

```javascript
const isValid = phoneLib.isValid(); // true o false
```

#### `formatInternational()`
Returns the number in international format / Devuelve el número en formato internacional.

```javascript
const international = phoneLib.formatInternational(); // '+57 300 123 4567'
```

#### `formatNational()`
Returns the number in national format / Devuelve el número en formato nacional.

```javascript
const national = phoneLib.formatNational(); // '300 123 4567'
```

#### `formatRFC3966()`
Returns the number in RFC3966 format / Devuelve el número en formato RFC3966.

```javascript
const rfc3966 = phoneLib.formatRFC3966(); // 'tel:+57-300-123-4567'
```

#### `getNumberType()`
Returns the number type (MOBILE, FIXED_LINE, etc.) / Devuelve el tipo de número (MOBILE, FIXED_LINE, etc.).

```javascript
const type = phoneLib.getNumberType(); // 'MOBILE' o null
```

#### `getInfo()`
Returns an object with all number information / Devuelve un objeto con toda la información del número.

```javascript
const info = phoneLib.getInfo();
// {
//   country: 'CO',
//   dialCode: '+57',
//   raw: '3001234567',
//   e164: '+573001234567',
//   international: '+57 300 123 4567',
//   national: '300 123 4567',
//   rfc3966: 'tel:+57-300-123-4567',
//   isValid: true,
//   type: 'MOBILE',
//   countryName: 'Colombia'
// }
```

#### `getCountryMetadata()`
Returns complete information about the selected country / Devuelve información completa del país seleccionado.

```javascript
const metadata = phoneLib.getCountryMetadata();
// {
//   iso2: 'CO',
//   name: 'Colombia',
//   dialCode: '+57',
//   flag: '<img...>'
// }
```

### Control Methods / Métodos de Control

#### `setCountry(iso2)`
Sets the country programmatically / Establece el país programáticamente.

```javascript
phoneLib.setCountry('ES');
```

#### `setPhoneNumber(number)`
Sets the phone number programmatically / Establece el número telefónico programáticamente.

```javascript
phoneLib.setPhoneNumber('+34600123456');
```

#### `setValue(country, number)`
Sets both country and number / Establece país y número juntos.

```javascript
phoneLib.setValue('ES', '600123456');
```

#### `enable()` / `disable()`
Enables or disables the component / Habilita o deshabilita el componente.

```javascript
phoneLib.enable();
phoneLib.disable();
```

#### `reset()`
Resets the component to initial values / Resetea el componente a valores iniciales.

```javascript
phoneLib.reset();
```

#### `destroy()`
Destroys the instance and cleans up resources / Destruye la instancia y limpia recursos.

```javascript
phoneLib.destroy();
```

#### `updateOptions(newOptions)`
Updates options dynamically / Actualiza opciones dinámicamente.

```javascript
phoneLib.updateOptions({
  preferredCountries: ['CO', 'US', 'ES', 'MX']
});
```

---

## 🎨 Custom Styling / Estilos Personalizados

### With CSS Classes / Con Clases CSS

```javascript
const phoneLib = new PhoneLib('#container', {
  customClasses: {
    wrapper: 'my-custom-class',
    dropdownButton: 'my-custom-button',
    input: 'my-custom-input'
  }
});
```

### With Inline Styles / Con Estilos Inline

```javascript
const phoneLib = new PhoneLib('#container', {
  customStyles: {
    dropdownButton: {
      backgroundColor: '#4a90e2',
      borderRadius: '20px',
      color: 'white'
    },
    input: {
      borderColor: '#4a90e2',
      fontSize: '18px'
    }
  }
});
```

### Customizable Elements / Elementos Personalizables

- `wrapper` - Main container / Contenedor principal
- `dropdownButton` - Country selector button / Botón del selector de país
- `input` - Phone input field / Campo de entrada de teléfono
- `dialCodeInput` - Dial code field (separated layout only) / Campo de código (solo layout separado)
- `row` - Grid row (separated layout only) / Fila del grid (solo layout separado)

---

## 🔧 Advanced Examples / Ejemplos Avanzados

### Automatic Country Detection / Detección Automática de País

```javascript
const phoneLib = new PhoneLib('#container', {
  autoDetectCountry: true  // Detects country when entering +34... / Detecta país al ingresar +34...
});

// User types / Usuario escribe: +34 600 123 456
// Automatically changes to Spain / Automáticamente cambia a España
```

### Country Filtering / Filtrado de Países

```javascript
const phoneLib = new PhoneLib('#container', {
  // Only show these countries / Solo mostrar estos países
  onlyCountries: ['CO', 'US', 'ES', 'MX'],
  
  // Disable these countries (appear but can't be selected) / Deshabilitar estos países
  disabledCountries: ['CU', 'KP'],
  
  // Exclude these countries (don't appear in list) / Excluir estos países
  excludeCountries: ['XX']
});
```

### Real-time Validation / Validación en Tiempo Real

```javascript
const phoneLib = new PhoneLib('#container', {
  validateOnInput: true,  // Validate while user types / Valida mientras el usuario escribe
  
  onValidationChange: (isValid) => {
    if (isValid) {
      console.log('Valid number! / ¡Número válido!');
    }
  }
});
```

### Readonly/Disabled Mode / Modo Readonly/Disabled

```javascript
// Read-only / Solo lectura
const phoneLib = new PhoneLib('#container', {
  readonly: true
});

// Disabled / Deshabilitado
const phoneLib = new PhoneLib('#container', {
  disabled: true
});
```

---

## 📱 React Component Props

| Prop | Type | Default | Description / Descripción |
|------|------|---------|--------------------------|
| `initialCountry` | string | `'US'` | Initial country (ISO2) / País inicial (ISO2) |
| `preferredCountries` | array | `[]` | Preferred countries / Países preferidos |
| `showHint` | boolean | `true` | Show validation hint / Mostrar hint de validación |
| `layout` | string | `'integrated'` | `'integrated'` or `'separated'` / `'integrated'` o `'separated'` |
| `showDialCode` | boolean | `true` | Show dial code / Mostrar código de marcación |
| `autoDetectCountry` | boolean | `false` | Auto-detect country / Detectar país automáticamente |
| `validateOnInput` | boolean | `false` | Validate while typing / Validar mientras se escribe |
| `disabledCountries` | array | `[]` | Disabled countries / Países deshabilitados |
| `onlyCountries` | array | `[]` | Only these countries / Solo estos países |
| `excludeCountries` | array | `[]` | Exclude these countries / Excluir estos países |
| `readonly` | boolean | `false` | Read-only mode / Modo solo lectura |
| `disabled` | boolean | `false` | Disabled component / Componente deshabilitado |
| `placeholder` | string | `null` | Custom placeholder / Placeholder personalizado |
| `countryLabel` | string | `'Country'` / `'País'` | Label for selector / Label para selector |
| `dialCodeLabel` | string | `'Code'` / `'Código'` | Label for code / Label para código |
| `phoneLabel` | string | `'Phone number'` / `'Número de teléfono'` | Label for number / Label para número |
| `customClasses` | object | `{}` | Custom CSS classes / Clases CSS personalizadas |
| `customStyles` | object | `{}` | Inline styles / Estilos inline personalizados |
| `messages` | object | `{}` | Custom messages / Mensajes personalizables |
| `ariaLabels` | object | `{}` | ARIA labels / Labels ARIA personalizables |
| `onCountryChange` | function | `null` | Callback when country changes / Callback cuando cambia el país |
| `onPhoneChange` | function | `null` | Callback when number changes / Callback cuando cambia el número |
| `onValidationChange` | function | `null` | Callback when validation changes / Callback cuando cambia la validación |
| `onFocus` | function | `null` | Callback when focused / Callback cuando se enfoca |
| `onBlur` | function | `null` | Callback when blurred / Callback cuando pierde foco |

---

## 🧪 Development and Testing / Desarrollo y Pruebas

### Run Demos Locally / Ejecutar Demos Localmente

```bash
# Install dependencies / Instalar dependencias
npm install

# Start development server / Iniciar servidor de desarrollo
npm run serve
```

This will open `http://localhost:3004` with all available demos / Esto abrirá `http://localhost:3004` con todos los demos disponibles.

### Demo Files / Archivos de Demo

- `demo.html` - Basic integrated layout / Layout integrado básico
- `demo-separated.html` - Separated layout / Layout separado
- `demo-all-layouts.html` - All layouts comparison / Comparación de todos los layouts
- `demo-features.html` - All features / Todas las características
- `demo-react.html` - React example / Ejemplo con React
- `demo-cdn-importmap.html` - CDN with Import Maps / CDN con Import Maps
- `demo-cdn-script.html` - CDN with Script Tag / CDN con Script Tag

---

## 📦 Package Structure / Estructura del Paquete

```
@jacksonavila/phone-lib/
├── phone-lib.js          # Main code (Vanilla JS) / Código principal (Vanilla JS)
├── phone-lib.css         # CSS styles / Estilos CSS
├── phone-lib-react.jsx   # React component / Componente React
├── phone-lib-react.js    # CommonJS/ESM React version / Versión CommonJS/ESM React
└── README.md             # Documentation / Documentación
```

### Import Paths / Rutas de Importación

```javascript
// Main library (Vanilla JS) / Librería principal (Vanilla JS)
import PhoneLib from '@jacksonavila/phone-lib';

// React component / Componente React
import PhoneLibReact from '@jacksonavila/phone-lib/react';

// CSS styles / Estilos CSS
import '@jacksonavila/phone-lib/css';

// Or with full paths / O con rutas completas
import PhoneLib from '@jacksonavila/phone-lib/phone-lib.js';
import PhoneLibReact from '@jacksonavila/phone-lib/phone-lib-react.jsx';
import '@jacksonavila/phone-lib/phone-lib.css';
```

---

## 🤝 Contributing / Contribuir

Contributions are welcome / Las contribuciones son bienvenidas. Please / Por favor:

1. Fork the project / Haz fork del proyecto
2. Create a feature branch / Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes / Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch / Push a la rama (`git push origin feature/AmazingFeature`)
5. Open a Pull Request / Abre un Pull Request

---

## 📄 License / Licencia

This project is licensed under the MIT License / Este proyecto está bajo la Licencia MIT - see the [LICENSE](LICENSE) file for details / ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 🙏 Acknowledgments / Agradecimientos

- [libphonenumber-js](https://github.com/catamphetamine/libphonenumber-js) - For phone number validation and formatting / Para validación y formato de números telefónicos

---

## 📞 Support / Soporte

If you have questions or find any issues / Si tienes preguntas o encuentras algún problema:

- Open an [issue](https://github.com/tu-usuario/phone-lib/issues) on GitHub
- Check the [complete documentation](./USAGE.md) / Consulta la [documentación completa](./USAGE.md)
- Review the [examples](./demo.html) / Revisa los [ejemplos](./demo.html)

---

**Made with ❤️ for the developer community / Hecho con ❤️ para la comunidad de desarrolladores**
