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
var events = require("events");

var racine = path.normalize( __dirname +"/");

// lien avec les managers =================================================================

// référencement musique manager
var musique_manager = require("./managers/musique_manager");

// référencement vote manager
var vote_manager = require("./managers/vote_manager");

// référencement stream manager
var stream_manager = require("./managers/stream_manager");

var persistance_manager = require("./managers/persistance_manager");

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

//Tracker pour changement de musique
var tracker = new events.EventEmitter();

function TrackInit(){
  initComplet += 1;
  console.log("[TRACKINIT] " + initComplet);
  if(initComplet === 4){
    //Quand tout les managers sont pret on peut lancer la suite
    console.log("STARITNG APP");
    StartApp();
  }
}

// On lance l'initalisation des managers
function InitApp(){
  console.log("[INDEX] RACINE " + racine);
  persistance_manager.Initialiser(racine, function(){
    TrackInit();
    vote_manager.Initialiser(function(){
      TrackInit();
      musique_manager.Initialiser(racine, function(){
        TrackInit();
        stream_manager.Initialiser(racine, tracker, function(){TrackInit()});
      });
    });
  });
};

tracker.on("newSong", function(){
  var musique = musique_manager.GetMusiqueEnCours();
  console.log("MUSIQUE en COURS %j", musique);
  io.emit("chansonEnCours", {titre : musique.titre, artiste : musique.artiste, genre : musique.genre});

      //RAZ des progress bar
      vote_manager.GetVoteDominant(function(infos){
        var file = path.normalize(racine + "views/voteProgress.mst");
        fs.readFile(file, "utf8", function(error, filedata){
          if(error) throw error;
          io.emit("voteProgress", {template : filedata.toString(), json : {pourcent1 : infos.pourcent1, pourcent2 : infos.pourcent2, pourcent3 : infos.pourcent3}});
        });
      });

      //Reafichage des choix de genre
      var file = path.normalize(racine + "views/voteForm.mst");
      var genresEnCours = vote_manager.GetGenresSelection();
      fs.readFile(file, "utf8", function(error, filedata){
        if(error) throw error;
        io.emit("updateButtonsGenre", {template : filedata.toString(), json : genresEnCours});
      });
});

function StartApp(){

stream_manager.StreamSong();
// routes =================================================================
// route principale (racine)
app.get('/', function(req, res) {
  console.log("Requested root");
  // envoi des données de la page
  var genresSelection = vote_manager.GetGenresSelection();
  var genres = vote_manager.GetGenres();
  var musiqueEnCours = musique_manager.GetMusiqueEnCours();
  vote_manager.GetVoteDominant(function(infos){

    res.render('master', {
      ip : ip.address(),
      port : 3000,
      genres : genres,
      genre1 : { id : genresSelection[0].id, genre : genresSelection[0].genre},
      genre2 : { id : genresSelection[1].id, genre : genresSelection[1].genre},
      genre3 : { id : genresSelection[2].id, genre : genresSelection[2].genre},
      pourcent1 : infos.pourcent1, 
      pourcent2 : infos.pourcent2, 
      pourcent3 : infos.pourcent3,
      musique : musiqueEnCours
    });
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

io.sockets.on('connection', function (socket) {

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
    var file = path.normalize(racine + "views/moderationFormEcouter.mst");
    fs.readFile(file, "utf8", function(error, filedata){
      if(error) throw error;
      var musics;
      musique_manager.GetMusiquesAttente(function(result){
        socket.emit("passModeResult", {template : filedata.toString(), json : {songs : result}});
      });
    });
  });

  socket.on("voteGenre", function(data){
    var clientIp = socket.request.connection.remoteAddress
    vote_manager.AjouterVote(data, clientIp, function (result){
      console.log("VOTE enregistré pour " + result.genre + " id "+result.id );
      //Emit 1 retour vous avez votez pour
      var file = path.normalize(racine + "views/voteVoted.mst");
      fs.readFile(file, "utf8", function(error, filedata){
        if(error) throw error;
        socket.emit("voteVoted", {template : filedata.toString(), json : {genreChoisi : result.genre}});
      });
      //Emit 2 Broadcast progress
      vote_manager.GetVoteDominant(function(infos){
        var file2 = path.normalize(racine + "views/voteProgress.mst");
        fs.readFile(file, "utf8", function(error, filedata){
          if(error) throw error;
          io.emit("voteProgress", {template : filedata.toString(), json : {pourcent1 : infos.pourcent1, pourcent2 : infos.pourcent2, pourcent3 : infos.pourcent3}});
        });
      });     
    });
  });
});
}

InitApp();