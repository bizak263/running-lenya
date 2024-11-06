document.addEventListener('DOMContentLoaded', () => {
    // Добавляем пиксельный шрифт
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // Стикмен
    const stickman = document.createElement('div');
    stickman.style.display = 'none';
    stickman.style.position = 'absolute';
    stickman.style.fontSize = '24px';
    stickman.style.zIndex = '999';
    stickman.innerHTML = `
        <div style="text-align: center;">
            💩
            <br>
            |
            <br>
            /|\\
            <br>
            / \\
        </div>
    `;
    document.body.appendChild(stickman);

    let stickmanActive = false;
    let gameTimer = null;
    let survivedTime = 0;
    let speed = 12; // Увеличенная начальная скорость стикмена

    // Функция преследования курсора стикменом
    function startStickmanChase() {
        stickmanActive = true;
        const lenya = document.getElementById('lenya');
        lenya.style.display = 'none';
        stickman.style.display = 'block';
        
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let stickmanX = window.innerWidth / 2;
        let stickmanY = window.innerHeight / 2;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        survivedTime = 0;
        gameTimer = setInterval(() => {
            survivedTime++;
            // Постепенно увеличиваем скорость еще больше
            if (survivedTime % 3 === 0 && speed < 20) {
                speed += 1;
            }
            if (survivedTime >= 30) {
                victory();
            }
        }, 1000);

        function chasePlayer() {
            if (!stickmanActive) return;

            const dx = mouseX - stickmanX;
            const dy = mouseY - stickmanY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                stickmanX += (dx / distance) * speed;
                stickmanY += (dy / distance) * speed;

                stickman.style.left = `${stickmanX}px`;
                stickman.style.top = `${stickmanY}px`;

                if (distance < 30) {
                    resetGame();
                    return;
                }
            }

            requestAnimationFrame(chasePlayer);
        }

        chasePlayer();
    }

    function victory() {
        clearInterval(gameTimer);
        stickmanActive = false;
        stickman.style.display = 'none';
        
        const victoryScreen = document.createElement('div');
        victoryScreen.style.position = 'fixed';
        victoryScreen.style.top = '50%';
        victoryScreen.style.left = '50%';
        victoryScreen.style.transform = 'translate(-50%, -50%)';
        victoryScreen.style.textAlign = 'center';
        victoryScreen.style.fontFamily = '"Press Start 2P", cursive';
        victoryScreen.style.fontSize = '20px';
        victoryScreen.style.zIndex = '1001';
        victoryScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        victoryScreen.style.padding = '30px';
        victoryScreen.style.borderRadius = '10px';
        victoryScreen.style.border = '3px solid #00ff00';
        victoryScreen.style.color = '#fff';
        victoryScreen.style.textShadow = '2px 2px 0 #ff0000, -2px -2px 0 #0000ff';
        victoryScreen.style.animation = 'victoryPulse 2s infinite';
        victoryScreen.innerHTML = `
            ▄█▀█▄ VICTORY! ▄█▀█▄<br><br>
            ★ ТЫ ПОБЕДИЛ! ★<br><br>
            <a href="https://web.telegram.org/a/#-1001574305110" 
               style="color: #00ff00; text-decoration: none; display: block; margin-top: 20px; 
               text-shadow: 2px 2px 0 #000; transition: all 0.3s ease;">
               [☆ ПРИСОЕДИНЯЙСЯ К НАМ! ☆]
            </a>
        `;
        document.body.appendChild(victoryScreen);

        // Добавляем стили для анимации победного экрана
        const style = document.createElement('style');
        style.textContent = `
            @keyframes victoryPulse {
                0% { transform: translate(-50%, -50%) scale(1); }
                50% { transform: translate(-50%, -50%) scale(1.1); }
                100% { transform: translate(-50%, -50%) scale(1); }
            }
        `;
        document.head.appendChild(style);

        // Добавляем эффект конфетти
        for (let i = 0; i < 50; i++) {
            createConfetti();
        }
    }

    function createConfetti() {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.zIndex = '1000';
        document.body.appendChild(confetti);

        const angle = Math.random() * Math.PI * 2;
        const velocity = 3 + Math.random() * 2;
        let x = parseInt(confetti.style.left);
        let y = -10;
        let rotation = 0;

        function animateConfetti() {
            y += velocity;
            x += Math.sin(angle) * 2;
            rotation += 10;
            
            confetti.style.top = y + 'px';
            confetti.style.left = x + 'px';
            confetti.style.transform = `rotate(${rotation}deg)`;

            if (y < window.innerHeight) {
                requestAnimationFrame(animateConfetti);
            } else {
                confetti.remove();
            }
        }

        animateConfetti();
    }

    function resetGame() {
        clearInterval(gameTimer);
        stickmanActive = false;
        stickman.style.display = 'none';
        const lenya = document.getElementById('lenya');
        lenya.style.display = 'block';
        lenya.textContent = 'леня';
        lenya.style.fontSize = '24px';
        const counter = document.getElementById('bounce-counter');
        if (counter) {
            counter.textContent = 'Отскоков: 0';
        }
        speed = 12; // Сбрасываем скорость стикмена
    }

    // Наблюдаем за счетчиком отскоков
    const bounceCounter = document.getElementById('bounce-counter');
    if (bounceCounter) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                const count = parseInt(mutation.target.textContent.match(/\d+/)[0]);
                if (count >= 1000 && !stickmanActive) {
                    startStickmanChase();
                }
            });
        });
        observer.observe(bounceCounter, { characterData: true, childList: true, subtree: true });
    }
});