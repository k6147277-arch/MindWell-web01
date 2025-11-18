

// Array simulado con propiedades alineadas para que loadChatWindow funcione.
// ESTA LISTA DEBE REFLEJAR LOS ID's Y NOMBRES DE calendar.js
const PSICOLOGOS_MASTER_LIST = [
    { id: 'dr_carlos', nombre: 'Dr. Carlos Gutiérrez', especialidad: 'Psicólogo Infantil y Juvenil. Especialista en TDAH...', img: 'imagenes/91496062-man-psychologist-specialist-professional-doctor-in-the-office.jpg' },
    { id: 'lic_ana', nombre: 'Lic. Ana Méndez', especialidad: 'Licenciada en Psicología Clínica, experta en TCC...', img: 'imagenes/psicologa-sonriendo.jpg' },
    { id: 'dr_david', nombre: 'Dr. David Palacio', especialidad: 'Especialista en Terapia Familiar Sistémica...', img: 'imagenes/images.jpg' },
    { id: 'dr_jensell', nombre: 'Dr. Jensell Saballos', especialidad: 'Terapia de Pareja y Manejo de Ansiedad.', img: 'imagenes/01.jpeg' }
];

function getPsicologoById(id) {
    const p = PSICOLOGOS_MASTER_LIST.find(p => p.id === id);
    if (p) {
        return {
            id: p.id,
            nombre: p.nombre, // Usado en loadChatWindow
            img: p.img
        }
    }
    return null;
}


// Estructura para almacenar chats activos en el localStorage (simulación de chats iniciados)
const CHAT_STORAGE_KEY = 'mindwell_active_chats';

function getActiveChats() {
    const chats = localStorage.getItem(CHAT_STORAGE_KEY);
    return chats ? JSON.parse(chats) : [];
}

function saveActiveChats(chats) {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chats));
}


/**
 * Carga el estado inicial cuando la lista de chats está vacía.
 */
function loadEmptyChatWindow() {
    const chatInput = document.querySelector('.chat-input');
    const headerName = document.getElementById('header-name');
    const headerAvatar = document.getElementById('header-avatar');
    const messagesArea = document.getElementById('messages-area');
    const deleteChatBtn = document.getElementById('delete-chat-btn');
    
    if (chatInput) chatInput.style.display = 'none';
    if (headerName) headerName.textContent = 'Selecciona un chat';
    if (headerAvatar) headerAvatar.src = '';
    if (messagesArea) messagesArea.innerHTML = '<p style="text-align: center; color: #777; margin-top: 50px;">Selecciona una conversación para empezar.</p>';
    if (deleteChatBtn) deleteChatBtn.style.display = 'none';
}


/**
 * Carga el contenido de la ventana de chat (header y mensajes).
 */
function loadChatWindow(chat, isNewChat = false) {
    const headerName = document.getElementById('header-name');
    const headerAvatar = document.getElementById('header-avatar');
    const messagesArea = document.getElementById('messages-area');
    const chatInput = document.querySelector('.chat-input');
    const deleteChatBtn = document.getElementById('delete-chat-btn');

    if (!headerName || !headerAvatar || !messagesArea || !chatInput || !deleteChatBtn) {
        console.error("Elementos del chat no encontrados en el DOM.");
        return;
    }

    // Mostrar el botón de eliminar chat
    deleteChatBtn.style.display = 'inline-block';

    // Actualizar Header
    headerName.textContent = chat.nombre;
    headerAvatar.src = chat.img;

    // Mostrar el área de escritura
    chatInput.style.display = 'flex'; 

    // Cargar mensajes (Se mantiene la simulación)
    messagesArea.innerHTML = '';
    
    if (isNewChat) {
        messagesArea.innerHTML = `
            <div class="date-divider"><span>HOY</span></div>
            <div class="message other">
                <div class="message-content">
                    Bienvenido/a. Soy ${chat.nombre}, tu especialista.
                    Es un placer saludarte. ¿Cómo te sientes hoy y en qué te gustaría trabajar?
                    <span class="message-time">4:15 PM</span>
                </div>
            </div>
            <p style="text-align: center; color: #777; margin-top: 20px;">¡Este es el inicio de tu conversación!</p>
        `;
    } else {
        // Simular historial de chat si no es nuevo
         messagesArea.innerHTML = `
            <div class="date-divider"><span>AYER</span></div>
            <div class="message other">
                <div class="message-content">
                    Hola. El tema de la ansiedad es complejo, pero tiene solución. ¡Cuenta conmigo!
                    <span class="message-time">10:00 AM</span>
                </div>
            </div>
            <div class="message self">
                <div class="message-content">
                    Muchas gracias, me tranquiliza saberlo.
                    <span class="message-time">10:05 AM</span>
                </div>
            </div>
            <div class="date-divider"><span>HOY</span></div>
            <div class="message other">
                <div class="message-content">
                    ¿Hay algo específico que te preocupe hoy?
                    <span class="message-time">4:15 PM</span>
                </div>
            </div>
        `;
    }
    
    // Asegurar scroll al final
    messagesArea.scrollTop = messagesArea.scrollHeight; 
    
    // -------------------------------------------------------------
    // ⭐ Lógica para el botón de "Eliminar Chat" 
    // -------------------------------------------------------------
    deleteChatBtn.onclick = null; 
    deleteChatBtn.onclick = () => {
        if (confirm(`¿Estás seguro de que quieres eliminar la conversación con ${chat.nombre}?`)) {
            let currentChats = getActiveChats();
            currentChats = currentChats.filter(c => c.id !== chat.id);
            saveActiveChats(currentChats);
            
            // Recargar la vista de chats para que se actualice la lista
            renderChatSidebar();
        }
    };
    
    // -------------------------------------------------------------
    
    // Lógica básica de envío de mensaje (Se mantiene la simulación)
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-message-btn');

    sendButton.onclick = null;
    sendButton.onclick = () => {
        const text = messageInput.value.trim();
        if (text) {
            messagesArea.innerHTML += `
                <div class="message self">
                    <div class="message-content">
                        ${text}
                        <span class="message-time">${new Date().toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})}</span>
                    </div>
                </div>
            `;
            messageInput.value = '';
            messagesArea.scrollTop = messagesArea.scrollHeight; 
        }
    };
}


/**
 * Función central para cargar la lista de chats y manejar redirecciones.
 */
function renderChatSidebar() {
    const chatListContainer = document.getElementById('chat-list-container');
    if (!chatListContainer) return; 

    let activeChats = getActiveChats();
    const redirectToId = localStorage.getItem('redirect_to_chat_id');
    let activeChatId = null;
    let newChat = false;

    // 1. Manejar Redirección/Nuevo Chat
    if (redirectToId) {
        const targetPsicologoData = getPsicologoById(redirectToId); 
        
        if (targetPsicologoData && !activeChats.some(chat => chat.id === redirectToId)) {
            // Es un nuevo chat, lo añade a la lista con datos completos
            activeChats.push({ ...targetPsicologoData, lastMessageTime: Date.now() });
            saveActiveChats(activeChats);
            newChat = true;
        }
        activeChatId = redirectToId; 
        localStorage.removeItem('redirect_to_chat_id'); 
    }

    if (!activeChatId && activeChats.length > 0) {
        activeChatId = activeChats[0].id;
    }

    // 2. Renderizar la lista de chats
    chatListContainer.innerHTML = '';
    
    if (activeChats.length === 0) {
        chatListContainer.innerHTML = '<p style="text-align: center; color: #777; margin-top: 15px; padding: 10px;">No has iniciado ninguna conversación. Ve a "Inicio" para contactar a un especialista.</p>';
        loadEmptyChatWindow();
        return;
    }

    activeChats.forEach(chat => {
        const item = document.createElement('div');
        item.classList.add('chat-item');
        if (chat.id === activeChatId) {
            item.classList.add('active');
        }
        item.dataset.chatId = chat.id;

        item.innerHTML = `
            <img src="${chat.img}" alt="Avatar">
            <div class="chat-info">
                <strong>${chat.nombre}</strong>
                <p>¡Hola! ¿En qué puedo ayudarte hoy?</p>
            </div>
            ${chat.unreadCount ? `<span class="unread-count">${chat.unreadCount}</span>` : ''}
        `;

        item.addEventListener('click', () => {
            // Lógica para cambiar de chat activo
            document.querySelectorAll('.chat-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            loadChatWindow(chat); // Cargar la ventana del chat seleccionado
        });

        chatListContainer.appendChild(item);
    });

    // 3. Cargar la ventana de chat si hay un chat activo
    const initialChat = activeChats.find(chat => chat.id === activeChatId);
    if (initialChat) {
        loadChatWindow(initialChat, newChat);
    } else {
        loadEmptyChatWindow();
    }
}


/**
 * Función para buscar y filtrar la lista de chats activos en el sidebar.
 * Ahora solo OCULTA/MUESTRA los chats ya renderizados.
 */
function setupSearchFunctionality() {
    const searchInput = document.getElementById('chat-search-input');
    const chatListContainer = document.getElementById('chat-list-container');
    
    if (searchInput && chatListContainer) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.trim().toLowerCase();
            const allChatItems = document.querySelectorAll('#chat-list-container .chat-item');

            allChatItems.forEach(item => {
                const chatName = item.querySelector('strong').textContent.toLowerCase();
                
                if (chatName.includes(searchTerm) || searchTerm === '') {
                    item.style.display = 'flex'; // Mostrar si coincide o si el campo está vacío
                } else {
                    item.style.display = 'none'; // Ocultar si no coincide
                }
            });
        });
    }
}


// Ejecutar la lógica al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Si estamos en chats.html
    if (document.getElementById('chat-list-container')) {
        renderChatSidebar();
        setupSearchFunctionality();
    }
});