# Reporte de Problema: PhoneLibReact pierde valor del teléfono al re-renderizar

## Información del Entorno

- **Librería**: `@jacksonavila/phone-lib`
- **Versión**: `^2.0.9`
- **React**: `18.2.0`
- **TypeScript**: `^5.1.6`

## Descripción del Problema

El componente `PhoneLibReact` pierde el valor del número de teléfono ingresado por el usuario cuando el componente padre se re-renderiza debido a cambios en otros campos del formulario.

## Comportamiento Esperado

El valor del teléfono debería persistir cuando el usuario escribe en otros campos del formulario (como nombre, email, dirección, etc.).

## Comportamiento Actual

Cuando el usuario ingresa un número de teléfono y luego escribe en otros campos del formulario, el valor del teléfono **se borra visualmente** del input, aunque el componente internamente podría mantenerlo (no podemos verificarlo porque `getRaw()` retorna vacío cuando esto ocurre).

## Pasos para Reproducir

1. Renderizar un formulario con múltiples campos usando React `useState`
2. Incluir el componente `PhoneLibReact` en el formulario con `layout="separated"`
3. Incluir otros campos del formulario que actualicen el estado del componente padre
4. **Resultado**: El usuario ingresa un número de teléfono, luego escribe en otros campos, y el valor del teléfono desaparece del input

## Análisis del Problema

1. **Estado interno no controlado**: El componente `PhoneLibReact` mantiene su propio estado interno para el número de teléfono, pero no hay una prop para controlar este valor desde fuera (similar a `initialCountry` que existe para el país)

2. **Falta de prop `value` o `initialPhoneNumber`**: No existe una prop equivalente a `initialCountry` para el número de teléfono

3. **Re-render del componente padre**: Cuando otros campos del formulario cambian, React re-renderiza el componente padre, y aunque `PhoneLibReact` debería mantener su estado interno, parece que lo pierde

4. **Método `getRaw()` retorna vacío**: Cuando el valor se pierde visualmente, el método `getRaw()` del ref también retorna una cadena vacía

## Soluciones Intentadas (Sin Éxito)

1. Agregar `key` estable al componente
2. Guardar valor en ref y restaurarlo usando `setPhoneNumber()`
3. Usar `useCallback` para memorizar handlers

## Preguntas para los Mantenedores

1. ¿Existe alguna prop o método para mantener el valor del teléfono durante re-renders?
2. ¿Es este un bug conocido o el comportamiento esperado?
3. ¿Hay alguna forma recomendada de usar el componente en formularios con múltiples campos?
4. ¿Se podría agregar una prop `initialPhoneNumber` o `value` para controlar el valor?

## Propuesta de Solución

Sugerimos agregar una prop `initialPhoneNumber` o `value` para controlar el valor del teléfono de manera similar a como funciona `initialCountry`.

## Información Adicional

- El problema ocurre con `layout="separated"` y `layout="integrated"`
- El problema no ocurre si no hay otros campos que actualicen el estado
- El problema es consistente y reproducible al 100%

---
**Fecha del reporte**: 2025-01-17
**Versión de la librería**: 2.0.9
**React**: 18.2.0
