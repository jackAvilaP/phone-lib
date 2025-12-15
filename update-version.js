#!/usr/bin/env node
/**
 * Script para actualizar la versión en todos los archivos
 * Uso: node update-version.js 2.0.2
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const newVersion = process.argv[2];

if (!newVersion) {
  console.error('❌ Error: Debes proporcionar la nueva versión');
  console.log('Uso: node update-version.js 2.0.2');
  process.exit(1);
}

// Validar formato de versión (semver básico)
if (!/^\d+\.\d+\.\d+$/.test(newVersion)) {
  console.error('❌ Error: Formato de versión inválido. Debe ser X.Y.Z (ej: 2.0.2)');
  process.exit(1);
}

console.log(`🔄 Actualizando versión a ${newVersion}...\n`);

// Leer package.json para obtener versión actual
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const oldVersion = packageJson.version;

if (oldVersion === newVersion) {
  console.log(`⚠️  La versión ya es ${newVersion}. No hay cambios necesarios.`);
  process.exit(0);
}

console.log(`📦 Versión actual: ${oldVersion}`);
console.log(`📦 Nueva versión: ${newVersion}\n`);

// Archivos a actualizar
const filesToUpdate = [
  {
    path: 'package.json',
    updates: [
      {
        search: `"version": "${oldVersion}"`,
        replace: `"version": "${newVersion}"`
      }
    ]
  },
  {
    path: 'phone-lib.cdn.js',
    updates: [
      {
        search: `const PACKAGE_VERSION = '${oldVersion}';`,
        replace: `const PACKAGE_VERSION = '${newVersion}';`
      },
      {
        search: new RegExp(`@${oldVersion.replace(/\./g, '\\.')}`, 'g'),
        replace: `@${newVersion}`
      }
    ]
  },
  {
    path: 'demo-cdn-importmap.html',
    updates: [
      {
        search: new RegExp(`@${oldVersion.replace(/\./g, '\\.')}`, 'g'),
        replace: `@${newVersion}`
      }
    ]
  },
  {
    path: 'demo-cdn-script.html',
    updates: [
      {
        search: new RegExp(`@${oldVersion.replace(/\./g, '\\.')}`, 'g'),
        replace: `@${newVersion}`
      }
    ]
  },
  {
    path: 'README.md',
    updates: [
      {
        search: new RegExp(`@${oldVersion.replace(/\./g, '\\.')}`, 'g'),
        replace: `@${newVersion}`
      }
    ]
  },
  {
    path: 'USO-SIN-NPM.md',
    updates: [
      {
        search: new RegExp(`@${oldVersion.replace(/\./g, '\\.')}`, 'g'),
        replace: `@${newVersion}`
      }
    ]
  },
  {
    path: 'GUIA-VANILLA-JS.md',
    updates: [
      {
        search: new RegExp(`@${oldVersion.replace(/\./g, '\\.')}`, 'g'),
        replace: `@${newVersion}`
      }
    ]
  }
];

let updatedCount = 0;
let errorCount = 0;

// Actualizar cada archivo
filesToUpdate.forEach(({ path: filePath, updates }) => {
  const fullPath = path.join(__dirname, filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Archivo no encontrado: ${filePath}`);
    return;
  }

  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    let fileUpdated = false;

    updates.forEach(({ search, replace }) => {
      if (typeof search === 'string') {
        if (content.includes(search)) {
          content = content.replace(search, replace);
          fileUpdated = true;
        }
      } else {
        // Es un RegExp
        const matches = content.match(search);
        if (matches && matches.length > 0) {
          content = content.replace(search, replace);
          fileUpdated = true;
        }
      }
    });

    if (fileUpdated) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Actualizado: ${filePath}`);
      updatedCount++;
    } else {
      console.log(`ℹ️  Sin cambios: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error actualizando ${filePath}:`, error.message);
    errorCount++;
  }
});

console.log(`\n📊 Resumen:`);
console.log(`   ✅ Archivos actualizados: ${updatedCount}`);
console.log(`   ❌ Errores: ${errorCount}`);
console.log(`\n💡 Siguiente paso: npm publish --access=public`);
