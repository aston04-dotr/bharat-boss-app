# Technical Specification: Project Deployment

## Task Complexity Assessment
**Difficulty**: Medium

**Reasoning**: While the task appears straightforward (install dependencies and run npm start), there's a significant gap between the current codebase state and the deployment requirements. The project lacks essential backend infrastructure and configuration files.

## Technical Context

### Current State
- **Language**: JavaScript (Node.js for backend, vanilla JS for frontend)
- **Frontend**: Static Telegram WebApp with socket.io-client
  - `index.html` - UI for a "Syndicate Terminal" game/app
  - `app.js` - Client-side logic using Telegram WebApp API and socket.io
  - `style.css` - Styling
- **Backend**: Missing (referenced but not present)
  - Currently connects to hardcoded ngrok URL: `https://atrociously-notionate-idalia.ngrok-free.dev`
- **Dependencies**: No package.json exists

### Missing Components
1. **package.json**: No dependency management configuration
2. **bot.js**: Telegram bot server (mentioned in task description but absent)
3. **server.js**: Web server (mentioned in task description but absent)
4. **node_modules**: Dependencies not installed

## Implementation Approach

### 1. Create Package Configuration
Create `package.json` with:
- **Dependencies**:
  - `express` - Web server framework
  - `socket.io` - Real-time bidirectional communication
  - `node-telegram-bot-api` - Telegram Bot API wrapper
  - `dotenv` - Environment variable management
- **Scripts**:
  - `start`: Launch both bot and server simultaneously
  - Development and production modes if needed

### 2. Create Web Server (server.js)
Implement HTTP server to:
- Serve static files (index.html, app.js, style.css)
- Handle socket.io connections for real-time updates
- Replace hardcoded ngrok URL in app.js with relative connection
- Manage balance updates and click events from frontend
- Default port: 3000 (configurable via environment variable)

### 3. Create Telegram Bot (bot.js)
Implement Telegram bot to:
- Initialize bot using Telegram Bot API
- Provide WebApp access via bot commands
- Handle bot commands and inline keyboards
- Integrate with the WebApp URL
- Require BOT_TOKEN from environment variables

### 4. Environment Configuration
Create `.env.example` with required variables:
- `BOT_TOKEN` - Telegram bot token
- `PORT` - Server port (optional, default 3000)
- `WEBAPP_URL` - URL where the web app is hosted

### 5. Update .gitignore
Ensure the following are ignored:
- `node_modules/`
- `.env`
- `*.log`
- `.DS_Store`

### 6. Update Frontend Connection
Modify `app.js` to:
- Connect to relative socket.io URL instead of hardcoded ngrok
- Use `io()` without parameters or `io(window.location.origin)`

## Source Code Structure Changes

### New Files
- `package.json` - Project configuration and dependencies
- `server.js` - Express + Socket.io web server
- `bot.js` - Telegram bot implementation
- `.env.example` - Environment variable template
- `.gitignore` - Git ignore rules (if not exists)

### Modified Files
- `app.js` - Update socket.io connection URL (line 2)

### File Tree (After Implementation)
```
.
├── .env.example
├── .gitignore
├── package.json
├── bot.js
├── server.js
├── index.html
├── app.js
├── style.css
└── node_modules/ (after npm install)
```

## Data Model / API / Interface Changes

### Socket.io Events
**Client → Server**:
- `click` - Emitted when user clicks mission button

**Server → Client**:
- `update_balance` - Updates client balance
  - Payload: `{ new_balance: number }`

### Telegram Bot Interface
- `/start` command - Sends welcome message with WebApp button
- Inline keyboard with WebApp launch button

## Verification Approach

### Installation Verification
1. Run `npm install` - should install dependencies without errors
2. Verify `node_modules/` directory is created
3. Check that all dependencies are installed

### Runtime Verification
1. Create `.env` file with valid `BOT_TOKEN`
2. Run `npm start` - should launch both bot and server
3. Verify server starts on specified port (default 3000)
4. Verify bot connects to Telegram successfully
5. Access bot in Telegram and launch WebApp
6. Test click functionality and socket.io communication
7. Verify balance updates in real-time

### Manual Testing Checklist
- [ ] Bot responds to /start command
- [ ] WebApp opens from bot button
- [ ] UI loads correctly in Telegram
- [ ] Click button triggers haptic feedback
- [ ] Balance increments on click
- [ ] Socket.io connection is established
- [ ] No console errors in browser

## Dependencies Required
```json
{
  "express": "^4.18.2",
  "socket.io": "^4.6.1",
  "node-telegram-bot-api": "^0.64.0",
  "dotenv": "^16.3.1"
}
```

## Environment Variables Required
- `BOT_TOKEN` (required) - Obtain from @BotFather on Telegram
- `PORT` (optional) - Default: 3000
- `WEBAPP_URL` (required in production) - URL where the app is hosted

## Risk Considerations
1. **Bot Token Security**: Must use .env and never commit BOT_TOKEN
2. **CORS Issues**: May need CORS configuration for WebApp
3. **ngrok/Tunneling**: For local development, may need ngrok or similar for HTTPS
4. **Concurrent Processes**: npm start needs to run both bot.js and server.js (use concurrently or similar)

## Success Criteria
- `npm install` completes successfully
- `npm start` launches both services without errors
- Telegram bot is accessible and responsive
- WebApp loads and functions correctly
- Socket.io communication works bidirectionally
