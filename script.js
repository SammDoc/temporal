// Sistema de partículas avanzado
class Particula {
    constructor(x, y, tipo) {
        this.x = x;
        this.y = y;
        this.tipo = tipo;
        this.vida = 1;
        this.velocidadX = (Math.random() - 0.5) * 4;
        this.velocidadY = -Math.random() * 6 - 2;
        this.tamaño = Math.random() * 4 + 2;
        this.gravedad = 0.1;
        this.friccion = 0.98;
        
        if (tipo === 'chispa') {
            this.color = `hsl(${Math.random() * 60 + 10}, 100%, ${Math.random() * 30 + 60}%)`;
            this.decaimiento = Math.random() * 0.02 + 0.01;
            this.velocidadY = -Math.random() * 12 - 3;
            this.velocidadX = (Math.random() - 0.5) * 8;
        } else if (tipo === 'brasa') {
            this.color = `hsl(${Math.random() * 40}, 100%, 50%)`;
            this.decaimiento = Math.random() * 0.015 + 0.005;
            this.velocidadY = -Math.random() * 4 - 1;
            this.tamaño = Math.random() * 6 + 3;
        } else if (tipo === 'humo') {
            this.color = `rgba(60, 60, 60, ${Math.random() * 0.3 + 0.1})`;
            this.decaimiento = Math.random() * 0.008 + 0.003;
            this.velocidadY = -Math.random() * 2 - 0.5;
            this.velocidadX = (Math.random() - 0.5) * 2;
            this.tamaño = Math.random() * 25 + 15;
            this.gravedad = -0.05;
        }
    }
    
    actualizar() {
        this.velocidadY += this.gravedad;
        this.velocidadX *= this.friccion;
        this.velocidadY *= this.friccion;
        
        this.x += this.velocidadX;
        this.y += this.velocidadY;
        
        this.vida -= this.decaimiento;
        
        if (this.tipo === 'humo') {
            this.tamaño += 0.5;
        }
    }
    
    dibujar(ctx) {
        ctx.save();
        ctx.globalAlpha = this.vida;
        
        if (this.tipo === 'humo') {
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.tamaño);
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.tamaño, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.color;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.tamaño, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    estaViva() {
        return this.vida > 0 && this.y > -100;
    }
}

// Sistema de gestión de partículas
class SistemaParticulas {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particulas = [];
        this.activo = false;
        
        this.redimensionar();
        window.addEventListener('resize', () => this.redimensionar());
    }
    
    redimensionar() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    emitirChispas(cantidad) {
        for (let i = 0; i < cantidad; i++) {
            const x = Math.random() * this.canvas.width;
            const y = this.canvas.height;
            this.particulas.push(new Particula(x, y, 'chispa'));
        }
    }
    
    emitirBrasas(cantidad) {
        for (let i = 0; i < cantidad; i++) {
            const x = Math.random() * this.canvas.width;
            const y = this.canvas.height - Math.random() * 100;
            this.particulas.push(new Particula(x, y, 'brasa'));
        }
    }
    
    emitirHumo(cantidad) {
        for (let i = 0; i < cantidad; i++) {
            const x = Math.random() * this.canvas.width;
            const y = this.canvas.height - Math.random() * 200;
            this.particulas.push(new Particula(x, y, 'humo'));
        }
    }
    
    actualizar() {
        if (!this.activo) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Actualizar y filtrar partículas
        this.particulas = this.particulas.filter(p => {
            p.actualizar();
            p.dibujar(this.ctx);
            return p.estaViva();
        });
        
        // Emitir nuevas partículas continuamente
        if (Math.random() < 0.3) this.emitirChispas(3);
        if (Math.random() < 0.4) this.emitirBrasas(2);
        if (Math.random() < 0.2) this.emitirHumo(1);
    }
    
    iniciar() {
        this.activo = true;
        this.animar();
    }
    
    animar() {
        this.actualizar();
        if (this.activo) {
            requestAnimationFrame(() => this.animar());
        }
    }
}

// Inicialización principal
document.addEventListener('DOMContentLoaded', function() {
    const vela = document.getElementById('vela');
    const fuego = document.getElementById('fuego');
    const mensaje = document.getElementById('mensaje');
    const muebles = document.getElementById('muebles');
    const habitacion = document.querySelector('.habitacion');
    const humo = document.getElementById('humo');
    const chispas = document.getElementById('chispas');
    const brasas = document.getElementById('brasas');
    
    // Inicializar sistema de partículas en canvas
    const canvas = document.getElementById('particulas');
    const sistemaParticulas = new SistemaParticulas(canvas);
    
    let yaClickeado = false;
    
    // Efecto de partículas sutiles en la vela antes del click
    function particulasVelaAmbiente() {
        if (yaClickeado) return;
        
        const rect = vela.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top;
        
        const particula = new Particula(x, y, 'chispa');
        particula.velocidadY = -Math.random() * 2 - 0.5;
        particula.velocidadX = (Math.random() - 0.5) * 0.5;
        particula.tamaño = Math.random() * 2 + 1;
        particula.decaimiento = 0.02;
        
        sistemaParticulas.particulas.push(particula);
    }
    
    // Iniciar animación de ambiente
    sistemaParticulas.activo = true;
    sistemaParticulas.animar();
    
    // Partículas sutiles de vela
    setInterval(particulasVelaAmbiente, 100);
    
    // Crear efecto de chispas volando
    function crearChispaVoladora() {
        const chispa = document.createElement('div');
        chispa.style.position = 'absolute';
        chispa.style.left = Math.random() * 100 + '%';
        chispa.style.bottom = '0';
        chispa.style.width = Math.random() * 4 + 2 + 'px';
        chispa.style.height = Math.random() * 4 + 2 + 'px';
        chispa.style.borderRadius = '50%';
        chispa.style.background = `hsl(${Math.random() * 60 + 10}, 100%, 70%)`;
        chispa.style.boxShadow = `0 0 ${Math.random() * 10 + 5}px currentColor`;
        chispa.style.pointerEvents = 'none';
        
        const animacion = chispa.animate([
            {
                transform: 'translateY(0) translateX(0) scale(1)',
                opacity: 1
            },
            {
                transform: `translateY(-${window.innerHeight * (Math.random() * 0.6 + 0.3)}px) 
                           translateX(${(Math.random() - 0.5) * 200}px) 
                           scale(0)`,
                opacity: 0
            }
        ], {
            duration: Math.random() * 2000 + 2000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        chispas.appendChild(chispa);
        
        animacion.onfinish = () => chispa.remove();
    }
    
    // Crear brasas en el suelo
    function crearBrasa() {
        const brasa = document.createElement('div');
        brasa.style.position = 'absolute';
        brasa.style.left = Math.random() * 100 + '%';
        brasa.style.bottom = Math.random() * 50 + 'px';
        brasa.style.width = Math.random() * 8 + 4 + 'px';
        brasa.style.height = Math.random() * 8 + 4 + 'px';
        brasa.style.borderRadius = '50%';
        brasa.style.background = `radial-gradient(circle, 
            hsl(${Math.random() * 40}, 100%, 60%) 0%, 
            hsl(${Math.random() * 30}, 100%, 40%) 100%)`;
        brasa.style.boxShadow = `0 0 ${Math.random() * 20 + 10}px rgba(255, 100, 0, 0.8)`;
        brasa.style.animation = `pulso-brasa ${Math.random() * 2 + 1}s ease-in-out infinite`;
        
        brasas.appendChild(brasa);
        
        setTimeout(() => {
            brasa.style.transition = 'opacity 2s';
            brasa.style.opacity = '0';
            setTimeout(() => brasa.remove(), 2000);
        }, Math.random() * 5000 + 3000);
    }
    
    // Agregar animación de pulso para brasas
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulso-brasa {
            0%, 100% {
                transform: scale(1);
                filter: brightness(1);
            }
            50% {
                transform: scale(1.2);
                filter: brightness(1.5);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Crear humo
    function crearHumo() {
        const nube = document.createElement('div');
        nube.style.position = 'absolute';
        nube.style.left = Math.random() * 100 + '%';
        nube.style.bottom = Math.random() * 30 + '%';
        nube.style.width = Math.random() * 100 + 80 + 'px';
        nube.style.height = Math.random() * 100 + 80 + 'px';
        nube.style.borderRadius = '50%';
        nube.style.background = `radial-gradient(circle, 
            rgba(80, 80, 80, ${Math.random() * 0.3 + 0.2}) 0%, 
            transparent 70%)`;
        nube.style.filter = 'blur(20px)';
        nube.style.pointerEvents = 'none';
        
        const animacion = nube.animate([
            {
                transform: 'translateY(0) scale(0.8)',
                opacity: 0.6
            },
            {
                transform: `translateY(-${window.innerHeight * 0.6}px) scale(1.5)`,
                opacity: 0
            }
        ], {
            duration: Math.random() * 8000 + 6000,
            easing: 'linear'
        });
        
        humo.appendChild(nube);
        
        animacion.onfinish = () => nube.remove();
    }
    
    // Evento click en la vela
    vela.addEventListener('click', function() {
        if (yaClickeado) return;
        yaClickeado = true;
        
        // Añadir clase de caída
        vela.classList.add('cayendo');
        
        // Explosión inicial de partículas
        setTimeout(() => {
            sistemaParticulas.emitirChispas(30);
            sistemaParticulas.emitirBrasas(15);
        }, 800);
        
        // Iniciar el fuego y efectos
        setTimeout(function() {
            fuego.classList.add('activo');
            habitacion.classList.add('iluminada');
            muebles.classList.add('visible');
            mensaje.classList.add('visible');
            humo.classList.add('activo');
            
            // Iniciar sistema completo de partículas
            sistemaParticulas.iniciar();
            
            // Generar chispas continuamente
            setInterval(() => {
                if (Math.random() < 0.7) {
                    for (let i = 0; i < Math.random() * 5 + 2; i++) {
                        crearChispaVoladora();
                    }
                }
            }, 200);
            
            // Generar brasas
            setInterval(() => {
                if (Math.random() < 0.5) {
                    for (let i = 0; i < Math.random() * 3 + 1; i++) {
                        crearBrasa();
                    }
                }
            }, 500);
            
            // Generar humo
            setInterval(() => {
                if (Math.random() < 0.6) {
                    for (let i = 0; i < 2; i++) {
                        crearHumo();
                    }
                }
            }, 800);
            
        }, 1000);
    });
    
    // Efecto de cursor
    vela.addEventListener('mouseenter', function() {
        if (!yaClickeado) {
            this.style.cursor = 'pointer';
        }
    });
    
    // Efecto de temblor sutil en la pantalla cuando hay fuego
    function efectoCalor() {
        if (!fuego.classList.contains('activo')) return;
        
        const desplazamiento = Math.sin(Date.now() / 100) * 0.5;
        habitacion.style.transform = `translate(${desplazamiento}px, ${desplazamiento * 0.5}px)`;
    }
    
    setInterval(efectoCalor, 50);
    
    // Agregar efecto de parpadeo a la iluminación
    function efectoParpadeo() {
        if (!fuego.classList.contains('activo')) return;
        
        const brillo = 0.95 + Math.random() * 0.1;
        habitacion.style.filter = `brightness(${brillo})`;
    }
    
    setInterval(efectoParpadeo, 100);
});
