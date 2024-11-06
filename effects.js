document.addEventListener('DOMContentLoaded', () => {
    // Массив эмодзи для эффектов
    const emojis = ['😈', '👻', '💀', '🔥', '⚡', '🌚', '🖤', '🗡️', '🩸', '🕷️'];
    let isOtchim = false; // Флаг для отслеживания превращения в ОТЧИМ

    // Функция создания эмодзи
    function createEmoji(x, y, isTransformation = false) {
        const emoji = document.createElement('div');
        emoji.style.position = 'absolute';
        emoji.style.left = `${x}px`;
        emoji.style.top = `${y}px`;
        emoji.style.fontSize = '20px';
        emoji.style.zIndex = '999';
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        document.body.appendChild(emoji);

        let emojiX = x;
        let emojiY = y;
        let emojiVX = (Math.random() - 0.5) * (isTransformation ? 20 : 10);
        let emojiVY = (isTransformation ? -15 : -10) * Math.random();
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

    // Наблюдаем за изменениями в слове "леня"
    const lenya = document.getElementById('lenya');
    const lenyaObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'characterData' || mutation.type === 'childList') {
                if (mutation.target.textContent === 'ОТЧИМ' && !isOtchim) {
                    isOtchim = true;
                    const rect = lenya.getBoundingClientRect();
                    // Создаем взрыв эмодзи при трансформации
                    for (let i = 0; i < 15; i++) {
                        setTimeout(() => {
                            createEmoji(
                                rect.left + rect.width / 2,
                                rect.top + rect.height / 2,
                                true
                            );
                        }, i * 50);
                    }
                }
            }
        });
    });

    lenyaObserver.observe(lenya, {
        characterData: true,
        childList: true,
        subtree: true
    });

    // Ускоряем стикмена
    const originalChaseInterval = setInterval(() => {
        const stickman = document.querySelector('div[style*="position: absolute"][style*="display: block"]');
        if (stickman && stickman.innerHTML.includes('💩')) {
            const style = stickman.getAttribute('style');
            if (style) {
                const newStyle = style.replace(/speed = 3/, 'speed = 6');
                stickman.setAttribute('style', newStyle);
            }
            clearInterval(originalChaseInterval);
        }
    }, 100);

    // Добавляем эмодзи при отскоках после превращения в ОТЧИМ
    const bounceCheck = setInterval(() => {
        if (isOtchim && lenya.style.display !== 'none') {
            const rect = lenya.getBoundingClientRect();
            if (Math.random() < 0.3) { // 30% шанс создания эмодзи при каждом отскоке
                createEmoji(
                    rect.left + rect.width / 2,
                    rect.top + rect.height / 2
                );
            }
        }
    }, 50);
});