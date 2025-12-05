#!/usr/bin/env node

/**
 * Ejecuta SQL directamente usando la connection string de Supabase
 * Requiere: PGPASSWORD o contraseña en .env.local
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Cargar .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local no existe');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match && !match[1].startsWith('#')) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL;
const PROJECT_REF = SUPABASE_URL?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

if (!PROJECT_REF) {
  console.error('❌ No se pudo extraer PROJECT_REF de NEXT_PUBLIC_SUPABASE_URL');
  process.exit(1);
}

const DB_HOST = `${PROJECT_REF}.supabase.co`;
const DB_PORT = '5432';
const DB_NAME = 'postgres';
const DB_USER = 'postgres';

console.log('🚀 Ejecutando migraciones con psql...');
console.log(`📦 Host: ${DB_HOST}`);
console.log('');

// Verificar si psql está instalado
try {
  execSync('which psql', { stdio: 'ignore' });
} catch {
  console.error('❌ psql no está instalado');
  console.error('💡 Instala PostgreSQL: brew install postgresql');
  process.exit(1);
}

// Intentar obtener contraseña
let dbPassword = process.env.PGPASSWORD || envVars.SUPABASE_DB_PASSWORD;

if (!dbPassword) {
  console.error('❌ No se encontró la contraseña de la base de datos');
  console.error('');
  console.error('💡 Opciones:');
  console.error('   1. Agrega SUPABASE_DB_PASSWORD a .env.local');
  console.error('   2. O exporta PGPASSWORD antes de ejecutar este script');
  console.error('   3. Obtén la contraseña en: Supabase Dashboard > Settings > Database');
  console.error('');
  console.error('📋 Alternativa: Ejecuta manualmente en SQL Editor:');
  console.error(`   https://supabase.com/dashboard/project/${PROJECT_REF}/sql`);
  process.exit(1);
}

// Lista de migraciones
const migrations = [
  'supabase/vlockster_00_schema.sql',
  'supabase/vlockster_01_auth_profiles.sql',
  'supabase/vlockster_02_creator_requests.sql',
  'supabase/vlockster_03_videos.sql',
  'supabase/vlockster_04_projects.sql',
  'supabase/vlockster_05_communities.sql',
  'supabase/vlockster_06_moderation.sql',
  'supabase/vlockster_07_rls_policies.sql',
  'supabase/vlockster_08_triggers.sql',
];

// Ejecutar cada migración
for (const migration of migrations) {
  const filePath = path.join(__dirname, '..', migration);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Archivo no encontrado: ${migration}`);
    continue;
  }

  console.log(`📄 Ejecutando: ${migration}`);
  
  try {
    const command = `PGPASSWORD="${dbPassword}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -f "${filePath}"`;
    execSync(command, { 
      stdio: 'inherit',
      env: { ...process.env, PGPASSWORD: dbPassword }
    });
    console.log(`✅ Completado: ${migration}\n`);
  } catch (error) {
    console.error(`❌ Error ejecutando ${migration}:`, error.message);
    console.error('💡 Verifica la contraseña y los permisos');
    process.exit(1);
  }
}

console.log('🎉 Todas las migraciones ejecutadas exitosamente');
console.log('');
console.log('📝 Regenerando tipos de TypeScript...');
try {
  execSync('pnpm supabase:types', { stdio: 'inherit' });
} catch {
  console.log('⚠️  No se pudieron regenerar los tipos automáticamente');
  console.log('💡 Ejecuta manualmente: pnpm supabase:types');
}

