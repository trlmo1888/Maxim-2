// MAXIM - Card Revelation App
// Redesigned to match original interface

// App State
const state = {
    selectedSuit: null,
    selectedRank: null,
    currentStack: 'mnemonica',
    timer: {
        seconds: 0,
        interval: null,
        isRunning: false
    },
    stats: {
        performances: 0,
        lastCard: null
    }
};

// Card Stacks
const stacks = {
    mnemonica: [
        '4♣', '2♥', '7♦', '3♣', '4♥', '6♦', 'A♠', '5♥', '9♠', '2♠',
        'Q♥', '3♦', 'Q♣', '8♥', '6♠', '5♠', '9♥', 'K♣', '2♦', 'J♥',
        '3♠', '8♠', '6♥', '10♣', '5♦', 'K♦', '2♣', '3♥', '8♦', 'A♥',
        'K♠', '10♦', 'Q♠', 'J♣', '7♠', 'K♥', 'J♦', 'A♦', '4♠', 'Q♦',
        '7♥', '6♣', '10♠', 'A♣', '9♦', 'J♠', '9♣', '5♣', '8♣', '7♣',
        '4♦', '10♥'
    ],
    aronson: [
        'J♣', 'A♥', '9♠', '2♦', '7♣', '3♥', 'K♦', '4♠', 'A♣', '8♥',
        '5♦', 'Q♠', '6♣', '2♥', '10♦', 'J♠', '3♣', '9♥', '4♦', 'K♠',
        '7♥', 'A♦', '6♠', 'Q♣', '8♦', '3♠', '5♥', '10♠', '2♣', 'K♥',
        '9♦', '4♥', 'J♦', '6♥', 'A♠', 'Q♥', '7♦', '10♣', '5♠', '3♦',
        '8♠', '2♠', 'K♣', '9♣', '6♦', 'J♥', '4♣', 'Q♦', '7♠', '10♥',
        '5♣', '8♣'
    ],
    'eight-kings': generateEightKings(),
    'si-stebbins': generateSiStebbins(),
    custom: []
};

function generateEightKings() {
    const pattern = ['8', 'K', '3', '10', '2', '7', '9', '5', 'Q', '4', 'A', '6', 'J'];
    const suits = ['♣', '♥', '♠', '♦'];
    const deck = [];
    for (let i = 0; i < 52; i++) {
        deck.push(pattern[i % 13] + suits[i % 4]);
    }
    return deck;
}

function generateSiStebbins() {
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const suits = ['♣', '♥', '♠', '♦'];
    const deck = [];
    let rankIndex = 0, suitIndex = 0;
    for (let i = 0; i < 52; i++) {
        deck.push(ranks[rankIndex] + suits[suitIndex]);
        rankIndex = (rankIndex + 3) % 13;
        suitIndex = (suitIndex + 1) % 4;
    }
    return deck;
}

// Navigation
function showScreen(screenId) {
    document.querySelectorAll('.screen, .perform-screen, .results-screen, .settings-screen').forEach(s => {
        s.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    vibrate(30);
}

function showMainScreen() {
    showScreen('mainScreen');
    resetSelection();
}

function showPerformScreen() {
    showScreen('performScreen');
    resetSelection();
}

function showRankScreen() {
    showScreen('rankScreen');
}

function showResultsScreen() {
    showScreen('resultsScreen');
}

// Card Selection
// Card Selection - Step by Step
function selectSuitAndNext(suit) {
    state.selectedSuit = suit;
    vibrate(50);
    
    // Highlight selected suit
    document.querySelectorAll('.suit-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    // Wait a moment for visual feedback, then go to next screen
    setTimeout(() => {
        showRankScreen();
    }, 200);
}

function selectRankAndCalculate(rank) {
    state.selectedRank = rank;
    vibrate(50);
    
    // Highlight selected rank
    document.querySelectorAll('.rank-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    // Wait a moment for visual feedback, then calculate
    setTimeout(() => {
        calculateReveals();
    }, 200);
}

// Old functions (keep for compatibility)
function selectSuit(suit) {
    state.selectedSuit = suit;
    document.querySelectorAll('.suit-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
    vibrate(30);
}

function selectRank(rank) {
    state.selectedRank = rank;
    document.querySelectorAll('.rank-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
    vibrate(30);
}

function resetSelection() {
    state.selectedSuit = null;
    state.selectedRank = null;
    document.querySelectorAll('.suit-button, .rank-button').forEach(btn => {
        btn.classList.remove('selected');
    });
}

// Calculate Reveals
function calculateReveals() {
    if (!state.selectedSuit || !state.selectedRank) {
        showNotification('Por favor, selecciona una carta primero');
        return;
    }

    const card = formatCard(state.selectedRank, state.selectedSuit);
    const position = findPosition(card);

    if (position === -1) {
        showNotification('Carta no encontrada en el stack actual');
        return;
    }

    displayResults(card, position);
    showResultsScreen();
    
    // Update stats
    state.stats.performances++;
    state.stats.lastCard = card;
    saveState();
    
    vibrate([50, 100, 50]);
}

function formatCard(rank, suit) {
    const suitSymbols = {
        hearts: '♥',
        diamonds: '♦',
        clubs: '♣',
        spades: '♠'
    };
    return rank + suitSymbols[suit];
}

function findPosition(card) {
    const stack = stacks[state.currentStack];
    return stack.indexOf(card) + 1;
}

function displayResults(card, position) {
    const cardName = getCardName(card);
    document.getElementById('selectedCardName').textContent = cardName;

    const reveals = generateReveals(card, position, cardName);
    const container = document.getElementById('revealMethods');
    
    container.innerHTML = reveals.map(reveal => `
        <div class="reveal-card">
            <h3>${reveal.icon} ${reveal.title}</h3>
            <p>${reveal.description}</p>
            <div class="reveal-number">${reveal.number}</div>
            <p class="reveal-instruction">${reveal.instruction}</p>
            ${reveal.hasTimer ? `
                <button class="timer-launch-btn" onclick="launchQuickTimer(${reveal.timerSeconds})">
                    ⏱️ Temporizador ${reveal.timerSeconds}s
                </button>
            ` : ''}
        </div>
    `).join('');
}

function launchQuickTimer(seconds) {
    if (window.iosTimer) {
        iosTimer.hours = 0;
        iosTimer.minutes = 0;
        iosTimer.seconds = seconds;
        iosTimer.open();
        
        // Auto-start after a brief delay
        setTimeout(() => {
            iosTimer.start();
        }, 500);
    }
    
    vibrate(50);
}

function getCardName(card) {
    const rankNames = {
        'A': 'As', '2': 'Dos', '3': 'Tres', '4': 'Cuatro', '5': 'Cinco',
        '6': 'Seis', '7': 'Siete', '8': 'Ocho', '9': 'Nueve', '10': 'Diez',
        'J': 'Jota', 'Q': 'Reina', 'K': 'Rey'
    };
    const suitNames = {
        '♥': 'Corazones', '♦': 'Diamantes', '♣': 'Tréboles', '♠': 'Picas'
    };
    const rank = card.slice(0, -1);
    const suit = card.slice(-1);
    return `${rankNames[rank]} de ${suitNames[suit]}`;
}

function generateReveals(card, position, cardName) {
    const reveals = [];
    const today = new Date();
    const dayOfMonth = today.getDate();

    // Date Reveal
    if (document.getElementById('dateReveal').checked) {
        const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                       'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        const dateStr = `${dayOfMonth} de ${months[today.getMonth()]}`;
        
        reveals.push({
            icon: '📅',
            title: 'Revelación por Fecha',
            description: `Hoy es ${dateStr}`,
            number: `Posición ${position}`,
            instruction: position === dayOfMonth 
                ? `¡La carta está en la posición ${position} - Cuenta ${dayOfMonth} cartas!`
                : `Desde arriba: ${position} cartas | Desde abajo: ${53 - position} cartas | Hoy: día ${dayOfMonth}`,
            hasTimer: false
        });
    }

    // Spelling Reveal
    if (document.getElementById('spellingReveal').checked) {
        const letterCount = cardName.replace(/\s/g, '').length;
        reveals.push({
            icon: '🔤',
            title: 'Revelación por Deletreo',
            description: 'Deletrea el nombre de la carta',
            number: `${letterCount} letras`,
            instruction: `"${cardName}" tiene ${letterCount} letras. ¡Cuenta una carta por letra!`,
            hasTimer: true,
            timerSeconds: letterCount
        });
    }

    // Position Reveal
    reveals.push({
        icon: '📍',
        title: 'Posición Directa',
        description: 'Cuenta desde arriba o abajo',
        number: `#${position}`,
        instruction: `Desde arriba: ${position} | Desde abajo: ${53 - position}`,
        hasTimer: false
    });

    // Lucky Number Reveal
    const luckyNumbers = [7, 13, 21];
    for (const lucky of luckyNumbers) {
        if (Math.abs(position - lucky) <= 2) {
            reveals.push({
                icon: '🎲',
                title: 'Número de la Suerte',
                description: `Cerca del número ${lucky}`,
                number: `Posición ${position}`,
                instruction: `"Piensa en un número de la suerte... ¿como el ${lucky}?" ¡La carta está en ${position}!`,
                hasTimer: false
            });
            break;
        }
    }

    return reveals.slice(0, 3);
}

function generateTimerHTML() {
    return `
        <div class="timer-display">
            <div class="time">00:00</div>
            <div class="timer-controls">
                <button class="timer-btn" onclick="startTimer(this)">Start</button>
                <button class="timer-btn" onclick="pauseTimer(this)">Pause</button>
                <button class="timer-btn" onclick="resetTimer(this)">Reset</button>
            </div>
        </div>
    `;
}

// Timer Functions
function initializeTimers() {
    // Timer functionality can be expanded here
}

function startTimer(btn) {
    const timerDisplay = btn.closest('.timer-display');
    const timeElement = timerDisplay.querySelector('.time');
    
    if (state.timer.isRunning) return;
    
    state.timer.isRunning = true;
    state.timer.interval = setInterval(() => {
        state.timer.seconds++;
        const minutes = Math.floor(state.timer.seconds / 60);
        const seconds = state.timer.seconds % 60;
        timeElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
    
    vibrate(30);
}

function pauseTimer(btn) {
    if (!state.timer.isRunning) return;
    
    clearInterval(state.timer.interval);
    state.timer.isRunning = false;
    vibrate(30);
}

function resetTimer(btn) {
    const timerDisplay = btn.closest('.timer-display');
    const timeElement = timerDisplay.querySelector('.time');
    
    clearInterval(state.timer.interval);
    state.timer.seconds = 0;
    state.timer.isRunning = false;
    timeElement.textContent = '00:00';
    vibrate(30);
}

// Settings
function changeStack() {
    state.currentStack = document.getElementById('stackType').value;
    saveState();
    showNotification(`Stack cambiado a ${state.currentStack}`);
}

// Utilities
function showNotification(message) {
    const notif = document.getElementById('notification');
    notif.textContent = message;
    notif.classList.add('show');
    setTimeout(() => notif.classList.remove('show'), 3000);
}

function vibrate(pattern) {
    if ('vibrate' in navigator && document.getElementById('vibrationOn')?.checked) {
        navigator.vibrate(pattern);
    }
}

function saveState() {
    localStorage.setItem('maximState', JSON.stringify(state));
}

function loadState() {
    const saved = localStorage.getItem('maximState');
    if (saved) {
        const data = JSON.parse(saved);
        Object.assign(state, data);
        state.timer.interval = null;
        state.timer.isRunning = false;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    
    // Set stack selector
    if (document.getElementById('stackType')) {
        document.getElementById('stackType').value = state.currentStack;
    }
    
    console.log('MAXIM initialized');
});

// Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('SW registered'))
            .catch(err => console.log('SW registration failed'));
    });
}
