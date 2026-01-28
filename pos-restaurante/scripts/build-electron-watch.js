#!/usr/bin/env node
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function renameFiles() {
  const files = ['index.js', 'preload.js'];
  const distMain = path.join(__dirname, '..', 'dist', 'main');
  
  for (const file of files) {
    const jsPath = path.join(distMain, file);
    const cjsPath = path.join(distMain, file.replace('.js', '.cjs'));
    
    if (fs.existsSync(jsPath)) {
      try {
        fs.renameSync(jsPath, cjsPath);
        console.log(`✓ Renamed ${file} to ${file.replace('.js', '.cjs')}`);
      } catch (err) {
        console.error(`Failed to rename ${file}:`, err.message);
      }
    }
  }
}

// Run tsc in watch mode
const tsc = spawn('tsc', ['-p', 'tsconfig.electron.json', '-w'], {
  stdio: 'inherit',
  cwd: path.join(__dirname, '..')
});

// Watch for file changes and rename
let timeout;
fs.watch(path.join(__dirname, '..', 'dist', 'main'), (eventType, filename) => {
  if (filename && filename.endsWith('.js')) {
    clearTimeout(timeout);
    timeout = setTimeout(renameFiles, 500);
  }
});

process.on('SIGINT', () => {
  tsc.kill();
  process.exit(0);
});
