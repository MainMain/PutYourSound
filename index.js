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



// requires ================================================================
// import du framework express
var express = require("express");
// import du morteur de template express                  
var mustacheExpress = require('mustache-express');  
var http = require("http");
var fs = require('fs');
var siofu = require("socketio-file-upload");
var ip = require("ip");
var path = require("path");

var pathToMusic = path.normalize(__dirname+"/musique/");
<<<<<<< HEAD
var pathToMusicFile = path.normalize(__dirname+"/persistance/listeMusiques.txt");
=======
>>>>>>> 9081565fdbd009f1d64babd0c6ce9a74a6bd03c0

// lien avec les managers =================================================================
// référencement musique manager
var musique_manager = require("./managers/musique_manager.js");
// intialisation du manager (chargement en mémoire des musiques)
musique_manager.Initialiser(pathToMusic);

//////////////////////////////////////////////////////////////////////////////////////////////////////
musique_manager.Valider("idAAAA");


//////////////////////////////////////////////////////////////////////////////////////////////////////
// référencement vote manager
var vote_manager = require("./managers/vote_manager.js");
vote_manager.Initialiser();
// référencement stream manager
var stream_manager = require("./managers/stream_manager.js");
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

stream_manager.pathToMusic = pathToMusic;
stream_manager.init();
stream_manager.streamSong();

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

  stream_manager.encoder.on("data", function(data) {
    res.write(data);
  });

  stream_manager.encoder.on('end', function(){
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
    console.log("Nom de la musique uploadée " + event.file.name);
    console.log(event);
    console.log("nom " + event.file.name);
    console.log("Song " + event.file.meta.song);
    console.log("Genre " + event.file.meta.genre);
  });

  //pour charger le formulaire de moderation si mdp valide
  socket.on('passMode', function(mdp){
    if(musique_manager.IsPassValidationOk(mdp)){
      file = path.normalize(__dirname + "/views/moderationFormEcouter.mst");
      fs.readFile(file, "utf8", function(error, filedata){
        if(error) throw error;
        var songsTmp = [];
        var i=0;
        musicName = musique_manager.Load();
        for(var songId in musicName){
          songsTmp[i] = {name : musicName[songId], id : musicName[songId]};
          i++;
        }
        socket.emit("passModeResult", {template : filedata.toString(), json : {songs : songsTmp}});
      });
    }
  });
  
  socket.on("listenSong", function(id){
   file = path.normalize(__dirname + "/views/moderationFormValider.mst");
   fs.readFile(file, "utf8", function(error, filedata){
    if(error) throw error;
    socket.emit("listenSongResult", {template : filedata.toString(), json : {songId : id}});
  });
 });

  socket.on("getSong", function(id){
    console.log(id);
    file = path.normalize(__dirname + "/musique/pending/" + id);
    fs.readFile(file,"base64", function(error, filedata){
      if(error) throw error;
      socket.emit("getSongResult", filedata);
    });
  });

  socket.on("moderationValider", function(data){
    file = path.normalize(__dirname + "/views/moderationFormEcouter.mst");
    fs.readFile(file, "utf8", function(error, filedata){
      if(error) throw error;
      var songsTmp = [];
      var i=0; 
      musicName = musique_manager.Load();
      for(var songId in musicName){
        songsTmp[i] = {name : musicName[songId], id : musicName[songId]};
        i++;
      }
      socket.emit("passModeResult", {template : filedata.toString(), json : {songs : songsTmp}});
    });
    console.log(data.id + data.state);
  });
});
