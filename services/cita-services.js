// services/cita-services.js

// Almacenamiento simulado en memoria
let citas = [
    { id: 101, userId: 42, fecha: '2025-11-20T10:00:00', descripcion: 'Primera sesión' },
    { id: 102, userId: 42, fecha: '2025-11-27T14:30:00', descripcion: 'Seguimiento' }
];
let nextCitaId = 103;


class CitasService {
    /**
     * Obtiene una lista de citas para un usuario específico (simulación).
     */
    async obtenerCitasParaCalendario(userId) {
        // En una app real, aquí harías una consulta a la base de datos
        return citas.filter(cita => cita.userId === userId);
    }

    /**
     * Crea una nueva cita (simulación).
     */
    async crearCita(datosCita) {
        const nuevaCita = {
            id: nextCitaId++,
            userId: datosCita.userId || 42, 
            fecha: datosCita.fecha || new Date().toISOString(),
            descripcion: datosCita.descripcion || 'Nueva cita agendada'
        };
        citas.push(nuevaCita);
        return nuevaCita;
    }

    /**
     * Cancela una cita por su ID (simulación).
     */
    async cancelarCita(citaId) {
        const initialLength = citas.length;
        citas = citas.filter(cita => cita.id !== citaId);
        return citas.length < initialLength; // Devuelve true si se eliminó algo
    }
}

module.exports = CitasService;