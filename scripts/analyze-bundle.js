#!/usr/bin/env node

/**
 * Bundle Analyzer Script
 * Analyzes Next.js bundle size and generates report
 * 
 * Usage: pnpm analyze-bundle
 */

const { execSync } = require('child_process')
const path = require('path')

console.log('📦 Analyzing bundle size...\n')

try {
  // Set environment variable to enable bundle analyzer
  process.env.ANALYZE = 'true'
  
  // Run Next.js build with analyzer
  execSync('next build', {
    stdio: 'inherit',
    env: {
      ...process.env,
      ANALYZE: 'true',
    },
  })
  
  console.log('\n✅ Bundle analysis complete!')
  console.log('📊 Check the generated reports in .next/analyze/')
} catch (error) {
  console.error('❌ Bundle analysis failed:', error.message)
  process.exit(1)
}

