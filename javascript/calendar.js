// calendar.js

// ===============================================================
// SIMULACIÓN DE DATOS (Citas y Psicólogos) - SOURCE OF TRUTH
// ===============================================================

// Estructura de citas: Mes 0=Enero, 8=Septiembre, 9=Octubre
const masterAppointments = [
    // Septiembre (Mes 8)
    { id: 101, year: 2025, month: 8, day: 3, time: '3:00 p.m.', doctor: 'Dr. David Palacio', status: 'pending', statusClass: 'status-pending' },
    { id: 102, year: 2025, month: 8, day: 4, time: '9:00 a.m.', doctor: 'Dr. Carlos Gutiérrez', status: 'canceled', statusClass: 'status-canceled' },
    { id: 103, year: 2025, month: 8, day: 14, time: '11:00 a.m.', doctor: 'Lic. Ana Méndez', status: 'completed', statusClass: 'status-completed' },
    { id: 104, year: 2025, month: 8, day: 29, time: '1:00 p.m.', doctor: 'Dr. Carlos Gutiérrez', status: 'completed', statusClass: 'status-completed' },

    // Octubre (Mes 9 - La fecha actual/por defecto)
    { id: 105, year: 2025, month: 9, day: 3, time: '10:00 a.m.', doctor: 'Dr. David Palacio', status: 'pending', statusClass: 'status-pending' },
    { id: 106, year: 2025, month: 9, day: 15, time: '4:00 p.m.', doctor: 'Dr. Carlos Gutiérrez', status: 'completed', statusClass: 'status-completed' },
    { id: 107, year: 2025, month: 9, day: 20, time: '9:00 a.m.', doctor: 'Lic. Ana Méndez', status: 'pending', statusClass: 'status-pending' },
    { id: 108, year: 2025, month: 9, day: 30, time: '2:00 p.m.', doctor: 'Dr. Carlos Gutiérrez', status: 'pending', statusClass: 'status-pending' },
];

const psychologists = [
    // ¡IMPORTANTE! Se usaron IDs en minúsculas y guiones bajos para que coincidan con la lógica de chat
    { id: 'dr_carlos', name: 'Dr. Carlos Gutiérrez', specialization: 'Psicólogo Infantil y Juvenil. Especialista en TDAH...', rating: '⭐⭐⭐⭐⭐', image: 'imagenes/91496062-man-psychologist-specialist-professional-doctor-in-the-office.jpg' },
    { id: 'lic_ana', name: 'Lic. Ana Méndez', specialization: 'Licenciada en Psicología Clínica, experta en TCC...', rating: '⭐⭐⭐⭐', image: 'imagenes/psicologa-sonriendo.jpg' },
    { id: 'dr_david', name: 'Dr. David Palacio', specialization: 'Especialista en Terapia Familiar Sistémica...', rating: '⭐⭐⭐', image: 'imagenes/images.jpg' },
    { id: 'dr_jensell', name: 'Dr. Jensell Saballos', specialization: 'Psicologo con enfoque a la salud mental y bienestar emocional...', rating: '⭐⭐⭐⭐', image: 'imagenes/01.jpeg' }
];

// Función para obtener el estado del día (sin cambios)
function getDayStatus(year, month, day) {
    const appointmentsOnDay = masterAppointments.filter(a => 
        a.year === year && a.month === month && a.day === day
    );

    if (appointmentsOnDay.some(a => a.status === 'canceled')) return 'red'; 
    if (appointmentsOnDay.some(a => a.status === 'pending' || a.status === 'scheduled')) return 'yellow'; 
    if (appointmentsOnDay.some(a => a.status === 'completed')) return 'green';
    
    return null;
}

// Lógica de sincronización de estado (sin cambios)
function handleStatusChange(event) {
    const selectElement = event.target;
    const newStatus = selectElement.value;
    const appointmentId = parseInt(selectElement.getAttribute('data-appointment-id'));
    
    const appointmentIndex = masterAppointments.findIndex(a => a.id === appointmentId);
    if (appointmentIndex !== -1) {
        masterAppointments[appointmentIndex].status = newStatus;
        masterAppointments[appointmentIndex].statusClass = `status-${newStatus}`;
        
        const { year, month, day } = masterAppointments[appointmentIndex];

        const appointmentItem = selectElement.closest('.appointment-item');
        appointmentItem.className = appointmentItem.className.replace(/status-(completed|pending|canceled)/g, '');
        appointmentItem.classList.add(`status-${newStatus}`);

        renderCalendar(true, year, month, day); 
    }
}


// ===============================================================
// INICIALIZACIÓN Y LÓGICA PRINCIPAL
// ===============================================================

document.addEventListener('DOMContentLoaded', () => {
    // Inicialización de variables (sin cambios)
    const today = new Date();
    let currentDay = new Date(2025, 8, 1);
    let currentMonth = currentDay.getMonth();
    let currentYear = currentDay.getFullYear();
    let selectedDayElement = null;
    let selectedDayValue = null;

    // Elementos del DOM del Calendario (sin cambios)
    const monthYearDisplay = document.getElementById('current-month-year');
    const daysGrid = document.getElementById('calendar-days-grid');
    const prevBtn = document.getElementById('prev-month-btn');
    const nextBtn = document.getElementById('next-month-btn');
    const appointmentsContainer = document.getElementById('appointment-list-container');
    
    // Elementos del DOM de Psicólogos (sin cambios)
    const searchInput = document.getElementById('search-input');
    const psychologistListContainer = document.getElementById('psychologist-list');

    const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    // Funciones del Calendario (sin cambios significativos)
    function renderCalendar(reselect = false, reselYear, reselMonth, reselDay) {
        // ... (Contenido de renderCalendar) ...
        monthYearDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;

        daysGrid.innerHTML = '';
        if (!reselect) {
            selectedDayElement = null; 
            selectedDayValue = null;
        }

        dayNames.forEach(name => {
            const dayNameCell = document.createElement('div');
            dayNameCell.classList.add('day-name');
            dayNameCell.textContent = name;
            daysGrid.appendChild(dayNameCell);
        });
        
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.innerHTML = '&nbsp;'; 
            daysGrid.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('day-number');
            dayCell.textContent = day;

            const statusClass = getDayStatus(currentYear, currentMonth, day);
            if (statusClass) {
                dayCell.classList.add(statusClass);
            }
            
            if (reselect && day === reselDay && currentYear === reselYear && currentMonth === reselMonth) {
                dayCell.classList.add('selected-day');
                selectedDayElement = dayCell;
                selectedDayValue = day;
            }

            dayCell.addEventListener('click', () => {
                if (selectedDayElement) {
                    selectedDayElement.classList.remove('selected-day');
                }
                
                dayCell.classList.add('selected-day');
                selectedDayElement = dayCell;
                selectedDayValue = day;
                
                displayAppointments(currentYear, currentMonth, day);
            });

            daysGrid.appendChild(dayCell);
        }
        
        if (!reselect) {
            const defaultDay = daysGrid.querySelector('.day-number');
            if (defaultDay) {
                defaultDay.classList.add('selected-day');
                selectedDayElement = defaultDay;
                selectedDayValue = parseInt(defaultDay.textContent);
                displayAppointments(currentYear, currentMonth, selectedDayValue);
            }
        } else if (selectedDayElement) {
            displayAppointments(currentYear, currentMonth, selectedDayValue);
        }
    }

    function displayAppointments(year, month, day) {
        // ... (Contenido de displayAppointments) ...
        const filteredAppointments = masterAppointments.filter(a => 
            a.year === year && a.month === month && a.day === day
        );

        appointmentsContainer.innerHTML = '';

        if (filteredAppointments.length === 0) {
            appointmentsContainer.innerHTML = '<p style="text-align: center; color: #777; margin-top: 15px;">No hay citas agendadas para esta fecha.</p>';
            return;
        }

        filteredAppointments.forEach(app => {
            const html = `
                <div class="appointment-item ${app.statusClass}">
                    <div class="appointment-info">
                        <span class="time">${app.time}</span>
                        <span class="doctor">${app.doctor}</span>
                    </div>
                    <select data-appointment-id="${app.id}">
                        <option value="completed" ${app.status === 'completed' ? 'selected' : ''}>Completada</option>
                        <option value="pending" ${app.status === 'pending' ? 'selected' : ''}>Pendiente</option>
                        <option value="canceled" ${app.status === 'canceled' ? 'selected' : ''}>Cancelada</option>
                    </select>
                </div>
            `;
            appointmentsContainer.innerHTML += html;
        });

        document.querySelectorAll('.appointment-item select').forEach(select => {
            select.addEventListener('change', handleStatusChange);
        });
    }

    // Lógica de Navegación (sin cambios)
    prevBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    nextBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });
    
    // ===============================================================
    // FUNCIONES DE PSICÓLOGOS (Renderizado y Búsqueda)
    // ===============================================================

    // MODIFICADA para usar la lógica de localStorage y redirección al chat
    function renderPsychologists(psychos) {
        psychologistListContainer.innerHTML = '';
        if (psychos.length === 0) {
            psychologistListContainer.innerHTML = '<p class="no-results" style="text-align: center; color: #777; margin-top: 15px;">No se encontraron especialistas que coincidan con la búsqueda.</p>';
            return;
        }
        
        psychos.forEach(psycho => {
            // *** HTML MODIFICADO: ELIMINADO EL BOTÓN 'Ver Perfil' ***
            const html = `
                <div class="psychologist-card" data-id="${psycho.id}" data-name="${psycho.name}">
                    <img src="${psycho.image}" alt="${psycho.name}">
                    <div class="psychologist-details">
                        <h4>
                            ${psycho.name}
                            <div class="action-buttons"> 
                                <button class="chat-btn">Chatear</button>
                            </div>
                        </h4>
                        <span class="rating">${psycho.rating}</span>
                        <p class="description">${psycho.specialization}</p>
                    </div>
                </div>
            `;
            
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html.trim();
            const card = tempDiv.firstChild; 

            // Integrar la lógica de redirección con localStorage 
            card.querySelector('.chat-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                const psychoId = card.getAttribute('data-id');
                // USAR LOCALSTORAGE para la redirección al chat
                localStorage.setItem('redirect_to_chat_id', psychoId); 
                window.location.href = 'chats.html';
            });
            
            // *** LÓGICA DE 'VER PERFIL' ELIMINADA ***
            // La lógica de hacer clic en la tarjeta para chatear se mantiene
            card.addEventListener('click', () => {
                const psychoId = card.getAttribute('data-id');
                localStorage.setItem('redirect_to_chat_id', psychoId);
                window.location.href = 'chats.html';
            });

            psychologistListContainer.appendChild(card);
        });
    }

    // Función de búsqueda (sin cambios)
    function handleSearch() {
        const query = searchInput.value.toLowerCase().trim();
        const filtered = psychologists.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.specialization.toLowerCase().includes(query)
        );
        renderPsychologists(filtered);
    }


    // ===============================================================
    // INICIO DE LA APLICACIÓN
    // ===============================================================
    renderCalendar();
    renderPsychologists(psychologists); 
    searchInput.addEventListener('input', handleSearch);
});