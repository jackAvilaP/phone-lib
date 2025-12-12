# 🚀 Publicar PhoneLib - Instrucciones Finales

## ✅ Cambios Realizados

He actualizado el nombre del paquete a `@jacksonavila/phone-lib` porque `phone-lib` es muy similar a un paquete existente.

## 📋 Pasos para Publicar

### Paso 1: Verificar cambios

El `package.json` ahora tiene:
```json
{
  "name": "@jacksonavila/phone-lib",
  ...
}
```

### Paso 2: Publicar con acceso público

Como es un scoped package, necesitas usar `--access=public`:

```bash
npm publish --access=public
```

### Paso 3: Verificar publicación

```bash
npm view @jacksonavila/phone-lib
```

O en el navegador:
```
https://www.npmjs.com/package/@jacksonavila/phone-lib
```

## 📦 Después de Publicar

### Instalar en proyectos

```bash
npm install @jacksonavila/phone-lib
```

### Usar en Vanilla JavaScript

```javascript
import PhoneLib from '@jacksonavila/phone-lib';
import '@jacksonavila/phone-lib/css';

const phoneLib = new PhoneLib('#container', {
  initialCountry: 'CO'
});
```

### Usar en React

```jsx
import PhoneLibReact from '@jacksonavila/phone-lib/react';
import '@jacksonavila/phone-lib/css';

<PhoneLibReact initialCountry="CO" />
```

## ⚠️ Importante

- El nombre ahora es `@jacksonavila/phone-lib` (scoped package)
- Debes usar `--access=public` al publicar
- Los usuarios instalarán con `npm install @jacksonavila/phone-lib`

## 🎯 Comando Final

```bash
npm publish --access=public
```

¡Listo para publicar! 🚀
