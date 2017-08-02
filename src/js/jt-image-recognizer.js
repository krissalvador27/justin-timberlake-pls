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
 * @description Is
 * @param  {[type]}  imgurObj [description]
 * @return {Boolean}          [description]
 */
JTImageRecognizer.prototype.isThatYouJT = function(imgurObj) {
  const link = imgurObj.data.link;

  JTClarafaiModel.models.predict('justin timberlake' , link).then(
    (response) => {
      let output   = response.outputs[0];
      let concepts = output.data.concepts;
      let justinTimberlakeScore = parseInt(concepts[0].value * 100);

      if (justinTimberlakeScore > 95) {
        let canWeSave = window.confirm('OMG I\'m ' + score + '% sure you\'re Justin Timberlake! Can I log that you were here Justin!?');

        if (canWeSave) {
          cameraInstance.savePhoto(imgurObj);
        } else {
          this.cameraInstance.deletePhoto(imgurObj);
        }
      } else {
        cameraInstance.deletePhoto(imgurObj);
        cameraInstance.resetCamera();
        alert('Nice try ... but I\'m pretty sure you\'re not Justin Timberlake... >:(');
      }
    },
    (err) => {
      console.error(err);
    }
  );
};

module.exports = JTImageRecognizer;