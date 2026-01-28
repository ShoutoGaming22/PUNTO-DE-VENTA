// Use dynamic import to load CommonJS built electron main
// The .cjs extension ensures it's treated as CommonJS despite "type": "module"
try {
  // Require the CommonJS-built main (index.cjs)
  require('./dist/main/index.cjs');
} catch (err) {
  console.error('Failed to load electron main:', err);
  process.exit(1);
}
