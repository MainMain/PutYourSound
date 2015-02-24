// référencement autres couches
var persistance = require("../persistance/persistance_BD.js")

// Constructeur
var vote_Manager = {
	genre_1 : undefined,
	genre_2 : undefined,
	genre_3 : undefined,
	listeVotants : undefined,
Initialiser : function()
{
	// demande la liste des genres à la persistance

	// choix de trois genre aléatoires

	// attributions dans les attributs avec nombre voix = 0

	// vidage de la liste des votants
},

// Un utilisateur vient de voter
AjouterVote : function(nomDuGenre)
{
	// vérification que c'est un des trois genres en attribut

	// si oui
		// on incrémente 
},

// renvoi le genre avec le plus de votes
GetVoteDominant : function()
{
	// Recherche du genre avec le plus de voix

	// Renvoi

	//Simulé
  	return parseInt(Math.random()*3);
},

Test : function()
{
	console.log("[vote_Manager] : Test");
}
};

// Définition des dtrois genres aléatoire (attributs)

module.exports = vote_Manager;