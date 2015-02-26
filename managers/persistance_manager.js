var sqlite3 = require('sqlite3').verbose();
var Musique = require("../model/musique.js")
var db = new sqlite3.Database('musiques.db');
var fs = require("fs");


var persistance_manager = {
	listesGenres : undefined,
	Initialiser : function(racine){
		if(!fs.existsSync(racine + "musiques.db")){
			console.log("Creation BD");
			db.serialize(function() {
				db.run("CREATE TABLE `genre` ( `id` INTEGER PRIMARY KEY AUTOINCREMENT, `genre` TEXT )");
				db.run("CREATE TABLE `musique` ( `id` INTEGER PRIMARY KEY AUTOINCREMENT, `titre` TEXT, `artiste` TEXT, `genre_id` INTEGER, `validee` INTEGER, FOREIGN KEY(genre_id) REFERENCES genre(id) )");
			});	
		}else{
			console.log("DB déjà présente");
		}
	},
//id, titre, artiste, genre, fichier, validee)
	GetMusiquesValidee : function(callback){
		var musiqueValide = [];
		db.serialize(function(){
			var query = "SELECT m.id, m.titre, m.artiste, m.validee, m.fichier, g.genre FROM musique m INNER JOIN genre g On g.id = m.genre_id WHERE m.validee = 1";
			db.each(query, function(err, row){
				musiqueValide.push(new Musique(row.id, row.titre, row.artiste, row.genre, row.fichier, row.validee));
			},
			function(){
				callback(musiqueValide);
			});
		});
	},

	GetMusiquesAttente : function(){
		db.serialize(function(){
			var query = "SELECT m.id, m.titre, m.artiste, m.validee, m.fichier, g.genre FROM musique m INNER JOIN genre g On g.id = m.genre_id WHERE m.validee = 0";
			db.each(query)
		});
	},

	GetGenres : function(){

	},

	GetNRandomGenres : function (N) {
		// body...
	},

	GetRandomMusiqueForGenre : function(genreId){

	}
};

module.exports = persistance_manager;