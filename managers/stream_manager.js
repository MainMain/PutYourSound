var Musique = require("../model/musique.js")
var Throttle = require('throttle');
var probe = require('node-ffprobe');
var lame = require('lame');
var musique_manager = require("./musique_manager.js");
var vote_manager = require("./vote_manager.js");
var fs = require("fs");
var path = require("path");

var stream_manager = {
  pathToMusic : "",

  encoder : undefined ,

  decoder : undefined ,

  Initialiser : function(racine, callback){
    this.pathToMusic = path.normalize(racine + "musique/");
    this.encoder = lame.Encoder({channels: 2, bitDepth: 16, sampleRate: 44100});
    this.decoder = lame.Decoder();
    var that = this;
    this.decoder.on('format', function(format) {
      that.decoder.pipe(that.encoder);
    });
    callback();
  },

  StreamSong : function(){
    var track; 
    var that = this;
    musique_manager.Lire(function(result){
      track = path.normalize(that.pathToMusic + result);
      console.log("Choosed : "+ track);

      probe(track, function(err, probeData) {
        //Bitrate de la chanson
        var bit_rate = probeData.format.bit_rate;
        //On lit le mp3
        var currentStream = fs.createReadStream(track);
        //On applique un ratio a la lecutre pour une lecture continue
        bit_rate = (bit_rate/10) * 1.4;
        throttle = new Throttle(bit_rate);
        currentStream.pipe(throttle);
        //On remonte les données
        throttle.on('data', function(data){
          that.decoder.write(data);
        });
        //Fin du morceau on en demande un autre
        throttle.on('end', function(){
          that.StreamSong();
        });
      });
    });
  }
};

module.exports = stream_manager;