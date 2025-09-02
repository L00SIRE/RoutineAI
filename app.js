class RoutineAI {
    constructor() {
        this.schedules = [];
        this.alarms = [];
        this.isListening = false;
        this.recognition = null;
        this.notificationPermission = false;
        
        this.init();
    }

    init() {
        this.loadData();
        this.setupVoiceRecognition();
        this.setupEventListeners();
        this.checkNotificationPermission();
        this.renderSchedules();
        this.renderAlarms();
        this.startAlarmChecker();
    }

    // Voice Recognition Setup
    setupVoiceRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
        } else if ('SpeechRecognition' in window) {
            this.recognition = new SpeechRecognition();
        } else {
            console.warn('Speech recognition not supported');
            return;
        }

        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateVoiceStatus('Listening... Speak your command');
            document.getElementById('voiceBtn').classList.add('listening');
        };

        this.recognition.onresult = (event) => {
            const command = event.results[0][0].transcript.toLowerCase();
            this.updateVoiceStatus(`Processing: "${command}"`);
            this.processVoiceCommand(command);
        };

        this.recognition.onerror = (event) => {
            this.updateVoiceStatus(`Error: ${event.error}`);
            this.stopListening();
        };

        this.recognition.onend = () => {
            this.stopListening();
        };
    }

    // Voice Command Processing
    processVoiceCommand(command) {
        console.log('Processing command:', command);
        
        try {
            if (command.includes('set alarm') || command.includes('alarm')) {
                this.handleAlarmCommand(command);
            } else if (command.includes('schedule') || command.includes('meeting') || command.includes('appointment')) {
                this.handleScheduleCommand(command);
            } else if (command.includes('remind') || command.includes('reminder')) {
                this.handleReminderCommand(command);
            } else if (command.includes('show') || command.includes('list')) {
                this.handleShowCommand(command);
            } else if (command.includes('delete') || command.includes('remove') || command.includes('cancel')) {
                this.handleDeleteCommand(command);
            } else {
                this.updateVoiceStatus('Command not recognized. Try "set alarm for 7 AM" or "schedule meeting at 3 PM"');
            }
        } catch (error) {
            console.error('Error processing command:', error);
            this.updateVoiceStatus('Error processing command. Please try again.');
        }
    }

    handleAlarmCommand(command) {
        const timeMatch = command.match(/(\d{1,2}):?(\d{2})?\s*(am|pm)?|(\d{1,2})\s*(am|pm)/i);
        const dateMatch = command.match(/(today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i);
        
        if (timeMatch) {
            let hour, minute = 0, period = '';
            
            if (timeMatch[4]) { // Format like "7 AM"
                hour = parseInt(timeMatch[4]);
                period = timeMatch[5] || '';
            } else { // Format like "7:30 AM"
                hour = parseInt(timeMatch[1]);
                minute = parseInt(timeMatch[2]) || 0;
                period = timeMatch[3] || '';
            }
            
            // Convert to 24-hour format
            if (period.toLowerCase() === 'pm' && hour !== 12) hour += 12;
            if (period.toLowerCase() === 'am' && hour === 12) hour = 0;
            
            const targetDate = this.parseDate(dateMatch ? dateMatch[1] : 'today');
            targetDate.setHours(hour, minute, 0, 0);
            
            const alarm = {
                id: Date.now().toString(),
                title: 'Alarm',
                time: targetDate,
                type: 'alarm',
                active: true
            };
            
            this.alarms.push(alarm);
            this.saveData();
            this.renderAlarms();
            this.updateVoiceStatus(`Alarm set for ${targetDate.toLocaleDateString()} at ${targetDate.toLocaleTimeString()}`);
            this.scheduleNotification(alarm);
        } else {
            this.updateVoiceStatus('Could not understand the time. Try "set alarm for 7 AM tomorrow"');
        }
    }

    handleScheduleCommand(command) {
        const timeMatch = command.match(/(\d{1,2}):?(\d{2})?\s*(am|pm)?|(\d{1,2})\s*(am|pm)/i);
        const dateMatch = command.match(/(today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i);
        
        // Extract title from command
        let title = 'Schedule Item';
        if (command.includes('meeting')) {
            title = 'Meeting';
        } else if (command.includes('appointment')) {
            title = 'Appointment';
        }
        
        // Try to extract more specific title
        const titleMatch = command.match(/schedule\s+(.+?)\s+at|meeting\s+(.+?)\s+at|(.+?)\s+meeting/i);
        if (titleMatch) {
            title = titleMatch[1] || titleMatch[2] || titleMatch[3] || title;
        }
        
        if (timeMatch) {
            let hour, minute = 0, period = '';
            
            if (timeMatch[4]) {
                hour = parseInt(timeMatch[4]);
                period = timeMatch[5] || '';
            } else {
                hour = parseInt(timeMatch[1]);
                minute = parseInt(timeMatch[2]) || 0;
                period = timeMatch[3] || '';
            }
            
            if (period.toLowerCase() === 'pm' && hour !== 12) hour += 12;
            if (period.toLowerCase() === 'am' && hour === 12) hour = 0;
            
            const targetDate = this.parseDate(dateMatch ? dateMatch[1] : 'today');
            targetDate.setHours(hour, minute, 0, 0);
            
            const schedule = {
                id: Date.now().toString(),
                title: title,
                time: targetDate,
                type: 'meeting',
                active: true
            };
            
            this.schedules.push(schedule);
            this.saveData();
            this.renderSchedules();
            this.updateVoiceStatus(`Scheduled "${title}" for ${targetDate.toLocaleDateString()} at ${targetDate.toLocaleTimeString()}`);
            this.scheduleNotification(schedule);
        } else {
            this.updateVoiceStatus('Could not understand the time. Try "schedule meeting at 3 PM today"');
        }
    }

    handleReminderCommand(command) {
        const timeMatch = command.match(/(\d{1,2}):?(\d{2})?\s*(am|pm)?|(\d{1,2})\s*(am|pm)/i);
        const dateMatch = command.match(/(today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i);
        
        // Extract reminder content
        let title = 'Reminder';
        const reminderMatch = command.match(/remind me to (.+?)(?:\s+at|\s+tomorrow|\s+today|$)/i);
        if (reminderMatch) {
            title = reminderMatch[1];
        }
        
        if (timeMatch) {
            let hour, minute = 0, period = '';
            
            if (timeMatch[4]) {
                hour = parseInt(timeMatch[4]);
                period = timeMatch[5] || '';
            } else {
                hour = parseInt(timeMatch[1]);
                minute = parseInt(timeMatch[2]) || 0;
                period = timeMatch[3] || '';
            }
            
            if (period.toLowerCase() === 'pm' && hour !== 12) hour += 12;
            if (period.toLowerCase() === 'am' && hour === 12) hour = 0;
            
            const targetDate = this.parseDate(dateMatch ? dateMatch[1] : 'today');
            targetDate.setHours(hour, minute, 0, 0);
            
            const reminder = {
                id: Date.now().toString(),
                title: title,
                time: targetDate,
                type: 'reminder',
                active: true
            };
            
            this.schedules.push(reminder);
            this.saveData();
            this.renderSchedules();
            this.updateVoiceStatus(`Reminder set: "${title}" for ${targetDate.toLocaleDateString()} at ${targetDate.toLocaleTimeString()}`);
            this.scheduleNotification(reminder);
        } else {
            this.updateVoiceStatus('Could not understand the time. Try "remind me to call John at 2:30 PM"');
        }
    }

    handleShowCommand(command) {
        if (command.includes('schedule') || command.includes('today')) {
            const today = new Date();
            const todaySchedules = this.schedules.filter(s => 
                s.time.toDateString() === today.toDateString()
            );
            
            if (todaySchedules.length > 0) {
                const scheduleText = todaySchedules.map(s => 
                    `${s.title} at ${s.time.toLocaleTimeString()}`
                ).join(', ');
                this.updateVoiceStatus(`Today's schedule: ${scheduleText}`);
            } else {
                this.updateVoiceStatus('No schedule items for today');
            }
        } else if (command.includes('alarm')) {
            const activeAlarms = this.alarms.filter(a => a.active);
            if (activeAlarms.length > 0) {
                const alarmText = activeAlarms.map(a => 
                    `${a.time.toLocaleTimeString()}`
                ).join(', ');
                this.updateVoiceStatus(`Active alarms: ${alarmText}`);
            } else {
                this.updateVoiceStatus('No active alarms');
            }
        }
    }

    handleDeleteCommand(command) {
        const timeMatch = command.match(/(\d{1,2}):?(\d{2})?\s*(am|pm)?|(\d{1,2})\s*(am|pm)/i);
        
        if (timeMatch && (command.includes('alarm') || command.includes('delete alarm'))) {
            let hour, minute = 0, period = '';
            
            if (timeMatch[4]) {
                hour = parseInt(timeMatch[4]);
                period = timeMatch[5] || '';
            } else {
                hour = parseInt(timeMatch[1]);
                minute = parseInt(timeMatch[2]) || 0;
                period = timeMatch[3] || '';
            }
            
            if (period.toLowerCase() === 'pm' && hour !== 12) hour += 12;
            if (period.toLowerCase() === 'am' && hour === 12) hour = 0;
            
            const targetTime = new Date();
            targetTime.setHours(hour, minute, 0, 0);
            
            const alarmIndex = this.alarms.findIndex(a => 
                a.time.getHours() === hour && a.time.getMinutes() === minute
            );
            
            if (alarmIndex !== -1) {
                this.alarms.splice(alarmIndex, 1);
                this.saveData();
                this.renderAlarms();
                this.updateVoiceStatus(`Alarm for ${targetTime.toLocaleTimeString()} deleted`);
            } else {
                this.updateVoiceStatus('Could not find alarm for that time');
            }
        } else {
            this.updateVoiceStatus('Could not understand what to delete. Try "delete alarm for 7 AM"');
        }
    }

    parseDate(dateString) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        switch (dateString.toLowerCase()) {
            case 'today':
                return new Date(today);
            case 'tomorrow':
                return new Date(tomorrow);
            case 'monday':
            case 'tuesday':
            case 'wednesday':
            case 'thursday':
            case 'friday':
            case 'saturday':
            case 'sunday':
                const dayIndex = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
                    .indexOf(dateString.toLowerCase());
                const targetDate = new Date(today);
                const currentDay = today.getDay();
                const daysUntilTarget = (dayIndex - currentDay + 7) % 7;
                targetDate.setDate(today.getDate() + (daysUntilTarget === 0 ? 7 : daysUntilTarget));
                return targetDate;
            default:
                return new Date(today);
        }
    }

    // Event Listeners
    setupEventListeners() {
        document.getElementById('voiceBtn').addEventListener('click', () => {
            if (this.isListening) {
                this.stopListening();
            } else {
                this.startListening();
            }
        });

        document.getElementById('addManualBtn').addEventListener('click', () => {
            document.getElementById('manualModal').style.display = 'block';
        });

        document.querySelector('.close').addEventListener('click', () => {
            document.getElementById('manualModal').style.display = 'none';
        });

        document.getElementById('manualForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addManualItem();
        });

        document.getElementById('enableNotifications').addEventListener('click', () => {
            this.requestNotificationPermission();
        });

        document.getElementById('dismissBanner').addEventListener('click', () => {
            document.getElementById('notificationBanner').style.display = 'none';
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('manualModal');
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Voice Control Methods
    startListening() {
        if (this.recognition) {
            try {
                this.recognition.start();
            } catch (error) {
                console.error('Error starting recognition:', error);
                this.updateVoiceStatus('Error starting voice recognition');
            }
        } else {
            this.updateVoiceStatus('Voice recognition not supported');
        }
    }

    stopListening() {
        this.isListening = false;
        document.getElementById('voiceBtn').classList.remove('listening');
        if (this.recognition) {
            this.recognition.stop();
        }
        setTimeout(() => {
            this.updateVoiceStatus('Click the microphone to give a voice command');
        }, 2000);
    }

    updateVoiceStatus(message) {
        document.getElementById('voiceStatus').textContent = message;
    }

    // Manual Item Addition
    addManualItem() {
        const title = document.getElementById('title').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const type = document.getElementById('type').value;

        const datetime = new Date(`${date}T${time}`);
        
        const item = {
            id: Date.now().toString(),
            title: title,
            time: datetime,
            type: type,
            active: true
        };

        if (type === 'alarm') {
            this.alarms.push(item);
            this.renderAlarms();
        } else {
            this.schedules.push(item);
            this.renderSchedules();
        }

        this.saveData();
        this.scheduleNotification(item);
        document.getElementById('manualModal').style.display = 'none';
        document.getElementById('manualForm').reset();
    }

    // Rendering Methods
    renderSchedules() {
        const container = document.getElementById('scheduleList');
        const today = new Date();
        const todaySchedules = this.schedules
            .filter(s => s.time.toDateString() === today.toDateString())
            .sort((a, b) => a.time - b.time);

        if (todaySchedules.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-alt"></i>
                    <p>No schedule items for today</p>
                </div>
            `;
            return;
        }

        container.innerHTML = todaySchedules.map(schedule => `
            <div class="schedule-item fade-in">
                <div class="item-info">
                    <div class="item-title">${schedule.title}</div>
                    <div class="item-time">
                        <i class="fas fa-clock"></i>
                        ${schedule.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                </div>
                <div class="item-type ${schedule.type}">${schedule.type}</div>
                <div class="item-actions">
                    <button class="action-btn delete" onclick="routineAI.deleteSchedule('${schedule.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderAlarms() {
        const container = document.getElementById('alarmsList');
        const activeAlarms = this.alarms
            .filter(a => a.active)
            .sort((a, b) => a.time - b.time);

        if (activeAlarms.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-bell"></i>
                    <p>No active alarms</p>
                </div>
            `;
            return;
        }

        container.innerHTML = activeAlarms.map(alarm => `
            <div class="alarm-item fade-in">
                <div class="item-info">
                    <div class="item-title">${alarm.title}</div>
                    <div class="item-time">
                        <i class="fas fa-bell"></i>
                        ${alarm.time.toLocaleDateString()} at ${alarm.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                </div>
                <div class="item-type alarm">alarm</div>
                <div class="item-actions">
                    <button class="action-btn delete" onclick="routineAI.deleteAlarm('${alarm.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Delete Methods
    deleteSchedule(id) {
        this.schedules = this.schedules.filter(s => s.id !== id);
        this.saveData();
        this.renderSchedules();
    }

    deleteAlarm(id) {
        this.alarms = this.alarms.filter(a => a.id !== id);
        this.saveData();
        this.renderAlarms();
    }

    // Notification Methods
    checkNotificationPermission() {
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                this.notificationPermission = true;
            } else if (Notification.permission === 'default') {
                document.getElementById('notificationBanner').style.display = 'block';
            }
        }
    }

    requestNotificationPermission() {
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.notificationPermission = true;
                    document.getElementById('notificationBanner').style.display = 'none';
                }
            });
        }
    }

    scheduleNotification(item) {
        if (!this.notificationPermission) return;

        const now = new Date().getTime();
        const targetTime = item.time.getTime();
        const delay = targetTime - now;

        if (delay > 0) {
            setTimeout(() => {
                this.showNotification(item);
            }, delay);
        }
    }

    showNotification(item) {
        if (!this.notificationPermission) return;

        const notification = new Notification(item.title, {
            body: `Scheduled for ${item.time.toLocaleTimeString()}`,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: item.id,
            requireInteraction: true
        });

        // Play alarm sound for alarms
        if (item.type === 'alarm') {
            this.playAlarmSound();
        }

        notification.onclick = () => {
            window.focus();
            notification.close();
        };
    }

    playAlarmSound() {
        // Create audio context for alarm sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 1);

        // Repeat the sound
        setTimeout(() => {
            if (audioContext.state !== 'closed') {
                this.playAlarmSound();
            }
        }, 1500);
    }

    // Alarm Checker
    startAlarmChecker() {
        setInterval(() => {
            const now = new Date();
            const currentTime = now.getTime();

            // Check alarms
            this.alarms.forEach(alarm => {
                if (alarm.active && Math.abs(alarm.time.getTime() - currentTime) < 30000) { // Within 30 seconds
                    this.showNotification(alarm);
                    alarm.active = false; // Deactivate after triggering
                }
            });

            // Check schedule items
            this.schedules.forEach(schedule => {
                if (schedule.active && Math.abs(schedule.time.getTime() - currentTime) < 30000) {
                    this.showNotification(schedule);
                    schedule.active = false; // Deactivate after triggering
                }
            });

            this.saveData();
        }, 10000); // Check every 10 seconds
    }

    // Data Persistence
    saveData() {
        localStorage.setItem('routineAI_schedules', JSON.stringify(this.schedules));
        localStorage.setItem('routineAI_alarms', JSON.stringify(this.alarms));
    }

    loadData() {
        const savedSchedules = localStorage.getItem('routineAI_schedules');
        const savedAlarms = localStorage.getItem('routineAI_alarms');

        if (savedSchedules) {
            this.schedules = JSON.parse(savedSchedules).map(s => ({
                ...s,
                time: new Date(s.time)
            }));
        }

        if (savedAlarms) {
            this.alarms = JSON.parse(savedAlarms).map(a => ({
                ...a,
                time: new Date(a.time)
            }));
        }
    }
}

// Initialize the application
const routineAI = new RoutineAI();

// Make routineAI globally available for onclick handlers
window.routineAI = routineAI;

