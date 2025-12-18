# 📋 Guía de Versionamiento - PhoneLib

## ✅ Estado Actual

**Versión actual:** `2.0.10`

### Archivos con Versión Hardcodeada

Cuando actualices la versión, debes actualizar estos archivos:

1. **`package.json`** ✅
   - Campo: `"version": "2.0.10"`

2. **`phone-lib.cdn.js`** ✅
   - Línea 20: `const PACKAGE_VERSION = '2.0.10';`
   - Comentarios en líneas 7-8

3. **`demo-cdn-importmap.html`** ✅
   - Línea 8: CSS link
   - Líneas 98, 107, 144: URLs en ejemplos

4. **`demo-cdn-script.html`** ✅
   - Línea 10: CSS link
   - Líneas 138, 144, 178: URLs en ejemplos

5. **`README.md`** ✅
   - Sección "Using from CDN"
   - Múltiples referencias a `@2.0.10`

6. **`USO-SIN-NPM.md`** ✅
   - Múltiples ejemplos con `@2.0.10`

7. **`GUIA-VANILLA-JS.md`** ✅
   - Referencias a `@2.0.10`

## 🔄 Proceso de Actualización de Versión

### Opción 1: Manual (Actual)

1. Actualizar `package.json`:
   ```json
   {
     "version": "2.0.10"  // Nueva versión
   }
   ```

2. Actualizar `phone-lib.cdn.js`:
   ```javascript
   const PACKAGE_VERSION = '2.0.10';
   ```

3. Buscar y reemplazar en todos los archivos:
   ```bash
   # Buscar todas las referencias
   grep -r "@2.0.9" .
   
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
npm version patch  # 2.0.9 -> 2.0.10
# o
npm version minor  # 2.0.9 -> 2.1.0
# o
npm version major  # 2.0.9 -> 3.0.0
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
grep -r "2\.0\.9" . --include="*.js" --include="*.html" --include="*.md" --include="*.json"

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

**Última actualización:** Versión 2.0.10

**Cambios en 2.0.10:**
- 🐛 **BUG FIX CRÍTICO:** Corregido problema donde `PhoneLibReact` perdía el valor del teléfono cuando el componente padre se re-renderizaba
- ✅ Método `updateOptions()` ahora preserva el valor del teléfono y país antes de re-renderizar y lo restaura después
- ✅ Agregada prop `initialPhoneNumber` al componente React para establecer un valor inicial del teléfono
- ✅ Soporte para `initialPhoneNumber` en el constructor de `PhoneLib` y método `init()`
- ✅ El valor del teléfono ahora persiste correctamente durante re-renders de React
- ✅ Mejorada la sincronización entre el estado interno de `PhoneLib` y el componente React

**Cambios en 2.0.9:**
- ✅ **NUEVA FUNCIONALIDAD:** Input solo acepta números - validación automática para prevenir entrada de caracteres no numéricos
- ✅ Listener `keydown` previene entrada de caracteres inválidos en tiempo real
- ✅ Filtro en evento `input` limpia caracteres no válidos (por ejemplo, al pegar texto)
- ✅ Método `setPhoneNumber()` filtra caracteres no numéricos cuando se establece programáticamente
- ✅ Permite números (0-9) y símbolo `+` (solo al inicio para código internacional)
- ✅ Permite teclas especiales (Backspace, Delete, flechas, Tab, Ctrl+A/C/V/X, etc.)

**Cambios en 2.0.8:**
- 🐛 **BUG FIX:** Corregido problema donde algunos países mostraban códigos ISO2 (TK, TL, TM, TN, TO, TT, etc.) en lugar de nombres completos
- ✅ Completado objeto `countryNames` con todos los países del mundo (más de 240 países)
- ✅ Ahora todos los países muestran su nombre completo en español en el selector

**Cambios en 2.0.7:**
- 🐛 **BUG FIX:** Mejorada detección automática de país - ahora detecta correctamente el país al escribir números con código internacional
- ✅ Mejorado formateo en tiempo real - usa el país detectado para formatear correctamente
- ✅ Eventos de cambio de país mejorados - emite `onCountryChange` cuando se detecta automáticamente un país
- ✅ Test completo creado (`test-detection.html`) para verificar detección y formateo

**Cambios en 2.0.6:**
- 🐛 **BUG FIX:** Corregido problema donde el input no permitía escribir (cursor se perdía al formatear)
- ✅ Mejorado `updatePhoneNumber()` para preservar posición del cursor
- ✅ Mejor manejo de eventos y listeners (prevención de memory leaks)
- ✅ Validación mejorada en `selectCountry()` para evitar errores con países inválidos
- ✅ Sanitización básica de `arrowIcon` para prevenir XSS
- ✅ Mejorada navegación por teclado (verifica items disponibles y deshabilitados)

**Cambios en 2.0.5:**
- ✅ Chevron SVG por defecto (reemplaza triángulo CSS)
- ✅ Opción `arrowIcon` para personalizar la flecha del selector
- ✅ Nombres de países completos (sin truncar)
- ✅ Nuevo demo: demo-arrow-custom.html

**Cambios en 2.0.4:**
- ✅ Agregado control de anchos para campos (width, maxWidth, dropdownWidth, inputWidth, gridColumns, etc.)
- ✅ Nuevo demo: demo-widths.html
- ✅ Nuevo test: test-widths.html

**Próxima versión:** 2.0.11 (patch) o 2.1.0 (minor) según cambios
