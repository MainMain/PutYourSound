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
	// lecture du fichier des musiques

	// renvoi des musique sous forme de LISTE d'objet Musique
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
persistance_file.ValiderMusique = function(nlleMusique)
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
	console.log("[persistance_file] : Test");

}

module.exports = persistance_file;
