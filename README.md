# RoutineAI 🎤⏰

A sophisticated voice-activated scheduling and alarm system with push notifications. Create and manage your daily routine using natural voice commands!

## ✨ Features

- 🎤 **Voice Commands**: Natural language processing for scheduling
- ⏰ **Smart Alarms**: Set alarms with voice or manual input
- 📅 **Schedule Management**: Organize meetings, appointments, and tasks
- 🔔 **Push Notifications**: Browser notifications for reminders
- 💾 **Persistent Storage**: Your data is saved locally
- 📱 **Responsive Design**: Works on desktop and mobile
- 🎨 **Modern UI**: Beautiful, intuitive interface

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.6+ (for local server)
- Microphone access for voice commands

### Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd RoutineAI-1
   ```

2. **Start the server**
   ```bash
   # Option 1: Using Python
   python3 server.py
   
   # Option 2: Using npm (if you have Node.js)
   npm run serve
   
   # Option 3: Simple Python server
   python3 -m http.server 8000
   ```

3. **Open your browser**
   - Go to: `http://localhost:8000`
   - Allow microphone access when prompted
   - Enable notifications for alarms

## 🎤 Voice Commands

### Setting Alarms
- "Set alarm for 7 AM tomorrow"
- "Alarm for 6:30 PM today"
- "Set wake up alarm for 6 AM"

### Scheduling Events
- "Schedule meeting at 3 PM today"
- "Schedule doctor appointment at 2:30 PM tomorrow"
- "Meeting with John at 10 AM Monday"

### Setting Reminders
- "Remind me to call Mom at 5 PM"
- "Remind me to take medicine at 8 AM tomorrow"
- "Reminder to buy groceries at 6 PM"

### Viewing Schedule
- "Show my schedule for today"
- "List today's appointments"
- "Show active alarms"

### Deleting Items
- "Delete alarm for 7 AM"
- "Cancel alarm for tomorrow morning"
- "Remove 3 PM meeting"

## 📱 Manual Controls

- **Add Manual Entry**: Click the "+" button to add items without voice
- **Voice Button**: Click the microphone to start voice recognition
- **Delete Items**: Click the trash icon to remove schedules or alarms

## 🔧 Technical Features

### Voice Recognition
- Uses Web Speech API for real-time voice processing
- Supports natural language commands
- Handles various time formats (12/24 hour, AM/PM)
- Recognizes dates (today, tomorrow, weekdays)

### Notification System
- Browser push notifications
- Audio alerts for alarms
- Persistent reminders
- Smart timing (checks every 10 seconds)

### Data Storage
- Local browser storage (localStorage)
- Automatic save/load
- Persistent across sessions
- No server required for data

## 🎨 UI Components

- **Voice Control Panel**: Microphone button and status display
- **Schedule View**: Today's appointments and tasks
- **Alarms Panel**: Active alarms with management controls
- **Manual Entry Modal**: Form for precise scheduling
- **Notification Banner**: Permission requests and alerts

## 🔒 Privacy & Security

- **Local Only**: All data stays on your device
- **No Tracking**: No analytics or data collection
- **Offline Capable**: Works without internet (after initial load)
- **Secure Storage**: Uses browser's built-in localStorage

## 🛠️ Development

### Project Structure
```
RoutineAI-1/
├── index.html          # Main HTML structure
├── styles.css          # Modern CSS styling
├── app.js             # Core JavaScript application
├── server.py          # Simple Python server
├── package.json       # NPM configuration
└── README.md          # This file
```

### Core Classes
- **RoutineAI**: Main application class
- **Voice Recognition**: Speech-to-text processing
- **Schedule Manager**: Event and alarm handling
- **Notification System**: Push notification management

### Key Methods
- `processVoiceCommand()`: Parse natural language
- `handleAlarmCommand()`: Process alarm requests
- `scheduleNotification()`: Set up browser notifications
- `parseDate()`: Convert relative dates (today, tomorrow)

## 🌐 Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|---------|------|
| Voice Recognition | ✅ | ✅ | ✅ | ✅ |
| Push Notifications | ✅ | ✅ | ✅ | ✅ |
| Local Storage | ✅ | ✅ | ✅ | ✅ |
| Audio API | ✅ | ✅ | ✅ | ✅ |

## 📞 Troubleshooting

### Voice Recognition Not Working
- Check microphone permissions in browser
- Ensure you're using HTTPS or localhost
- Try refreshing the page
- Check browser console for errors

### Notifications Not Showing
- Click "Enable" on the notification banner
- Check browser notification settings
- Ensure notifications aren't blocked
- Try setting a test alarm

### Alarms Not Triggering
- Keep the browser tab open
- Check system time is correct
- Verify notification permissions
- Check browser console for errors

## 🔮 Future Enhancements

- 🌍 **Multi-language Support**: International voice commands
- 🔄 **Calendar Integration**: Sync with Google Calendar, Outlook
- 🏷️ **Categories & Tags**: Organize schedules by type
- 📊 **Analytics**: Usage patterns and insights
- 🎵 **Custom Alarm Sounds**: Personalized wake-up tones
- 🌙 **Dark Mode**: Theme switching
- 📱 **PWA Support**: Install as mobile app
- 🤖 **AI Improvements**: Better natural language processing

## 💝 Contributing

We welcome contributions! Please feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Web Speech API for voice recognition
- Font Awesome for icons
- Modern CSS Grid and Flexbox
- Browser Notification API

---

**Ready to revolutionize your routine? Start talking to your schedule! 🗣️⏰**
