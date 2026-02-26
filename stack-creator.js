// Stack Creator - Con listeners en DOMContentLoaded
console.log('Stack Creator JS loaded');

// Variables globales
let tempRank = null;
let tempCards = [];

function updateStackDisplay() {
    const display = document.getElementById('stackCards');
    const counter = document.getElementById('stackCount');
    
    if (!display || !counter) return;
    
    if (tempCards.length === 0) {
        display.innerHTML = '<span style="opacity: 0.5;">Click rango + palo...</span>';
    } else {
        display.textContent = tempCards.join(' ');
    }
    
    counter.textContent = tempCards.length + ' / 52';
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Stack Creator: DOM loaded, adding listeners...');
    
    // Listener para abrir pantalla crear stack
    const createStackBtn = document.getElementById('createStackBtn');
    if (createStackBtn) {
        createStackBtn.addEventListener('click', function() {
            console.log('Opening create stack screen');
            if (typeof showScreen === 'function') {
                showScreen('createStackScreen');
            }
        });
        console.log('✓ Create stack button listener added');
    }
    
    // Listener para volver
    const backBtn = document.getElementById('backFromCreate');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            console.log('Going back to main screen');
            if (typeof showMainScreen === 'function') {
                showMainScreen();
            }
        });
        console.log('✓ Back button listener added');
    }
    
    // Listeners para RANGOS
    const ranksContainer1 = document.getElementById('ranksContainer');
    const ranksContainer2 = document.getElementById('ranksContainer2');
    
    if (ranksContainer1) {
        ranksContainer1.addEventListener('click', function(e) {
            if (e.target.dataset.rank) {
                const rank = e.target.dataset.rank;
                tempRank = rank;
                e.target.classList.add('selected');
                setTimeout(() => e.target.classList.remove('selected'), 300);
                console.log('Rank selected:', rank);
            }
        });
        console.log('✓ Ranks container 1 listener added');
    }
    
    if (ranksContainer2) {
        ranksContainer2.addEventListener('click', function(e) {
            if (e.target.dataset.rank) {
                const rank = e.target.dataset.rank;
                tempRank = rank;
                e.target.classList.add('selected');
                setTimeout(() => e.target.classList.remove('selected'), 300);
                console.log('Rank selected:', rank);
            }
        });
        console.log('✓ Ranks container 2 listener added');
    }
    
    // Listeners para PALOS
    const suitsContainer = document.getElementById('suitsContainer');
    if (suitsContainer) {
        suitsContainer.addEventListener('click', function(e) {
            if (e.target.dataset.suit) {
                const suit = e.target.dataset.suit;
                
                if (!tempRank) {
                    alert('⚠️ Primero elige un rango');
                    return;
                }
                
                const card = tempRank + suit;
                tempCards.push(card);
                tempRank = null;
                updateStackDisplay();
                console.log('Card added:', card, '- Total:', tempCards.length);
            }
        });
        console.log('✓ Suits container listener added');
    }
    
    // Listener BORRAR
    const deleteBtn = document.getElementById('deleteCardBtn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            tempCards.pop();
            updateStackDisplay();
            console.log('Card deleted - Total:', tempCards.length);
        });
        console.log('✓ Delete button listener added');
    }
    
    // Listener GUARDAR
    const saveBtn = document.getElementById('saveStackBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            console.log('Save clicked');
            
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
            
            if (tempCards.length !== 52) {
                alert('⚠️ Necesitas 52 cartas (tienes ' + tempCards.length + ')');
                return;
            }
            
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
            const stackArray = tempCards.map(card => {
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
            
            // Actualizar selector
            const select = document.getElementById('stackType');
            if (select) {
                const option = document.createElement('option');
                option.value = stackId;
                option.textContent = name;
                option.selected = true;
                select.appendChild(option);
            }
            
            // Limpiar
            tempCards = [];
            tempRank = null;
            nameInput.value = '';
            updateStackDisplay();
            
            alert('✅ Stack "' + name + '" creado');
            console.log('Stack saved successfully');
        });
        console.log('✓ Save button listener added');
    }
    
    console.log('Stack Creator: All listeners added successfully!');
});

