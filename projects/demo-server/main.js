const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// Verificar que todas las variables de entorno requeridas estén presentes
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY'];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Error: Faltan las siguientes variables de entorno:');
  missingEnvVars.forEach((envVar) => console.error(`- ${envVar}`));
  console.error('Por favor, crea un archivo .env en la carpeta demo-server con las variables necesarias.');
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

// Inicializar cliente de Supabase admin con la clave de servicio
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// Endpoint para generar magic link
app.post('/api/generate-magic-link', async (req, res) => {
  try {
    // Obtener token del header de autorización
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No autorizado: Token faltante o inválido' });
    }

    const token = authHeader.split(' ')[1];

    // Obtener datos del usuario usando el cliente admin
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);

    console.log('userData', token, userData, userError);

    if (userError) {
      return res.status(401).json({ error: 'No autorizado: Token de usuario inválido', details: userError.message });
    }

    const email = userData.user.email;

    if (!email) {
      return res.status(400).json({ error: 'Email de usuario no encontrado' });
    }

    console.log(`Generando magic link para el usuario: ${email}`);

    // Generar magic link para el usuario usando el cliente admin
    const { data: magicLink, error: magicLinkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
    });

    if (magicLinkError) {
      console.error('Error al generar magic link:', magicLinkError);
      return res.status(500).json({ error: 'Error al generar magic link', details: magicLinkError.message });
    }

    // Extraer hashed_token del magic link
    const hashedToken = magicLink.properties?.hashed_token;

    if (!hashedToken) {
      return res.status(500).json({ error: 'No se pudo extraer el token del magic link' });
    }

    console.log('Magic link generado exitosamente');

    // Devolver el hashed token
    res.status(200).json({ hashed_token: hashedToken });
  } catch (error) {
    console.error('Error al generar magic link:', error);
    res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
  console.log(`Variables de entorno cargadas de: ${path.resolve(__dirname, '.env')}`);
});
