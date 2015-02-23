// référencement autres couches
var persistance = require("../persistance/persistance_BD.js")

// Constructeur
function musique_Manager(){}

// Attributs
// Liste des musiques
this.listeMusiques;
this.mdpValidation = "heyheyyou";

// Initialisation (chargement des données)
musique_Manager.Load = function()
{
	// chargement des musiques validées
},

// Ajout d'une musique par un utilisateur
musique_Manager.Ajouter = function()
{
	// Request id suivant

	// Format du nom fichier 001-Titre-Artiste-Genre (cast \s et '-' en '_')
	 
	// ajout du fichier dans le dossier

	// ajout dans la liste de musique (attribut)
	
	// référencement dans la persistance
},

// Validation d'une musique par un modérateur
musique_Manager.Valider = function()
{
	
	// !vérifier que le mot de passe de validation est bon (remplace le principe des sessions)

	// ajout dans la liste de musique (attribut)

	// référencement dans la persistance
},

// Suppression de la musique (! ne doit pas être en cours de lecture)
musique_Manager.Supprimer = function()
{
	// !vérifier que le mot de passe de suppression est bon

	// suppression de la liste de musique (attribut)

	// déréférencement dans la persistance
},

musique_Manager.Lire = function()
{

}

module.exports = musique_Manager;
