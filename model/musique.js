var Musique = (function() {
	'use strict';


	// --- Constructeur + attributs d'instance (définis dans le constructeur)
	Musique.build = function() {return new Musique();};

	// Constructeur
	function Musique(id, nom, artiste, genre, passProtection, validee) {
		this.id = id;
		this.nom = nom;
		this.artiste = artiste;
		this.genre = genre;
		this.passProtection = passProtection;
		this.validee = validee;
	}

	// --- METHODES D'INSTANCE
	Musique.prototype = {
		getId : function(){
			return this.id;
		},

		getNom : function(){
			return this.nom;
		},

		getArtiste : function(){
			return this.artiste;
		},

		getGenre : function(){
			return this.genre;
		},

		getPassValidation : function(){
			return this.passProtection;
		},

		isValidee : function(){
			return this.validee;
		},
		
		doValider : function() {
			this.validee = true;
		}
	};

	// Attributs
	Musique.id;
	Musique.nom;
	Musique.artiste;
	Musique.genre;
	Musique.passProtection;
	Musique.validee;


	// On pense à retourner le constructeur (afin de pouvoir construire des
	// instances, sinon tout
	// le code de notre classe serait inutile car non visible depuis
	// l'extérieur)
	return Musique;
}());

module.exports = Musique;
