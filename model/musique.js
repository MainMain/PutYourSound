var Musique = (function() {
	'use strict';


	// --- Constructeur + attributs d'instance (définis dans le constructeur)
	Musique.build = function() {return new Musique();};

	// Constructeur
	function Musique(id, titre, artiste, genre, fichier, validee) {
		this.id = id;
		this.titre = titre;
		this.artiste = artiste;
		this.genre = genre;
		this.fichier = fichier;
		this.validee = validee;
	}

	// --- METHODES D'INSTANCE
	Musique.prototype = {
		getId : function(){
			return this.id;
		},

		getTitre : function(){
			return this.titre;
		},

		getArtiste : function(){
			return this.artiste;
		},

		getGenre : function(){
			return this.genre;
		},

		isValidee : function(){
			return this.validee;
		},

		getFicher : function()
		{
			// Format du titre fichier 001-Titre-Artiste
			return this.fichier;
		}
	};

	// Attributs
	Musique.id;
	Musique.titre;
	Musique.artiste;
	Musique.genre;
	Musique.fichier;
	Musique.validee;


	// On pense à retourner le constructeur (afin de pouvoir construire des
	// instances, sinon tout
	// le code de notre classe serait inutile car non visible depuis
	// l'extérieur)
	return Musique;
}());

module.exports = Musique;
