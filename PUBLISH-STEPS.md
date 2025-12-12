# 🚀 Pasos para Publicar PhoneLib en npm

## ✅ Estado Actual

- ✅ **Nombre disponible**: `phone-lib` está disponible en npm
- ⚠️ **No estás logueado**: Necesitas hacer login en npm
- ✅ **Archivos listos**: Todo está configurado correctamente

## 📋 Pasos para Publicar

### Paso 1: Hacer Login en npm

```bash
npm login
```

Te pedirá:
- **Username**: Tu usuario de npm (si no tienes cuenta, créala en https://www.npmjs.com/signup)
- **Password**: Tu contraseña
- **Email**: Tu email

### Paso 2: Verificar que estás logueado

```bash
npm whoami
```

Debería mostrar tu nombre de usuario.

### Paso 3: Verificar el package.json (Opcional pero recomendado)

Puedes agregar tu información de autor en `package.json`:

```json
{
  "author": "Tu Nombre <tu-email@ejemplo.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/tu-usuario/phone-lib"
  },
  "bugs": {
    "url": "https://github.com/tu-usuario/phone-lib/issues"
  },
  "homepage": "https://github.com/tu-usuario/phone-lib#readme"
}
```

### Paso 4: Verificar sintaxis del código

```bash
node --check phone-lib.js
```

### Paso 5: Publicar en npm

```bash
npm publish
```

Si todo está bien, verás algo como:
```
+ phone-lib@2.0.0
```

### Paso 6: Verificar la publicación

```bash
# Ver el paquete publicado
npm view phone-lib

# O en el navegador
# https://www.npmjs.com/package/phone-lib
```

## 🎉 Después de Publicar

### Instalar en un proyecto nuevo

```bash
npm install phone-lib
```

### Usar en Vanilla JavaScript

```javascript
import PhoneLib from 'phone-lib';
import 'phone-lib/css';

const phoneLib = new PhoneLib('#container', {
  initialCountry: 'CO'
});
```

### Usar en React

```jsx
import PhoneLibReact from 'phone-lib/react';
import 'phone-lib/css';

<PhoneLibReact initialCountry="CO" />
```

## 🔄 Actualizar una Versión

Cuando hagas cambios:

```bash
# Actualizar versión (patch, minor, o major)
npm version patch  # 2.0.0 -> 2.0.1
npm version minor  # 2.0.0 -> 2.1.0
npm version major # 2.0.0 -> 3.0.0

# Publicar nueva versión
npm publish
```

## ⚠️ Notas Importantes

1. **Una vez publicado, el nombre `phone-lib` será tuyo** (siempre que mantengas el paquete activo)
2. **No puedes cambiar el nombre** después de publicar (solo puedes deprecar y crear uno nuevo)
3. **La versión inicial es `2.0.0`** - puedes cambiarla a `1.0.0` si prefieres empezar desde 1.0.0
4. **Los archivos que se publican** están en el array `files` de `package.json`

## 🐛 Si hay problemas

### Error: "You do not have permission"
- Verifica que estés logueado: `npm whoami`
- Verifica que el nombre del paquete no pertenezca a otro usuario

### Error: "Package name too similar"
- Cambia el nombre en `package.json` a algo más único

### Error al importar después de instalar
- Verifica que `package.json` tenga `"type": "module"`
- Verifica que los `exports` estén correctos

## ✅ Checklist Final

Antes de publicar, verifica:

- [ ] Estás logueado en npm (`npm whoami`)
- [ ] El nombre está disponible (`npm view phone-lib` da 404)
- [ ] La sintaxis es correcta (`node --check phone-lib.js`)
- [ ] Los archivos necesarios están en `files` del `package.json`
- [ ] El README.md está completo
- [ ] Has probado la librería localmente (`npm run serve`)

## 🎯 Comandos Rápidos

```bash
# 1. Login
npm login

# 2. Verificar
npm whoami

# 3. Publicar
npm publish

# 4. Verificar publicación
npm view phone-lib
```

¡Listo para publicar! 🚀
