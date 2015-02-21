// référencement autres couches
var persistance = require("../persistance/persistance_BD.js")

// Constructeur
function vote_Manager(){}

// Attributs
// liste des votes possible avec le nom de voix en cours
this.genre_1; // ex : { "rock", 5}
this.genre_2;
this.genre_3;
// liste des id des votants
this.listeVotants;

// Définition des dtrois genres aléatoire (attributs)
vote_Manager.Initialiser = function()
{
	// demande la liste des genres à la persistance

	// choix de trois votes aléatoires

	// attributions dans les attributs avec nombre voix = 0

	// vidage de la liste des votants
},

// Un utilisateur vient de voter
vote_Manager.AjouterVote = function(nomDuGenre)
{
	// vérification que c'est un des trois genres en attribut

	// si oui
		// on incrémente 
},

// renvoi le genre avec le plus de votes
vote_Manager.GetVoteDominant = function()
{
	// Recherche du gnre avec le plus de voix

	// Renvoi
}

module.exports = vote_Manager;