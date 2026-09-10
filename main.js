const { app, BrowserWindow, session } = require('electron');
const path = require('path');
const os = require('os');
let pluginName;
const platform = os.platform();
if (platform === 'win32') {
  pluginName = 'pepflashplayer.dll'; // Plugin para Windows
} else if (platform === 'darwin') {
  pluginName = 'PepperFlashPlayer.plugin'; // Plugin para Mac
}

let flashPath;
if (app.isPackaged) {
  flashPath = path.join(process.resourcesPath, 'plugins', pluginName);
} else {
  flashPath = path.join(__dirname, 'plugins', pluginName);
}

app.commandLine.appendSwitch('ppapi-flash-path', flashPath);
app.commandLine.appendSwitch('ppapi-flash-version', '32.0.0.465'); 

const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
app.userAgentFallback = userAgent;

function createWindow () {
  app.commandLine.appendSwitch('disable-features', 'EnableEphemerealFlashPermission');
  
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Navegador de Juegos",
    webPreferences: {
      plugins: true,
      webviewTag: true, // Permitir las pestañas embebidas para nuestra barra de direcciones
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  
  // Interceptar todas las peticiones globales (tanto ventana principal como webview)
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = userAgent;
    details.requestHeaders['Accept-Language'] = 'es-ES,es;q=0.9,en;q=0.8';
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  win.maximize();
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});