/**
 * Created by Etudiant on 03/07/2017.
 */
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var ent = require('ent');
var fs = require('fs');
var encode = require('ent/encode');

server.listen(80);

app.get('/', function(req, res) {
    res.render('index.twig');
});

app.get('/cours', function(req, res) {
    res.render('cours.twig');
})

app.get('*style.css', function(req, res) {
    fs.readFile(__dirname + '/styles/style.css', function(err, data)
    {
        if (err) console.log(err);
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(data);
        res.end();
    });
});

/*
app.get('*texte.jpg', function(req, res) {
    fs.readFile(__dirname + '/img/texte.jpg', function(err, data)
    {
        if (err) console.log(err);
        res.write(data);
        res.end();
    });
});

app.get('*alcapone.jpg', function(req, res) {
    fs.readFile(__dirname + '/img/alcapone.jpg', function(err, data)
    {
        if (err) console.log(err);
        res.write(data);
        res.end();
    });
});
*/

io.on('connection', function (socket) {

    socket.on('new_user', function(pseudo) {
        var pseudo = ent.encode = pseudo;
        socket.pseudo = pseudo;
        if(socket.pseudo == null)
        {
            socket.emit('err', 'Aucun pseudo !');
        }
        else
        {
            socket.broadcast.emit('nouveau_client', pseudo);
        }
    });

    socket.on('message', function (message) {
        message = encode(message);
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
    });

    socket.on('status', function (data) {
        if(data.status == 'typing')
        {
            socket.broadcast.emit('status_m', {pseudo: data.pseudo, status: 'typing'});
        }
        else
        {
            socket.broadcast.emit('status_m', {pseudo: data.pseudo, status: 'none'});
        }
    })
});