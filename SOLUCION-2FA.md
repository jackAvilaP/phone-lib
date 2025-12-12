# 🔐 Solución: Error 403 - Autenticación de Dos Factores Requerida

## ❌ Error que estás viendo

```
npm error 403 403 Forbidden - PUT https://registry.npmjs.org/phone-lib
Two-factor authentication or granular access token with bypass 2fa enabled is required to publish packages.
```

## ✅ Solución: Habilitar 2FA en npm

npm requiere autenticación de dos factores (2FA) para publicar paquetes. Tienes dos opciones:

---

## Opción 1: Habilitar 2FA en tu cuenta (Recomendado)

### Paso 1: Ir a la configuración de npm

1. Ve a: https://www.npmjs.com/settings/[TU-USUARIO]/auth
2. O desde npmjs.com → Click en tu avatar → "Account Settings" → "Two-Factor Authentication"

### Paso 2: Habilitar 2FA

1. Click en **"Enable 2FA"** o **"Enable Two-Factor Authentication"**
2. Elige el método:
   - **Opción A: App Authenticator** (Recomendado)
     - Usa apps como Google Authenticator, Authy, Microsoft Authenticator
     - Escanea el código QR con tu app
     - Ingresa el código de 6 dígitos que muestra la app
   - **Opción B: SMS**
     - Ingresa tu número de teléfono
     - Recibirás un código por SMS

### Paso 3: Verificar que está habilitado

Deberías ver "Two-Factor Authentication: Enabled" en tu cuenta.

### Paso 4: Intentar publicar de nuevo

```bash
npm publish
```

Ahora debería funcionar. npm te pedirá el código de 2FA cuando intentes publicar.

---

## Opción 2: Crear un Token de Acceso Granular (Alternativa)

Si prefieres no usar 2FA en tu cuenta principal, puedes crear un token de acceso:

### Paso 1: Crear Token de Acceso

1. Ve a: https://www.npmjs.com/settings/[TU-USUARIO]/tokens
2. Click en **"Generate New Token"**
3. Selecciona:
   - **Token Type**: "Granular Access Token"
   - **Expiration**: Elige una fecha (o "No expiration")
   - **Packages**: Selecciona "All packages" o el paquete específico
   - **Permissions**: Marca "Read and Publish"
   - **Bypass 2FA**: Marca esta opción si está disponible

4. Click en **"Generate Token"**
5. **¡IMPORTANTE!** Copia el token inmediatamente (solo se muestra una vez)

### Paso 2: Usar el Token

Tienes dos formas de usar el token:

#### Método A: Configurar en `.npmrc` (Recomendado)

Crea o edita el archivo `.npmrc` en tu directorio home:

**Windows:**
```bash
# Crear archivo en: C:\Users\[TU-USUARIO]\.npmrc
```

**Contenido del archivo:**
```
//registry.npmjs.org/:_authToken=TU_TOKEN_AQUI
```

#### Método B: Usar en la línea de comandos

```bash
npm publish --auth-type=legacy --_auth=TU_TOKEN_AQUI
```

O configurar temporalmente:

```bash
# Windows PowerShell
$env:NPM_TOKEN="TU_TOKEN_AQUI"
npm publish

# Windows CMD
set NPM_TOKEN=TU_TOKEN_AQUI
npm publish
```

---

## 🔍 Verificar tu configuración actual

### Ver si tienes 2FA habilitado

```bash
npm profile get
```

Busca la línea que dice `two-factor` - debería mostrar `enabled` o `disabled`.

### Ver tus tokens activos

Ve a: https://www.npmjs.com/settings/[TU-USUARIO]/tokens

---

## 📝 Pasos Recomendados (Más Seguro)

**Te recomiendo usar la Opción 1 (2FA con App Authenticator)** porque:

1. ✅ Es más seguro
2. ✅ Es el método recomendado por npm
3. ✅ Protege tu cuenta completa
4. ✅ Es más fácil de usar a largo plazo

### Pasos rápidos:

1. **Instala una app autenticadora**:
   - Google Authenticator (iOS/Android)
   - Microsoft Authenticator (iOS/Android)
   - Authy (iOS/Android/Desktop)

2. **Habilita 2FA en npm**:
   - Ve a: https://www.npmjs.com/settings/[TU-USUARIO]/auth
   - Click en "Enable 2FA"
   - Escanea el código QR con tu app
   - Ingresa el código de 6 dígitos

3. **Publica de nuevo**:
   ```bash
   npm publish
   ```
   npm te pedirá el código de 2FA cuando intentes publicar.

---

## 🆘 Si sigues teniendo problemas

### Verificar que estás logueado correctamente

```bash
npm whoami
```

### Cerrar sesión y volver a iniciar

```bash
npm logout
npm login
```

### Verificar permisos del paquete

Si el nombre `phone-lib` ya existe y pertenece a otro usuario, necesitarás cambiar el nombre en `package.json`.

---

## ✅ Checklist

- [ ] Tienes una cuenta en npm
- [ ] Estás logueado (`npm whoami` muestra tu usuario)
- [ ] Has habilitado 2FA en tu cuenta npm
- [ ] Tienes una app autenticadora instalada (si usas 2FA)
- [ ] El nombre del paquete está disponible (`npm view phone-lib` da 404)

---

## 🎯 Comandos después de habilitar 2FA

```bash
# 1. Verificar login
npm whoami

# 2. Publicar (te pedirá código 2FA)
npm publish

# 3. Verificar publicación
npm view phone-lib
```

---

## 📚 Recursos

- [Documentación oficial de npm sobre 2FA](https://docs.npmjs.com/configuring-two-factor-authentication)
- [Guía de tokens de acceso](https://docs.npmjs.com/about-access-tokens)
- [Configuración de seguridad de npm](https://docs.npmjs.com/about-security-best-practices)

¡Una vez que habilites 2FA, podrás publicar sin problemas! 🚀
