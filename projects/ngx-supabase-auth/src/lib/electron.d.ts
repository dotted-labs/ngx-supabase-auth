/**
 * Type declarations for Electron API exposed via preload.js
 */
declare global {
  interface Window {
    ngxSupabaseAuth?: {
      onDeepLinkReceived: (callback: (url: string) => void) => void;
    };
  }
}

export {};
