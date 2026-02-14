// iOS-Style Timer for MAXIM - VERSIÓN FINAL
class IOSTimer {
    constructor() {
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 15; // Default 15 segundos
        this.totalSeconds = 0;
        this.remainingSeconds = 0;
        this.interval = null;
        this.isRunning = false;
        this.audio = new Audio('alarm.mp3');
        this.audio.loop = true;
    }

    init() {
        this.createTimerModal();
        this.setupEventListeners();
    }

    createTimerModal() {
        const modal = document.createElement('div');
        modal.id = 'timerModal';
        modal.className = 'timer-modal';
        modal.innerHTML = `
            <div id="timerSetup" class="timer-setup">
                <div class="timer-picker-container">
                    <div class="picker-wheel">
                        <div class="picker-selector"></div>
                        <ul class="picker-list" id="hoursPicker">
                            ${this.generatePickerItems(0, 23, 'h')}
                        </ul>
                    </div>

                    <div class="picker-wheel">
                        <div class="picker-selector"></div>
                        <ul class="picker-list" id="minutesPicker">
                            ${this.generatePickerItems(0, 59, 'min')}
                        </ul>
                    </div>

                    <div class="picker-wheel">
                        <div class="picker-selector"></div>
                        <ul class="picker-list" id="secondsPicker">
                            ${this.generatePickerItems(0, 59, 's')}
                        </ul>
                    </div>
                </div>

                <div class="timer-quick-buttons">
                    <button class="timer-quick-btn" onclick="iosTimer.setQuickTime(0, 0, 15)">15s</button>
                    <button class="timer-quick-btn" onclick="iosTimer.setQuickTime(0, 0, 30)">30s</button>
                    <button class="timer-quick-btn" onclick="iosTimer.setQuickTime(0, 1, 0)">1 min</button>
                </div>

                <div class="timer-buttons">
                    <button class="timer-action-btn timer-cancel-btn" onclick="iosTimer.close()">Cancelar</button>
                    <button class="timer-action-btn timer-start-btn" onclick="iosTimer.start()">Iniciar</button>
                </div>
            </div>

            <div id="timerRunning" class="timer-running">
                <div class="timer-progress-ring">
                    <svg width="280" height="280">
                        <circle class="timer-progress-bg" cx="140" cy="140" r="135"></circle>
                        <circle class="timer-progress-bar" cx="140" cy="140" r="135" 
                                stroke-dasharray="848" stroke-dashoffset="0" id="progressCircle"></circle>
                    </svg>
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                        <div class="timer-display" id="timerDisplay">00:15</div>
                    </div>
                </div>

                <div class="timer-control-btns">
                    <button class="timer-pause-btn" id="pauseBtn" onclick="iosTimer.pauseResume()">Pausar</button>
                    <button class="timer-stop-btn" onclick="iosTimer.stop()">Detener</button>
                </div>
            </div>

            <div id="timerStopped" class="timer-stopped" style="display: none;">
                <div style="text-align: center; margin-bottom: 40px;">
                    <div style="font-size: 80px; margin-bottom: 20px;">⏱️</div>
                    <h2 style="font-size: 24px; margin-bottom: 10px;">Temporizador Detenido</h2>
                    <p style="opacity: 0.7;">Continúa con el juego</p>
                </div>
                <button class="timer-continue-btn" onclick="iosTimer.continueToGame()">Continuar</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    generatePickerItems(start, end, label) {
        let items = '';
        // Padding superior (4 items vacíos)
        for (let i = 0; i < 4; i++) {
            items += `<li class="picker-item">&nbsp;</li>`;
        }
        
        // Números reales
        for (let i = start; i <= end; i++) {
            items += `<li class="picker-item" data-value="${i}">${i}</li>`;
        }
        
        // Padding inferior (4 items vacíos)
        for (let i = 0; i < 4; i++) {
            items += `<li class="picker-item">&nbsp;</li>`;
        }
        
        return items;
    }

    setupEventListeners() {
        this.setupPicker('hoursPicker', (value) => {
            this.hours = parseInt(value) || 0;
        });

        this.setupPicker('minutesPicker', (value) => {
            this.minutes = parseInt(value) || 0;
        });

        this.setupPicker('secondsPicker', (value) => {
            this.seconds = parseInt(value) || 0;
        });
    }

    setupPicker(pickerId, onChange) {
        const picker = document.getElementById(pickerId);
        const items = picker.querySelectorAll('.picker-item');
        
        items.forEach((item, index) => {
            item.addEventListener('click', () => {
                const value = item.getAttribute('data-value');
                if (!value) return;
                
                // Actualizar selección visual
                items.forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
                
                // Centrar el item seleccionado
                this.centerItem(picker, index);
                
                // Callback
                onChange(value);
            });
        });
    }

    centerItem(picker, index) {
        const itemHeight = 40;
        // El item en índice 4 del padding debe estar centrado
        // Entonces el offset es (index - 4) * itemHeight
        const offset = (index - 4) * itemHeight;
        picker.style.transform = `translateY(${-offset}px)`;
        picker.style.transition = 'transform 0.3s ease';
    }

    scrollToValue(pickerId, value) {
        const picker = document.getElementById(pickerId);
        const items = picker.querySelectorAll('.picker-item');
        
        items.forEach((item, index) => {
            const itemValue = item.getAttribute('data-value');
            if (itemValue == value) {
                item.classList.add('selected');
                this.centerItem(picker, index);
            } else {
                item.classList.remove('selected');
            }
        });
    }

    open() {
        document.getElementById('timerModal').classList.add('active');
        document.getElementById('timerSetup').style.display = 'flex';
        document.getElementById('timerRunning').classList.remove('active');
        document.getElementById('timerStopped').style.display = 'none';
        
        // Scroll a valores por defecto (0h, 0min, 15s)
        setTimeout(() => {
            this.scrollToValue('hoursPicker', this.hours);
            this.scrollToValue('minutesPicker', this.minutes);
            this.scrollToValue('secondsPicker', this.seconds);
        }, 100);
    }

    close() {
        document.getElementById('timerModal').classList.remove('active');
        this.reset();
    }

    setQuickTime(hours, minutes, seconds) {
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
        
        this.scrollToValue('hoursPicker', hours);
        this.scrollToValue('minutesPicker', minutes);
        this.scrollToValue('secondsPicker', seconds);
        
        if ('vibrate' in navigator) {
            navigator.vibrate(30);
        }
    }

    start() {
        this.totalSeconds = (this.hours * 3600) + (this.minutes * 60) + this.seconds;
        
        if (this.totalSeconds === 0) {
            alert('Por favor, configura un tiempo mayor a 0');
            return;
        }

        this.remainingSeconds = this.totalSeconds;
        this.isRunning = true;

        // Cambiar a vista de running
        document.getElementById('timerSetup').style.display = 'none';
        document.getElementById('timerRunning').classList.add('active');

        this.updateDisplay();
        this.updateProgress();
        
        this.interval = setInterval(() => {
            if (this.isRunning) {
                this.remainingSeconds--;
                this.updateDisplay();
                this.updateProgress();

                if (this.remainingSeconds <= 0) {
                    this.finish();
                }
            }
        }, 1000);

        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    }

    pauseResume() {
        this.isRunning = !this.isRunning;
        const pauseBtn = document.getElementById('pauseBtn');
        
        if (this.isRunning) {
            pauseBtn.textContent = 'Pausar';
            document.getElementById('timerDisplay').classList.remove('timer-pulse');
        } else {
            pauseBtn.textContent = 'Reanudar';
            document.getElementById('timerDisplay').classList.add('timer-pulse');
        }

        if ('vibrate' in navigator) {
            navigator.vibrate(30);
        }
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
        clearInterval(this.interval);
        this.isRunning = false;
        
        // Mostrar pantalla "Continuar"
        document.getElementById('timerRunning').classList.remove('active');
        document.getElementById('timerStopped').style.display = 'flex';
        
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    }

    continueToGame() {
        // Cerrar timer y continuar al juego
        this.close();
        
        // Ir a pantalla de key card (carta de abajo)
        if (typeof showScreen === 'function') {
            showScreen('keyCardSuitScreen');
        }
    }

    finish() {
        clearInterval(this.interval);
        this.isRunning = false;
        
        // Reproducir alarma
        this.audio.play();
        
        // Vibración
        if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200, 100, 200]);
        }

        // Mostrar estado final
        document.getElementById('timerDisplay').textContent = '00:00';
        document.getElementById('timerDisplay').classList.add('timer-pulse');
        document.getElementById('pauseBtn').style.display = 'none';
    }

    reset() {
        clearInterval(this.interval);
        this.isRunning = false;
        this.remainingSeconds = 0;
        this.audio.pause();
        this.audio.currentTime = 0;
        
        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) {
            pauseBtn.style.display = 'block';
            pauseBtn.textContent = 'Pausar';
        }
        
        const display = document.getElementById('timerDisplay');
        if (display) {
            display.classList.remove('timer-pulse');
        }
    }

    updateDisplay() {
        const hours = Math.floor(this.remainingSeconds / 3600);
        const minutes = Math.floor((this.remainingSeconds % 3600) / 60);
        const seconds = this.remainingSeconds % 60;

        let display = '';
        if (hours > 0) {
            display = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        } else {
            display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }

        document.getElementById('timerDisplay').textContent = display;
    }

    updateProgress() {
        const progress = this.remainingSeconds / this.totalSeconds;
        const circumference = 2 * Math.PI * 135;
        const offset = circumference * (1 - progress);
        
        document.getElementById('progressCircle').style.strokeDashoffset = offset;
    }
}

// Inicializar timer
let iosTimer;
document.addEventListener('DOMContentLoaded', () => {
    iosTimer = new IOSTimer();
    iosTimer.init();
    console.log('Timer initialized');
});
