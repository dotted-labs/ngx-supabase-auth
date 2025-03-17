const { app, BrowserWindow, protocol, shell } = require('electron');
const { initialize, enable } = require('@electron/remote/main');
const path = require('path');
const url = require('url');

// Inicializar @electron/remote
initialize();

// El protocolo de deep link para nuestra aplicación
const PROTOCOL = 'ngx-supabase-auth';

// Mantener una referencia global del objeto window para evitar que se cierre automáticamente
let mainWindow;

function createWindow() {
  // Crear la ventana del navegador
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Habilitar @electron/remote para este webContents
  enable(mainWindow.webContents);

  // Cargar la aplicación Angular
  const appUrl = app.isPackaged
    ? url.format({
        pathname: path.join(__dirname, '../dist/demo-app-electron/browser/index.html'),
        protocol: 'file:',
        slashes: true,
      })
    : 'http://localhost:4300';

  mainWindow.loadURL(appUrl);

  // Abrir DevTools en modo de desarrollo
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  // Manejar cuando la ventana se cierra
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Registrar el protocolo de deep link
function registerProtocol() {
  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, [path.resolve(process.argv[1])]);
    }
  } else {
    app.setAsDefaultProtocolClient(PROTOCOL);
  }

  // Manejar el protocolo
  protocol.registerFileProtocol(PROTOCOL, (request, callback) => {
    const url = request.url;
    // Enviar la URL a la ventana del renderizador
    mainWindow.webContents.send('deep-link-received', url);
  });
}

// Crear ventana cuando la aplicación esté lista
app.whenReady().then(() => {
  createWindow();
  registerProtocol();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Manejar el esquema de URL personalizado cuando se abre desde macOS
app.on('open-url', (event, url) => {
  event.preventDefault();
  if (mainWindow) {
    mainWindow.webContents.send('deep-link-received', url);
  } else {
    // Si la ventana aún no existe, almacenar la URL para procesarla cuando se cree la ventana
    process.deepLinkingUrl = url;
  }
});

// Salir cuando todas las ventanas estén cerradas
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// En macOS, volver a crear la ventana cuando el usuario hace clic en el icono del dock
app.on('activate', () => {
  if (mainWindow === null) createWindow();
});

// Manejar links externos para que se abran en el navegador predeterminado
app.on('web-contents-created', (event, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    // Abrir URLs externas en el navegador predeterminado
    if (url.startsWith('http')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });
});
