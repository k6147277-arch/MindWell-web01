// Importamos los módulos necesarios
const express = require('express');
const path = require('path'); // Para rutas estáticas
const cors = require('cors');

// 💡 IMPORTACIONES CORREGIDAS: Apuntan a tus archivos con guion
const LoginService = require('./services/login-services'); 
const CitasService = require('./services/cita-services'); 

const app = express();
const PORT = 3000; 

// Inicializamos los servicios
const loginService = new LoginService();
const citasService = new CitasService();


// --- MIDDLEWARE ---
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


// CONFIGURACIÓN DE ARCHIVOS ESTÁTICOS
app.use('/javascript', express.static(path.join(__dirname, 'javascript')));
app.use('/imagenes', express.static(path.join(__dirname, 'imagenes')));
app.use(express.static(path.join(__dirname))); 


// --- RUTAS DE LA API (ENDPOINTs) ---

// 1. RUTA DE LOGIN (POST /api/login)
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    
    // Credenciales de prueba: paciente@test.com / 12345
    const resultado = await loginService.login(email, password);

    if (resultado.exito) {
        return res.json({ 
            success: true, 
            message: resultado.mensaje,
            token: "simulated_token_12345",
            redirectUrl: "Inicio.html",
        });
    } else {
        return res.status(401).json({ 
            success: false, 
            message: resultado.mensaje 
        });
    }
});


// 2. RUTA DE CITAS: OBTENER CITAS POR USUARIO (GET /api/citas/:userId)
app.get('/api/citas/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId); 
    const citas = await citasService.obtenerCitasParaCalendario(userId);
    res.status(200).json({ success: true, citas: citas });
});


// 3. RUTA DE CITAS: AGENDAR NUEVA CITA (POST /api/citas/agendar)
app.post('/api/citas/agendar', async (req, res) => {
    const datosCita = req.body; 
    
    try {
        const nuevaCita = await citasService.crearCita(datosCita);
        res.status(201).json({ success: true, message: "Cita agendada (Simulación).", cita: nuevaCita });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || "Error al agendar la cita." });
    }
});


// 4. RUTA DE CITAS: CANCELAR UNA CITA (POST /api/citas/cancelar)
app.post('/api/citas/cancelar', async (req, res) => {
    const { citaId } = req.body; 
    const exito = await citasService.cancelarCita(parseInt(citaId));

    if (exito) {
        res.status(200).json({ success: true, message: `Cita ${citaId} cancelada (Simulación).` });
    } else {
        res.status(404).json({ success: false, message: "Cita no encontrada." });
    }
});


// --- INICIO DEL SERVIDOR ---
app.listen(PORT, () => {
    console.log(`Servidor de MindWell ejecutándose en http://localhost:${PORT}`);
    console.log(`¡Servicios de Login y Citas listos!`);
});