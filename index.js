'use strict';

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const config = require(`${__dirname}/config.js`);

const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(config.telegram.token);

// Controllers
const usersController = require(`${__dirname}/app/controllers/usersController.js`);
const driversController = require(`${__dirname}/app/controllers/driversController.js`);
const servicesController = require(`${__dirname}/app/controllers/servicesController.js`);

// ChatBot

const keyboard = Markup.inlineKeyboard([
    Markup.button.url('❤️', 'http://telegraf.js.org'),
    Markup.button.callback('Delete', 'delete')
])


// * Welcome
bot.start((ctx) => {
    // ctx.replyWithContact('+59175199157', 'Agustin Mejia');
    welcome(ctx);
});

bot.hears(['hi', 'Hi', 'HI', 'hola', 'Hola', 'HOLA'], (ctx) => {
    welcome(ctx);
});

async function createUser(ctx){
    let { from } = ctx.message;
    let user = await usersController.find(from.id).then(results => results);
    if(user.length == 0){
        let create = await usersController.create(from).then(results => results);
        return create[0];
    }else{
        return user[0];
    }
}

async function createDriver(ctx){
    let { from } = ctx.message;
    let driver = await driversController.find(from.id).then(results => results);
    if(driver.length == 0){
        return await driversController.create(from).then(results => results);
    }else{
        return driver[0];
    }
}

async function welcome(ctx){
    let user = await createUser(ctx);
    let { first_name } = ctx.message;
    ctx.telegram.sendMessage(ctx.chat.id, `\u{1f44b} Hola ${first_name}, Deseas solicitar un taxi?`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Si \u{2705}', callback_data: "newService"}, {text: 'No \u{274c}', callback_data: "NO"}]
            ]
        }
    });
}

// Actions
bot.action('newService', ctx => {
    ctx.reply(`Envíanos tu ubicación \u{1f4cd}`);
});
bot.action('NO', ctx => {
    ctx.reply('Gracias por ingresar a nuestro chat asistente, hasta luego!')
});


bot.on('location', async ctx => {
    var { id } = ctx.update.message.from;
    var service = await servicesController.findLast(id);
    if(service.length){
        if(service[0].status == 1){
            var { latitude, longitude } = ctx.message.location;
            ctx.telegram.sendLocation(service[0].code, latitude, longitude).then();
        }else if(service[0].status == 0){
            ctx.reply(`\u{1f625} Tu pasajeron canceló el servicio de taxi.`);
        }else{
            ctx.reply(`\u{2139} Debes tener un pasajero en espera para enviarle tu ubicación.`);
        }
        
    }else{
        let user = await createUser(ctx);
        usersController.createLocation(user.id, ctx.message);
        ctx.telegram.sendMessage(ctx.chat.id, `Que tipo de transporte deseas?`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Motocicleta \u{1f3cd}', callback_data: "selectMoto"}, {text: 'Automóvil \u{1f698}', callback_data: "selectAuto"}]
                ]
            }
        });
    }
});


// Cliente solicitando vehículo
bot.action('selectMoto', ctx => {
    selectVehicle(ctx);
    ctx.reply(`Tu solicitud ha sido enviada.`);
});

bot.action('selectAuto', ctx => {
    selectVehicle(ctx);
    ctx.reply(`Tu solicitud ha sido enviada.`);
});

function selectVehicle(ctx){
    driversController.getDriverTypeVehicle(ctx).then(async function(res) {
        var location = await usersController.lastLocationByUserCode(res.id).then(results => results);
        res.results.map(driver => {
            if(driver.status == 1){
                ctx.telegram.sendMessage(driver.code, `Hola ${driver.name}, un cliente solicitó una carrera!`, {
                    reply_markup: {
                        inline_keyboard: [
                            [{text: `Ver solicitud ID:${location[0].id}`, callback_data: "ver_solicitud"}]
                        ]
                    }
                });
            }
        });
    });
}

// Actions
bot.action('ver_solicitud', async ctx => {
    // Obtener ID
    let { text } = ctx.update.callback_query.message.reply_markup.inline_keyboard[0][0];
    let id = text.replace('Ver solicitud ID:', '');
    var location = await usersController.findLocation(id).then(results => results);
    if(location.length > 0){
        ctx.telegram.sendLocation(ctx.chat.id, location[0].latitude, location[0].longitude);
        setTimeout(() => {
            ctx.telegram.sendMessage(ctx.chat.id, `Deseas aceptar el servicio?`, {
                reply_markup: {
                    inline_keyboard: [
                        [{text: `Aceptar ID:${id}`, callback_data: "aceptar_solicitud"}, {text: 'Descartar', callback_data: "descartar_solicitud"}]
                    ]
                }
            });
        }, 500);
    }
});
bot.action('aceptar_solicitud', async ctx => {
    // Obtener ID
    let { text } = ctx.update.callback_query.message.reply_markup.inline_keyboard[0][0];
    let location_id = text.replace('Aceptar ID:', '');
    
    let { id } = ctx.update.callback_query.message.chat;
    // Obtener conductor
    let driver = await driversController.find(id);
    // Guardar servicio
    let service = await servicesController.create(location_id, driver[0].id);
    // Obtener información de la ubicación
    let location = await usersController.findLocation(location_id);
    if(location.length){
        ctx.telegram.sendMessage(location[0].code, `\u{1f44d} Solicitud de taxi aceptada!!!`);
        // Actualizar estado del conducto a ocupado "2"
        await driversController.updateColumn('status', 2, id);
    }

    ctx.telegram.sendMessage(ctx.chat.id, `Notificación enviada!!! Cuanto tiempo estimas que tardes en llegar?`, {
        reply_markup: {
            inline_keyboard: [
                [
                    {text: '5:00 min', callback_data: "cinco_min"},
                    {text: '10:00 min', callback_data: "diez_min"},
                    {text: '15:00 min', callback_data: "quince_min"}
                ]
            ]
        }
    });
});
bot.action('descartar_solicitud', ctx => {
    ctx.reply('Se descartó la solicitud.');
});

bot.action('cinco_min', async ctx => {
    sendTimeArrival(ctx, 5);
});
bot.action('diez_min', ctx => {
    sendTimeArrival(ctx, 10);
});
bot.action('quince_min', ctx => {
    sendTimeArrival(ctx, 15);
});

async function sendTimeArrival(ctx, time){
    ctx.reply('Tiempo estimado enviado');
    let { id } = ctx.update.callback_query.from;
    let service = await servicesController.findLast(id);
    if(service.length){
        ctx.telegram.sendMessage(service[0].code, `Tu taxi llegará en aproximadamente ${time} minutos. \u{23f1}`);
    }
}

bot.command('/disponible', async ctx => {
    let { id } = ctx.message.from
    await driversController.updateColumn('status', 1, id);
    var service = await servicesController.findLast(id);
    if(service.length){
        // Actualizar estado del servicio a realizado "2"
        await servicesController.updateColumn('status', 2, service[0].id);

        // Pedir calificación al cliente
        ctx.telegram.sendMessage(service[0].code, `Que te pareció el servicio?`, {
            reply_markup: {
                inline_keyboard: [
                    [
                        {text: '\u{1f61f}', callback_data: "bad_service"},
                        {text: '\u{1f610}', callback_data: "normal_service"},
                        {text: '\u{1f60d}', callback_data: "good_service"}
                    ]
                ]
            }
        });
    }
    ctx.reply(`Estado disponible activado! \u{1f44d}`);
});

bot.action('bad_service', async ctx => {
    ctx.reply(`Gracias por tu puntuación, intentaremos mejorar!`);
});
bot.action('normal_service', ctx => {
    ctx.reply(`Gracias por tu puntuación, estamos trabajando para mejorar el servicio!`);
});
bot.action('good_service', ctx => {
    ctx.reply(`Gracias por tu puntuación, es un gusto ofrecerte nuestros servicios!`);
});

// Drivers
bot.command('/registrarse', async ctx => {
    await createDriver(ctx);
    let { first_name } = ctx.message.from
    ctx.reply(`Hola, ${first_name}, Bienvenido a nuestra plataforma, gracias por registrarte!`);

    ctx.telegram.sendMessage(ctx.chat.id, `Que tipo de vehículo manejas?`, {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Motocicleta \u{1f3cd}', callback_data: "setVehicleMoto"}, {text: 'Automóvil \u{1f698}', callback_data: "setVehicleAuto"}]
            ]
        }
    });
});

bot.action('setVehicleMoto', ctx => {
    driversController.setVehicleType(ctx);
    ctx.reply('Bien hecho, registro terminado con exito!!!')
});

bot.action('setVehicleAuto', ctx => {
    driversController.setVehicleType(ctx);
    ctx.reply('Bien hecho, registro terminado con exito!!!')
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
