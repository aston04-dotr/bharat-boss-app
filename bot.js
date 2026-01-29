require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL || 'http://localhost:3000';

if (!BOT_TOKEN) {
    console.error('Error: BOT_TOKEN is not defined in .env file');
    process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || 'User';
    
    const welcomeMessage = `Welcome to Syndicate Terminal, ${firstName}! 🎮\n\n` +
        `This is your gateway to the digital underground. ` +
        `Click the button below to launch the WebApp and start your mission.`;
    
    const keyboard = {
        inline_keyboard: [
            [
                {
                    text: '🚀 Launch Terminal',
                    web_app: { url: WEBAPP_URL }
                }
            ]
        ]
    };
    
    bot.sendMessage(chatId, welcomeMessage, {
        reply_markup: keyboard
    });
});

bot.on('polling_error', (error) => {
    console.error('Polling error:', error.code, error.message);
});

console.log('Telegram bot started successfully');
console.log(`WebApp URL: ${WEBAPP_URL}`);
