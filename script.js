const words = [
    "amor", "sexo", "pasión", "besitos", "apoyo", "ternura",
    "bebés", "celos", "golpes", "daño", "mordidas", "familia",
    "infidelidad", "heridas", "calzones", "odio", "envidia",
    "maldad", "inseguridad", "paz"
];

const wordsContainer = document.getElementById("wordsContainer");
const dropZone = document.getElementById("dropZone");
const doneBtn = document.getElementById("doneBtn");
const resultMessage = document.getElementById("resultMessage");

let draggedElement = null;

// Crear palabras dinámicamente
words.forEach(word => {
    const div = document.createElement("div");
    div.classList.add("word");
    div.textContent = word;
    div.setAttribute("draggable", true);

    // Drag desktop
    div.addEventListener("dragstart", () => {
        draggedElement = div;
    });

    wordsContainer.appendChild(div);
});

// Drop desktop
dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("active");
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("active");
});

dropZone.addEventListener("drop", () => {
    dropZone.classList.remove("active");
    if (draggedElement) {
        dropZone.appendChild(draggedElement);
    }
});

// Soporte táctil móvil
document.querySelectorAll(".word").forEach(word => {
    word.addEventListener("pointerdown", (e) => {
        draggedElement = word;
        word.setPointerCapture(e.pointerId);
    });

    word.addEventListener("pointerup", (e) => {
        const rect = dropZone.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;

        if (
            x > rect.left &&
            x < rect.right &&
            y > rect.top &&
            y < rect.bottom
        ) {
            dropZone.appendChild(word);
        }
    });
});

// Botón finalizar
doneBtn.addEventListener("click", () => {
    const selectedWords = dropZone.querySelectorAll(".word");

    if (selectedWords.length === 0) {
        resultMessage.textContent = "No elegiste nada… la relación no se cuida sola 💭";
        return;
    }

    const list = Array.from(selectedWords).map(w => w.textContent).join(", ");

    resultMessage.textContent = `Elegiste construir nuestra relación con: ${list}.`;
});
