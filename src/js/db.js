// write to file
const csv    = require('fast-csv');
const dbFile = "../lib/db.csv";

module.exports = {

  /**
   * @description Write to db (csv file.. lol)
   * @param {Object} imgurObj - imgur obj
   */
  writeToDB : (imgurObj) => {
    let csvStream      = csv.createWriteStream({headers: true});
    let writableStream = fs.createWriteStream(dbFile);
    let imgurData      = imgurObj.data;

    writableStream.on('finish', function(){
      console.log("Wrote to DB!");
    });
    csvStream.pipe(writableStream);
    csvStream.write({
      id         : imgurData.id,
      date       : window.moment('ll'),
      link       : imgurData.link,
      deleteHash : imgurData.deletehash
    });
    csvStream.end();
  }

}
