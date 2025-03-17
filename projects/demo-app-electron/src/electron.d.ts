// Declaraciones de tipo para la API de Electron exportada desde preload.js
interface Window {
  electron?: {
    receive: (channel: string, callback: (...args: any[]) => void) => void;
    send: (channel: string, data: any) => void;
    platform: string;
  };
}
