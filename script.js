// --- Массив GIF ---
const gifs = [
	'media/gif/1.gif',
	'media/gif/2.gif',
	'media/gif/3.gif',
	'media/gif/4.gif',
	'media/gif/5.gif',
	'media/gif/6.gif'
];
let lastIndex = -1; // Переменная, которая помнит, что мы показали последним

// --- Обробатываем имя выводим GIF загружаем видео и музыку ---
function showBirthday() {
    const rawInput = document.getElementById('userName').value.trim();
    if (rawInput === "") return alert("Пожалуйста, введи имя!");
    
    const name = rawInput.charAt(0).toUpperCase() + rawInput.slice(1).toLowerCase();

    // 1. Выбираем мем
    changeMeme(); 

    // 2. Переключаем экраны
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('celebration').style.display = 'block';
    document.getElementById('greeting').innerText = `✨ ${name}, с 8 марта!`;

    // 3. Запускаем ВИДЕО
    const video = document.getElementById('bgVideo');
    if (video) {
        video.style.display = 'block';
        video.play().catch(e => console.log("Видео ждет клика", e));
    }

    // 4. ЗАПУСКАЕМ МУЗЫКУ (НОВОЕ!)
    const music = document.getElementById('bgMusic');
    if (music) {
        music.play().catch(e => console.log("Музыка заблокирована браузером до клика", e));
    }
}

// --- Обновляем GIF ---
function changeMeme() {
    const imgElement = document.getElementById('randomMeme');
    const loader = document.getElementById('gif-loader');
    let newIndex;

    // Выбор индекса
    do {
        newIndex = Math.floor(Math.random() * gifs.length);
    } while (newIndex === lastIndex && gifs.length > 1);

    lastIndex = newIndex;

    // --- ЛОГИКА ПРЕЛОАДЕРА ---
    loader.style.display = 'inline-block'; // Показываем крутилку
    imgElement.style.opacity = '0';         // Скрываем старую картинку

    imgElement.src = gifs[newIndex];       // Начинаем загрузку новой

    imgElement.onload = function() {
        loader.style.display = 'none';     // Прячем крутилку
        imgElement.style.opacity = '1';    // Плавно показываем новую гифку
    };
}

// --- Блики на фоне ---
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
