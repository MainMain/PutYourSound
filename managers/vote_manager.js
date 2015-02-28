// référencement autres couches
var persistance = require("./persistance_manager")

// Constructeur
var vote_Manager = {
	listeGenres : undefined,
	listeGenresSelection : undefined,
	listeVotes : undefined,
	listeVotants : undefined,

Initialiser : function(callback)
{
	// demande la liste des genres à la persistance
	var that = this;
	
	persistance.GetGenres(function(result){
		that.listeGenres = result;
	});
	
	persistance.GetNRandomGenres(3, function(result){
		that.listeGenresSelection = result;
		// init le nombre de vote
		that.listeVotes = {};
		that.listeVotes.genre_1 = {genreId : that.listeGenresSelection[0].id, votes : 0}
		that.listeVotes.genre_2 = {genreId : that.listeGenresSelection[1].id, votes : 0}
		that.listeVotes.genre_3 = {genreId : that.listeGenresSelection[2].id, votes : 0}
		callback();
	});

	// vidage de la liste des votants
	this.listeVotants = new Array();
},

GetGenres : function(){
	return this.listeGenres;
},
GetGenresSelection : function(){
	return this.listeGenresSelection;
},

// Un utilisateur vient de voter
AjouterVote : function(idGenre, ipVotant, callback)
{
	// on vérifie qu'il n'a pas voté
	if(this.listeVotants.indexOf(ipVotant) === -1){
		this.listeVotants.push(ipVotant);
		// on incrémente le nombre de vote
		if (idGenre == this.listeVotes.genre_1.genreId){
			this.listeVotes.genre_1.votes += 1;
			callback(this.listeGenresSelection[0]);
		}

		if (idGenre == this.listeVotes.genre_2.genreId){
			this.listeVotes.genre_2.votes += 1;	
			callback(this.listeGenresSelection[1]);
		}
		if (idGenre == this.listeVotes.genre_3.genreId){
			this.listeVotes.genre_3.votes += 1;
			callback(this.listeGenresSelection[2]);
		}
	}
},

// renvoi le genre avec le plus de votes
GetVoteDominant : function(callback)
{
	var genreDominant;
	var votesArray = [this.listeVotes.genre_1.votes, this.listeVotes.genre_2.votes, this.listeVotes.genre_3.votes];
	var infoVotes = {};
	
	var totalVote = votesArray[0] + votesArray[1] + votesArray[2];
	var max = Math.max(votesArray) === 0 ? -1 : Math.max(votesArray);
	switch(max){
		case this.listeVotes.genre_1.votes :
			genreDominant = this.listeVotes.genre_1.genreId;
		break;
		case this.listeVotes.genre_2.votes :
			genreDominant = this.listeVotes.genre_2.genreId;
		break;
		case this.listeVotes.genre_3.votes :
			genreDominant = this.listeVotes.genre_2.genreId;
		break;
		default :
			genreDominant = this.listeVotes.genre_1.genreId;
		break;
	}

	var pourcent1 = 0;
	var pourcent2 = 0;
	var pourcent3 = 0;

	if(totalVote != 0){
		pourcent1 = parseInt(100 * (votesArray[0]/totalVote));
		pourcent2 = parseInt(100 * (votesArray[1]/totalVote));
		pourcent3 = parseInt(100 * (votesArray[2]/totalVote));
	}

	infoVotes.genreDominant = genreDominant;
	infoVotes.pourcent1 = pourcent1;
	infoVotes.pourcent2 = pourcent2;
	infoVotes.pourcent3 = pourcent3;

	console.log("[VOTE_MANAGER] : Retourne vote id genreDominant : %j", infoVotes );
	callback(infoVotes);
},

};

// Définition des dtrois genres aléatoire (attributs)

module.exports = vote_Manager;