// --- Настройки ---
const phrases = [
    "Ты легенда этой вечеринки!",
    "Танцпол знает кто тут главный!",
    "Северное сияние так не сияет!",
    "Этот танцпол твоя стихия!",
    "Затмение не смогло тебя затмить!",
    "Все понятно без слов!"
];

const totalGifs = 26; 
const gifs = Array.from({ length: totalGifs }, (_, i) => `media/gif/${i + 1}.gif`);

// --- "Колоды" для тасовки ---
let deckGifs = [];
let deckPhrases = [];

// --- Алгоритм Фишера-Йетса ---
function shuffle(array) {
    let newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Универсальный помощник для взятия "карты" из колоды
function getNextItem(deck, originalArray) {
    if (deck.length === 0) {
        deck = shuffle(originalArray);
    }
    return { item: deck.pop(), remainingDeck: deck };
}

// --- Главная функция запуска ---
function showBirthday() {
    const rawInput = document.getElementById('userName').value.trim();
    if (rawInput === "") return alert("Пожалуйста, введи имя!");
    
    const name = rawInput
        .split(/\s+/) 
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
        .join(' '); 

    // Запускаем первый мем и фразу
    changeMeme(); 

    // Переключаем экраны
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('celebration').style.display = 'block';
    document.getElementById('greeting').innerText = `✨ ${name}, с\u00A08\u00A0марта!`;

    // Запускаем мультимедиа
    const video = document.getElementById('bgVideo');
    if (video) {
        video.style.display = 'block';
        video.play().catch(e => console.log("Видео ждет клика", e));
    }

    const music = document.getElementById('bgMusic');
    if (music) {
        music.play().catch(e => console.log("Музыка заблокирована", e));
    }
}

// --- Логика обновления мема и фразы (Фишер-Йетс) ---
function changeMeme() {
    const imgElement = document.getElementById('randomMeme');
    const phraseElement = document.getElementById('random-phrase');
    const loader = document.getElementById('gif-loader');

    // Обновляем фразу
    const pResult = getNextItem(deckPhrases, phrases);
    deckPhrases = pResult.remainingDeck;
    if (phraseElement) phraseElement.innerText = pResult.item;

    // Обновляем гифку
    const gResult = getNextItem(deckGifs, gifs);
    deckGifs = gResult.remainingDeck;

    if (imgElement) {
        if (loader) loader.style.display = 'inline-block'; 
        imgElement.style.opacity = '0';         
        imgElement.src = gResult.item;       

        imgElement.onload = function() {
            if (loader) loader.style.display = 'none';     
            imgElement.style.opacity = '1';    
        };
    }
}

// --- Блики на фоне (Canvas) ---
const canvas = document.getElementById('discoGlints');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let glints = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Glint {
        constructor() { this.init(); }
        init() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 5 + 2;
            this.speedX = (Math.random() - 0.5) * 2;
            this.speedY = (Math.random() - 0.5) * 2;
            this.opacity = Math.random() * 0.5;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = "white";
            ctx.fill();
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.init();
        }
    }

    function setup() {
        resize();
        for (let i = 0; i < 50; i++) glints.push(new Glint());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        glints.forEach(g => { g.update(); g.draw(); });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    setup();
    animate();
}
