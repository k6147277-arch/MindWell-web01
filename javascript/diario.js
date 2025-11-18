// ===============================================================
// Archivo: javascript/diario.js
// Lógica para el calendario interactivo y el registro de diario
// ===============================================================

// 1. SIMULACIÓN DE DATOS Y CONFIGURACIÓN DE EMOCIONES
// ---------------------------------------------------

// Datos de las emociones (Color, Emoji y ID para el guardado)
const EMOTIONS = [
    { id: 'alegria', name: 'Feliz', emoji: '😊', color: '#2ecc71' },     // Verde
    { id: 'tristeza', name: 'Triste', emoji: '😔', color: '#3498db' },    // Azul
    { id: 'calma', name: 'Calma', emoji: '😌', color: '#f39c12' },       // Naranja
    { id: 'estres', name: 'Estresado', emoji: '😫', color: '#e74c3c' },  // Rojo
    { id: 'neutral', name: 'Normal', emoji: '😐', color: '#bdc3c7' }     // Gris
];

// Base de datos simulada de entradas de diario (SIN CAMBIOS)
const DIARY_ENTRIES = {
    "2025-04-01": { text: "Estuve feliz", emotionId: 'alegria' },
    "2025-04-03": { text: "No sé ni por dónde empezar...", emotionId: 'estres' },
    "2025-04-06": { text: "Tuve una revelación increíble. Me sentí completamente motivado y feliz de estar vivo. ¡Qué gran día!", emotionId: 'calma' }, 
    "2025-04-13": { text: "Las cosas no salieron como esperaba. Siento que no estoy avanzando. Necesito hablar con el doctor pronto.", emotionId: 'neutral' }, 
    "2025-04-25": { text: "Necesito desconectarme y que se acabe el día. Me siento vacío y exhausto al mismo tiempo. Necesito respirar profundo y ver si mañana se siente un poco menos pesado", emotionId: 'tristeza' } 
};

// ===============================================================
// 2. VARIABLES DE ESTADO E INICIALIZACIÓN (SIN CAMBIOS)
// ===============================================================

let currentDay = new Date(2025, 3, 1); 
let currentMonth = currentDay.getMonth();
let currentYear = currentDay.getFullYear();
let selectedDayElement = null; 
let selectedDayValue = currentDay.getDate(); 
let selectedEmotionId = null;

const monthYearTitle = document.getElementById('current-month-year-title');
const monthYearDisplay = document.getElementById('current-month-year');
const daysGrid = document.getElementById('calendar-days-grid');
const entryModal = document.getElementById('entry-modal');
const entryDisplayText = document.getElementById('entry-display-text');
const entryDisplayDate = document.getElementById('entry-display-date');
const saveEntryBtn = document.getElementById('save-entry-btn');

const dayNames = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// ===============================================================
// 3. FUNCIONES DEL CALENDARIO Y DIARIO
// ===============================================================

// getDayEmotion (SIN CAMBIOS)
function getDayEmotion(year, month, day) {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const entry = DIARY_ENTRIES[dateKey];
    
    if (entry) {
        return EMOTIONS.find(e => e.id === entry.emotionId) || null;
    }
    
    const extraEmotions = {
        '2025-04-22': 'calma', 
        '2025-04-23': 'estres', 
        '2025-04-24': 'alegria' 
    };
    if (extraEmotions[dateKey]) {
        return EMOTIONS.find(e => e.id === extraEmotions[dateKey]);
    }

    return null;
}

/**
 * Renderiza el calendario completo.
 * CORRECCIÓN: Asegura que la variable selectedDayElement se actualice al renderizar.
 * @param {number} dayToSelect Día a seleccionar por defecto.
 */
function renderCalendar(dayToSelect = selectedDayValue) {
    const currentMonthName = monthNames[currentMonth];
    monthYearDisplay.textContent = `${currentMonthName} ${currentYear}`;
    monthYearTitle.textContent = `${currentMonthName} ${currentYear}`;

    daysGrid.innerHTML = '';
    
    dayNames.forEach(name => {
        daysGrid.innerHTML += `<div class="day-name">${name}</div>`;
    });
    
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    
    // Resetear la variable de selección antes de renderizar
    selectedDayElement = null; 

    // Rellenar con días del mes anterior (grises)
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const dateKey = `${new Date(currentYear, currentMonth, 0).getFullYear()}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const emotionData = getDayEmotion(new Date(currentYear, currentMonth, 0).getFullYear(), currentMonth - 1, day);
        const style = emotionData ? `background-color: ${emotionData.color}; color: white;` : 'color:#bdc3c7;';
        const content = emotionData ? `<span class="day-emoji">${emotionData.emoji}</span>${day}` : day;

        daysGrid.innerHTML += `<div class="day-number inactive" data-date-key="${dateKey}" style="${style}">${content}</div>`;
    }
    
    let dayToHighlight = dayToSelect;
    if (dayToHighlight > daysInMonth) {
        dayToHighlight = daysInMonth; 
    }
    
    // Rellenar con los días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const emotionData = getDayEmotion(currentYear, currentMonth, day);
        
        let cellContent = day;
        let cellClass = 'day-number';
        let style = '';

        if (emotionData) {
            style = `background-color: ${emotionData.color}; color: white;`;
            cellContent = `<span class="day-emoji">${emotionData.emoji}</span>${day}`;
        }
        
        if (day === dayToHighlight) {
            cellClass += ' selected-day';
        }

        const dayCell = document.createElement('div');
        dayCell.className = cellClass;
        dayCell.innerHTML = cellContent;
        dayCell.setAttribute('data-day', day);
        dayCell.setAttribute('data-date-key', dateKey);
        dayCell.style.cssText = style;

        daysGrid.appendChild(dayCell);
        
        dayCell.addEventListener('click', () => {
            handleDaySelection(dayCell, day, true);
        });
        
        // CORRECCIÓN CLAVE: Asignar el elemento DOM del día seleccionado a la variable global.
        if (day === dayToHighlight) {
             selectedDayElement = dayCell; 
        }
    }
    
    // Rellenar con días del mes siguiente (grises) (SIN CAMBIOS)
    const remainingCells = 42 - daysGrid.children.length; 
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;

    for (let i = 1; i <= remainingCells; i++) {
        const dateKey = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        daysGrid.innerHTML += `<div class="day-number inactive" data-date-key="${dateKey}" style="color:#bdc3c7;">${i}</div>`;
    }

    // Actualizar el valor global del día seleccionado y mostrar la entrada
    selectedDayValue = dayToHighlight; 
    const dateKeyToDisplay = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayToHighlight).padStart(2, '0')}`;
    displayEntry(dateKeyToDisplay);
}

// handleDaySelection (SIN CAMBIOS)
function handleDaySelection(dayCell, day, updateClass = true) {
    if (dayCell.classList.contains('inactive')) {
        return; 
    }

    if (selectedDayElement && updateClass) {
        selectedDayElement.classList.remove('selected-day');
    }
    if (updateClass) {
        dayCell.classList.add('selected-day');
    }
    
    selectedDayElement = dayCell; 
    selectedDayValue = day; 

    const dateKey = dayCell.getAttribute('data-date-key');
    displayEntry(dateKey);
}

// displayEntry (SIN CAMBIOS)
function displayEntry(dateKey) {
    const entry = DIARY_ENTRIES[dateKey];
    const [year, month, day] = dateKey.split('-');
    const displayDate = `${day}/${month}/${year}`;
    
    entryDisplayDate.textContent = displayDate;

    if (entry) {
        const emotion = EMOTIONS.find(e => e.id === entry.emotionId);
        const emotionColor = emotion ? emotion.color : '#3498db'; 
        const emotionText = emotion ? `${emotion.emoji} ${emotion.name}` : 'Desconocida';
        
        entryDisplayText.innerHTML = `
            <div style="font-size: 1.1em; font-weight: 600; margin-bottom: 10px; color: ${emotionColor};">
                Mi estado de ánimo fue: ${emotionText}
            </div>
            <p style="color: #333; line-height: 1.6;">${entry.text}</p>
        `;
        document.getElementById('entry-view-panel').style.borderLeft = `5px solid ${emotionColor}`;
    } else {
        entryDisplayText.innerHTML = '<p style="color: #777;">No hay entrada registrada para esta fecha. Usa "Nueva Entrada" para agregar una.</p>';
        document.getElementById('entry-view-panel').style.borderLeft = '5px solid var(--color-light-blue)';
    }
}

// openNewEntryModal (SIN CAMBIOS)
function openNewEntryModal() {
    // Si selectedDayElement es nulo (el error que estamos corrigiendo), se detiene aquí.
    if (!selectedDayElement || selectedDayElement.classList.contains('inactive')) {
        alert("Por favor, selecciona un día válido del mes actual para crear una entrada.");
        return;
    }
    
    const dateKey = selectedDayElement.getAttribute('data-date-key');
    
    if (DIARY_ENTRIES[dateKey]) {
        if (!confirm("Ya existe una entrada para este día. ¿Deseas sobrescribirla?")) {
            return;
        }
    }
    
    const [year, month, day] = dateKey.split('-');
    document.getElementById('modal-date').textContent = `${day}/${month}/${year}`;
    
    document.getElementById('diary-entry-text').value = DIARY_ENTRIES[dateKey] ? DIARY_ENTRIES[dateKey].text : '';
    
    selectedEmotionId = null;
    saveEntryBtn.disabled = true;
    
    entryModal.style.display = 'flex';
    renderEmotionOptions(DIARY_ENTRIES[dateKey] ? DIARY_ENTRIES[dateKey].emotionId : null);
}

// closeEntryModal (SIN CAMBIOS)
function closeEntryModal() {
    entryModal.style.display = 'none';
}

// renderEmotionOptions (SIN CAMBIOS)
function renderEmotionOptions(currentEmotionId = null) {
    const container = document.getElementById('emotion-selection');
    let html = '<h4>Selecciona tu emoción:</h4><div style="display: flex; gap: 10px; flex-wrap: wrap;">';

    EMOTIONS.forEach(emotion => {
        const isSelected = emotion.id === currentEmotionId;
        const colorStyle = `border: 2px solid ${emotion.color}; background: ${isSelected ? emotion.color : 'white'}; color: ${isSelected ? 'white' : emotion.color};`;
        
        html += `
            <button type="button" 
                class="emotion-btn ${isSelected ? 'selected-emotion' : ''}" 
                data-emotion-id="${emotion.id}" 
                style="${colorStyle}"
            >
                ${emotion.emoji} ${emotion.name}
            </button>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
    
    document.querySelectorAll('#emotion-selection .emotion-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('#emotion-selection .emotion-btn').forEach(b => {
                const emotion = EMOTIONS.find(e => e.id === b.getAttribute('data-emotion-id'));
                b.classList.remove('selected-emotion');
                b.style.backgroundColor = 'white';
                b.style.color = emotion.color; 
            });
            const emotion = EMOTIONS.find(e => e.id === this.getAttribute('data-emotion-id'));
            this.classList.add('selected-emotion');
            this.style.backgroundColor = emotion.color; 
            this.style.color = 'white';
            
            selectedEmotionId = this.getAttribute('data-emotion-id');
            saveEntryBtn.disabled = false; 
        });
    });
    
    if (currentEmotionId) {
         selectedEmotionId = currentEmotionId;
         saveEntryBtn.disabled = false;
    }
}


// saveEntry (SIN CAMBIOS)
function saveEntry() {
    const text = document.getElementById('diary-entry-text').value.trim();
    
    if (!text) {
        alert("El campo de diario no puede estar vacío.");
        return;
    }
    if (!selectedEmotionId) {
        alert("Debes seleccionar una emoción para guardar la entrada.");
        return;
    }

    const dateKey = selectedDayElement.getAttribute('data-date-key');
    
    DIARY_ENTRIES[dateKey] = {
        text: text,
        emotionId: selectedEmotionId
    };

    alert(`¡Entrada guardada para el día ${dateKey}!`);
    
    closeEntryModal();
    renderCalendar(); 
}

// setupEventListeners (SIN CAMBIOS)
function setupEventListeners() {
    document.getElementById('prev-month-btn').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(); 
    });

    document.getElementById('next-month-btn').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });
    
    document.getElementById('new-entry-btn').addEventListener('click', openNewEntryModal);
    document.getElementById('cancel-entry-btn').addEventListener('click', closeEntryModal);
    document.getElementById('save-entry-btn').addEventListener('click', saveEntry);

    entryModal.addEventListener('click', (e) => {
        if (e.target === entryModal) {
            closeEntryModal();
        }
    });
    
    renderCalendar(currentDay.getDate());
}

// LLAMADA DE INICIALIZACIÓN (SIN CAMBIOS)
window.onload = setupEventListeners;