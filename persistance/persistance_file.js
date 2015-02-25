var Musique = require("../model/musique.js")

// Constructeur
function persistance_file(){}

// Attributs
this.pathToFile = "";

// Renvoi les musiques validées
persistance_file.GetMusiquesValidees = function()
{
	// lecture du fichier des musiques

	// renvoi des musique sous forme de LISTE d'objet Musique
},

// Renvoi les musiques en attente de validation
persistance_file.GetMusiquesPending = function()
{
	// lecture du fichier des musiques

	// renvoi des musique sous forme de LISTE d'objet Musique
},

// Renvoi toutes les musiques
persistance_file.GetMusiques = function()
{	
	// liste musique simulée

	// création d'une liste de musique pour test
	var listeMusiques = new Array();
	var music1 = new Musique("a1", "nom1", "artiste1", "genre1", false);
	var music2 = new Musique("a2", "nom2", "artiste2", "genre2", false);
	var music3 = new Musique("a3", "nom3", "artiste3", "genre3", false);
	listeMusiques.push(music1);
	listeMusiques.push(music2);
	listeMusiques.push(music3);

	// lecture du fichier des musiques

	// le bon log
	console.log("[PERSISTANCE] : Chargement de (" + listeMusiques.length + ") musiques");

	// renvoi des musique sous forme de LISTE d'objet Musique
	return listeMusiques;
},

// Renvoi tout les genres différents
persistance_file.GetGenres = function()
{
	// lecture du fichier des genres

	// renvoi des musique sous forme de LISTE de sting
},

// Enregistrement la musiques qui vient d'être validée
persistance_file.AjouterMusique = function(nlleMusique)
{
	// nlleMusique -> objet musique avec les infos sur la nouvelle musique

	// ajout d'une ligne dans le fichier des musiques

	// renvoi 1 si enregistrement OK
},

// Validation de la musique
persistance_file.ValiderMusique = function(idMusique)
{
	// recherche de la ligne dans le fichier

	// suppression de cette ligne

	// apeller la fonction AjouterMusique()

	// renvoi 1 si enregistrement OK
},

// Validation de la musique
persistance_file.SupprimerMusique = function(nlleMusique)
{
	// recherche de la ligne dans le fichier

	// suppression de cette ligne

	// renvoi 1 si enregistrement OK
},

// Pour le test de la chaine de traitement
persistance_file.Test = function()
{
	console.log("[persistance_file] : OK");

}

module.exports = persistance_file;
