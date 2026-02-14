// MAXIM - Card Revelation App
// App State
const state = {
    selectedSuit: null,
    selectedRank: null,
    targetCard: null, // Carta que el espectador nombró
    keyCard: null, // Carta de abajo que vemos
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

// Navigation Functions
function showScreen(screenId) {
    const allScreens = document.querySelectorAll('.screen, .perform-screen, .results-screen, .settings-screen');
    allScreens.forEach(s => s.classList.remove('active'));
    
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
    }
    vibrate(30);
}

function showMainScreen() {
    showScreen('mainScreen');
    resetSelection();
}

function showTimerFirst() {
    // Ejecutar → Mostrar pantalla de palos (carta objetivo)
    showPerformScreen();
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

// Card Selection - Step by Step
function selectSuitAndNext(suit) {
    state.selectedSuit = suit;
    vibrate(50);
    
    const buttons = document.querySelectorAll('.suit-button');
    buttons.forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
    
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
    
    // Guardar carta objetivo (la que buscaremos)
    state.targetCard = formatCard(state.selectedRank, state.selectedSuit);
    
    // Abrir temporizador
    setTimeout(() => {
        if (typeof iosTimer !== 'undefined' && iosTimer) {
            iosTimer.open();
        }
    }, 200);
}

function selectSuit(suit) {
    state.selectedSuit = suit;
    const buttons = document.querySelectorAll('.suit-button');
    buttons.forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
    vibrate(30);
}

function selectRank(rank) {
    state.selectedRank = rank;
    const buttons = document.querySelectorAll('.rank-button');
    buttons.forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
    vibrate(30);
}

function resetSelection() {
    state.selectedSuit = null;
    state.selectedRank = null;
    const buttons = document.querySelectorAll('.suit-button, .rank-button');
    buttons.forEach(btn => btn.classList.remove('selected'));
}

// Key Card Selection (después del timer)
function selectKeySuitAndNext(suit) {
    state.selectedSuit = suit;
    vibrate(50);
    
    document.querySelectorAll('.suit-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    setTimeout(() => {
        showScreen('keyCardRankScreen');
    }, 200);
}

function selectKeyRankAndCalculate(rank) {
    state.selectedRank = rank;
    state.keyCard = formatCard(rank, state.selectedSuit);
    vibrate(50);
    
    document.querySelectorAll('.rank-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    setTimeout(() => {
        calculateTargetPosition();
    }, 200);
}

function calculateTargetPosition() {
    // Calcular posición de la carta objetivo basada en la key card
    const stack = stacks[state.currentStack];
    const keyPosition = stack.indexOf(state.keyCard) + 1;
    const targetPosition = stack.indexOf(state.targetCard) + 1;
    
    if (keyPosition === 0 || targetPosition === 0) {
        showNotification('Error: Carta no encontrada en el stack');
        return;
    }
    
    // Calcular distancia
    let distance;
    if (targetPosition > keyPosition) {
        distance = targetPosition - keyPosition;
    } else {
        distance = (52 - keyPosition) + targetPosition;
    }
    
    displayTargetResults(distance);
    showResultsScreen();
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

function displayTargetResults(distance) {
    const targetName = getCardName(state.targetCard);
    const keyName = getCardName(state.keyCard);
    
    document.getElementById('selectedCardName').textContent = targetName;
    
    const container = document.getElementById('revealMethods');
    
    container.innerHTML = `
        <div class="reveal-card">
            <h3>🎯 Carta Objetivo</h3>
            <p>${targetName}</p>
        </div>
        
        <div class="reveal-card">
            <h3>🔑 Carta Clave (abajo)</h3>
            <p>${keyName}</p>
        </div>
        
        <div class="reveal-card">
            <h3>📍 Ubicación</h3>
            <div class="reveal-number">${distance}</div>
            <p class="reveal-instruction">
                ${targetName} está <strong>${distance} cartas desde abajo</strong><br>
                (o ${52 - distance} desde arriba)
            </p>
        </div>
    `;
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
    if (typeof iosTimer !== 'undefined' && iosTimer) {
        iosTimer.hours = 0;
        iosTimer.minutes = 0;
        iosTimer.seconds = seconds;
        iosTimer.open();
        
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

    if (document.getElementById('dateReveal') && document.getElementById('dateReveal').checked) {
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

    if (document.getElementById('spellingReveal') && document.getElementById('spellingReveal').checked) {
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

    reveals.push({
        icon: '📍',
        title: 'Posición Directa',
        description: 'Cuenta desde arriba o abajo',
        number: `#${position}`,
        instruction: `Desde arriba: ${position} | Desde abajo: ${53 - position}`,
        hasTimer: false
    });

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

// Settings
function changeStack() {
    const selector = document.getElementById('stackType');
    if (selector) {
        state.currentStack = selector.value;
        saveState();
        updateStackDisplay();
        showNotification(`Stack cambiado a ${state.currentStack}`);
    }
}

// Utilities
function showNotification(message) {
    const notif = document.getElementById('notification');
    if (notif) {
        notif.textContent = message;
        notif.classList.add('show');
        setTimeout(() => notif.classList.remove('show'), 3000);
    }
}

function vibrate(pattern) {
    if ('vibrate' in navigator) {
        const vibrationOn = document.getElementById('vibrationOn');
        if (!vibrationOn || vibrationOn.checked) {
            navigator.vibrate(pattern);
        }
    }
}

function saveState() {
    try {
        localStorage.setItem('maximState', JSON.stringify(state));
    } catch (e) {
        console.error('Error saving state:', e);
    }
}

function loadState() {
    try {
        const saved = localStorage.getItem('maximState');
        if (saved) {
            const data = JSON.parse(saved);
            Object.assign(state, data);
            state.timer.interval = null;
            state.timer.isRunning = false;
        }
    } catch (e) {
        console.error('Error loading state:', e);
    }
}

function updateStackDisplay() {
    const stackList = document.getElementById('stackCardsList');
    const stackName = document.getElementById('currentStackName');
    
    if (!stackList) return;
    
    const currentStack = stacks[state.currentStack];
    const stackNames = {
        'mnemonica': 'Mnemonica (Tamariz)',
        'aronson': 'Aronson Stack',
        'eight-kings': 'Eight Kings',
        'si-stebbins': 'Si Stebbins',
        'custom': 'Stack Personalizado'
    };
    
    if (stackName) {
        stackName.textContent = stackNames[state.currentStack] || 'Stack Desconocido';
    }
    
    stackList.innerHTML = currentStack.map((card, index) => `
        <div style="
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 8px;
            padding: 10px 5px;
            text-align: center;
            font-size: 12px;
        ">
            <div style="font-weight: 600; margin-bottom: 3px;">${index + 1}</div>
            <div style="font-size: 18px;">${card}</div>
        </div>
    `).join('');
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('MAXIM: DOM loaded');
    
    loadState();
    
    const stackType = document.getElementById('stackType');
    if (stackType) {
        stackType.value = state.currentStack;
    }
    
    updateStackDisplay();
    
    console.log('MAXIM: Initialized');
});

// Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('SW registered'))
            .catch(err => console.log('SW registration failed'));
    });
}

console.log('MAXIM: app.js loaded');
