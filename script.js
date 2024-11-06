document.addEventListener('DOMContentLoaded', () => {
    const lenya = document.getElementById('lenya');
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let velocityX = 0;
    let velocityY = 0;
    let bounceCount = 0;
    let emojis = ['😈', '👻', '💀', '🔥', '⚡', '🌚', '🖤', '🗡️', '🩸', '🕷️'];

    // Получаем существующий счетчик
    const counter = document.getElementById('bounce-counter');

    // Стили для слова
    lenya.style.position = 'absolute';
    lenya.style.fontSize = '24px';
    lenya.style.userSelect = 'none';
    lenya.style.transition = 'font-size 0.3s';
    
    // Установим начальную позицию
    lenya.style.left = `${x}px`;
    lenya.style.top = `${y}px`;

    function createEmoji(x, y) {
        const emoji = document.createElement('div');
        emoji.style.position = 'absolute';
        emoji.style.left = `${x}px`;
        emoji.style.top = `${y}px`;
        emoji.style.fontSize = '20px';
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        document.body.appendChild(emoji);

        let emojiX = x;
        let emojiY = y;
        let emojiVX = (Math.random() - 0.5) * 10;
        let emojiVY = -Math.random() * 10;
        let opacity = 1;

        function animateEmoji() {
            emojiX += emojiVX;
            emojiY += emojiVY;
            emojiVY += 0.5;
            opacity -= 0.02;

            emoji.style.left = `${emojiX}px`;
            emoji.style.top = `${emojiY}px`;
            emoji.style.opacity = opacity;

            if (opacity > 0) {
                requestAnimationFrame(animateEmoji);
            } else {
                emoji.remove();
            }
        }

        animateEmoji();
    }

    function handleInteraction(clientX, clientY) {
        const dx = clientX - x;
        const dy = clientY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
            bounceCount++;
            if (counter) {
                counter.textContent = `Отскоков: ${bounceCount}`;
            }
            
            if (bounceCount === 228) {
                lenya.textContent = 'ОТЧИМ';
                lenya.style.fontSize = '36px';
            }

            const angle = Math.atan2(dy, dx);
            const escapeSpeed = 15;
            
            velocityX -= Math.cos(angle) * escapeSpeed;
            velocityY -= Math.sin(angle) * escapeSpeed;

            if (bounceCount > 666) {
                createEmoji(x, y);
            }
        }
    }

    // Обработка мыши для десктопа
    document.addEventListener('mousemove', (e) => {
        handleInteraction(e.clientX, e.clientY);
    });

    // Обработка касаний для мобильных устройств
    document.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        handleInteraction(touch.clientX, touch.clientY);
    }, { passive: false });

    function animate() {
        x += velocityX;
        y += velocityY;
        
        velocityX *= 0.95;
        velocityY *= 0.95;
        
        const padding = 20;
        
        if (x < padding) {
            x = padding;
            velocityX = Math.abs(velocityX) * 0.8;
        }
        if (x > window.innerWidth - lenya.offsetWidth - padding) {
            x = window.innerWidth - lenya.offsetWidth - padding;
            velocityX = -Math.abs(velocityX) * 0.8;
        }
        if (y < padding) {
            y = padding;
            velocityY = Math.abs(velocityY) * 0.8;
        }
        if (y > window.innerHeight - lenya.offsetHeight - padding) {
            y = window.innerHeight - lenya.offsetHeight - padding;
            velocityY = -Math.abs(velocityY) * 0.8;
        }
        
        lenya.style.left = `${x}px`;
        lenya.style.top = `${y}px`;
        
        requestAnimationFrame(animate);
    }

    animate();
});