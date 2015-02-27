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

var racine = path.normalize( __dirname +"/");

// lien avec les managers =================================================================

// référencement musique manager
var musique_manager = require("./managers/musique_manager.js");
// intialisation du manager (chargement en mémoire des musiques)


// référencement vote manager
var vote_manager = require("./managers/vote_manager.js");

/*
// référencement stream manager
var stream_manager = require("./managers/stream_manager.js");
*/
var persistance_manager = require("./managers/persistance_manager.js");


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

var initComplet = 0;



function TrackInit(){
  initComplet += 1;
  console.log("[TRACKINIT] " + initComplet);
  if(initComplet === 3){
    //Quand tout les managers sont pret on peut lancer la suite
    console.log("STARITNG APP");
    StartApp();
  }
}

// On lance l'initalisation des managers
function InitApp(){
  console.log("[INDEX] RACINE " + racine);
  persistance_manager.Initialiser(racine, function(){TrackInit()});
  musique_manager.Initialiser(racine, function(){TrackInit()});
  vote_manager.Initialiser(function(){TrackInit()});
  //stream_manager.Initialiser(racine, function(){TrackInit()});
};

function StartApp(){

//On lance le stream
//stream_manager.streamSong();

// routes =================================================================
// route principale (racine)
app.get('/', function(req, res) {
  console.log("Requested root");
  // envoi des données de la page
  var genresSelection = vote_manager.GetGenresSelection();
  var genres = vote_manager.GetGenres();
  res.render('master', {
    ip : ip.address(),
    port : 3000,
    genres : genres,
    genre1 : { id : genresSelection[0].id, genre : genresSelection[0].genre},
    genre2 : { id : genresSelection[1].id, genre : genresSelection[1].genre},
    genre3 : { id : genresSelection[2].id, genre : genresSelection[2].genre}
  });
});

/*
//Route du streaming 
app.get('/stream.mp3', function(req, res) {

  stream_manager.encoder.on("data", function(data) {
    res.write(data);
  });

  stream_manager.encoder.on('end', function(){
    res.end();
  });

});
*/
// lancement du serveur
// app
server.listen(process.env.PORT || 3000);

console.log("Serveur PutYourSound lancé sur " + ip.address() + ":3000");

// communication client <-> serveur =================================================================

io.sockets.on('connection', function (socket) {

  var clientIp = socket.request.connection.remoteAddress
  console.log("New connection from " + clientIp);

  var uploader = new siofu;
  uploader.dir = racine + "musique/";
  uploader.listen(socket);
  uploader.on("saved", function(event){
    console.log("%j",event.file.base)
    musique_manager.Ajouter(event.file.base, event.file.meta.song, event.file.meta.artiste, event.file.meta.genre, "lol");
  });

  //pour charger le formulaire de moderation si mdp valide
  socket.on('passMode', function(mdp){
    if(musique_manager.IsPassValidationOk(mdp)){
      file = path.normalize(racine + "views/moderationFormEcouter.mst");
      fs.readFile(file, "utf8", function(error, filedata){
        if(error) throw error;
        console.log("[INDEX] GetMusiquesAttente");
        var musics;
        musique_manager.GetMusiquesAttente(function(result){
          console.log("Test %j", result);
          socket.emit("passModeResult", {template : filedata.toString(), json : {songs : result}});
        });
      });
    }
  });
  
  socket.on("listenSong", function(id){
   file = path.normalize(racine + "views/moderationFormValider.mst");
   fs.readFile(file, "utf8", function(error, filedata){
    if(error) throw error;
    socket.emit("listenSongResult", {template : filedata.toString(), json : {songId : id}});
  });
 });

  socket.on("getSong", function(id){
    var file;
    musique_manager.GetMusiqueForId(id, function(result){
      file = path.normalize( racine + "musique/" + result.fichier);
      fs.readFile(file,"base64", function(error, filedata){
        if(error) throw error;
        socket.emit("getSongResult", filedata);
      });
    });
  });

  socket.on("moderationValider", function(data){
    if(data.state === "true"){
      musique_manager.Valider(data.id);
    }else{
      musique_manager.Supprimer(data.id);
    }
    file = path.normalize(racine + "views/moderationFormEcouter.mst");
    fs.readFile(file, "utf8", function(error, filedata){
      if(error) throw error;
      var musics;
      musique_manager.GetMusiquesAttente(function(result){
        socket.emit("passModeResult", {template : filedata.toString(), json : {songs : result}});
      });
    });
  });
});
}

InitApp();