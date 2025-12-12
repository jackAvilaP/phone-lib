# 📦 Usar PhoneLib Sin npm - Guía Completa

Esta guía te muestra cómo usar `@jacksonavila/phone-lib` **sin instalar npm**, usando CDN directamente en HTML.

---

## 🌐 Opción 1: Import Maps (Recomendado para Navegadores Modernos)

### Ventajas / Advantages

- ✅ Código más limpio / Cleaner code
- ✅ Usa módulos ES6 nativos / Uses native ES6 modules
- ✅ Mejor para proyectos modernos / Better for modern projects

### Requisitos / Requirements

- Navegadores que soporten Import Maps / Browsers that support Import Maps
- Chrome 89+, Edge 89+, Safari 16.4+, Firefox 108+

### Ejemplo Completo / Complete Example

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PhoneLib - CDN Import Maps</title>
  
  <!-- CSS desde CDN / CSS from CDN -->
  <link rel="stylesheet" 
        href="https://cdn.jsdelivr.net/npm/@jacksonavila/phone-lib@2.0.1/phone-lib.css">
</head>
<body>
  <h1>Formulario de Contacto</h1>
  
  <div id="phone-container"></div>
  
  <button id="submit-btn">Enviar</button>

  <!-- Import Map para módulos ES6 / Import Map for ES6 modules -->
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
      showDialCode: true,
      showHint: true,
      
      onCountryChange: (country, dialCode, countryName) => {
        console.log('País cambiado / Country changed:', countryName, `(${dialCode})`);
      },
      
      onPhoneChange: (phone, isValid, country) => {
        console.log('Número / Number:', phone, 'Válido / Valid:', isValid);
      },
      
      onValidationChange: (isValid) => {
        console.log('Validación / Validation:', isValid ? 'Válido / Valid' : 'Inválido / Invalid');
      }
    });

    // Manejar envío / Handle submit
    document.getElementById('submit-btn').addEventListener('click', () => {
      const info = phoneLib.getInfo();
      
      if (!info.isValid) {
        alert('Por favor ingrese un número válido / Please enter a valid number');
        return;
      }
      
      console.log('Enviar / Send:', info.e164);
    });
  </script>
</body>
</html>
```

### URLs de CDN Disponibles / Available CDN URLs

**jsDelivr (Recomendado / Recommended):**
- CSS: `https://cdn.jsdelivr.net/npm/@jacksonavila/phone-lib@2.0.1/phone-lib.css`
- JS: `https://cdn.jsdelivr.net/npm/@jacksonavila/phone-lib@2.0.1/phone-lib.js`

**unpkg:**
- CSS: `https://unpkg.com/@jacksonavila/phone-lib@2.0.1/phone-lib.css`
- JS: `https://unpkg.com/@jacksonavila/phone-lib@2.0.1/phone-lib.js`

---

## 📜 Opción 2: Script Tag Simple (Todos los Navegadores)

### Ventajas / Advantages

- ✅ Funciona en todos los navegadores modernos / Works in all modern browsers
- ✅ No requiere bundler / No bundler required
- ✅ Más simple de usar / Simpler to use

### Ejemplo Completo / Complete Example

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PhoneLib - CDN Script Tag</title>
  
  <!-- CSS desde CDN / CSS from CDN -->
  <link rel="stylesheet" 
        href="https://cdn.jsdelivr.net/npm/@jacksonavila/phone-lib@2.0.1/phone-lib.css">
</head>
<body>
  <h1>Formulario de Contacto</h1>
  
  <div id="phone-container"></div>
  
  <button id="submit-btn">Enviar</button>

  <!-- Script desde CDN / Script from CDN -->
  <script src="https://cdn.jsdelivr.net/npm/@jacksonavila/phone-lib@2.0.1/phone-lib.cdn.js"></script>
  
  <script>
    let phoneLib = null;

    // Esperar a que PhoneLib esté listo / Wait for PhoneLib to be ready
    document.addEventListener('phoneLibReady', () => {
      phoneLib = new PhoneLib('#phone-container', {
        initialCountry: 'CO',
        layout: 'integrated',
        showDialCode: true,
        showHint: true,
        
        onCountryChange: (country, dialCode, countryName) => {
          console.log('País cambiado / Country changed:', countryName, `(${dialCode})`);
        },
        
        onPhoneChange: (phone, isValid, country) => {
          console.log('Número / Number:', phone, 'Válido / Valid:', isValid);
        },
        
        onValidationChange: (isValid) => {
          console.log('Validación / Validation:', isValid ? 'Válido / Valid' : 'Inválido / Invalid');
        }
      });
    });

    // Manejar errores / Handle errors
    document.addEventListener('phoneLibError', (e) => {
      console.error('Error cargando PhoneLib / Error loading PhoneLib:', e.detail.error);
      alert('Error cargando PhoneLib. Por favor recarga la página. / Error loading PhoneLib. Please reload the page.');
    });

    // Manejar envío / Handle submit
    document.getElementById('submit-btn').addEventListener('click', () => {
      if (!phoneLib) {
        alert('PhoneLib aún no está listo. Por favor espera. / PhoneLib is not ready yet. Please wait.');
        return;
      }
      
      const info = phoneLib.getInfo();
      
      if (!info.isValid) {
        alert('Por favor ingrese un número válido / Please enter a valid number');
        return;
      }
      
      console.log('Enviar / Send:', info.e164);
    });
  </script>
</body>
</html>
```

### URLs de CDN para Script Tag / CDN URLs for Script Tag

**jsDelivr:**
- CSS: `https://cdn.jsdelivr.net/npm/@jacksonavila/phone-lib@2.0.1/phone-lib.css`
- JS: `https://cdn.jsdelivr.net/npm/@jacksonavila/phone-lib@2.0.1/phone-lib.cdn.js`

**unpkg:**
- CSS: `https://unpkg.com/@jacksonavila/phone-lib@2.0.1/phone-lib.css`
- JS: `https://unpkg.com/@jacksonavila/phone-lib@2.0.1/phone-lib.cdn.js`

---

## 📋 Comparación de Métodos / Methods Comparison

| Característica / Feature | Import Maps | Script Tag |
|-------------------------|-------------|------------|
| **Compatibilidad / Compatibility** | Navegadores modernos / Modern browsers | Todos los navegadores / All browsers |
| **Código / Code** | Más limpio / Cleaner | Más simple / Simpler |
| **Carga / Loading** | Síncrona / Synchronous | Asíncrona (evento) / Asynchronous (event) |
| **Recomendado para / Recommended for** | Proyectos modernos / Modern projects | Uso general / General use |

---

## 🎯 Ejemplo: Formulario Completo con Script Tag

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Formulario de Contacto</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@jacksonavila/phone-lib@2.0.1/phone-lib.css">
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 50px auto;
      padding: 20px;
    }
    .form-group {
      margin-bottom: 20px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    button {
      background: #4a90e2;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <h1>Formulario de Contacto</h1>
  
  <form id="contact-form">
    <div class="form-group">
      <label>Nombre</label>
      <input type="text" id="name" required>
    </div>
    
    <div class="form-group">
      <label>Email</label>
      <input type="email" id="email" required>
    </div>
    
    <div class="form-group">
      <label>Teléfono</label>
      <div id="phone-container"></div>
    </div>
    
    <button type="submit">Enviar</button>
  </form>

  <script src="https://cdn.jsdelivr.net/npm/@jacksonavila/phone-lib@2.0.1/phone-lib.cdn.js"></script>
  
  <script>
    let phoneLib = null;

    // Esperar a que PhoneLib esté listo
    document.addEventListener('phoneLibReady', () => {
      phoneLib = new PhoneLib('#phone-container', {
        initialCountry: 'CO',
        layout: 'integrated',
        showDialCode: true,
        validateOnInput: true
      });
    });

    // Manejar envío
    document.getElementById('contact-form').addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (!phoneLib) {
        alert('PhoneLib aún no está listo. Por favor espera.');
        return;
      }
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const phoneInfo = phoneLib.getInfo();
      
      if (!phoneInfo.isValid) {
        alert('Por favor ingrese un número de teléfono válido');
        return;
      }
      
      const formData = {
        name: name,
        email: email,
        phone: phoneInfo.e164,
        country: phoneInfo.country
      };
      
      console.log('Enviar:', formData);
      // Aquí puedes enviar a tu servidor
    });
  </script>
</body>
</html>
```

---

## 🔧 Control Programático con Script Tag

```html
<script src="https://cdn.jsdelivr.net/npm/@jacksonavila/phone-lib@2.0.1/phone-lib.cdn.js"></script>
<script>
  let phoneLib = null;

  document.addEventListener('phoneLibReady', () => {
    phoneLib = new PhoneLib('#phone-container', {
      initialCountry: 'CO'
    });
  });

  // Establecer país programáticamente
  function setCountry(iso2) {
    if (phoneLib) {
      phoneLib.setCountry(iso2);
    }
  }

  // Obtener información
  function getInfo() {
    if (phoneLib) {
      const info = phoneLib.getInfo();
      console.log('Información:', info);
      return info;
    }
  }

  // Resetear
  function reset() {
    if (phoneLib) {
      phoneLib.reset();
    }
  }
</script>
```

---

## ⚠️ Notas Importantes / Important Notes

1. **Necesitas un servidor HTTP / You need an HTTP server**
   - No funciona con `file://` / Doesn't work with `file://`
   - Usa: `python -m http.server 8000` o `npx http-server . -p 8000`

2. **Versión específica / Specific version**
   - Usa `@2.0.1` o la versión más reciente / Use `@2.0.1` or latest version
   - Puedes usar `@latest` pero no es recomendado / You can use `@latest` but not recommended

3. **Con Script Tag / With Script Tag**
   - Espera el evento `phoneLibReady` antes de usar / Wait for `phoneLibReady` event before using
   - Maneja el evento `phoneLibError` para errores / Handle `phoneLibError` event for errors

---

## 🆘 Solución de Problemas / Troubleshooting

### Error: "Failed to load module"

**Solución / Solution:** Usa un servidor HTTP / Use an HTTP server:
```bash
python -m http.server 8000
# O / Or
npx http-server . -p 8000
```

### Los estilos no se cargan / Styles don't load

**Solución / Solution:** Verifica que la ruta del CSS sea correcta / Verify CSS path is correct:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@jacksonavila/phone-lib@2.0.1/phone-lib.css">
```

### PhoneLib no está disponible / PhoneLib not available

**Solución / Solution:** Espera el evento `phoneLibReady` / Wait for `phoneLibReady` event:
```javascript
document.addEventListener('phoneLibReady', () => {
  // Ahora puedes usar PhoneLib / Now you can use PhoneLib
  const phoneLib = new PhoneLib('#container', {...});
});
```

---

## 📚 Ejemplos Adicionales / Additional Examples

Ver los archivos de demo / See demo files:
- `demo-cdn-importmap.html` - Ejemplo con Import Maps / Import Maps example
- `demo-cdn-script.html` - Ejemplo con Script Tag / Script Tag example

---

¡Listo para usar sin npm! / Ready to use without npm! 🚀
