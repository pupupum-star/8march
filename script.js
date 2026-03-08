// --- Настройки ---
const phrases = [
	"Ты — легенда этой вечеринки!"
	"Танцпол знает, кто тут хедлайнер!"
	"Северное сияние так не сияет!"
	"Этот танцпол — твоя стихия!"
	"Сверкнула молния? Нет, это была ты!"
	"Затмение не смогло тебя затмить!"
	"Прогноз на сегодня: ураган на танцполе!"
	"После тебя танцполу нужен перерыв!"
	"Лёд тронулся, потому что ты тронула!"
	"Минус на улице — плюс в тебе!"
	"Закат в шоке от шоу, которое ты закатила!"
	"Было прохладно до твоего появления!"
	"Ты не танцуешь — ты нарушаешь законы физики!"
	"После тебя — только титры!"
	"Ты подняла градус на танцполе до кипения!"
	"Ты — контрольный выстрел этой вечеринки!"
	"Ты не повышаешь планку — ты её ломаешь!"
	"Тут не сцена — тут твоя арена!"
	"Гравитация — это правило. Ты — исключение!"
	"Ты — константа в окружении переменных!"
	"Всё понятно без слов!"
	"Тут был танцпол… пока не появилась ты!"
	"Кто включил режим легенды?"
	"Танцпол официально перегрет!"
	"Это танец или секретная техника?"
	"Объявлено танцевальное предупреждение!"
	"По шкале Рихтера — танцетрясение!"
	"Ты шторм в 13 баллов по шкале Бофорта!"
	"Этот танец вне закона… и это закон!"
	"Ты — главный босс в конце танцпола!"
];

const totalGifs = 70; 
const gifs = Array.from({ length: totalGifs }, (_, i) => `media/gif/${i + 1}.gif`);

let deckGifs = [];
let deckPhrases = [];

function shuffle(array) {
    let newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

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

    changeMeme(); 

    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('celebration').style.display = 'block';
    document.getElementById('greeting').innerText = `✨ ${name}, с\u00A08\u00A0марта!`;

    // Запускаем видео
    const video = document.getElementById('bgVideo');
    if (video) {
        video.style.display = 'block';
        video.play().catch(e => console.log("Видео ждет клика", e));
    }

    // Запускаем музыку и ПЛАВНО показываем регулятор
    const music = document.getElementById('bgMusic');
    const volWrapper = document.getElementById('volumeWrapper');
    const volPercent = document.getElementById('volumePercent');
    
    if (music) {
        music.volume = 0.5; // Начальная громкость 50%
        music.play().catch(e => console.log("Музыка заблокирована", e));
    }
    
    if (volWrapper) {
        volWrapper.classList.add('show'); // Плавное появление блока
        if (volPercent) volPercent.innerText = "50%"; // Установка текста
    }
}

function changeMeme() {
    const imgElement = document.getElementById('randomMeme');
    const phraseElement = document.getElementById('random-phrase');
    const loader = document.getElementById('gif-loader');

    const pResult = getNextItem(deckPhrases, phrases);
    deckPhrases = pResult.remainingDeck;
    if (phraseElement) phraseElement.innerText = pResult.item;

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

// --- НОВАЯ ЛОГИКА КНОПОЧНОГО РЕГУЛЯТОРА ---
function adjustVolume(step) {
    const music = document.getElementById('bgMusic');
    const display = document.getElementById('volumePercent');
    
    if (!music || !display) return;

    let newVolume = music.volume + step;

    // Ограничение от 10% (0.1) до 90% (0.9)
    if (newVolume < 0.1) newVolume = 0.1;
    if (newVolume > 0.9) newVolume = 0.9;

    // Округление для корректной работы JS
    newVolume = Math.round(newVolume * 10) / 10;

    music.volume = newVolume;
    display.innerText = Math.round(newVolume * 100) + "%";
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
