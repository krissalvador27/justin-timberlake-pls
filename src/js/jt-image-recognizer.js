const JTClarafaiModel = require('./clarifai-trainer');
const JPEGCamera      = require('./jpeg-camera');
const ImgurHelper     = require('./imgur-helper');

let cameraInstance;
const JTImageRecognizer = function(options={}) {
  this.initialize();
};

JTImageRecognizer.prototype.initialize = function() {
  cameraInstance = new JPEGCamera({
    uploadCallback : this.isThatYouJT
  });
};

/**
 * @description Is that you JT?
 * @param  {Object} imgurObj - imgur obj passed into 
 * @return {Boolean}
 */
JTImageRecognizer.prototype.isThatYouJT = function(imgurObj) {
  const link = imgurObj.data.link;

  JTClarafaiModel.models.predict('justin timberlake' , link).then(
    (response) => {
      let output   = response.outputs[0];
      let concepts = output.data.concepts;
      let justinTimberlakeScore = parseInt(concepts[0].value * 100);
      
      cameraInstance.resetCamera();
      cameraInstance.deletePhoto(imgurObj);

      if (justinTimberlakeScore > 95) {
        alert('OMG I\'m ' + justinTimberlakeScore + '% sure you\'re Justin Timberlake! Hi Justin!!! <(^_^)>');
      } else {
        alert('Nice try ... but I\'m pretty sure you\'re not Justin Timberlake... >:(');
      }
    },
    (err) => {
      console.error(err);
    }
  );
};

module.exports = JTImageRecognizer;