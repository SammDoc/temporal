// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    const vela = document.getElementById('vela');
    const fuego = document.getElementById('fuego');
    const mensaje = document.getElementById('mensaje');
    const muebles = document.getElementById('muebles');
    const habitacion = document.querySelector('.habitacion');

    // Variable para evitar clicks múltiples
    let yaClickeado = false;

    // Evento click en la vela
    vela.addEventListener('click', function() {
        if (yaClickeado) return;
        yaClickeado = true;

        // Añadir clase de caída a la vela
        vela.classList.add('cayendo');

        // Después de que la vela caiga, iniciar el fuego
        setTimeout(function() {
            // Activar el fuego
            fuego.classList.add('activo');
            
            // Iluminar la habitación
            habitacion.classList.add('iluminada');
            
            // Hacer visibles los muebles
            muebles.classList.add('visible');
            
            // Mostrar el mensaje
            mensaje.classList.add('visible');
        }, 1000); // 1 segundo después de que empiece a caer
    });

    // Efecto de cursor especial en la vela
    vela.addEventListener('mouseenter', function() {
        if (!yaClickeado) {
            this.style.cursor = 'pointer';
        }
    });

    // Añadir partículas de fuego opcionales (efecto extra)
    function crearParticula() {
        if (!fuego.classList.contains('activo')) return;

        const particula = document.createElement('div');
        particula.style.position = 'absolute';
        particula.style.bottom = '0';
        particula.style.left = Math.random() * 100 + '%';
        particula.style.width = '3px';
        particula.style.height = '3px';
        particula.style.background = '#ff' + Math.floor(Math.random() * 100) + '00';
        particula.style.borderRadius = '50%';
        particula.style.opacity = '1';
        particula.style.animation = 'particula-subir 3s ease-out forwards';
        
        fuego.appendChild(particula);

        setTimeout(() => {
            particula.remove();
        }, 3000);
    }

    // Crear partículas de fuego periódicamente
    setInterval(function() {
        if (fuego.classList.contains('activo')) {
            for (let i = 0; i < 3; i++) {
                crearParticula();
            }
        }
    }, 200);

    // Añadir la animación de partículas en CSS dinámicamente
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particula-subir {
            0% {
                transform: translateY(0) scale(1);
                opacity: 1;
            }
            100% {
                transform: translateY(-${window.innerHeight * 0.8}px) scale(0);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});
