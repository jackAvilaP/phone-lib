# 🧪 Guía para Probar PhoneLib

Esta guía te muestra cómo probar la librería PhoneLib en diferentes escenarios.

## 📋 Requisitos Previos

```bash
# Instalar dependencias
npm install
```

## 🚀 Opción 1: Probar con el Servidor Incluido (Recomendado)

### Paso 1: Iniciar el servidor

```bash
npm run serve
```

Esto iniciará un servidor HTTP en `http://localhost:3004` y abrirá tu navegador automáticamente.

### Paso 2: Probar los Demos

Una vez que el servidor esté corriendo, puedes acceder a:

#### Demos de Vanilla JavaScript:
- **`demo.html`** - Layout integrado básico
  - URL: `http://localhost:3004/demo.html`
  
- **`demo-separated.html`** - Layout separado
  - URL: `http://localhost:3004/demo-separated.html`
  
- **`demo-all-layouts.html`** - Comparación de todos los layouts
  - URL: `http://localhost:3004/demo-all-layouts.html`
  
- **`demo-features.html`** - Todas las nuevas características
  - URL: `http://localhost:3004/demo-features.html`
  - Incluye: eventos, control programático, auto-detección, filtros, etc.

#### Demos de React:
- **`demo-react.html`** - Ejemplo básico con React
  - URL: `http://localhost:3004/demo-react.html`
  - Nota: Usa Babel Standalone (solo para demo)

---

## 🔧 Opción 2: Usar Otro Servidor HTTP

Si prefieres usar otro servidor, aquí tienes alternativas:

### Python 3
```bash
python -m http.server 8000
```
Luego abre: `http://localhost:8000/demo.html`

### Python 2
```bash
python -m SimpleHTTPServer 8000
```

### Node.js http-server
```bash
npx http-server . -p 8080 -o
```
Luego abre: `http://localhost:8080/demo.html`

### PHP
```bash
php -S localhost:8000
```

### VS Code Live Server
Si usas VS Code, instala la extensión "Live Server" y haz clic derecho en `demo.html` → "Open with Live Server"

---

## 📝 Probar con Vanilla JavaScript

### Ejemplo Mínimo

Crea un archivo `test.html`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test PhoneLib</title>
  <link rel="stylesheet" href="phone-lib.css">
</head>
<body>
  <h1>Test PhoneLib</h1>
  <div id="phone-container"></div>

  <script type="importmap">
    {
      "imports": {
        "libphonenumber-js": "https://esm.sh/libphonenumber-js@1.11.0"
      }
    }
  </script>

  <script type="module">
    import PhoneLib from './phone-lib.js';

    const phoneLib = new PhoneLib('#phone-container', {
      initialCountry: 'CO',
      layout: 'integrated',
      showDialCode: true,
      onCountryChange: (country, dialCode) => {
        console.log('País cambiado:', country, dialCode);
      },
      onPhoneChange: (phone, isValid) => {
        console.log('Número:', phone, 'Válido:', isValid);
      }
    });

    // Probar métodos después de 2 segundos
    setTimeout(() => {
      console.log('País:', phoneLib.getCountry());
      console.log('Código:', phoneLib.getDialCode());
      console.log('Info completa:', phoneLib.getInfo());
    }, 2000);
  </script>
</body>
</html>
```

Abre este archivo con el servidor HTTP (no directamente con `file://`).

---

## ⚛️ Probar con React

### Opción A: Usar el Demo Incluido

Simplemente abre `demo-react.html` con el servidor:

```bash
npm run serve
# Luego navega a: http://localhost:3004/demo-react.html
```

### Opción B: Crear un Proyecto React Nuevo

#### Con Create React App:

```bash
# Crear proyecto
npx create-react-app test-phonelib
cd test-phonelib

# Copiar archivos de PhoneLib
cp ../phone-lib/phone-lib.js ./src/
cp ../phone-lib/phone-lib.css ./src/
cp ../phone-lib/phone-lib-react.jsx ./src/

# Instalar dependencias adicionales
npm install libphonenumber-js
```

#### Editar `src/App.js`:

```jsx
import React, { useRef } from 'react';
import PhoneLibReact from './phone-lib-react';
import './phone-lib.css';
import './App.css';

function App() {
  const phoneLibRef = useRef(null);

  const handleTest = () => {
    const info = phoneLibRef.current.getInfo();
    console.log('Información:', info);
    alert(`Número: ${info.e164}\nVálido: ${info.isValid}`);
  };

  return (
    <div className="App">
      <h1>Test PhoneLib</h1>
      
      <PhoneLibReact
        ref={phoneLibRef}
        initialCountry="CO"
        layout="integrated"
        showDialCode={true}
        onCountryChange={(country, dialCode) => {
          console.log('País:', country);
        }}
        onPhoneChange={(phone, isValid) => {
          console.log('Número:', phone, 'Válido:', isValid);
        }}
      />
      
      <button onClick={handleTest} style={{ marginTop: '20px' }}>
        Obtener Info
      </button>
    </div>
  );
}

export default App;
```

#### Ejecutar:

```bash
npm start
```

#### Con Vite:

```bash
# Crear proyecto
npm create vite@latest test-phonelib -- --template react
cd test-phonelib
npm install

# Copiar archivos de PhoneLib
cp ../phone-lib/phone-lib.js ./src/
cp ../phone-lib/phone-lib.css ./src/
cp ../phone-lib/phone-lib-react.jsx ./src/

# Instalar dependencias
npm install libphonenumber-js
```

Luego edita `src/App.jsx` igual que arriba y ejecuta:

```bash
npm run dev
```

---

## 🧪 Casos de Prueba Sugeridos

### 1. Prueba Básica de Funcionalidad

```javascript
// Crear instancia
const phoneLib = new PhoneLib('#container', {
  initialCountry: 'CO'
});

// Verificar que se renderiza
console.assert(phoneLib.getCountry() === 'CO', 'País inicial incorrecto');

// Cambiar país
phoneLib.setCountry('ES');
console.assert(phoneLib.getCountry() === 'ES', 'No cambió el país');

// Establecer número
phoneLib.setPhoneNumber('+34600123456');
const info = phoneLib.getInfo();
console.log('Info:', info);
```

### 2. Prueba de Validación

```javascript
const phoneLib = new PhoneLib('#container', {
  initialCountry: 'CO'
});

// Número válido
phoneLib.setPhoneNumber('3001234567');
console.assert(phoneLib.isValid() === true, 'Número válido no detectado');

// Número inválido
phoneLib.setPhoneNumber('123');
console.assert(phoneLib.isValid() === false, 'Número inválido no detectado');
```

### 3. Prueba de Eventos

```javascript
let countryChanged = false;

const phoneLib = new PhoneLib('#container', {
  initialCountry: 'CO',
  onCountryChange: () => {
    countryChanged = true;
  }
});

phoneLib.setCountry('ES');
setTimeout(() => {
  console.assert(countryChanged === true, 'Evento no se disparó');
}, 100);
```

### 4. Prueba de Formatos

```javascript
const phoneLib = new PhoneLib('#container', {
  initialCountry: 'CO'
});

phoneLib.setPhoneNumber('3001234567');

console.log('Raw:', phoneLib.getRaw());
console.log('E164:', phoneLib.getE164());
console.log('International:', phoneLib.formatInternational());
console.log('National:', phoneLib.formatNational());
console.log('RFC3966:', phoneLib.formatRFC3966());
```

### 5. Prueba de Estados

```javascript
const phoneLib = new PhoneLib('#container', {
  initialCountry: 'CO'
});

// Deshabilitar
phoneLib.disable();
console.assert(phoneLib.isDisabled === true, 'No se deshabilitó');

// Habilitar
phoneLib.enable();
console.assert(phoneLib.isDisabled === false, 'No se habilitó');

// Resetear
phoneLib.setPhoneNumber('3001234567');
phoneLib.reset();
console.assert(phoneLib.getRaw() === '', 'No se reseteó');
```

---

## 🐛 Debugging

### Ver logs en consola

Todos los demos incluyen `console.log` para debugging. Abre las herramientas de desarrollador (F12) y revisa la consola.

### Verificar que los módulos se cargan

```javascript
// En la consola del navegador
import('./phone-lib.js').then(module => {
  console.log('PhoneLib cargado:', module.default);
});
```

### Verificar eventos DOM

```javascript
const container = document.getElementById('phone-container');
container.addEventListener('phoneLib:countryChange', (e) => {
  console.log('Evento DOM recibido:', e.detail);
});
```

---

## 📊 Checklist de Pruebas

- [ ] El componente se renderiza correctamente
- [ ] El dropdown de países se abre y cierra
- [ ] Se puede seleccionar un país
- [ ] El número se formatea automáticamente
- [ ] La validación funciona correctamente
- [ ] Los eventos se disparan correctamente
- [ ] Los métodos de control programático funcionan
- [ ] El modo disabled funciona
- [ ] El modo readonly funciona
- [ ] La auto-detección de país funciona
- [ ] Los filtros de países funcionan
- [ ] Los métodos de formato retornan valores correctos
- [ ] El método `getInfo()` retorna todos los datos
- [ ] Funciona en diferentes navegadores (Chrome, Firefox, Safari, Edge)
- [ ] Es responsive en móviles

---

## 🆘 Solución de Problemas

### Error: "Failed to load module"
- **Causa**: Estás abriendo el archivo directamente con `file://`
- **Solución**: Usa un servidor HTTP (`npm run serve`)

### Error: "libphonenumber-js not found"
- **Causa**: El importmap no está configurado o la CDN falló
- **Solución**: Verifica que el `<script type="importmap">` esté presente

### Las banderas no se ven
- **Causa**: Bloqueador de anuncios o problemas de CORS
- **Solución**: Desactiva el bloqueador o verifica la consola para errores de red

### El componente no se renderiza
- **Causa**: El contenedor no existe o el selector es incorrecto
- **Solución**: Verifica que el elemento exista antes de inicializar

---

## 📚 Recursos Adicionales

- Ver `README.md` para documentación completa
- Ver `USAGE.md` para ejemplos de uso
- Ver los archivos `demo-*.html` para ejemplos prácticos
