const cp = require('child_process');
const path = require('path');

const electronPath = path.join(__dirname, 'node_modules', 'electron', 'dist', 'Electron.app', 'Contents', 'MacOS', 'Electron');

const app = cp.spawn(electronPath, ['.'], {
  stdio: 'inherit' // Intenta con logs
});

app.on('error', (err) => {
  console.error("Error al iniciar Electron:", err);
});
