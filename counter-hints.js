document.addEventListener('DOMContentLoaded', () => {
    // Создаем счетчик
    const counter = document.createElement('div');
    counter.id = 'bounce-counter';
    counter.style.position = 'fixed';
    counter.style.top = '20px';
    counter.style.left = '20px';
    counter.style.fontSize = '24px';
    counter.style.fontFamily = 'Arial, sans-serif';
    counter.style.zIndex = '1000';
    counter.textContent = 'Отскоков: 0';
    document.body.appendChild(counter);

    // Создаем подсказку
    const hint = document.createElement('div');
    hint.style.position = 'fixed';
    hint.style.top = '20px';
    hint.style.right = '20px';
    hint.style.fontSize = '24px';
    hint.style.fontFamily = 'Arial, sans-serif';
    hint.style.padding = '15px';
    hint.style.borderRadius = '10px';
    hint.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    hint.style.color = 'white';
    hint.style.zIndex = '1000';
    hint.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.5)';
    document.body.appendChild(hint);

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

    let bounceCount = 0;
    let stickmanActive = false;
    let gameTimer = null;
    let survivedTime = 0;

    // Добавляем стили анимации
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        @keyframes glow {
            0%, 100% { text-shadow: 0 0 5px #fff, 0 0 10px #ff0000; }
            50% { text-shadow: 0 0 20px #fff, 0 0 30px #ff0000; }
        }
    `;
    document.head.appendChild(styleSheet);

    // Функция обновления состояния игры
    function updateGameState() {
        if (bounceCount < 228) {
            hint.textContent = 'Догони "леня" 228 раз!';
            hint.style.animation = 'pulse 1s infinite';
        } else if (bounceCount < 666) {
            hint.textContent = 'Теперь догони 666 раз!';
            hint.style.animation = 'pulse 1s infinite, shake 0.5s infinite';
            hint.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
        } else if (bounceCount < 1000) {
            hint.textContent = 'Осталось до 1000!';
            hint.style.animation = 'pulse 1s infinite, shake 0.5s infinite, glow 1s infinite';
            hint.style.backgroundColor = 'rgba(128, 0, 0, 0.9)';
        } else if (!stickmanActive) {
            startStickmanChase();
        }
    }

    // Функция преследования курсора стикменом
    function startStickmanChase() {
        stickmanActive = true;
        hint.style.display = 'none';
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
                const speed = 3;
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
        victoryScreen.style.fontSize = '24px';
        victoryScreen.style.zIndex = '1001';
        victoryScreen.innerHTML = `
            Поздравляем! Ты победил!<br>
            <a href="https://web.telegram.org/a/#-1001574305110" 
               style="color: blue; text-decoration: underline; display: block; margin-top: 20px;">
               Присоединяйся к нам!
            </a>
        `;
        document.body.appendChild(victoryScreen);
    }

    function resetGame() {
        clearInterval(gameTimer);
        stickmanActive = false;
        stickman.style.display = 'none';
        const lenya = document.getElementById('lenya');
        lenya.style.display = 'block';
        lenya.textContent = 'леня';
        lenya.style.fontSize = '24px';
        bounceCount = 0;
        counter.textContent = 'Отскоков: 0';
        hint.style.display = 'block';
        updateGameState();
    }

    // Отслеживаем отскоки от курсора
    document.addEventListener('mousemove', (e) => {
        const lenya = document.getElementById('lenya');
        if (!lenya || stickmanActive) return;

        const rect = lenya.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
            bounceCount++;
            counter.textContent = `Отскоков: ${bounceCount}`;
            updateGameState();
        }
    });

    // Начальное обновление состояния
    updateGameState();
});