const cp = require('child_process');
const electron = require('electron'); // Resuelve automáticamente la ruta al ejecutable en cualquier SO

const app = cp.spawn(electron, ['.'], {
  stdio: 'inherit' 
});

app.on('error', (err) => {
  console.error("Error al iniciar Electron:", err);
});
