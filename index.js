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


var pathToMusic =__dirname+"/musique/pending/";

// requires ================================================================
// import du framework express
var express = require("express"),
  // import du morteur de template express                  
  mustacheExpress = require('mustache-express');  
  var http = require("http");
  var fs = require('fs');
  var child_process = require("child_process");
  var Throttle = require('throttle');
  var probe = require('node-ffprobe');
  var lame = require('lame');
  var siofu = require("socketio-file-upload");
  var ip = require("ip");
  

// lien avec les managers =================================================================
// référencement musique manager
var musique_manager = require("./managers/musique_manager.js");
// référencement vote manager
var vote_manager = require("./managers/vote_manager.js");
// File upload via socket.io

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

//Initialisation du path pour récupérer les musiques
musique_manager.pathToMusic = pathToMusic;

// Objet permettent de streamer une musique donnée
var streamer = {
  encoder : undefined ,

  decoder : undefined ,

  init : function(){
    this.encoder = lame.Encoder({channels: 2, bitDepth: 16, sampleRate: 44100});
    this.decoder = lame.Decoder();
    var that = this;
    this.decoder.on('format', function(format) {
      that.decoder.pipe(that.encoder);
    });
  },

  streamSong : function(){

    var track = pathToMusic + musique_manager.Load()[vote_manager.GetVoteDominant()];

    console.log("Choosed : "+track);
    var that = this;

    probe(track, function(err, probeData) {
      //Bitrate de la chanson
      var bit_rate = probeData.format.bit_rate;
      //On lit le mp3
      var currentStream = fs.createReadStream(track);
      //On applique un ratio a la lecutre pour une lecture continue
      bit_rate = (bit_rate/10) * 1.4;
      throttle = new Throttle(bit_rate);
      currentStream.pipe(throttle);
      //On remonte les données
      throttle.on('data', function(data){
        that.decoder.write(data);
      });
      //Fin du morceau on en demande un autre
      throttle.on('end', function(){
        that.streamSong();
      });
    });
  },
};

streamer.init();
streamer.streamSong();

// routes =================================================================
// route principale (racine)
app.get('/', function(req, res) {
  console.log("Requested root");
  // envoi des données de la page
  res.render('master', {
      ip : ip.address(),
      port : 3000
  });
});

//Route du streaming 
app.get('/stream.mp3', function(req, res) {
  
  streamer.encoder.on("data", function(data) {
    res.write(data);
  });

  streamer.encoder.on('end', function(){
    res.end();
  });

});
// lancement du serveur
// app
server.listen(process.env.PORT || 3000);

console.log("Serveur PutYourSound lancé sur " + ip.address() + ":3000");

// communication client <-> serveur =================================================================

io.on('connection', function (socket) {

  var uploader = new siofu;
  uploader.dir = pathToMusic;
  uploader.listen(socket);
  uploader.on("start", function(event){
    console.log("Artiste " + event.file.meta.artiste);
    console.log("Song " + event.file.meta.song);
    console.log("Genre " + event.file.meta.genre);
  });
});