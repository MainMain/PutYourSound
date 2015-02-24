// référencement autres couches
var persistance = require("../persistance/persistance_BD.js")
var vote_manager = require("./vote_manager.js");
var fs = require("fs");

// Attributs
// Liste des musiques
//this.listeMusiques;
//this.mdpValidation = "heyheyyou";

// Constructeur
var musique_manager = {
	pathToMusic : "",
	// Initialisation (chargement des données)
	Load : function()
	{	
		if(!this.pathToMusic)
			return null;
		return fs.readdirSync(this.pathToMusic);
	},

// Ajout d'une musique par un utilisateur
Ajouter : function()
{
	// Request id suivant

	// Format du nom fichier 001-Titre-Artiste-Genre (cast \s et '-' en '_')

	// ajout du fichier dans le dossier

	// ajout dans la liste de musique (attribut)
	
	// référencement dans la persistance
},

// Validation d'une musique par un modérateur
Valider : function()
{
	
	// !vérifier que le mot de passe de validation est bon (remplace le principe des sessions)

	// ajout dans la liste de musique (attribut)

	// référencement dans la persistance
},

// Suppression de la musique (! ne doit pas être en cours de lecture)
Supprimer : function()
{
	// !vérifier que le mot de passe de suppression est bon

	// suppression de la liste de musique (attribut)

	// déréférencement dans la persistance
},

Lire : function()
{
	console.log(vote_manager.GetVoteDominant());
}
};


module.exports = musique_manager;
