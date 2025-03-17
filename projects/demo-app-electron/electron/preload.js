const { contextBridge, ipcRenderer } = require('electron');

// Exponer variables y funciones a través de contextBridge
// para hacerlas accesibles en el contexto del renderizador (Angular)
contextBridge.exposeInMainWorld('electron', {
  // Recibir mensajes desde el proceso principal
  receive: (channel, callback) => {
    // Lista blanca de canales que pueden recibir mensajes
    const validChannels = ['deep-link-received'];
    if (validChannels.includes(channel)) {
      // Eliminar el listener existente para evitar duplicados
      ipcRenderer.removeAllListeners(channel);
      // Establecer un nuevo listener
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  },

  // Enviar mensajes al proceso principal
  send: (channel, data) => {
    // Lista blanca de canales que pueden enviar mensajes
    const validChannels = ['log', 'auth-action'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },

  // Obtener la plataforma actual
  platform: process.platform,
});
