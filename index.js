// API express
var express = require('express')
var app = express();
// API FileSystem
var fs = require('fs'); 
// IMPORT mustach Engine
var mustache = require('mustache'); 

// Données de test
var demo = [{ 
            "projet": "PutYourSound",
            "team": [{
                "member": "Johan"
            }, {
                "member": "Joris"
            }, {
                "member": "Julien"
            }, {
                "member": "Roy"
            }]}];

// Route principale
app.get('/:slug', function(req, res){ // get the url and slug info
var slug =[req.params.slug][0]; // grab the page slug

// Données à renvoyer (a modifier pour les websockets ?)
var rData = {data:demo}; // wrap the data in a global object... (mustache starts from an object then parses)

// Création de la page
var page = fs.readFileSync(slug, "utf8"); // bring in the HTML file

// Conversion des données avec mustache
var html = mustache.to_html(page, rData); // replace all of the data

// Envoi de la page convertie au client
res.send(html); // send to client
});

// Lancement du serveur
app.listen(3000);// start the server listening
console.log('Server running at http://127.0.0.1:3000/'); // server start up message
