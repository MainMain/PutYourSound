// référencement autres couches
var Musique = require("../model/musique.js")
var persistance = require("../persistance/persistance_file.js")
var vote_manager = require("./vote_manager.js");
var fs = require("fs");

// Attributs
// Liste des musiques

// Constructeur
var musique_manager = {
	listeMusiques : undefined,
	pathToMusic : "",
	mdpValidation : "heyheyyou",


// Initialisation (chargement des données)
Load : function()
{	
	// chaergemente n mémoire de la liste des musiques
	this.listeMusiques = persistance.GetMusiques();

	if(!this.pathToMusic)
		return null;
	this.listeMusiques = fs.readdirSync(this.pathToMusic);
	this.listeMusiques.splice(this.listeMusiques.indexOf(".keep"),1);
	return this.listeMusiques;
},

// Ajout d'une musique par un utilisateur
Ajouter : function(nom, artiste, genre, passProtection)
{
	// Request id 
	var id = this.GenerateId();

	// Format du nom fichier 001-Titre-Artiste-Genre (cast \s et '-' en '_')
	// fait dans index.js

	// ajout du fichier dans le dossier
	// fait dans index.je

	// ajout dans la liste de musique (attribut)
	var nlleMusique = new Musique(id, nom, artiste, genre, passProtection, false);

	// référencement dans la persistance
	persistance.AjouterMusique(nlleMusique);
},

// Validation d'une musique par un modérateur
Valider : function(idMusique)
{
	// note : on ne vérifie pas le mot de passe (déja vérifié pour accéder au panel)
	// validation dans la liste de musique (attribut)
	for (curMusique in this.listeMusiques)
	{
		if (curMusique.GetId() === idMusique)
		{
			curMusique.doValider();
			console.log(curMusique.isValidee());
			
		}
	}

	// référencement dans la persistance
	persistance.ValiderMusique(idMusique);
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
},

IsPassValidationOk : function(passEntree)
{
	return (this.mdpValidation === passEntree);
},

// Pour le test de la chaine de traitement
Test : function()
{
	//console.log("[musique_Manager] : OK");
	//persistance.Test();

	// Julien : ici un test avec un objet Musique (! majuscule (pas obligatoire))
	//var musiqueTest = new Musique(1, "nom", "artiste", "genre", "passProtection", "validee");
	//console.log(musiqueTest.getNom());
	//musiqueTest.nom = "bref";
	//console.log(musiqueTest.getNom());
},

GenerateId : function()
{
    var id = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var longueurId = 6;

    for( var i=0; i < longueurId; i++ )
        id += possible.charAt(Math.floor(Math.random() * possible.length));

    return id;
}
};

module.exports = musique_manager;
