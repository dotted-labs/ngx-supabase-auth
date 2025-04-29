const { contextBridge, ipcRenderer } = require('electron');

// Exponer variables y funciones a través de contextBridge
// para hacerlas accesibles en el contexto del renderizador (Angular)
contextBridge.exposeInMainWorld('ngxSupabaseAuth', {
  // Recibir mensajes desde el proceso principal
  onDeepLinkReceived: (callback) => {
    // Eliminar el listener existente para evitar duplicados
    ipcRenderer.removeAllListeners('deep-link-received');
    // Establecer un nuevo listener
    ipcRenderer.on('deep-link-received', (event, ...args) => callback(...args));
  },
});
