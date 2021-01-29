'use strict';

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const config = require(`${__dirname}/config.js`);

const { Telegraf } = require('telegraf');

const bot = new Telegraf(config.telegram.token);

// Controllers
const usersController = require(`${__dirname}/app/controllers/usersController.js`);
const driversController = require(`${__dirname}/app/controllers/driversController.js`);

// ChatBot

// * Welcome
bot.hears(['hi', 'Hi', 'HI', 'hola', 'Hola', 'HOLA'], (ctx) => {
    usersController.create(ctx.message);
    let { first_name } = ctx.message.from;

    ctx.telegram.sendMessage(ctx.chat.id, `Hola ${first_name}, Deseas solicitar un taxi?`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Si', callback_data: "SI"}, {text: 'No', callback_data: "NO"}]
            ]
        }
    });
});

bot.on('location', (ctx) => {
    usersController.createLocation(ctx.message);
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
    ctx.reply('Ok, jodete')
});

// Drivers
bot.command('/registrarse', ctx => {
    driversController.create(ctx.message);
    let { first_name } = ctx.message.from
    ctx.reply(`Hola, ${first_name}, Bienvenido a nuestra plataforma, gracias por registrarte!`);

    ctx.telegram.sendMessage(ctx.chat.id, `Que tipo de vehículo manejas?`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Motocicleta', callback_data: "setVehicleMoto"}, {text: 'Automóvil', callback_data: "setVehicleAuto"}]
            ]
        }
    });
});

bot.action('setVehicleMoto', ctx => {
    ctx.reply('Moto')
});

bot.action('setVehicleAuto', ctx => {
    ctx.reply('Auto')
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
    });
});

// Start server
http.listen(3000, () => {
    console.log('listening on *:3000');
});
