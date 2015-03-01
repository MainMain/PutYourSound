// référencement autres couches
var Musique = require("../model/musique.js")
var persistance = require("./persistance_manager")
var vote_manager = require("./vote_manager");
var fs = require('fs-extra');
var path = require("path");

// Attributs
// Liste des musiques

// Constructeur
var musique_manager = {

	musiqueEnCours : undefined,
	pathToMusic : "",
	mdpValidation : "heyheyyou",


	// Initialisation (chargement des données)
	Initialiser : function (racine, callback)
	{
		// affectation chemin
		this.pathToMusic = path.normalize(racine + "musique/");

		callback();
	},

	// Ajout d'une musique par un utilisateur
	Ajouter : function (fileName, titre, artiste, genre )
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
		var that = this;
		persistance.GetMusiqueForId(idMusique, function(result){
			var file = that.pathToMusic + result.fichier;
			fs.removeSync(file);
			// déréférencement dans la persistance
			persistance.Supprimer(idMusique);
		});
	},

	Lire : function(callback)
	{
		var that = this;
		vote_manager.GetVoteDominant(function(infos){
			vote_manager.Initialiser(function(){
				persistance.GetRandomMusiqueForGenre(infos.genreDominant, function(result){
					that.musiqueEnCours = result;
					callback(result);
				});	
			});
		});
	},

	GetMusiqueEnCours : function()
	{
		return this.musiqueEnCours;
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