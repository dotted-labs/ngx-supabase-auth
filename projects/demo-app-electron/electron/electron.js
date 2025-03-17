const { spawn } = require('child_process');
const electron = require('electron');
const path = require('path');

// Script para iniciar Electron con Angular en modo de desarrollo
function startElectron() {
  // Ruta al archivo principal de Electron
  const electronPath = path.join(__dirname, 'main.js');

  // Iniciar Electron
  const electronProcess = spawn(electron, [electronPath], {
    stdio: 'inherit',
  });

  // Manejar el cierre de Electron
  electronProcess.on('close', (code) => {
    console.log(`Electron cerrado con código: ${code}`);
    process.exit(code);
  });
}

// Iniciar Electron
startElectron();
