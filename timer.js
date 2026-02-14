// iOS-Style Timer for MAXIM
class IOSTimer {
    constructor() {
        this.hours = 0;
        this.minutes = 15;
        this.seconds = 0;
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
                <div class="timer-header">
                    <h2>Temporizador</h2>
                    <p>Configura el tiempo</p>
                </div>

                <div class="timer-picker-container">
                    <div class="picker-wheel">
                        <div class="picker-selector"></div>
                        <ul class="picker-list" id="hoursPicker">
                            ${this.generatePickerItems(0, 23, 'horas')}
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

                <div class="timer-options">
                    <div class="timer-option">
                        <span>Al finalizar</span>
                        <div class="timer-option-value">
                            <span>Detener reproducción</span>
                            <span>›</span>
                        </div>
                    </div>
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
                        <div class="timer-display" id="timerDisplay">15:00</div>
                    </div>
                </div>

                <div class="timer-control-btns">
                    <button class="timer-pause-btn" id="pauseBtn" onclick="iosTimer.pauseResume()">Pausar</button>
                    <button class="timer-stop-btn" onclick="iosTimer.stop()">Detener</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    generatePickerItems(start, end, label) {
        let items = '';
        // Add padding items
        for (let i = 0; i < 4; i++) {
            items += `<li class="picker-item" data-value="">&nbsp;</li>`;
        }
        
        for (let i = start; i <= end; i++) {
            const selected = (label === 'min' && i === 15) ? 'selected' : '';
            items += `<li class="picker-item ${selected}" data-value="${i}">${i}</li>`;
        }
        
        // Add padding items
        for (let i = 0; i < 4; i++) {
            items += `<li class="picker-item" data-value="">&nbsp;</li>`;
        }
        
        return items;
    }

    setupEventListeners() {
        // Hours picker
        this.setupPicker('hoursPicker', (value) => {
            this.hours = parseInt(value) || 0;
        });

        // Minutes picker
        this.setupPicker('minutesPicker', (value) => {
            this.minutes = parseInt(value) || 0;
        });

        // Seconds picker
        this.setupPicker('secondsPicker', (value) => {
            this.seconds = parseInt(value) || 0;
        });

        // Initialize minutes to 15
        this.scrollToValue('minutesPicker', 15);
    }

    setupPicker(pickerId, onChange) {
        const picker = document.getElementById(pickerId);
        const items = picker.querySelectorAll('.picker-item');
        
        items.forEach((item, index) => {
            item.addEventListener('click', () => {
                const value = item.getAttribute('data-value');
                if (value === '') return;
                
                // Update selection
                items.forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
                
                // Center the item
                const itemHeight = 40;
                const offset = (index - 4) * itemHeight;
                picker.style.transform = `translateY(-${offset}px)`;
                
                // Trigger callback
                onChange(value);
            });
        });
    }

    scrollToValue(pickerId, value) {
        const picker = document.getElementById(pickerId);
        const items = picker.querySelectorAll('.picker-item');
        
        items.forEach((item, index) => {
            if (item.getAttribute('data-value') == value) {
                item.classList.add('selected');
                const itemHeight = 40;
                const offset = (index - 4) * itemHeight;
                picker.style.transform = `translateY(-${offset}px)`;
            }
        });
    }

    open() {
        document.getElementById('timerModal').classList.add('active');
        document.getElementById('timerSetup').classList.remove('hidden');
        document.getElementById('timerRunning').classList.remove('active');
        
        // Scroll to current values
        this.scrollToValue('hoursPicker', this.hours);
        this.scrollToValue('minutesPicker', this.minutes);
        this.scrollToValue('secondsPicker', this.seconds);
    }

    close() {
        document.getElementById('timerModal').classList.remove('active');
        this.reset();
    }

    setQuickTime(hours, minutes, seconds) {
        // Set the time
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
        
        // Update the pickers visually
        this.scrollToValue('hoursPicker', hours);
        this.scrollToValue('minutesPicker', minutes);
        this.scrollToValue('secondsPicker', seconds);
        
        // Visual feedback
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

        // Switch to running view
        document.getElementById('timerSetup').classList.add('hidden');
        document.getElementById('timerRunning').classList.add('active');

        // Start countdown
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

        // Vibrate
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

        // Vibrate
        if ('vibrate' in navigator) {
            navigator.vibrate(30);
        }
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
        clearInterval(this.interval);
        this.close();
        
        // Vibrate
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    }

    finish() {
        clearInterval(this.interval);
        this.isRunning = false;
        
        // Play alarm
        this.audio.play();
        
        // Vibrate pattern
        if ('vibrate' in navigator) {
            const vibratePattern = [200, 100, 200, 100, 200];
            navigator.vibrate(vibratePattern);
        }

        // Show finish state
        document.getElementById('timerDisplay').textContent = '00:00';
        document.getElementById('timerDisplay').classList.add('timer-pulse');
        document.getElementById('pauseBtn').classList.add('hidden');
    }

    reset() {
        clearInterval(this.interval);
        this.isRunning = false;
        this.remainingSeconds = 0;
        this.audio.pause();
        this.audio.currentTime = 0;
        
        document.getElementById('pauseBtn').classList.remove('hidden');
        document.getElementById('pauseBtn').textContent = 'Pausar';
        document.getElementById('timerDisplay').classList.remove('timer-pulse');
    }

    updateDisplay() {
        const hours = Math.floor(this.remainingSeconds / 3600);
        const minutes = Math.floor((this.remainingSeconds % 3600) / 60);
        const seconds = this.remainingSeconds % 60;

        let display = '';
        if (hours > 0) {
            display = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        } else {
            display = `${minutes}:${String(seconds).padStart(2, '0')}`;
        }

        document.getElementById('timerDisplay').textContent = display;
    }

    updateProgress() {
        const progress = this.remainingSeconds / this.totalSeconds;
        const circumference = 2 * Math.PI * 135; // radius = 135
        const offset = circumference * (1 - progress);
        
        document.getElementById('progressCircle').style.strokeDashoffset = offset;
    }
}

// Initialize timer
let iosTimer;
document.addEventListener('DOMContentLoaded', () => {
    iosTimer = new IOSTimer();
    iosTimer.init();
});
