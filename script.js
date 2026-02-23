// --- Массив фраз ---
const phrases = [
    "Ты легенда этой вечеринки!",
    "Танцпол знает кто тут главный!",
	"Северное сияние так не сияет!",
	"Этот танцпол твоя стихия!",
	"Затмение не смогло тебя затмить!",
    "Все понятно без слов!"
];

// --- Динамический массив GIF ---
const totalGifs = 26; 
const gifs = Array.from({ length: totalGifs }, (_, i) => `media/gif/${i + 1}.gif`);

let lastIndex = -1; 
let lastPhraseIndex = -1; // Переменная для исключения повтора фраз

// --- Обрабатываем имя выводим GIF загружаем видео и музыку ---
function showBirthday() {
    const rawInput = document.getElementById('userName').value.trim();
    if (rawInput === "") return alert("Пожалуйста, введи имя!");
    
	const name = rawInput
		.split(/\s+/) 
		.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
		.join(' '); 

    // Выбираем мем и фразу
    changeMeme(); 

    // Переключаем экраны
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('celebration').style.display = 'block';
    document.getElementById('greeting').innerText = `✨ ${name}, с\u00A08\u00A0марта!`;

    // Запускаем ВИДЕО
    const video = document.getElementById('bgVideo');
    if (video) {
        video.style.display = 'block';
        video.play().catch(e => console.log("Видео ждет клика", e));
    }

    // Запускаем МУЗЫКУ
    const music = document.getElementById('bgMusic');
    if (music) {
        music.play().catch(e => console.log("Музыка заблокирована", e));
    }
}

// --- Обновляем GIF и Фразу ---
function changeMeme() {
    const imgElement = document.getElementById('randomMeme');
    const phraseElement = document.getElementById('random-phrase'); // Убедись, что такой ID есть в HTML
    const loader = document.getElementById('gif-loader');
    
    // --- ЛОГИКА РАНДОМНОЙ ФРАЗЫ ---
    if (phraseElement) {
        let newPhraseIndex;
        do {
            newPhraseIndex = Math.floor(Math.random() * phrases.length);
        } while (newPhraseIndex === lastPhraseIndex && phrases.length > 1);
        
        lastPhraseIndex = newPhraseIndex;
        phraseElement.innerText = phrases[newPhraseIndex];
    }

    // --- ЛОГИКА ГИФКИ ---
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * gifs.length);
    } while (newIndex === lastIndex && gifs.length > 1);

    lastIndex = newIndex;

    loader.style.display = 'inline-block'; 
    imgElement.style.opacity = '0';         

    imgElement.src = gifs[newIndex];       

    imgElement.onload = function() {
        loader.style.display = 'none';     
        imgElement.style.opacity = '1';    
    };
}

// --- Блики на фоне (без изменений) ---
const canvas = document.getElementById('discoGlints');
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

