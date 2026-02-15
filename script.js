let garnList = [];
let stickList = [];
let timerInterval = null;
let timeRemaining = 0;
let isFirstClick = true;

// Ladda data från textfiler
async function loadData() {
    try {
        // Ladda garn
        const garnResponse = await fetch('garn.txt');
        const garnText = await garnResponse.text();
        garnList = garnText
            .split('\n')
            .map(g => g.trim())
            .filter(g => g.length > 0);

        // Ladda stickstorlekar
        const stickResponse = await fetch('stickor.txt');
        const stickText = await stickResponse.text();
        stickList = stickText
            .split('\n')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        console.log('Garn laddat:', garnList);
        console.log('Stickstorlekar laddat:', stickList);
    } catch (error) {
        console.error('Fel vid inladdning av filer:', error);
        alert('Kunde inte ladda garn.txt och stickor.txt. Se till att de finns i samma mapp som index.html');
    }
}

// Slumpa fram ett element från en lista
function getRandomElement(arr) {
    if (arr.length === 0) return '?';
    return arr[Math.floor(Math.random() * arr.length)];
}

// Slumpa fram tid mellan 2 och 10 minuter (i sekunder)
function getRandomTime() {
    const minSeconds = 2 * 60;
    const maxSeconds = 10 * 60;
    return Math.floor(Math.random() * (maxSeconds - minSeconds + 1)) + minSeconds;
}

// Formatera tid i mm:ss
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Uppdatera timern
function updateTimer() {
    const timerElement = document.getElementById('timerResult');
    timerElement.textContent = formatTime(timeRemaining);
    
    if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        timerElement.style.color = 'white';
        alert('Tiden är slut! Byt garn och stickstorlek!');
    } else {
        timeRemaining--;
    }
}

// Starta timern
function startTimer(seconds) {
    // Stoppa eventuell tidigare timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timeRemaining = seconds;
    const timerElement = document.getElementById('timerResult');
    timerElement.style.color = 'white';
    
    // Uppdatera omedelbar
    updateTimer();
    
    // Uppdatera varje sekund
    timerInterval = setInterval(updateTimer, 1000);
}

// Slumpa fram nya värden
function slumpa() {
    if (garnList.length === 0 || stickList.length === 0) {
        alert('Laddar data... Försök igen!');
        return;
    }
    
    const btn = document.getElementById('slumpaBtn');
    btn.classList.add('spinning');
    btn.disabled = true;
    
    // Vänta 0.8 sekunder före resultat visas
    setTimeout(() => {
        let garn, stick;
        
        if (isFirstClick) {
            // Första gången: ta första alternativet
            garn = garnList[0];
            stick = stickList[0];
            isFirstClick = false;
        } else {
            // Efterföljande gånger: slumpa
            garn = getRandomElement(garnList);
            stick = getRandomElement(stickList);
        }
        
        const time = getRandomTime();
        
        // Uppdatera resultatet
        document.getElementById('garnResult').textContent = garn;
        document.getElementById('stickResult').textContent = stick;
        
        // Ta bort snurr och aktivera knapp igen
        btn.classList.remove('spinning');
        btn.classList.add('stopping');
        
        // Ta bort stopping-klassen efter transiteringen
        setTimeout(() => {
            btn.classList.remove('stopping');
        }, 400);
        
        btn.disabled = false;
        
        // Starta timern
        startTimer(time);
    }, 800);
}

// Event listener för knappen
document.getElementById('slumpaBtn').addEventListener('click', slumpa);

// Ladda data när sidan är klar
document.addEventListener('DOMContentLoaded', loadData);
