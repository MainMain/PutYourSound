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
var express = require("express"),
  // import du morteur de template express                  
  mustacheExpress = require('mustache-express');  
  var http = require("http");
  var fs = require('fs');
  var siofu = require("socketio-file-upload");
  var ip = require("ip");
  var path = require("path");

var pathToMusic = path.normalize(__dirname+"/musique/");
var pathToMusicFile = path.normalize(__dirname+"/persistance/listeMusiques.txt");

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
//var stream_manager = require("./managers/stream_manager.js");
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

//stream_manager.pathToMusic = pathToMusic;
//stream_manager.init();
//stream_manager.streamSong();

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

// JORIS : méthoder à appeller pour tester pass modération 
// -> musique_manager.IsPassValidationOk(passEntree)
// il renvoi un booléen : true si pass ok


io.on('connection', function (socket) {

  var uploader = new siofu;
  uploader.dir = pathToMusic;
  uploader.listen(socket);
  uploader.on("start", function(event){
    console.log("Artiste " + event.file.meta.artiste);
    console.log("Song " + event.file.meta.song);
    console.log("Genre " + event.file.meta.genre);
  });

//pour charger le formulaire de moderation si mdp valide
  socket.on('passMode', function(data){
      console.log(musique_manager.IsPassValidationOk(data));
    if(musique_manager.IsPassValidationOk(data)){
      console.log(data);
        file = path.normalize(__dirname + "/views/moderationForm.mst");
        fs.readFile(file, "utf8", function(error, filedata){
        if(error) throw error;
         socket.emit("passModeOk", filedata.toString());
      });
    }
  });
});
