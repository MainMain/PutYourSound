// référencement autres couches
var persistance = require("./persistance_manager.js")

// Constructeur
var vote_Manager = {
	listeGenres : undefined,
	listeGenresSelection : undefined,
	listeVotes : {
		genre_1 : 0,
		genre_2 : 0,
		genre_3 : 0,
	},
	listeVotants : undefined,

Initialiser : function(callback)
{
	// demande la liste des genres à la persistance
	var that = this;
	persistance.GetNRandomGenres(3, function(result){
		that.listeGenresSelection = result;
		console.log("[VOTE] Genres : %j", that.listeGenresSelection);
	});

	persistance.GetGenres(function(result){
		that.listeGenres = result;
		console.log("[VOTE] Genres : %j", that.listeGenresSelection);
	});

	// init le nombre de vote
	this.listeVotes.genre_1 = 0;
	this.listeVotes.genre_2 = 0;
	this.listeVotes.genre_3 = 0;


	// vidage de la liste des votants
	this.listeVotants = new Array();
	callback();
},

GetGenres : function(){
	return this.listeGenres;
},
GetGenresSelection : function(){
	return this.listeGenresSelection;
},

// Un utilisateur vient de voter
AjouterVote : function(nomDuGenre, ipVotant)
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
	////////////////////////////////////////////////////////////////////////////////
	// A MODIFIER doit retourner listeGenresSelection[index];
	return genreDominant;
},

Test : function()
{
	console.log("[vote_Manager] : OK");
}
};

// Définition des dtrois genres aléatoire (attributs)

module.exports = vote_Manager;