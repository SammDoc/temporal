// Variables globales
let selectedWords = [];
let draggedElement = null;

// Elementos del DOM
const elementsArea = document.getElementById('elementsArea');
const dropZone = document.getElementById('dropZone');
const selectedItems = document.getElementById('selectedItems');
const submitBtn = document.getElementById('submitBtn');
const result = document.getElementById('result');

// Soporte para touch events (móviles)
let touchStartX, touchStartY;
let currentTouchElement = null;

// Inicializar eventos
function init() {
    const draggableElements = document.querySelectorAll('.draggable-element');
    
    draggableElements.forEach(element => {
        // Eventos de arrastre para desktop
        element.addEventListener('dragstart', handleDragStart);
        element.addEventListener('dragend', handleDragEnd);
        
        // Eventos táctiles para móviles
        element.addEventListener('touchstart', handleTouchStart, { passive: false });
        element.addEventListener('touchmove', handleTouchMove, { passive: false });
        element.addEventListener('touchend', handleTouchEnd, { passive: false });
    });

    // Eventos de la zona de soltar
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('drop', handleDrop);
    dropZone.addEventListener('dragleave', handleDragLeave);

    // Evento del botón enviar
    submitBtn.addEventListener('click', handleSubmit);
}

// Desktop drag events
function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    dropZone.classList.add('drag-over');
    return false;
}

function handleDragLeave(e) {
    dropZone.classList.remove('drag-over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    e.preventDefault();
    
    dropZone.classList.remove('drag-over');
    
    if (draggedElement) {
        addWordToBox(draggedElement);
    }
    
    return false;
}

// Touch events para móviles
function handleTouchStart(e) {
    e.preventDefault();
    currentTouchElement = this;
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    
    this.classList.add('dragging');
    
    // Crear un elemento visual que sigue el dedo
    const clone = this.cloneNode(true);
    clone.id = 'touch-clone';
    clone.style.position = 'fixed';
    clone.style.zIndex = '1000';
    clone.style.pointerEvents = 'none';
    clone.style.opacity = '0.8';
    clone.style.left = touch.clientX - this.offsetWidth / 2 + 'px';
    clone.style.top = touch.clientY - this.offsetHeight / 2 + 'px';
    document.body.appendChild(clone);
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!currentTouchElement) return;
    
    const touch = e.touches[0];
    const clone = document.getElementById('touch-clone');
    
    if (clone) {
        clone.style.left = touch.clientX - clone.offsetWidth / 2 + 'px';
        clone.style.top = touch.clientY - clone.offsetHeight / 2 + 'px';
    }
    
    // Verificar si está sobre la zona de soltar
    const dropZoneRect = dropZone.getBoundingClientRect();
    if (
        touch.clientX >= dropZoneRect.left &&
        touch.clientX <= dropZoneRect.right &&
        touch.clientY >= dropZoneRect.top &&
        touch.clientY <= dropZoneRect.bottom
    ) {
        dropZone.classList.add('drag-over');
    } else {
        dropZone.classList.remove('drag-over');
    }
}

function handleTouchEnd(e) {
    e.preventDefault();
    
    const clone = document.getElementById('touch-clone');
    if (clone) {
        clone.remove();
    }
    
    if (!currentTouchElement) return;
    
    currentTouchElement.classList.remove('dragging');
    
    const touch = e.changedTouches[0];
    const dropZoneRect = dropZone.getBoundingClientRect();
    
    // Verificar si se soltó sobre la zona de soltar
    if (
        touch.clientX >= dropZoneRect.left &&
        touch.clientX <= dropZoneRect.right &&
        touch.clientY >= dropZoneRect.top &&
        touch.clientY <= dropZoneRect.bottom
    ) {
        addWordToBox(currentTouchElement);
    }
    
    dropZone.classList.remove('drag-over');
    currentTouchElement = null;
}

// Agregar palabra a la caja
function addWordToBox(element) {
    const word = element.getAttribute('data-word');
    
    // Evitar duplicados
    if (selectedWords.includes(word)) {
        return;
    }
    
    selectedWords.push(word);
    
    // Crear elemento en la caja
    const selectedElement = document.createElement('div');
    selectedElement.className = 'draggable-element ' + element.classList[1];
    selectedElement.textContent = word;
    selectedElement.setAttribute('data-word', word);
    
    // Permitir eliminar al hacer clic
    selectedElement.addEventListener('click', function() {
        removeWordFromBox(word, selectedElement);
    });
    
    selectedItems.appendChild(selectedElement);
    
    // Ocultar elemento original
    element.classList.add('hidden');
    
    // Actualizar estado de la zona de soltar
    dropZone.classList.add('has-items');
}

// Eliminar palabra de la caja
function removeWordFromBox(word, element) {
    // Remover de la lista
    selectedWords = selectedWords.filter(w => w !== word);
    
    // Remover elemento visual
    element.remove();
    
    // Mostrar elemento original nuevamente
    const originalElement = document.querySelector(`.draggable-element[data-word="${word}"]`);
    if (originalElement) {
        originalElement.classList.remove('hidden');
    }
    
    // Actualizar estado de la zona de soltar
    if (selectedWords.length === 0) {
        dropZone.classList.remove('has-items');
    }
}

// Manejar envío
function handleSubmit() {
    if (selectedWords.length === 0) {
        result.textContent = '💔 Por favor, selecciona al menos una respuesta arrastrándola a la caja.';
        result.classList.add('show');
        setTimeout(() => {
            result.classList.remove('show');
        }, 3000);
        return;
    }
    
    // Mostrar resultado
    result.innerHTML = `
        <strong>💝 Has elegido ofrecer:</strong><br><br>
        ${selectedWords.map(w => `<span style="display: inline-block; margin: 5px; padding: 8px 12px; background: rgba(255,255,255,0.7); border-radius: 15px;">${w}</span>`).join('')}
        <br><br>
        <em>¡Hermoso compromiso para cultivar el amor eterno! 💕</em>
    `;
    result.classList.add('show');
    
    // Scroll hacia el resultado
    setTimeout(() => {
        result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// Inicializar cuando cargue el DOM
document.addEventListener('DOMContentLoaded', init);
