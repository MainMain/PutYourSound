// référencement autres couches
var persistance = require("../persistance/persistance_file.js")

// Constructeur
var vote_Manager = {
	genre_1 : { nom : undefined, votes : 0 },
	genre_2 : { nom : undefined, votes : 0 },
	genre_3 : { nom : undefined, votes : 0 },
	listeGenres : undefined,
	listeVotants : undefined,

Initialiser : function()
{
	// demande la liste des genres à la persistance
	this.listeGenres = persistance.GetGenres();

	// choix de trois genres aléatoires
	var num1 = Math.floor(Math.random() *  this.listeGenres.length);

	var num2;
	do
	{
		num2  = Math.floor(Math.random() *  this.listeGenres.length);
	}while(num2 === num1)

	var num3;
	do
	{
		num3 = Math.floor(Math.random() *  this.listeGenres.length);
	}while(num3 === num1 || num3 === num2)

	// affecte les noms
	this.genre_1.nom = this.listeGenres[num1];
	this.genre_2.nom = this.listeGenres[num2];
	this.genre_3.nom = this.listeGenres[num3];

	// init le nombre de vote
	this.genre_1.votes = 0;
	this.genre_2.votes = 0;
	this.genre_3.votes = 0;

	// le bon log
	console.log("[VOTE_MANAGER] : Nouveaux genre à voter : " + this.genre_1.nom + " - " 
		+ this.genre_2.nom + " - " + this.genre_3.nom);


	// vidage de la liste des votants
	this.listeVotants = new Array();
},

// Un utilisateur vient de voter
AjouterVote : function(nomDuGenre)
{
	// on vérifie qu'il n'a pas voté
	// TODO ?

	// vérification que c'est un des trois genres en attribut
	if (nomDuGenre === this.genre_1.nom || 
		nomDuGenre === this.genre_2.nom || 
		nomDuGenre === this.genre_3.nom)
	{
		// on incrémente le nombre de vote
		if (nomDuGenre === this.genre_1.nom) this.genre_1.votes++;
		else if (nomDuGenre === this.genre_2.nom) this.genre_2.votes++;
		else if (nomDuGenre === this.genre_3.nom) this.genre_3.votes++;
	}
},

// renvoi le genre avec le plus de votes
GetVoteDominant : function()
{
	var genreDominant = this.genre_1.nom;
	// Recherche du genre avec le plus de voix
	if (this.genre_1.votes == Math.max(this.genre_1.votes, this.genre_2.votes, this.genre_3.votes))
	{
		genreDominant = this.genre_1.nom;
	}
	else if (this.genre_2.votes == Math.max(this.genre_1.votes, this.genre_2.votes, this.genre_3.votes))
	{
		genreDominant =  this.genre_2.nom;
	}
	else if (this.genre_3.votes == Math.max(this.genre_1.votes, this.genre_2.votes, this.genre_3.votes))
	{
		genreDominant =  this.genre_3.nom;
	}

	console.log("{VOTE_MANAGER] : Retourne vote genreDominant : " + genreDominant );
	return genreDominant;
},

Test : function()
{
	console.log("[vote_Manager] : OK");
}
};

// Définition des dtrois genres aléatoire (attributs)

module.exports = vote_Manager;