const JTImageRecognizer = require('./jt-image-recognizer');
const moment            = require('moment');

window.jtImageRecognizer = new JTImageRecognizer();
window.moment            = moment;

// Button click listener
$('body').on('click', function(e) {
  $('.slide1').addClass('hide');
  $('.slide2').addClass('show');
  $('.main-container').removeClass('init-click');
  $('body').off('click');
});