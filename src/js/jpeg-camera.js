const ImgurHelpers = require('./imgur-helper');
const db           = require('./db');

const JPEGCamera = function(options={}) {
  this.uploadCallback = options.uploadCallback;
  this.deleteCallback = options.deleteCallback;
  this.initialize();
};

/**
 * @description Initialize JPEGCamera
 */
JPEGCamera.prototype.initialize = function() {
  if (!window.JpegCamera) {
      alert('Camera access is not available in your browser');
    } else {
      this.camera = new JpegCamera('#camera')
        .ready((resolution) => {
          this.bindEvents();
        })
        .error((err) => {
          alert('Camera access was denied');
        });
    }
};

/**
 * @description Bind listeners & dom elements to trigger camera functions
 */
JPEGCamera.prototype.bindEvents = function() {
  document.getElementsByClassName('camera-button')[0].onclick = () => {
    let snapshot = this.camera.capture();
    snapshot.show();

    // Hide snapshot button
    hideButton('camera-button');

    // Reveal submit and reset buttons
    showButton('submit-button');
    showButton('redo-button');

    document.getElementsByClassName('submit-button')[0].onclick = () => {
      let img;

      try {
        img = document.getElementsByTagName('canvas')[0].toDataURL('image/jpeg', 0.9).split(',')[1];
      } catch(e) {
        img = document.getElementsByTagName('canvas')[0].toDataURL().split(',')[1];
      }

      // Upload to imgur
      this.uploadPhoto(img);

      resetButtons();
    };

    document.getElementsByClassName('redo-button')[0].onclick = () => {
      if (this.camera._displayed_snapshot === snapshot) {
        this.camera._displayed_snapshot = null;
        this.camera.show_stream();
      }

      resetButtons();
    };
  };
};

/**
 * @description Utilize imgur to upload photo
 * @param {String} img
 */
JPEGCamera.prototype.uploadPhoto = function(img) {
  // Upload to imgur
  ImgurHelpers.upload(img, this.uploadCallback);
};

/**
 * @description Utilize imgur to upload photo
 * @param {Object} img - imgur object
 */
JPEGCamera.prototype.deletePhoto = function(img) {
  // Delete from imgur
  ImgurHelpers.delete(img, this.deleteCallback);
};

/**
 * @description Save photo
 * @param  {Object} imgurObj - imgur object
 */
JPEGCamera.prototype.savePhoto = function(imgurObj) {
  // Save to db.txt
  db.writeToDB(imgurObj);
};

/**
 * @description Hide currently shown snapshot and resume camera
 */
JPEGCamera.prototype.resetCamera = function() {
  this.camera.show_stream();
  resetButtons();
};

function resetButtons() {
  showButton('camera-button');
  hideButton('submit-button');
  hideButton('redo-button');
};

function showButton(className) {
  document.getElementsByClassName(className)[0].style.display = 'inline-block';
}

function hideButton(className) {
  document.getElementsByClassName(className)[0].style.display = 'none';
}

module.exports = JPEGCamera;
