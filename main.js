const { app, BrowserWindow } = require('electron');
const path = require('path');
const os = require('os');
let pluginName;
const platform = os.platform();
if (platform === 'win32') {
  pluginName = 'pepflashplayer.dll'; // Plugin para Windows
} else if (platform === 'darwin') {
  pluginName = 'PepperFlashPlayer.plugin'; // Plugin para Mac
}

// Determinar ruta según si está empaquetado (.exe/.dmg) o en desarrollo
let flashPath;
if (app.isPackaged) {
  flashPath = path.join(process.resourcesPath, 'plugins', pluginName);
} else {
  flashPath = path.join(__dirname, 'plugins', pluginName);
}

// Apuntamos Electron al plugin de Flash
app.commandLine.appendSwitch('ppapi-flash-path', flashPath);

// Simular que somos un Chrome moderno de escritorio normal (camuflar a Electron para evitar error 403)
app.userAgentFallback = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Mundijuegos",
    webPreferences: {
      plugins: true // Habilita Flash
    }
  });
  
  win.maximize();
  win.loadURL('https://www.mundijuegos.com/');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
