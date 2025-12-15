# 📘 Guía Completa: Usar PhoneLib con Vanilla JavaScript

## 🚀 Instalación

### Opción 1: Desde npm (Recomendado)

```bash
npm install @jacksonavila/phone-lib
```

### Opción 2: CDN (Sin npm)

Puedes usar importmap para cargar desde CDN:

```html
<script type="importmap">
{
  "imports": {
    "@jacksonavila/phone-lib": "https://esm.sh/@jacksonavila/phone-lib@2.0.5",
    "libphonenumber-js": "https://esm.sh/libphonenumber-js@1.11.0"
  }
}
</script>
```

---

## 📝 Ejemplo Básico Completo

### HTML

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PhoneLib - Ejemplo Vanilla JS</title>
  
  <!-- Importar CSS -->
  <link rel="stylesheet" href="node_modules/@jacksonavila/phone-lib/phone-lib.css">
  <!-- O desde CDN -->
  <!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@jacksonavila/phone-lib@2.0.5/phone-lib.css"> -->
  
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 50px auto;
      padding: 20px;
    }
    #phone-container {
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <h1>Ejemplo PhoneLib</h1>
  
  <!-- Contenedor donde se renderizará el componente -->
  <div id="phone-container"></div>
  
  <!-- Botón para obtener información -->
  <button id="get-info-btn">Obtener Información</button>
  <div id="info-display"></div>

  <!-- Importar la librería -->
  <script type="module">
    import PhoneLib from '@jacksonavila/phone-lib';
    // O desde CDN: import PhoneLib from 'https://esm.sh/@jacksonavila/phone-lib@2.0.5';

    // Inicializar PhoneLib
    const phoneLib = new PhoneLib('#phone-container', {
      initialCountry: 'CO',
      layout: 'integrated',
      showDialCode: true,
      showHint: true
    });

    // Obtener información cuando se hace clic en el botón
    document.getElementById('get-info-btn').addEventListener('click', () => {
      const info = phoneLib.getInfo();
      document.getElementById('info-display').innerHTML = `
        <h3>Información del Número:</h3>
        <pre>${JSON.stringify(info, null, 2)}</pre>
      `;
    });
  </script>
</body>
</html>
```

---

## 🎯 Ejemplos por Caso de Uso

### 1. Ejemplo Mínimo

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
      initialCountry: 'CO'
    });
  </script>
</body>
</html>
```

---

### 2. Con Eventos y Callbacks

```html
<div id="phone-container"></div>
<div id="log"></div>

<script type="module">
  import PhoneLib from '@jacksonavila/phone-lib';
  import '@jacksonavila/phone-lib/css';

  const log = document.getElementById('log');

  const phoneLib = new PhoneLib('#phone-container', {
    initialCountry: 'CO',
    
    // Callback cuando cambia el país
    onCountryChange: (country, dialCode, countryName) => {
      log.innerHTML += `<p>País cambiado: ${countryName} (${country}) - ${dialCode}</p>`;
    },
    
    // Callback cuando cambia el número
    onPhoneChange: (phoneNumber, isValid, country) => {
      log.innerHTML += `<p>Número: ${phoneNumber} - Válido: ${isValid ? 'Sí' : 'No'}</p>`;
    },
    
    // Callback cuando cambia la validación
    onValidationChange: (isValid) => {
      log.innerHTML += `<p>Validación: ${isValid ? 'Válido ✓' : 'Inválido ✗'}</p>`;
    },
    
    onFocus: () => {
      log.innerHTML += '<p>Input enfocado</p>';
    },
    
    onBlur: () => {
      log.innerHTML += '<p>Input perdió foco</p>';
    }
  });

  // También puedes escuchar eventos DOM personalizados
  document.getElementById('phone-container').addEventListener('phoneLib:countryChange', (e) => {
    console.log('Evento DOM recibido:', e.detail);
  });
</script>
```

---

### 3. Integración con Formularios

```html
<form id="contact-form">
  <div>
    <label>Nombre:</label>
    <input type="text" name="name" required>
  </div>
  
  <div>
    <label>Email:</label>
    <input type="email" name="email" required>
  </div>
  
  <div>
    <label>Teléfono:</label>
    <div id="phone-container"></div>
  </div>
  
  <button type="submit">Enviar</button>
</form>

<div id="result"></div>

<script type="module">
  import PhoneLib from '@jacksonavila/phone-lib';
  import '@jacksonavila/phone-lib/css';

  const phoneLib = new PhoneLib('#phone-container', {
    initialCountry: 'CO',
    validateOnInput: true,
    layout: 'integrated',
    showDialCode: true
  });

  document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const phoneInfo = phoneLib.getInfo();
    
    // Validar número
    if (!phoneInfo.isValid) {
      alert('Por favor ingrese un número de teléfono válido');
      return;
    }

    // Obtener datos del formulario
    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: phoneInfo.e164,
      phoneRaw: phoneInfo.raw,
      country: phoneInfo.country,
      countryName: phoneInfo.countryName
    };

    // Mostrar resultado
    document.getElementById('result').innerHTML = `
      <h3>Datos a enviar:</h3>
      <pre>${JSON.stringify(formData, null, 2)}</pre>
    `;

    // Aquí puedes enviar los datos a tu servidor
    // fetch('/api/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData)
    // });
  });
</script>
```

---

### 4. Control Programático

```html
<div id="phone-container"></div>

<div>
  <button onclick="setCountry('ES')">Establecer España</button>
  <button onclick="setCountry('US')">Establecer USA</button>
  <button onclick="setPhone('+34600123456')">Establecer Número</button>
  <button onclick="resetPhone()">Resetear</button>
  <button onclick="toggleDisable()" id="toggle-btn">Deshabilitar</button>
  <button onclick="showInfo()">Mostrar Info</button>
</div>

<div id="info"></div>

<script type="module">
  import PhoneLib from '@jacksonavila/phone-lib';
  import '@jacksonavila/phone-lib/css';

  // Crear instancia global para acceso desde funciones
  window.phoneLib = new PhoneLib('#phone-container', {
    initialCountry: 'CO',
    layout: 'integrated'
  });

  // Funciones de control
  window.setCountry = (iso2) => {
    window.phoneLib.setCountry(iso2);
    console.log('País cambiado a:', iso2);
  };

  window.setPhone = (number) => {
    window.phoneLib.setPhoneNumber(number);
    console.log('Número establecido:', number);
  };

  window.resetPhone = () => {
    window.phoneLib.reset();
    console.log('Componente reseteado');
  };

  window.toggleDisable = () => {
    const btn = document.getElementById('toggle-btn');
    if (window.phoneLib.isDisabled) {
      window.phoneLib.enable();
      btn.textContent = 'Deshabilitar';
    } else {
      window.phoneLib.disable();
      btn.textContent = 'Habilitar';
    }
  };

  window.showInfo = () => {
    const info = window.phoneLib.getInfo();
    document.getElementById('info').innerHTML = `
      <h3>Información Completa:</h3>
      <pre>${JSON.stringify(info, null, 2)}</pre>
    `;
  };
</script>
```

---

### 5. Con Detección Automática de País

```html
<div id="phone-container"></div>
<p><em>Intenta escribir: +34 600 123 456 (detectará España automáticamente)</em></p>

<script type="module">
  import PhoneLib from '@jacksonavila/phone-lib';
  import '@jacksonavila/phone-lib/css';

  const phoneLib = new PhoneLib('#phone-container', {
    initialCountry: 'US',
    autoDetectCountry: true,  // Habilita detección automática
    
    onCountryChange: (country, dialCode, name) => {
      console.log(`País detectado automáticamente: ${name} (${country})`);
    }
  });
</script>
```

---

### 6. Con Filtrado de Países

```html
<div id="phone-container"></div>

<script type="module">
  import PhoneLib from '@jacksonavila/phone-lib';
  import '@jacksonavila/phone-lib/css';

  const phoneLib = new PhoneLib('#phone-container', {
    initialCountry: 'CO',
    
    // Solo mostrar estos países
    onlyCountries: ['CO', 'US', 'ES', 'MX', 'AR'],
    
    // Deshabilitar estos países (aparecen pero no se pueden seleccionar)
    disabledCountries: ['CU'],
    
    // Excluir estos países (no aparecen en la lista)
    excludeCountries: ['XX']
  });
</script>
```

---

### 7. Layout Separado

```html
<div id="phone-container"></div>

<script type="module">
  import PhoneLib from '@jacksonavila/phone-lib';
  import '@jacksonavila/phone-lib/css';

  const phoneLib = new PhoneLib('#phone-container', {
    initialCountry: 'CO',
    layout: 'separated',      // Layout separado
    showDialCode: true,        // Mostrar campo de código
    countryLabel: 'País',      // Label personalizado
    dialCodeLabel: 'Código',
    phoneLabel: 'Número de teléfono'
  });
</script>
```

---

### 8. Con Estilos Personalizados

```html
<div id="phone-container"></div>

<style>
  .mi-tema-personalizado {
    border: 2px solid #4a90e2;
    border-radius: 10px;
    padding: 10px;
  }
  
  .mi-input-personalizado {
    font-size: 18px;
    font-weight: bold;
  }
</style>

<script type="module">
  import PhoneLib from '@jacksonavila/phone-lib';
  import '@jacksonavila/phone-lib/css';

  const phoneLib = new PhoneLib('#phone-container', {
    initialCountry: 'CO',
    
    // Clases CSS personalizadas
    customClasses: {
      wrapper: 'mi-tema-personalizado',
      input: 'mi-input-personalizado'
    },
    
    // Estilos inline personalizados
    customStyles: {
      dropdownButton: {
        backgroundColor: '#4a90e2',
        color: 'white',
        borderRadius: '8px'
      },
      input: {
        borderColor: '#4a90e2',
        borderWidth: '2px'
      }
    }
  });
</script>
```

---

### 9. Validación en Tiempo Real

```html
<div id="phone-container"></div>
<div id="validation-status"></div>

<script type="module">
  import PhoneLib from '@jacksonavila/phone-lib';
  import '@jacksonavila/phone-lib/css';

  const statusDiv = document.getElementById('validation-status');

  const phoneLib = new PhoneLib('#phone-container', {
    initialCountry: 'CO',
    validateOnInput: true,  // Validar mientras se escribe
    
    onValidationChange: (isValid, phoneNumber) => {
      if (phoneNumber) {
        statusDiv.innerHTML = isValid 
          ? '<span style="color: green;">✓ Número válido</span>'
          : '<span style="color: red;">✗ Número inválido</span>';
      } else {
        statusDiv.innerHTML = '';
      }
    }
  });
</script>
```

---

### 10. Obtener Todos los Formatos

```html
<div id="phone-container"></div>
<button onclick="showAllFormats()">Mostrar Todos los Formatos</button>
<div id="formats"></div>

<script type="module">
  import PhoneLib from '@jacksonavila/phone-lib';
  import '@jacksonavila/phone-lib/css';

  window.phoneLib = new PhoneLib('#phone-container', {
    initialCountry: 'CO'
  });

  window.showAllFormats = () => {
    const lib = window.phoneLib;
    
    const formats = {
      'País': lib.getCountry(),
      'Código de marcación': lib.getDialCode(),
      'Número sin formato (raw)': lib.getRaw(),
      'Formato E.164': lib.getE164(),
      'Formato internacional': lib.formatInternational(),
      'Formato nacional': lib.formatNational(),
      'Formato RFC3966': lib.formatRFC3966(),
      'Tipo de número': lib.getNumberType(),
      'Es válido': lib.isValid(),
      'Información completa': lib.getInfo()
    };

    document.getElementById('formats').innerHTML = `
      <h3>Formatos Disponibles:</h3>
      <pre>${JSON.stringify(formats, null, 2)}</pre>
    `;
  };
</script>
```

---

## 🔧 Configuración Completa

```javascript
import PhoneLib from '@jacksonavila/phone-lib';
import '@jacksonavila/phone-lib/css';

const phoneLib = new PhoneLib('#phone-container', {
  // Configuración básica
  initialCountry: 'CO',
  preferredCountries: ['CO', 'US', 'ES'],
  showHint: true,
  layout: 'integrated',  // 'integrated' o 'separated'
  showDialCode: true,
  
  // Detección y validación
  autoDetectCountry: false,
  validateOnInput: false,
  
  // Filtrado
  onlyCountries: [],
  disabledCountries: [],
  excludeCountries: [],
  
  // Estados
  readonly: false,
  disabled: false,
  
  // Personalización
  placeholder: null,
  countryLabel: 'País',
  dialCodeLabel: 'Código',
  phoneLabel: 'Número de teléfono',
  
  // Mensajes
  messages: {
    invalid: 'Ingrese un número válido',
    valid: '✓ Número válido'
  },
  
  // Estilos
  customClasses: {},
  customStyles: {},
  
  // Callbacks
  onCountryChange: (country, dialCode, name) => {},
  onPhoneChange: (phone, isValid, country) => {},
  onValidationChange: (isValid, phone) => {},
  onFocus: () => {},
  onBlur: () => {}
});
```

---

## 📚 Métodos Disponibles

```javascript
// Lectura
phoneLib.getCountry()           // 'CO'
phoneLib.getDialCode()          // '+57'
phoneLib.getRaw()               // '3001234567'
phoneLib.getE164()              // '+573001234567'
phoneLib.isValid()             // true/false
phoneLib.formatInternational()  // '+57 300 123 4567'
phoneLib.formatNational()       // '300 123 4567'
phoneLib.formatRFC3966()        // 'tel:+57-300-123-4567'
phoneLib.getNumberType()        // 'MOBILE' o null
phoneLib.getInfo()              // Objeto completo
phoneLib.getCountryMetadata()   // Metadata del país

// Control
phoneLib.setCountry('ES')
phoneLib.setPhoneNumber('+34600123456')
phoneLib.setValue('ES', '600123456')
phoneLib.enable()
phoneLib.disable()
phoneLib.reset()
phoneLib.destroy()
phoneLib.updateOptions({ ... })
```

---

## 🌐 Usar con Bundlers

### Con Vite

```javascript
// main.js
import PhoneLib from '@jacksonavila/phone-lib';
import '@jacksonavila/phone-lib/css';

const phoneLib = new PhoneLib('#phone-container', {
  initialCountry: 'CO'
});
```

### Con Webpack

```javascript
import PhoneLib from '@jacksonavila/phone-lib';
import '@jacksonavila/phone-lib/css';

const phoneLib = new PhoneLib('#phone-container', {
  initialCountry: 'CO'
});
```

### Con Parcel

```javascript
import PhoneLib from '@jacksonavila/phone-lib';
import '@jacksonavila/phone-lib/css';

const phoneLib = new PhoneLib('#phone-container', {
  initialCountry: 'CO'
});
```

---

## ⚠️ Notas Importantes

1. **Siempre importa el CSS**: `import '@jacksonavila/phone-lib/css'`
2. **Usa módulos ES6**: `<script type="module">`
3. **Necesitas un servidor HTTP**: No funciona con `file://`
4. **El contenedor debe existir**: Asegúrate de que el elemento exista antes de inicializar

---

## 🐛 Solución de Problemas

### Error: "Failed to load module"
- **Causa**: Estás abriendo el archivo con `file://`
- **Solución**: Usa un servidor HTTP (`npm run serve` o similar)

### Error: "Container not found"
- **Causa**: El elemento no existe cuando se inicializa
- **Solución**: Asegúrate de que el script esté después del elemento o usa `DOMContentLoaded`

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const phoneLib = new PhoneLib('#phone-container', {
    initialCountry: 'CO'
  });
});
```

### Las banderas no se ven
- **Causa**: Bloqueador de anuncios o problemas de CORS
- **Solución**: Desactiva el bloqueador o verifica la consola para errores de red

---

## 📖 Más Ejemplos

Revisa los archivos de demo incluidos:
- `demo.html` - Ejemplo básico
- `demo-separated.html` - Layout separado
- `demo-features.html` - Todas las características
- `demo-all-layouts.html` - Comparación de layouts

¡Listo para usar con Vanilla JavaScript! 🚀
