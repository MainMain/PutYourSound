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
Initialiser : function(pathToMusic)
{	
	// init persistance
	persistance.Initialiser(pathToMusic);

	// init array
	this.listeMusiques = new Array();

	// affectation chemin
	this.pathToMusic = pathToMusic;

	// chargement en mémoire de la liste des musiques
	this.listeMusiques = persistance.GetMusiques();

	// le bon log
	console.log("[MUSIQUE_MANAGER] : Chargement de (" + this.listeMusiques.length + ") musiques");
},

// Ajout d'une musique par un utilisateur
Ajouter : function(nom, artiste, genre, passProtection)
{
	console.log("Ajouter");
	// Request id 
	var id = this.GenerateId();

	// Format du nom fichier 001-Titre-Artiste-Genre (cast \s et '-' en '_')
	// fait dans index.js

	// ajout du fichier dans le dossier
	// fait dans index.je

	// ajout dans la liste de musique (attribut)
	var nlleMusique = new Musique(id, nom, artiste, genre, passProtection, false);

	// le bon log
	console.log("[MUSIQUE_MANAGER] : Ajout nouvelle musique : " + nlleMusique.nom + " - " + nlleMusique.artiste);

	// référencement dans la persistance
	persistance.AjouterMusique(nlleMusique);
},

// Validation d'une musique par un modérateur
Valider : function(idMusique)
{
	// note : on ne vérifie pas le mot de passe (déja vérifié pour accéder au panel)
	// validation dans la liste de musique (attribut)
	var curMusique;
	for (var id in this.listeMusiques)
	{
		curMusique = this.listeMusiques[id];
		if (curMusique.getId() === idMusique)
		{
			curMusique.doValider();
		}
	}
	console.log("[MUSIQUE_MANAGER] : Validation de la musique " +  curMusique.nom + " - " + curMusique.artiste)
	// référencement dans la persistance
	persistance.ValiderMusique(idMusique);
},

// Suppression de la musique (! ne doit pas être en cours de lecture)
Supprimer : function(idMusiqueASuppr)
{
	// !vérifier que le mot de passe de suppression est bon
	// fonctionnalité annulée

	// suppression de la liste de musique (attribut)
	for (var i = 0; i < this.listeMusiques.length; i++)
	{
		if (this.listeMusiques[i].getId() === idMusiqueASuppr)
		{
			break;
		}
	}
	this.listeMusiques.splice(i, 1);
	console.log("[MUSIQUE_MANAGER] : Suppression de la musique " + idMusiqueASuppr);

	// déréférencement dans la persistance
	persistance.SupprimerMusique(idMusiqueASuppr);
},

Lire : function()
{
	//console.log("[MUSIQUE_MANAGER] : Vote dominant : " + vote_manager.GetVoteDominant());
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
},

// Renvoi les musiques validées
GetMusiquesValidees : function()
{
	// lecture du fichier des musiques
	var listeMusiquesValidees = new Array();
	for (var i = 0; i < this.listeMusiques.length; i++)
	{
		if (this.listeMusiques[i].getValidee())
		{
			listeMusiquesValidees.push(this.listeMusiques[i]);
		}
	}

	// renvoi des musique sous forme de LISTE d'objet Musique
	return listeMusiquesValidees;
},

// Renvoi les musiques en attente de validation
GetMusiquesPending : function()
{
	// lecture du fichier des musiques
	var listeMusiquesValidees = new Array();
	for (var i = 0; i < this.listeMusiques.length; i++)
	{
		if (!this.listeMusiques[i].getValidee())
		{
			listeMusiquesValidees.push(this.listeMusiques[i]);
		}
	}

	// renvoi des musique sous forme de LISTE d'objet Musique
	return listeMusiquesValidees;
}

};

module.exports = musique_manager;
