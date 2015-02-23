function AudioTagSample() {
  // Create a new <audio> tag.
  this.audio = new Audio();

  // Note: the audio graph must be connected after the page is loaded.
  // Otherwise, the Audio tag just plays normally and ignores the audio
  // context. More info: crbug.com/112368
  window.addEventListener('load', this.onload.bind(this), false);
}

AudioTagSample.prototype.onload = function() {
  // Create the audio nodes.
  this.source = context.createMediaElementSource(this.audio);
  this.filter = context.createBiquadFilter();
  this.filter.type = this.filter.LOWPASS;
  this.filter.frequency.value = 500;

  // Connect the audio graph.
  this.source.connect(this.filter);
  this.filter.connect(context.destination);
};

AudioTagSample.prototype.play = function(url) {
  this.audio.src = url;
  this.audio.play();
};