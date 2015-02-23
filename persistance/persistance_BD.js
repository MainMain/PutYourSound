// Constructeur
function persistance_BD(){}

// Attributs
// liste des votes possible avec le nom de voix en cours
this.genre_1; // ex : { "rock", 5}
this.genre_2;
this.genre_3;
// liste des id des votants
this.listeVotants;

persistance_BD.Initialiser = function()
{
	// connexion à la BD
	mongoose.connect('mongodb://localhost/DevV1', function(err) {
	if (err) { throw err; }
	});

	// initalisation des schémas

}

persistance_BD.AjoutMusique = function()
{
	// connexion à la BD
	mongoose.connect('mongodb://localhost/DevV1', function(err) {
	if (err) { throw err; }
	});

	// initalisation des schémas

}

module.exports = persistance_BD;