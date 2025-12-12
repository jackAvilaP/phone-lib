# Guía de Uso - PhoneLib

## Tabla de Contenidos

1. [Vanilla JavaScript](#vanilla-javascript)
2. [React](#react)
3. [Comparación de Uso](#comparación-de-uso)

---

## Vanilla JavaScript

### Instalación

```bash
npm install libphonenumber-js
```

### Uso Básico

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="phone-lib.css">
</head>
<body>
  <div id="phone-container"></div>

  <script type="module">
    import PhoneLib from './phone-lib.js';

    const phoneLib = new PhoneLib('#phone-container', {
      initialCountry: 'CO',
      layout: 'integrated',
      showDialCode: true
    });

    // Obtener información
    const info = phoneLib.getInfo();
    console.log(info);
  </script>
</body>
</html>
```

### Con Eventos

```javascript
import PhoneLib from './phone-lib.js';

const phoneLib = new PhoneLib('#phone-container', {
  initialCountry: 'CO',
  onCountryChange: (country, dialCode, name) => {
    console.log('País cambiado:', country);
  },
  onPhoneChange: (phone, isValid, country) => {
    console.log('Número:', phone, 'Válido:', isValid);
  },
  onValidationChange: (isValid) => {
    console.log('Validación:', isValid);
  }
});

// Escuchar eventos DOM personalizados
document.getElementById('phone-container').addEventListener('phoneLib:countryChange', (e) => {
  console.log('Evento DOM:', e.detail);
});
```

### Control Programático

```javascript
// Establecer valores
phoneLib.setCountry('ES');
phoneLib.setPhoneNumber('+34600123456');
phoneLib.setValue('US', '5551234567');

// Controlar estado
phoneLib.enable();
phoneLib.disable();
phoneLib.reset();

// Obtener información
const country = phoneLib.getCountry();
const dialCode = phoneLib.getDialCode();
const isValid = phoneLib.isValid();
const info = phoneLib.getInfo();
```

---

## React

### Instalación

```bash
npm install react react-dom libphonenumber-js
```

### Uso Básico

```jsx
import React from 'react';
import PhoneLibReact from './phone-lib-react';
import './phone-lib.css';

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

### Con Ref y Métodos

```jsx
import React, { useRef } from 'react';
import PhoneLibReact from './phone-lib-react';
import './phone-lib.css';

function App() {
  const phoneLibRef = useRef(null);

  const handleSubmit = () => {
    const info = phoneLibRef.current.getInfo();
    
    if (!info.isValid) {
      alert('Número inválido');
      return;
    }

    console.log('Enviar:', info.e164);
  };

  return (
    <div>
      <PhoneLibReact
        ref={phoneLibRef}
        initialCountry="CO"
        onPhoneChange={(phone, isValid) => {
          console.log('Número:', phone);
        }}
      />
      <button onClick={handleSubmit}>Enviar</button>
    </div>
  );
}
```

### Con Estado de React

```jsx
import React, { useState, useRef } from 'react';
import PhoneLibReact from './phone-lib-react';

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
          // Actualizar estado cuando cambia el número
          if (isValid) {
            const info = phoneLibRef.current.getInfo();
            setPhoneData(info);
          }
        }}
      />
      
      {phoneData && (
        <div>
          <p>País: {phoneData.country}</p>
          <p>Número: {phoneData.e164}</p>
        </div>
      )}
    </div>
  );
}
```

### Integración con Formularios

```jsx
import React, { useRef } from 'react';
import PhoneLibReact from './phone-lib-react';

function ContactForm() {
  const phoneLibRef = useRef(null);
  const formRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const phoneInfo = phoneLibRef.current.getInfo();
    
    if (!phoneInfo.isValid) {
      alert('Por favor ingrese un número válido');
      return;
    }

    const formData = {
      name: formRef.current.name.value,
      email: formRef.current.email.value,
      phone: phoneInfo.e164,
      country: phoneInfo.country
    };

    // Enviar datos
    fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <input name="name" placeholder="Nombre" />
      <input name="email" type="email" placeholder="Email" />
      
      <PhoneLibReact
        ref={phoneLibRef}
        initialCountry="CO"
        validateOnInput={true}
      />
      
      <button type="submit">Enviar</button>
    </form>
  );
}
```

---

## Comparación de Uso

| Característica | Vanilla JS | React |
|---------------|------------|-------|
| **Inicialización** | `new PhoneLib(selector, options)` | `<PhoneLibReact {...props} />` |
| **Acceso a métodos** | Directo: `phoneLib.getInfo()` | A través de ref: `ref.current.getInfo()` |
| **Eventos** | Callbacks o eventos DOM | Props callbacks (`onCountryChange`, etc.) |
| **Actualización de props** | `updateOptions()` manual | Automático cuando cambian las props |
| **Cleanup** | `destroy()` manual | Automático en `useEffect` cleanup |
| **CSS** | Importar manualmente | Importar en componente o app principal |

### Ventajas de cada enfoque

**Vanilla JS:**
- ✅ Sin dependencias de frameworks
- ✅ Más ligero
- ✅ Funciona en cualquier proyecto
- ✅ Control total sobre el ciclo de vida

**React:**
- ✅ Integración nativa con React
- ✅ Actualización automática de props
- ✅ Cleanup automático
- ✅ Compatible con hooks y estado de React
- ✅ TypeScript support (con tipos de React)

---

## Migración de Vanilla JS a React

Si tienes código Vanilla JS y quieres migrarlo a React:

**Antes (Vanilla JS):**
```javascript
const phoneLib = new PhoneLib('#container', {
  initialCountry: 'CO',
  onCountryChange: (country) => console.log(country)
});
```

**Después (React):**
```jsx
const phoneLibRef = useRef(null);

<PhoneLibReact
  ref={phoneLibRef}
  initialCountry="CO"
  onCountryChange={(country) => console.log(country)}
/>
```

Los métodos son los mismos, solo cambia cómo se accede:
- Vanilla: `phoneLib.getInfo()`
- React: `phoneLibRef.current.getInfo()`
