// Stack Creator - Archivo separado
console.log('Stack Creator JS loaded');

// Variables globales para la calculadora
window.tempRank = null;
window.tempCards = [];

window.addRank = function(rank) {
    console.log('addRank called:', rank);
    window.tempRank = rank;
    
    // Marcar visualmente
    const buttons = document.querySelectorAll('.calc-btn');
    buttons.forEach(btn => {
        if (btn.textContent.trim() === rank) {
            btn.classList.add('selected');
            setTimeout(() => btn.classList.remove('selected'), 300);
        }
    });
    
    console.log('Rank selected:', rank);
};

window.addSuit = function(suit) {
    console.log('addSuit called:', suit);
    
    if (!window.tempRank) {
        alert('⚠️ Primero elige un rango');
        return;
    }
    
    const card = window.tempRank + suit;
    window.tempCards.push(card);
    window.tempRank = null;
    
    updateStackDisplay();
    console.log('Card added:', card);
};

function updateStackDisplay() {
    const display = document.getElementById('stackCards');
    const counter = document.getElementById('stackCount');
    
    if (!display || !counter) {
        console.error('Display elements not found');
        return;
    }
    
    if (window.tempCards.length === 0) {
        display.innerHTML = '<span style="opacity: 0.5;">Click rango + palo...</span>';
    } else {
        display.textContent = window.tempCards.join(' ');
    }
    
    counter.textContent = window.tempCards.length + ' / 52';
    console.log('Display updated, cards:', window.tempCards.length);
}

window.deleteCard = function() {
    console.log('deleteCard called');
    window.tempCards.pop();
    updateStackDisplay();
};

window.saveNewStack = function() {
    console.log('saveNewStack called');
    
    const nameInput = document.getElementById('newStackName');
    if (!nameInput) {
        console.error('Name input not found');
        return;
    }
    
    const name = nameInput.value.trim();
    
    if (!name) {
        alert('⚠️ Escribe un nombre');
        return;
    }
    
    if (window.tempCards.length !== 52) {
        alert('⚠️ Necesitas 52 cartas (tienes ' + window.tempCards.length + ')');
        return;
    }
    
    console.log('Saving stack:', name, window.tempCards);
    
    // Acceder al state global
    if (typeof state === 'undefined') {
        console.error('State not defined');
        alert('⚠️ Error: state no disponible');
        return;
    }
    
    const stackId = 'custom_' + Date.now();
    
    if (!state.customStacks) {
        state.customStacks = {};
    }
    
    // Convertir cartas a formato stack
    const stackArray = window.tempCards.map(card => {
        const suit = card.slice(-1);
        const rank = card.slice(0, -1);
        return { rank, suit };
    });
    
    state.customStacks[stackId] = {
        name: name,
        cards: stackArray,
        createdAt: new Date().toISOString()
    };
    
    if (typeof stacks !== 'undefined') {
        stacks[stackId] = stackArray;
    }
    
    state.currentStack = stackId;
    
    if (typeof saveState === 'function') {
        saveState();
    }
    
    if (typeof updateStackSelector === 'function') {
        updateStackSelector();
    }
    
    // Limpiar
    window.tempCards = [];
    window.tempRank = null;
    nameInput.value = '';
    updateStackDisplay();
    
    alert('✅ Stack "' + name + '" creado');
    console.log('Stack saved successfully');
};

console.log('Stack Creator functions registered');
