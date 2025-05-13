const { app, BrowserWindow, protocol, shell } = require('electron');
const { initialize, enable } = require('@electron/remote/main');
const path = require('path');
const url = require('url');

// Inicializar @electron/remote
initialize();

// El protocolo de deep link para nuestra aplicación
const PROTOCOL = 'ngx-supabase-auth';
const PROTOCOL_PREFIX = `${PROTOCOL}://`;

// Mantener una referencia global del objeto window y la URL de inicio
let mainWindow;
let initialDeepLinkUrl = null;

// --- Single Instance Lock ---
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  // Another instance is already running, quit this one
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    // commandLine is an array of strings, the last one might be the deep link URL
    const deepLinkUrl = commandLine.find((arg) => arg.startsWith(PROTOCOL_PREFIX));
    if (deepLinkUrl) {
      handleDeepLink(deepLinkUrl);
    }

    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  // --- App Lifecycle ---
  app.on('ready', () => {
    // Check for deep link URL from command line arguments (Windows/Linux)
    // The first argument is usually the executable path, the second might be the URL
    const argvDeepLinkUrl = process.argv.find((arg) => arg.startsWith(PROTOCOL_PREFIX));
    if (!initialDeepLinkUrl && argvDeepLinkUrl) {
      initialDeepLinkUrl = argvDeepLinkUrl;
    }

    createWindow();
    registerProtocolHandler(); // Use setAsDefaultProtocolClient here
  });

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  // Handle the protocol link opening on macOS
  app.on('open-url', (event, url) => {
    event.preventDefault();
    handleDeepLink(url);
  });

  app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  // --- Web Contents Handling ---
  app.on('web-contents-created', (event, contents) => {
    contents.setWindowOpenHandler(({ url }) => {
      // Open external links (http/https) in the default browser
      if (url.startsWith('http:') || url.startsWith('https:')) {
        shell.openExternal(url);
        return { action: 'deny' };
      }
      // Deny other types of window opening for security, adjust if needed
      return { action: 'deny' };
    });
  });
} // End of gotTheLock check

// --- Functions ---

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: false, // Keep false for security
      contextIsolation: true, // Keep true for security
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  enable(mainWindow.webContents); // Enable @electron/remote

  const appUrl = app.isPackaged
    ? url.format({
        pathname: path.join(__dirname, '../dist/demo-app-electron/browser/index.html'),
        protocol: 'file:',
        slashes: true,
      })
    : 'http://localhost:4300'; // Make sure this port matches your dev server

  mainWindow.loadURL(appUrl);

  // Handle the initial deep link URL *after* the window content has loaded
  mainWindow.webContents.on('did-finish-load', () => {
    if (initialDeepLinkUrl) {
      console.log('Processing initial deep link URL:', initialDeepLinkUrl);
      mainWindow.webContents.send('ngx-supabase-auth:deep-link-received', initialDeepLinkUrl);
      initialDeepLinkUrl = null; // Clear it after processing
    }
  });

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function registerProtocolHandler() {
  // Register the app to handle the custom protocol (PROTOCOL://)
  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, [path.resolve(process.argv[1])]);
    }
  } else {
    app.setAsDefaultProtocolClient(PROTOCOL);
  }

  // IMPORTANT: Remove the protocol.registerFileProtocol call
  // We handle the URLs via 'open-url' (macOS) and 'second-instance' (Win/Linux)
  /*
  protocol.registerFileProtocol(PROTOCOL, (request, callback) => {
    // This is likely not needed for external link handling
    console.log("Internal protocol request (shouldn't happen for external links):", request.url);
    // Decide how to handle internal requests if you ever need them
    // For now, just log and potentially return an error or default path
    return callback({ error: -3 }); // net::ERR_ABORTED
  });
  */
}

function handleDeepLink(url) {
  console.log('Received deep link URL:', url);
  if (!url || !url.startsWith(PROTOCOL_PREFIX)) {
    console.warn('Ignoring invalid or non-protocol URL:', url);
    return;
  }

  if (mainWindow) {
    // If window exists, bring it to front and send the URL
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
    mainWindow.webContents.send('ngx-supabase-auth:deep-link-received', url);
  } else {
    // If window doesn't exist yet (app launched via link), store it
    console.log('Storing deep link URL for processing after window creation:', url);
    initialDeepLinkUrl = url;
  }
}
