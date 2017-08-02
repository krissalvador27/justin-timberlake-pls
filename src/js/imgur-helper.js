const config = require('../config/config');

module.exports = {

  /**
   * @description Uploads to imgur
   * @param {String} img - Image
   * @param  {Function} callback - callback on success
   */
  upload : function(img, callback) {
    $.ajax({
      url: 'https://api.imgur.com/3/image',
      type: 'POST',
      headers: {
        Authorization: 'Client-ID ' + config['IMGUR_CLIENT_ID']
      },
      data: {
        image: img,
      },
      dataType: 'json',
    }).then(
      (response) => {
        console.log(response);
        if (callback)
          callback(response)
      },
      (err) => {
        console.error(err);
    });
  },

  /**
   * @description Deletes from imgur
   * @param {String} img - Image
   * @param  {Function} callback - callback on success
   */
  delete : function(img, callback) {
    let deleteHash = img.data.deletehash;

    $.ajax({
      url: 'https://api.imgur.com/3/image/' + deleteHash,
      type: 'DELETE',
      headers: {
        Authorization: 'Client-ID ' + config['IMGUR_CLIENT_ID']
      },
      data: {
        image: img,
      },
      dataType: 'json',
    }).then(
      (response) => {
        console.log(response);
        if (callback)
          callback(response);
      },
      (err) => {
        console.error(err);
    });
  }

}