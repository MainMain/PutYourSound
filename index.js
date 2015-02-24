// données de test ================================================================
var demo = { 
  "projet": "PutYourSound",
  "team": [{
    "member": "Johan"
  }, {
    "member": "Joris"
  }, {
    "member": "Julien"
  }, {
    "member": "Roy"
  }]
};


var pathToMusic =__dirname + "/musique/pending/";

// requires ================================================================
// import du framework express
var express = require("express"),
  // import du morteur de template express                  
  mustacheExpress = require('mustache-express');  
  var http = require("http");
  var fs = require('fs');
  var child_process = require("child_process");
  var throttle = require('throttle');
  var probe = require('node-ffprobe');
  var lame = require('lame');

// lien avec les managers =================================================================
// référencement musique manager
var musique_manager = require("./managers/musique_manager.js");
// référencement vote manager
var vote_manager = require("./managers/vote_manager.js");
// File upload via socket.io
var siofu = require("socketio-file-upload");

// configuration express et socket.io ===============================================================
// lancement d'express
var app = express();
// configuration socket.io
var server = http.createServer(app);

var io = require('socket.io').listen(server);
// extension des fichiers mustache
app.engine('mst', mustacheExpress());          
// extension des vues partielles
app.set('view engine', 'mst');
// dossier des vues                
app.set('views', __dirname + '/views');
// dossier public
app.use(express.static(__dirname + '/public'));
// upload de fichier via socket.io
app.use(siofu.router);




// routes =================================================================
// route principale (racine)
app.get('/', function(req, res) {
  console.log("/");
    // envoi des données de la page
    res.render('master', {
      head: {
        title: 'page title'
      },
      content: {
        title: 'post title',
        description: 'description',
        data : demo
      }
    });
  });

// lancement du serveur
// app
server.listen(process.env.PORT || 3000);

console.log("Serveur PutYourSound lancé sur 127.0.0.1:3000")


// communication client <-> serveur =================================================================

io.on('connection', function (socket) {

  var uploader = new siofu;
  uploader.dir = __dirname+"/musique/pending";
  uploader.listen(socket);
  uploader.on("start", function(event){
    console.log("Artiste " + event.file.meta.artiste);
    console.log("Song " + event.file.meta.song);
    console.log("Genre " + event.file.meta.genre);
  });

});

function getSongs(){
  return fs.readdirSync(__dirname + "/musique/pending");
};

function getRandomSong(Songs){
  var index;
  if(Songs.length === 0)
    return null;
  index = parseInt(Math.random()*Songs.length);
  return {song: Songs[index], id: index};
};

var encoder = lame.Encoder({channels: 2, bitDepth: 16, sampleRate: 44100});
encoder.on("data", function(data) {
  sendData(data);
});
var decoder = lame.Decoder();
decoder.on('format', function(format) {
  decoder.pipe(encoder);
});

function streamSong(){
  var song=getRandomSong(getSongs()).song;
  probe(track, function(err, probeData) {
    var bit_rate = probeData.format.bit_rate;
    var currentStream = fs.createReadStream('track.mp3');
  var unthrottle = throttle(currentStream, (bit_rate/10) * 1.4); // this multiplier may vary depending on your machine
  currentStream.on('data', function(data){
    decoder.write(data); // consider the decoder instance from the previous example
  });
});
};

function sendData(data){
  io.emit("Stream", data);
};



