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
//var server = require('http').Server(app);
//var io = require('socket.io')(server);

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
})
;
// lancement du serveur
// app
server.listen(process.env.PORT || 3000);
console.log("Serveur PutYourSound lancé sur 127.0.0.1:3000")


io.on('connection', function (socket) {
    // test reception
    socket.on('test_client_to_server', function(data)
    {
        console.log("Reception du client : " + data);
         // test envoi
        socket.emit('test_server_to_client', "coucou toua")
    })
    // test envoi

});
// Routes =================================================================
/*exports.routes = function(app) {
      app.get('/',  exports.findAll);
      console.log("export route");
}

 
exports.findAll = function(req, res) {
    console.log("findAll");
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
}*/