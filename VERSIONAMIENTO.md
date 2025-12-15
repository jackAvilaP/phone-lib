# 📋 Guía de Versionamiento - PhoneLib

## ✅ Estado Actual

**Versión actual:** `2.0.5`

### Archivos con Versión Hardcodeada

Cuando actualices la versión, debes actualizar estos archivos:

1. **`package.json`** ✅
   - Campo: `"version": "2.0.1"`

2. **`phone-lib.cdn.js`** ✅
   - Línea 20: `const PACKAGE_VERSION = '2.0.1';`
   - Comentarios en líneas 7-8

3. **`demo-cdn-importmap.html`** ✅
   - Línea 8: CSS link
   - Líneas 98, 107, 144: URLs en ejemplos

4. **`demo-cdn-script.html`** ✅
   - Línea 10: CSS link
   - Líneas 138, 144, 178: URLs en ejemplos

5. **`README.md`** ✅
   - Sección "Using from CDN"
   - Múltiples referencias a `@2.0.1`

6. **`USO-SIN-NPM.md`** ✅
   - Múltiples ejemplos con `@2.0.1`

7. **`GUIA-VANILLA-JS.md`** ✅
   - Referencias a `@2.0.1`

## 🔄 Proceso de Actualización de Versión

### Opción 1: Manual (Actual)

1. Actualizar `package.json`:
   ```json
   {
     "version": "2.0.2"  // Nueva versión
   }
   ```

2. Actualizar `phone-lib.cdn.js`:
   ```javascript
   const PACKAGE_VERSION = '2.0.2';
   ```

3. Buscar y reemplazar en todos los archivos:
   ```bash
   # Buscar todas las referencias
   grep -r "@2.0.1" .
   
   # Reemplazar manualmente en:
   # - demo-cdn-importmap.html
   # - demo-cdn-script.html
   # - README.md
   # - USO-SIN-NPM.md
   # - GUIA-VANILLA-JS.md
   ```

### Opción 2: Usar npm version (Recomendado)

```bash
# Esto actualiza automáticamente package.json
npm version patch  # 2.0.1 -> 2.0.2
# o
npm version minor  # 2.0.1 -> 2.1.0
# o
npm version major  # 2.0.1 -> 3.0.0
```

**Luego actualizar manualmente:**
- `phone-lib.cdn.js` (PACKAGE_VERSION)
- Archivos de demo y documentación

## 📝 Checklist de Versionamiento

Antes de publicar una nueva versión:

- [ ] `package.json` - versión actualizada
- [ ] `phone-lib.cdn.js` - PACKAGE_VERSION actualizado
- [ ] `demo-cdn-importmap.html` - URLs actualizadas
- [ ] `demo-cdn-script.html` - URLs actualizadas
- [ ] `README.md` - Referencias actualizadas
- [ ] `USO-SIN-NPM.md` - Ejemplos actualizados
- [ ] `GUIA-VANILLA-JS.md` - Referencias actualizadas (si aplica)
- [ ] Probar que los demos funcionan con la nueva versión
- [ ] Publicar: `npm publish --access=public`

## 🔍 Verificar Consistencia

Para verificar que todas las versiones son consistentes:

```bash
# Buscar todas las referencias a la versión
grep -r "2\.0\.1" . --include="*.js" --include="*.html" --include="*.md" --include="*.json"

# O buscar referencias al paquete con versión
grep -r "@jacksonavila/phone-lib@" . --include="*.js" --include="*.html" --include="*.md"
```

## 💡 Recomendaciones

1. **Para demos HTML**: Considera usar `@latest` en lugar de versión específica (pero no recomendado para producción)

2. **Para documentación**: Mantén ejemplos con versión específica para estabilidad

3. **Para phone-lib.cdn.js**: Debe tener versión específica para funcionar correctamente

4. **Automación futura**: Considera crear un script que:
   - Lea la versión de `package.json`
   - Actualice automáticamente `phone-lib.cdn.js`
   - Actualice referencias en documentación (opcional)

## 📌 Notas

- Los archivos de demo (`demo-cdn-*.html`) pueden usar `@latest` pero es mejor usar versión específica para reproducibilidad
- La documentación debe mostrar ejemplos con versión específica para evitar confusión
- `phone-lib.cdn.js` DEBE tener la versión correcta porque se usa en producción

---

**Última actualización:** Versión 2.0.5
**Cambios en 2.0.5:**
- ✅ Chevron SVG por defecto (reemplaza triángulo CSS)
- ✅ Opción `arrowIcon` para personalizar la flecha del selector
- ✅ Nombres de países completos (sin truncar)
- ✅ Nuevo demo: demo-arrow-custom.html

**Cambios en 2.0.4:**
- ✅ Agregado control de anchos para campos (width, maxWidth, dropdownWidth, inputWidth, gridColumns, etc.)
- ✅ Nuevo demo: demo-widths.html
- ✅ Nuevo test: test-widths.html

**Próxima versión:** 2.0.6 (patch) o 2.1.0 (minor) según cambios
