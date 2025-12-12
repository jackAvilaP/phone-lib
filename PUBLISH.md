# 📦 Guía para Publicar PhoneLib en npm

Esta guía te ayudará a publicar PhoneLib en npm para que pueda ser instalada y usada en cualquier proyecto.

## 📋 Requisitos Previos

1. **Cuenta en npm**: Si no tienes una, créala en [npmjs.com](https://www.npmjs.com/signup)
2. **Node.js y npm instalados**: Verifica con `node --version` y `npm --version`
3. **CLI de npm instalado**: Viene con Node.js

## 🚀 Pasos para Publicar

### Paso 1: Verificar que estás en el directorio correcto

```bash
cd C:\Users\jackp\Documents\Proyectos_personales\phone-lib
```

### Paso 2: Verificar que el package.json esté correcto

Abre `package.json` y verifica:
- ✅ `name`: Debe ser único en npm (ej: `phone-lib` o `@tu-usuario/phone-lib`)
- ✅ `version`: Versión inicial (ej: `2.0.0`)
- ✅ `description`: Descripción clara
- ✅ `author`: Tu nombre o información (opcional pero recomendado)
- ✅ `license`: MIT (recomendado)

**⚠️ IMPORTANTE**: El nombre `phone-lib` podría estar ocupado. Considera usar:
- `@tu-usuario/phone-lib` (scoped package)
- `phone-lib-tu-nombre` (con sufijo único)
- `tu-phone-lib` (con prefijo único)

### Paso 3: Verificar que no estés logueado en npm (o loguearte)

```bash
# Ver quién está logueado
npm whoami

# Si no estás logueado, hacer login
npm login
```

Te pedirá:
- Username (tu usuario de npm)
- Password (tu contraseña)
- Email (tu email)

### Paso 4: Verificar que el nombre del paquete esté disponible

```bash
# Verificar si el nombre está disponible
npm search phone-lib

# O intentar ver el paquete directamente
npm view phone-lib
```

Si el paquete existe, necesitarás cambiar el nombre en `package.json`.

### Paso 5: Preparar los archivos para publicación

Los archivos que se publicarán están definidos en `package.json` bajo `files`:
- `phone-lib.js` ✅
- `phone-lib.css` ✅
- `phone-lib-react.jsx` ✅
- `phone-lib-react.js` ✅
- `README.md` ✅

Los demos y archivos de prueba NO se publicarán (están en `.npmignore`).

### Paso 6: Verificar que todo funciona localmente

```bash
# Verificar sintaxis
node --check phone-lib.js

# Probar que se puede importar (opcional)
node -e "import('./phone-lib.js').then(m => console.log('OK'))"
```

### Paso 7: Publicar en npm

#### Opción A: Publicación Pública (Recomendada)

```bash
npm publish
```

#### Opción B: Publicación como Scoped Package (Si el nombre está ocupado)

Si necesitas usar un nombre scoped (ej: `@tu-usuario/phone-lib`):

1. Edita `package.json`:
```json
{
  "name": "@tu-usuario/phone-lib",
  ...
}
```

2. Publica con acceso público:
```bash
npm publish --access public
```

### Paso 8: Verificar la publicación

Después de publicar, verifica en:
- Navegador: `https://www.npmjs.com/package/tu-paquete`
- CLI: `npm view tu-paquete`

## 📝 Después de Publicar

### Instalar en un Proyecto Nuevo

```bash
# Instalar desde npm
npm install phone-lib

# O si usaste scoped package
npm install @tu-usuario/phone-lib
```

### Usar en Vanilla JavaScript

```javascript
// Importar desde npm
import PhoneLib from 'phone-lib';
import 'phone-lib/css'; // Para los estilos

// O con scoped
import PhoneLib from '@tu-usuario/phone-lib';
import '@tu-usuario/phone-lib/css';
```

### Usar en React

```jsx
// Importar componente React
import PhoneLibReact from 'phone-lib/react';
import 'phone-lib/css';

// O con scoped
import PhoneLibReact from '@tu-usuario/phone-lib/react';
import '@tu-usuario/phone-lib/css';
```

## 🔄 Actualizar una Versión Publicada

Cuando hagas cambios y quieras publicar una nueva versión:

### Opción 1: Actualizar versión manualmente

1. Edita `package.json` y cambia `version`:
```json
{
  "version": "2.0.1"  // Incrementa según cambios
}
```

2. Publica:
```bash
npm publish
```

### Opción 2: Usar npm version (Recomendado)

```bash
# Patch (2.0.0 -> 2.0.1) - Bug fixes
npm version patch

# Minor (2.0.0 -> 2.1.0) - Nuevas características
npm version minor

# Major (2.0.0 -> 3.0.0) - Cambios breaking
npm version major
```

Esto actualiza automáticamente `package.json` y crea un commit git (si tienes git).

Luego publica:
```bash
npm publish
```

## 🎯 Buenas Prácticas

### 1. Versionado Semántico (SemVer)

- **MAJOR** (x.0.0): Cambios incompatibles con versiones anteriores
- **MINOR** (0.x.0): Nuevas funcionalidades compatibles hacia atrás
- **PATCH** (0.0.x): Correcciones de bugs compatibles

### 2. README Completo

Asegúrate de que `README.md` incluya:
- Descripción clara
- Instrucciones de instalación
- Ejemplos de uso
- API documentation
- Licencia

### 3. Tags de Git (Opcional pero Recomendado)

```bash
# Crear tag para la versión
git tag v2.0.0
git push origin v2.0.0
```

### 4. CHANGELOG.md (Opcional)

Crea un archivo `CHANGELOG.md` para documentar cambios:

```markdown
# Changelog

## [2.0.0] - 2024-01-XX
### Added
- Soporte para React
- Eventos y callbacks
- Métodos de control programático

## [1.0.0] - 2024-01-XX
### Added
- Versión inicial
```

## 🐛 Solución de Problemas

### Error: "You do not have permission to publish"

**Causa**: No estás logueado o el nombre del paquete pertenece a otro usuario.

**Solución**:
```bash
# Verificar login
npm whoami

# Si no estás logueado
npm login

# Si el nombre está ocupado, cambiar el nombre en package.json
```

### Error: "Package name too similar to existing package"

**Causa**: El nombre es muy similar a otro paquete existente.

**Solución**: Cambia el nombre en `package.json` a algo más único.

### Error: "Invalid package name"

**Causa**: El nombre no cumple con las reglas de npm (solo minúsculas, guiones, sin espacios).

**Solución**: Usa solo letras minúsculas y guiones: `phone-lib`, `my-phone-lib`

### Error al importar después de instalar

**Causa**: Problemas con módulos ES6 o rutas incorrectas.

**Solución**: Verifica que `package.json` tenga `"type": "module"` y que los exports estén correctos.

## 📚 Recursos Adicionales

- [Documentación oficial de npm](https://docs.npmjs.com/)
- [Guía de publicación en npm](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)

## ✅ Checklist Antes de Publicar

- [ ] `package.json` tiene nombre único y correcto
- [ ] Versión inicial es `1.0.0` o `2.0.0`
- [ ] Descripción es clara y útil
- [ ] README.md está completo y actualizado
- [ ] Todos los archivos necesarios están en `files`
- [ ] `.npmignore` excluye archivos innecesarios
- [ ] Código funciona correctamente
- [ ] Estás logueado en npm (`npm whoami`)
- [ ] El nombre del paquete está disponible
- [ ] Has probado la librería localmente

## 🎉 ¡Listo!

Una vez publicado, otros desarrolladores podrán instalar tu librería con:

```bash
npm install phone-lib
```

Y usarla en sus proyectos. ¡Felicidades por publicar tu primera librería en npm! 🚀
