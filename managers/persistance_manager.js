var sqlite3 = require('sqlite3').verbose();
var Musique = require("../model/musique.js")
var db = new sqlite3.Database('musiques.db');
var fs = require("fs");


var persistance_manager = {
	listesGenres : undefined,
	Initialiser : function(racine, callback){
		if(!fs.existsSync(racine + "musiques.db")){
			console.log("Creation BD");
			db.serialize(function() {
				db.run("CREATE TABLE `genre` ( `id` INTEGER PRIMARY KEY AUTOINCREMENT, `genre` TEXT )");
				db.run("CREATE TABLE `musique` ( `id` INTEGER PRIMARY KEY AUTOINCREMENT, `titre` TEXT, `artiste` TEXT, `genre_id` INTEGER, `validee` INTEGER, FOREIGN KEY(genre_id) REFERENCES genre(id) )");
			});	
		}else{
			console.log("DB déjà présente");
			callback();
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

	GetMusiquesAttente : function(callback){
		var musiqueAttente = [];
		db.serialize(function(){
			var query = "SELECT m.id, m.titre, m.artiste, m.validee, m.fichier, g.genre FROM musique m INNER JOIN genre g On g.id = m.genre_id WHERE m.validee = 0";
			db.each(query, function(err, row){
				musiqueAttente.push(new Musique(row.id, row.titre, row.artiste, row.genre, row.fichier, row.validee));
			},
			function(){
				console.log("[PERSITANCE] %j", musiqueAttente);
				callback(musiqueAttente);
			});
		});
	},

	GetNRandomGenres : function (N, callback) {
		db.serialize(function(){
			var query = "SELECT * FROM genre ORDER BY RANDOM() LIMIT ?";
			db.all(query,[ N ], function(err, row){
				console.log("[PERSITANCE] GENRE ALEATOIRE  " + N +" Result %j",row);
				callback(row);
			});
		});
	},

	GetMusiqueForId : function(musiqueId, callback){
		db.serialize(function(){
			var query = "SELECT m.id, m.titre, m.artiste, m.validee, m.fichier, g.genre FROM musique m INNER JOIN genre g on g.id = m.genre_id WHERE m.id = ?";
			db.all(query,[ musiqueId ], function(err, row){
				console.log("[PERSITANCE] Musique for id : " + musiqueId +" Result %j",row[0]);
				callback(row[0]);
			});
		});
	},

	GetRandomMusiqueForGenre : function(genreId){

	},

	Valider : function(musiqueId){
		db.serialize(function(){
			var query = "UPDATE musique SET validee = 1 WHERE id = ?";
			db.run(query,[ musiqueId ]);
		});
	},

	Supprimer : function(musiqueId){
		db.serialize(function(){
			var query = "DELETE FROM musique WHERE id = ?";
			db.run(query, [ musiqueId ]);
		});
	}
};

module.exports = persistance_manager;