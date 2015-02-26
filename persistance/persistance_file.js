var Musique = require("../model/musique.js")
var fs = require("fs");
var lineByLineReader = require('line-by-line');

// Constructeur
function persistance_file(){}

// Attributs
var persistance_file = {
	pathToMusicFile : undefined,
	pathToMusic : undefined,
	listeMusiques : undefined,
	

// Init
Initialiser : function(pathToMusic)
{
	// affectation chemins
	this.pathToMusic = pathToMusic;
	this.pathToMusicFile = pathToMusic + "../persistance/listeMusiques.txt";

	console.log("[PERSISTANCE] : chemin musique initialisé à " + this.pathToMusic);
},


// Renvoi toutes les musiques
GetMusiques : function()
{	
	// lecture du fichier des musiques
	this.listeMusiques = new Array();

	var bufferString, bufferStringSplit;
	var that = this;

	function readFile() {
		bufferString = fs.readFileSync(that.pathToMusicFile).toString();
		bufferStringSplit = bufferString.split('\r');
		parseLine();
	}

	function parseLine(){
		for(var lineId in bufferStringSplit){
			line = bufferStringSplit[lineId].split('-');
			var music = new Musique(line[0], line[1], line[2], line[3], undefined, line[4]);
			that.listeMusiques.push(music);
		}
	}

	readFile();
	return this.listeMusiques;
	//return readFile(parseLine(returnListMusique))
	// vérifier que la musique lue dans le fichier existe bien ! 
	/*
	if(!this.pathToMusic)
		return null;
	this.listeMusiques = fs.readdirSync(this.pathToMusic);
	this.listeMusiques.splice(this.listeMusiques.indexOf(".keep"),1);
	return this.listeMusiques;*/

},

// Renvoi tout les genres différents
GetGenres : function()
{
	var listeGenre = new Array();
	
	// pour tests
	listeGenre.push("rock");
	listeGenre.push("classique");
	listeGenre.push("trance");
	listeGenre.push("métal");
	listeGenre.push("alternatif");
	listeGenre.push("neo");
	// lecture du fichier des genres

	// renvoi des musique sous forme de LISTE de string
	return listeGenre;
},

// Enregistrement la musiques qui vient d'être validée
AjouterMusique : function(nlleMusique)
{
	console.log("[persistance_file] : Ajout de la musique : "+nlleMusique.getNom());
	// nlleMusique -> objet musique avec les infos sur la nouvelle musique
	// ajout d'une ligne dans le fichier des musiques
	var contenu = fs.readFileSync(this.pathToMusicFile, "UTF-8");
	contenu = contenu+"\r"+nlleMusique.getId()+"-"+nlleMusique.getNom()+"-"+nlleMusique.getArtiste()+"-"+nlleMusique.getGenre()+"-"+nlleMusique.isValidee();
	fs.writeFileSync(this.pathToMusicFile,contenu, "UTF-8");
	// renvoi 1 si enregistrement OK
	return 1;
},

// Validation de la musique
ValiderMusique : function(idMusique)
{
	// recherche de la ligne dans le fichier
	var contenu = fs.readFileSync(this.pathToMusicFile, "UTF-8");
	var contenu2 ;
	var contenuFinal;
	var temp = new Array();
	var ligne;
	var listeInfos = new Array();
	var music ;
	if(contenu.indexOf(idMusique,0) > -1)
	{
		console.log("[persistance_file] : Musique trouvee "+idMusique);
		contenu2 = contenu.substring(contenu.indexOf(idMusique,0));
		temp = contenu2.split("-");
		console.log("[persistance_file] : -------> "+ temp[4]);
		// suppression de cette ligne
		if(temp[4] !== 'true')
		{
			console.log("[persistance_file] : La musique "+idMusique+" va etre supprimée");
			ligne = contenu.substring(contenu.indexOf(idMusique,0),contenu.indexOf("false",contenu.indexOf(idMusique,0))+5);
			console.log("[persistance_file] : ligne à supprimer : "+ligne);
			//on recupere les infos de la musique pour les mettre dans un objet musique
			listeInfos = ligne.split("-");
			console.log("[persistance_file] : -------> "+listeInfos);
			music = new Musique(listeInfos[0],listeInfos[1],listeInfos[2],listeInfos[3],"",true);
			console.log("[persistance_file] : La nouvelle musique : "+music.getNom());
			//TODO supprimer la ligne
			contenuFinal = contenu.substring(0,contenu.indexOf(idMusique,0))+contenu.substring(contenu.indexOf("false",contenu.indexOf(idMusique,0))+5);
			fs.writeFileSync(this.pathToMusicFile,contenuFinal, "UTF-8");
			// appeler la fonction AjouterMusique()
			this.AjouterMusique(music);
			// renvoi 1 si enregistrement OK
			return 1;

		}
		else
		{
			console.log("[persistance_file] : Ce fichier est déjà validé");
			return -1;
		}
	}
	else 
	{
		console.log("[persistance_file] : Musique non trouvée "+idMusique);
		return -1;
	}
	


	
},

// Suppression de la musique
SupprimerMusique : function(idMusique)
{
	// recherche de la ligne dans le fichier
	var contenu = fs.readFileSync(this.pathToMusicFile, "UTF-8");
	var contenu2;
	var contenuFinal;
	var temp = new Array();
	if(contenu.indexOf(idMusique,0) > -1)
	{
		contenu2 = contenu.substring(contenu.indexOf(idMusique,0));
		temp = contenu2.split("-");
		// suppression de cette ligne
		if(temp[4] !== 'true')
		{
			contenuFinal = contenu.substring(0,contenu.indexOf(idMusique,0))+contenu.substring(contenu.indexOf("false",contenu.indexOf(idMusique,0))+5);
			fs.writeFileSync(this.pathToMusicFile,contenuFinal, "UTF-8");
		}
		else
		{
			contenuFinal = contenu.substring(0,contenu.indexOf(idMusique,0))+contenu.substring(contenu.indexOf("true",contenu.indexOf(idMusique,0))+4);
			fs.writeFileSync(this.pathToMusicFile,contenuFinal, "UTF-8");
		}
		// renvoi 1 si enregistrement OK
		return 1;
	}
	else
	{
		console.log("[persistance_file] : Musique non trouvée");
		return -1;
	}

	
},

// Pour le test de la chaine de traitement
Test : function()
{
	console.log("[persistance_file] : OK");

}
};
module.exports = persistance_file;
