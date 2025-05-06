// Powered by : Zero_tech 
const canvas = document.getElementById('galaxy-bg');
const ctx = canvas.getContext('2d');
let w = window.innerWidth, h = window.innerHeight;
function resizeGalaxy() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
}
resizeGalaxy();
window.addEventListener('resize', resizeGalaxy);

// Generar estrellas
const STAR_COUNT = 120;
const stars = [];
for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.5 + 0.2,
        alpha: Math.random() * 0.5 + 0.5
    });
}

let galaxyPink = false;
let galaxyTransition = 0; 
let galaxySpeedUp = false;
let galaxyStarCount = 120;
let galaxyGrowStep = 0; // Para transición suave de cantidad/tamaño/velocidad

function lerp(a, b, t) {
    return a + (b - a) * t;
}
function lerpColor(c1, c2, t) {
    return [
        Math.round(lerp(c1[0], c2[0], t)),
        Math.round(lerp(c1[1], c2[1], t)),
        Math.round(lerp(c1[2], c2[2], t))
    ];
}
function rgb(arr) {
    return `rgb(${arr[0]},${arr[1]},${arr[2]})`;
}

function drawGalaxy() {
    ctx.clearRect(0, 0, w, h);

    // Transición de color suave
    if (galaxyPink && galaxyTransition < 1) {
        galaxyTransition += 0.012; // más suave
        if (galaxyTransition > 1) galaxyTransition = 1;
    } else if (!galaxyPink && galaxyTransition > 0) {
        galaxyTransition -= 0.012;
        if (galaxyTransition < 0) galaxyTransition = 0;
    }

    // Transición suave de cantidad/tamaño/velocidad de estrellas
    if (galaxyPink && galaxyGrowStep < 1) {
        galaxyGrowStep += 0.012;
        if (galaxyGrowStep > 1) galaxyGrowStep = 1;
    }

    // Añadir estrellas gradualmente
    if (galaxyPink && !galaxySpeedUp) {
        // Solo una vez: pre-crear todas las estrellas extra
        for (let i = 0; i < 380; i++) {
            stars.push({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 2.8 + 1.2,
                speed: Math.random() * 2.2 + 1.2,
                alpha: Math.random() * 0.5 + 0.5
            });
        }
        galaxyStarCount = stars.length;
        galaxySpeedUp = true;
    }

    // Calcula cuántas estrellas mostrar según el progreso de la transición
    let visibleStars = Math.floor(120 + (galaxyStarCount - 120) * galaxyGrowStep);

    for (let i = 0; i < visibleStars; i++) {
        let star = stars[i];
        ctx.save();
        ctx.globalAlpha = star.alpha;

        // Color transición: blanco a rosa
        let color = rgb(lerpColor([255,255,255], [255,105,180], galaxyTransition));
        // Transición suave de tamaño
        let baseR = star.r;
        let r = baseR;
        if (galaxyPink) {
            r = baseR + (baseR * 0.25) * galaxyGrowStep;
        }
        ctx.beginPath();
        ctx.arc(star.x, star.y, r, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8 + (20 * galaxyTransition);
        ctx.fill();
        ctx.restore();

        // Transición suave de velocidad
        let speed = star.speed;
        if (galaxyPink) {
            speed = star.speed * (1 + 1.1 * galaxyGrowStep);
        }
        star.y -= speed;
        if (star.y < -4) {
            star.x = Math.random() * w;
            star.y = h + 4;
            star.r = galaxyPink
                ? Math.random() * 2.8 + 1.2
                : Math.random() * 1.5 + 0.5;
            star.speed = galaxyPink
                ? Math.random() * 2.2 + 1.2
                : Math.random() * 0.5 + 0.2;
            star.alpha = Math.random() * 0.5 + 0.5;
        }
    }
    requestAnimationFrame(drawGalaxy);
}
drawGalaxy();

// --- BOTÓN NO EFECTO ---
const btnNo = document.getElementById('btn-no');
const btnsArea = document.getElementById('btns-area');
const btnSi = document.querySelector('.btn-si');
const h2 = document.querySelector('h2');

function getAreaRect() {
    return btnsArea.getBoundingClientRect();
}

btnsArea.addEventListener('mousemove', function(e) {
    const areaRect = getAreaRect();
    const mouseX = e.clientX - areaRect.left;
    const mouseY = e.clientY - areaRect.top;
    const btnRect = btnNo.getBoundingClientRect();
    const btnX = btnNo.offsetLeft + btnRect.width / 2;
    const btnY = btnNo.offsetTop + btnRect.height / 2;

    const dist = Math.hypot(mouseX - btnX, mouseY - btnY);

    if (dist < 180) { // aún más sensible
        // Mover el botón a una nueva posición dentro del área
        let newLeft, newTop;
        const maxLeft = btnsArea.clientWidth - btnNo.offsetWidth;
        const maxTop = btnsArea.clientHeight - btnNo.offsetHeight;

        do {
            newLeft = Math.random() * maxLeft;
            newTop = Math.random() * maxTop;
        } while (
            Math.hypot(mouseX - (newLeft + btnNo.offsetWidth / 2), mouseY - (newTop + btnNo.offsetHeight / 2)) < 140 // mayor distancia mínima
        );

        btnNo.classList.add('moving');
        // Suaviza el movimiento quitando la clase después de la transición
        setTimeout(() => btnNo.classList.remove('moving'), 700);
        btnNo.style.left = `${newLeft}px`;
        btnNo.style.top = `${newTop}px`;
    }
});

// Evitar que el botón salga del área al hacer resize
window.addEventListener('resize', () => {
    btnNo.style.left = '60px';
    btnNo.style.top = '30px';
});

// --- EFECTO AL PRESIONAR SÍ ---
btnSi.addEventListener('click', () => {
    // Cambia galaxia a rosa con brillo y más estrellas
    galaxyPink = true;

    // Transición profesional: desenfoque y fade de todo el contenedor, luego cambio de texto y fade-in
    const container = document.querySelector('.container');
    container.style.transition = 'filter 0.7s cubic-bezier(.4,0,.2,1), opacity 0.7s cubic-bezier(.4,0,.2,1)';
    container.style.filter = 'blur(6px)';
    container.style.opacity = '0.2';

    setTimeout(() => {
        h2.textContent = '¡Sabía que dirías que sí!';
        container.style.filter = 'blur(0px)';
        container.style.opacity = '1';
        h2.style.filter = 'blur(8px)';
        h2.style.opacity = '0';
        setTimeout(() => {
            h2.style.transition = 'opacity 1.2s cubic-bezier(.4,0,.2,1), filter 1.2s cubic-bezier(.4,0,.2,1)';
            h2.style.filter = 'blur(0px)';
            h2.style.opacity = '1';
        }, 100);
    }, 700);

    // Oculta botones Sí y No, muestra botón Volver
    btnSi.style.transition = 'opacity 0.7s cubic-bezier(.4,0,.2,1)';
    btnNo.style.transition = 'opacity 0.7s cubic-bezier(.4,0,.2,1)';
    btnSi.style.opacity = '0';
    btnNo.style.opacity = '0';
    setTimeout(() => {
        btnSi.style.display = 'none';
        btnNo.style.display = 'none';
        // Crear botón volver si no existe
        if (!document.getElementById('btn-volver')) {
            const btnVolver = document.createElement('button');
            btnVolver.id = 'btn-volver';
            btnVolver.className = 'btn btn-volver';
            btnVolver.textContent = 'Volver';
            btnVolver.style.opacity = '0';
            btnsArea.appendChild(btnVolver);
            setTimeout(() => {
                btnVolver.style.transition = 'opacity 0.9s cubic-bezier(.4,0,.2,1)';
                btnVolver.style.opacity = '1';
            }, 50);
            btnVolver.addEventListener('click', () => {
                location.reload();
            });
        }
    }, 700);
});
