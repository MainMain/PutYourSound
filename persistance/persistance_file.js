var Musique = require("../model/musique.js")

// Constructeur
function persistance_file(){}

// Attributs
var persistance_file = {
	pathToMusic : undefined,

// Renvoi les musiques validées
GetMusiquesValidees : function()
{
	// lecture du fichier des musiques

	// renvoi des musique sous forme de LISTE d'objet Musique
},

// Renvoi les musiques en attente de validation
GetMusiquesPending : function()
{
	// lecture du fichier des musiques

	// renvoi des musique sous forme de LISTE d'objet Musique
},

// Renvoi toutes les musiques
GetMusiques : function(pathToMusic)
{	
	// affectation chemin
	this.pathToMusic = pathToMusic;

	// lecture du fichier des musiques
	// **création d'une liste de musique pour test**
	var listeMusiques = new Array();
	var music1 = new Musique("idAAAA", "a_part_of_you", "mainmain", "trance", false);
	

	//ajout à la liste qu'on va renvoyer
	listeMusiques.push(music1);


	// vérifier que la musique lue dans le fichier existe bien ! 
	/*
	if(!this.pathToMusic)
		return null;
	this.listeMusiques = fs.readdirSync(this.pathToMusic);
	this.listeMusiques.splice(this.listeMusiques.indexOf(".keep"),1);
	return this.listeMusiques;*/

	// le bon log
	console.log("[PERSISTANCE] : Chargement de (" + listeMusiques.length + ") musiques");

	// renvoi des musique sous forme de LISTE d'objet Musique
	return listeMusiques;
},

// Renvoi tout les genres différents
GetGenres : function()
{
	var listeGenre = new Array();
	
	// pour tests
	listeGenre.push("rock");
	listeGenre.push("classique");
	listeGenre.push("trance");
	listeGenre.push("métal");
	listeGenre.push("alternatif");
	listeGenre.push("neo");
	// lecture du fichier des genres

	// renvoi des musique sous forme de LISTE de sting
	return listeGenre;
},

// Enregistrement la musiques qui vient d'être validée
AjouterMusique : function(nlleMusique)
{
	// nlleMusique -> objet musique avec les infos sur la nouvelle musique

	// ajout d'une ligne dans le fichier des musiques

	// renvoi 1 si enregistrement OK
},

// Validation de la musique
ValiderMusique : function(idMusique)
{
	// recherche de la ligne dans le fichier

	// suppression de cette ligne

	// apeller la fonction AjouterMusique()

	// renvoi 1 si enregistrement OK
},

// Validation de la musique
SupprimerMusique : function(nlleMusique)
{
	// recherche de la ligne dans le fichier

	// suppression de cette ligne

	// renvoi 1 si enregistrement OK
},

// Pour le test de la chaine de traitement
Test : function()
{
	console.log("[persistance_file] : OK");

}
};
module.exports = persistance_file;
