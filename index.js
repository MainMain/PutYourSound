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



// configuration express ===============================================================
// lancement d'express
var app = express();
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
app.listen(process.env.PORT || 3000);
console.log("Serveur PutYourSound lancé sur 127.0.0.1:3000")


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