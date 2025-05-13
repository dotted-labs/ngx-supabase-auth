const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ngxSupabaseAuth', {
  // Recibir mensajes desde el proceso principal
  onDeepLinkReceived: (callback) => {
    // Eliminar el listener existente para evitar duplicados
    ipcRenderer.removeAllListeners('ngx-supabase-auth:deep-link-received');
    // Establecer un nuevo listener
    ipcRenderer.on('ngx-supabase-auth:deep-link-received', (event, ...args) => callback(...args));
  },
});
