// référencement autres couches
var Musique = require("../model/musique.js")
var persistance = require("./persistance_manager.js")
var vote_manager = require("./vote_manager.js");
var fs = require('fs-extra');
var path = require("path");
 

// Attributs
// Liste des musiques

// Constructeur
var musique_manager = {
	listeMusiques : undefined,
	pathToMusic : "",
	mdpValidation : "heyheyyou",


// Initialisation (chargement des données)
Initialiser : function(racine, callback)
{	
	// init array
	this.listeMusiques = new Array();

	// affectation chemin
	this.pathToMusic = path.normalize(racine + "musique/");

	// chargement en mémoire de la liste des musiques
	//this.listeMusiques = persistance.GetMusiques();

	// le bon log
	console.log("[MUSIQUE_MANAGER] : Chargement de (" + this.listeMusiques.length + ") musiques");
	callback();
},

// Ajout d'une musique par un utilisateur
Ajouter : function(fileName, titre, artiste, genre )
{

	console.log("[MUSIQUE_MANAGER] : Ajout nouvelle musique : " + titre + " - " + artiste);

	// référencement dans la persistance
	persistance.Ajouter(titre, artiste, genre, fileName + ".mp3");
},

// Validation d'une musique par un modérateur
Valider : function(idMusique)
{
	// référencement dans la persistance
	persistance.Valider(idMusique);
},

// Suppression de la musique (! ne doit pas être en cours de lecture)
Supprimer : function(idMusique)
{
	console.log("[MUSIQUE_MANAGER] : Suppression de la musique " + idMusique);
	var that = this;
	persistance.GetMusiqueForId(idMusique, function(result){
		var file = that.pathToMusic + result.fichier;
		console.log("[MUSIQUE] Suppression " + file);
		fs.removeSync(file);
		// déréférencement dans la persistance
		persistance.Supprimer(idMusique);
	});
},

Lire : function(callback)
{
	genreDominant = vote_manager.GetVoteDominant();
	persistance_manager.GetRandomMusiqueForGenre(genreDominant, function(result){
		callback(result.fichier);
	});
},

GetMusiqueAleatoire : function()
{
	var nbrMusique = this.listeMusiques.length;
	var nbrAleatoire = Math.floor(Math.random() *  this.listeMusiques.length);
	// retourne un objet musique aléatoire
	return this.listeMusiques[nbrAleatoire];
},

IsPassValidationOk : function(passEntree)
{
	return (this.mdpValidation === passEntree);
},

// Renvoi les musiques validées
GetMusiquesValidees : function(callback)
{
	persistance.GetMusiquesValidees(function(result){callback(result)});
},

// Renvoi les musiques en attente de validation
GetMusiquesAttente : function(callback)
{
	persistance.GetMusiquesAttente(function(result){callback(result)});
},

GetMusiqueForId : function(musiqueId, callback){
	persistance.GetMusiqueForId(musiqueId, function(result){callback(result)});
}

};

module.exports = musique_manager;