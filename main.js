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

// Apuntamos Electron al plugin de Flash
const flashPath = path.join(__dirname, 'plugins', pluginName);
app.commandLine.appendSwitch('ppapi-flash-path', flashPath);
// app.commandLine.appendSwitch('ppapi-flash-version', '32.0.0.371'); // Versión compatible

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