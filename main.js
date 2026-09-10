const { app, BrowserWindow, BrowserView, ipcMain, session } = require('electron');
const path = require('path');
const os = require('os');

let pluginName = os.platform() === 'win32' ? 'pepflashplayer.dll' : 'PepperFlashPlayer.plugin';
let flashPath = app.isPackaged ? path.join(process.resourcesPath, 'plugins', pluginName) : path.join(__dirname, 'plugins', pluginName);

app.commandLine.appendSwitch('ppapi-flash-path', flashPath);
app.commandLine.appendSwitch('ppapi-flash-version', '14.0.0.177'); 
app.commandLine.appendSwitch('disable-features', 'EnableEphemerealFlashPermission');
app.commandLine.appendSwitch('no-sandbox');


const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
app.userAgentFallback = userAgent;

function createWindow () {
  // Ventana principal que contiene solo la barra superior (UI)
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Navegador Madre",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.maximize();
  win.loadFile('index.html');

  // La "vista" nativa que abrirá las webs justo debajo de la barra
  const view = new BrowserView({
    webPreferences: {
      plugins: true,
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.setBrowserView(view);
  
  // Ajustamos el rectángulo de la web para que ocupe todo menos los 50 píxeles de arriba
  const resizeView = () => {
    const space = win.getContentBounds();
    view.setBounds({ x: 0, y: 50, width: space.width, height: space.height - 50 });
  };
  
  win.on('resize', resizeView);
  win.on('ready-to-show', resizeView);
  resizeView();

  // Interceptar la sesión del view para evitar bloqueos
  view.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = userAgent;
    details.requestHeaders['Accept-Language'] = 'es-ES,es;q=0.9,en;q=0.8';
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  // Comunicación Botones de UI -> Web
  ipcMain.on('navigate', (e, url) => view.webContents.loadURL(url));
  ipcMain.on('goBack', () => view.webContents.goBack());
  ipcMain.on('goForward', () => view.webContents.goForward());
  ipcMain.on('reload', () => view.webContents.reload());

  // Comunicación Web -> UI
  const updateUrl = (e, url) => win.webContents.send('url-changed', url);
  view.webContents.on('did-navigate', updateUrl);
  view.webContents.on('did-navigate-in-page', updateUrl);

  // Primera carga
  view.webContents.loadURL('https://www.mundijuegos.com/');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});