// Estado del juego
let piecesPlaced = 0;
const totalPieces = 5;

// Elementos del DOM
const pieces = document.querySelectorAll('.heart-piece');
const dropZones = document.querySelectorAll('.drop-zone');
const pieceCountDisplay = document.getElementById('piece-count');
const resetBtn = document.getElementById('reset-btn');
const successMessage = document.getElementById('success-message');

// Pieza que se está arrastrando actualmente
let draggedPiece = null;

// Inicializar eventos de drag and drop
function initDragAndDrop() {
    // Eventos para las piezas
    pieces.forEach(piece => {
        piece.addEventListener('dragstart', handleDragStart);
        piece.addEventListener('dragend', handleDragEnd);
    });

    // Eventos para las zonas de drop
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragenter', handleDragEnter);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', handleDrop);
    });

    // Evento para el botón de reset
    resetBtn.addEventListener('click', resetGame);
}

// Cuando empieza a arrastrar una pieza
function handleDragStart(e) {
    draggedPiece = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

// Cuando termina de arrastrar
function handleDragEnd(e) {
    this.classList.remove('dragging');
}

// Cuando pasa sobre una zona de drop
function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

// Cuando entra a una zona de drop
function handleDragEnter(e) {
    this.classList.add('drag-over');
}

// Cuando sale de una zona de drop
function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

// Cuando suelta la pieza en una zona
function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    this.classList.remove('drag-over');
    
    // Verificar si la pieza corresponde a esta zona
    const pieceNumber = draggedPiece.getAttribute('data-piece');
    const zoneNumber = this.getAttribute('data-piece');
    
    if (pieceNumber === zoneNumber) {
        // Pieza correcta
        placePieceCorrectly(draggedPiece, this);
    } else {
        // Pieza incorrecta - hacer un efecto de rebote
        animateWrongPlacement(draggedPiece);
    }
    
    return false;
}

// Colocar la pieza correctamente
function placePieceCorrectly(piece, zone) {
    // Obtener la posición de la zona
    const zoneRect = zone.getBoundingClientRect();
    const moldRect = zone.parentElement.getBoundingClientRect();
    
    // Calcular posición relativa
    const relativeTop = zoneRect.top - moldRect.top;
    const relativeLeft = zoneRect.left - moldRect.left;
    
    // Mover la pieza al molde
    piece.style.position = 'absolute';
    piece.style.top = `${relativeTop}px`;
    piece.style.left = `${relativeLeft}px`;
    piece.style.width = `${zoneRect.width}px`;
    piece.style.height = `${zoneRect.height}px`;
    
    // Agregar al molde
    zone.parentElement.appendChild(piece);
    
    // Marcar como colocada
    piece.classList.add('placed', 'correct-position');
    piece.setAttribute('draggable', 'false');
    
    // Incrementar contador
    piecesPlaced++;
    updateProgress();
    
    // Reproducir sonido (opcional)
    playSuccessSound();
    
    // Verificar si completó el juego
    if (piecesPlaced === totalPieces) {
        setTimeout(showSuccessMessage, 500);
    }
}

// Animación cuando se coloca en el lugar incorrecto
function animateWrongPlacement(piece) {
    piece.style.animation = 'shake 0.5s ease';
    
    setTimeout(() => {
        piece.style.animation = '';
    }, 500);
    
    // Agregar estilo de shake si no existe
    if (!document.querySelector('#shake-style')) {
        const style = document.createElement('style');
        style.id = 'shake-style';
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-10px); }
                75% { transform: translateX(10px); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Actualizar el progreso
function updateProgress() {
    pieceCountDisplay.textContent = piecesPlaced;
    pieceCountDisplay.style.animation = 'pulse 0.3s ease';
    
    setTimeout(() => {
        pieceCountDisplay.style.animation = '';
    }, 300);
}

// Mostrar mensaje de éxito
function showSuccessMessage() {
    successMessage.classList.remove('hidden');
    successMessage.classList.add('show');
    
    // Crear confeti
    createConfetti();
}

// Crear efecto de confeti
function createConfetti() {
    const colors = ['#ff1744', '#e91e63', '#ec407a', '#f48fb1', '#f06292'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.opacity = '1';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            confetti.style.transition = 'all 3s ease-out';
            confetti.style.zIndex = '999';
            confetti.style.borderRadius = '50%';
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.style.top = '100vh';
                confetti.style.opacity = '0';
                confetti.style.transform = `rotate(${Math.random() * 720}deg)`;
            }, 10);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 30);
    }
}

// Sonido de éxito (simple beep usando Web Audio API)
function playSuccessSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Si no funciona el audio, no pasa nada
        console.log('Audio no disponible');
    }
}

// Reiniciar el juego
function resetGame() {
    // Ocultar mensaje de éxito
    successMessage.classList.remove('show');
    setTimeout(() => {
        successMessage.classList.add('hidden');
    }, 300);
    
    // Resetear contador
    piecesPlaced = 0;
    updateProgress();
    
    // Volver las piezas al área de piezas
    const piecesArea = document.querySelector('.pieces-area');
    
    pieces.forEach(piece => {
        piece.classList.remove('placed', 'correct-position');
        piece.setAttribute('draggable', 'true');
        piece.style.position = 'relative';
        piece.style.top = 'auto';
        piece.style.left = 'auto';
        piece.style.width = '100px';
        piece.style.height = '100px';
        
        // Volver al área de piezas con una posición aleatoria
        piecesArea.appendChild(piece);
    });
    
    // Mezclar las piezas aleatoriamente
    shufflePieces();
}

// Mezclar las piezas aleatoriamente
function shufflePieces() {
    const piecesArea = document.querySelector('.pieces-area');
    const piecesArray = Array.from(pieces);
    
    // Algoritmo Fisher-Yates para mezclar
    for (let i = piecesArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        piecesArea.appendChild(piecesArray[j]);
    }
}

// Inicializar el juego cuando carga la página
document.addEventListener('DOMContentLoaded', () => {
    initDragAndDrop();
    shufflePieces();
});

// Soporte para dispositivos táctiles
let touchStartX = 0;
let touchStartY = 0;
let touchElement = null;
let clonedElement = null;

pieces.forEach(piece => {
    piece.addEventListener('touchstart', handleTouchStart, { passive: false });
    piece.addEventListener('touchmove', handleTouchMove, { passive: false });
    piece.addEventListener('touchend', handleTouchEnd, { passive: false });
});

function handleTouchStart(e) {
    if (this.classList.contains('placed')) return;
    
    touchElement = this;
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    
    // Crear un clon visual
    clonedElement = this.cloneNode(true);
    clonedElement.style.position = 'fixed';
    clonedElement.style.zIndex = '1000';
    clonedElement.style.pointerEvents = 'none';
    clonedElement.style.opacity = '0.8';
    document.body.appendChild(clonedElement);
    
    this.style.opacity = '0.3';
}

function handleTouchMove(e) {
    e.preventDefault();
    
    if (!clonedElement) return;
    
    const touch = e.touches[0];
    clonedElement.style.left = (touch.clientX - 50) + 'px';
    clonedElement.style.top = (touch.clientY - 50) + 'px';
}

function handleTouchEnd(e) {
    if (!touchElement) return;
    
    const touch = e.changedTouches[0];
    const dropZone = document.elementFromPoint(touch.clientX, touch.clientY);
    
    touchElement.style.opacity = '1';
    
    if (clonedElement) {
        clonedElement.remove();
        clonedElement = null;
    }
    
    // Verificar si se soltó sobre una zona válida
    if (dropZone && dropZone.classList.contains('drop-zone')) {
        const pieceNumber = touchElement.getAttribute('data-piece');
        const zoneNumber = dropZone.getAttribute('data-piece');
        
        if (pieceNumber === zoneNumber) {
            draggedPiece = touchElement;
            placePieceCorrectly(touchElement, dropZone);
        } else {
            animateWrongPlacement(touchElement);
        }
    }
    
    touchElement = null;
}
