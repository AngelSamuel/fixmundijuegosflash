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

// User-agent moderno y común
const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
app.userAgentFallback = userAgent;

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Mundijuegos",
    webPreferences: {
      plugins: true, // Habilita Flash
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  
  win.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = userAgent;
    details.requestHeaders['Accept-Language'] = 'es-ES,es;q=0.9,en;q=0.8';
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  win.maximize();
  
  // Borrar caché antes de cargar por si se quedó pillado el 403
  win.webContents.session.clearCache().then(() => {
    win.loadURL('https://www.mundijuegos.com/', { userAgent });
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
