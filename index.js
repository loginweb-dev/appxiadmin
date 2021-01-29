'use strict';

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const conexion = require(`${__dirname}/database/connection.js`);

const { Telegraf } = require('telegraf');

const bot = new Telegraf('1451212413:AAE-6y0BXIuMqOS90ER0X8FYZRHobBMSP5o');

function sendMessage(message){
    io.emit('chat message', message);
}

// Controllers
const usersController = require(`${__dirname}/app/controllers/usersController.js`);

// ChatBot
var chat = null

// * Welcome
bot.hears(['hi', 'Hi', 'HI', 'hola', 'Hola', 'HOLA'], (ctx) => {
    sendMessage(`${ctx.message.chat.first_name} ${ctx.message.chat.last_name}: ${ctx.message.text}`);
    chat = ctx;
    usersController.create(ctx.message)
    let { first_name } = ctx.message.from

    ctx.telegram.sendMessage(ctx.chat.id, `Hola ${first_name}, Deseas solicitar un taxi?`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Si', callback_data: "SI"}, {text: 'No', callback_data: "NO"}]
            ]
        }
    });
});

bot.on('location', (ctx) => {
    usersController.createLocation(ctx.message)
    console.log(ctx.message.location)
    
    ctx.telegram.sendMessage(ctx.chat.id, `Que tipo de trasnporte deseas`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Motocicleta', callback_data: "moto"}, {text: 'Automovíl', callback_data: "auto"}]
            ]
        }
    });
});

// Actions
bot.action('SI', ctx => {
    ctx.reply(`Envíanos tu ubicación`);
})

bot.action('NO', ctx => {
    ctx.reply('Ok. jodete')
});

bot.launch()



// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/chat.html');
});

// SocketIO
io.on('connection', (socket) => {
    console.log('a user connected');
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
        chat.reply(msg)
    });
});

// Start server
http.listen(3000, () => {
    console.log('listening on *:3000');
});
