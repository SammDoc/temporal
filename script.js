// Variables globales
let attemptCount = 0;
const MAX_ATTEMPTS = 5;

// Elementos del DOM
const introScreen = document.getElementById('intro-screen');
const questionScreen = document.getElementById('question-screen');
const punishmentScreen = document.getElementById('punishment-screen');
const finalScreen = document.getElementById('final-screen');

const giftButton = document.getElementById('gift-button');
const samBtn = document.getElementById('sam-btn');
const wrongBtn = document.getElementById('wrong-btn');

// Función para cambiar de pantalla
function switchScreen(fromScreen, toScreen) {
    fromScreen.classList.remove('active');
    setTimeout(() => {
        toScreen.classList.add('active');
    }, 500);
}

// Función para obtener posición aleatoria para el botón
function getRandomPosition() {
    const container = questionScreen;
    const btn = samBtn;
    
    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    
    const maxX = containerRect.width - btnRect.width - 40;
    const maxY = containerRect.height - btnRect.height - 40;
    
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * (maxY - 200) + 100; // Evitar la parte superior donde está la pregunta
    
    return { x: randomX, y: randomY };
}

// Función para mover el botón Sam
function moveSamButton() {
    const pos = getRandomPosition();
    samBtn.style.position = 'absolute';
    samBtn.style.left = pos.x + 'px';
    samBtn.style.top = pos.y + 'px';
    samBtn.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        samBtn.style.transform = 'scale(1)';
    }, 100);
}

// Event listener para la caja de regalo
giftButton.addEventListener('click', () => {
    switchScreen(introScreen, questionScreen);
});

// Event listener para el botón "Cualquier otra persona..."
wrongBtn.addEventListener('click', () => {
    // Mostrar pantalla de castigo
    questionScreen.classList.remove('active');
    punishmentScreen.classList.add('active');
    
    // Volver a la pantalla de pregunta después de 1 segundo
    setTimeout(() => {
        punishmentScreen.classList.remove('active');
        questionScreen.classList.add('active');
    }, 1000);
});

// Event listener para el botón "Sam"
samBtn.addEventListener('click', () => {
    attemptCount++;
    
    if (attemptCount <= MAX_ATTEMPTS) {
        // Mover el botón a una nueva posición
        moveSamButton();
    } else {
        // Mostrar pantalla final
        switchScreen(questionScreen, finalScreen);
    }
});

// Inicialización
window.addEventListener('load', () => {
    // La pantalla de intro ya está activa por defecto
    console.log('Presentación cargada');
});
