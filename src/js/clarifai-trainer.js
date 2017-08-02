const config   = require('../config/config');
const Clarifai = require('../../node_modules/clarifai/src');

const clarifai = new Clarifai.App({
  apiKey: config['CLARAFAI_API_KEY']
});

/**
 * @description Positive train model
 * @param  {String[]} positiveURLS - url links of justin timberlake
 */
clarifai.positiveTrain = (positiveURLS) => {
  positiveURLS = positiveURLS.map((url) => {
    return {
      url,
      concepts: [
        { id: 'justin timberlake', value: true }
      ]
    }
  });

  clarifai.inputs.create(positiveURLS).then(
    createModel,
    errorHandler
  );
};

/**
 * @description Negative train model
 * @param  {String[]} negative - url links of anything not justin timberlake
 */
clarifai.negativeTrain = (negativeURLS) => {
  negativeURLS = negativeURLS.map((url) => {
    return {
      url,
      concepts: [
        { id: 'justin timberlake', value: false }
      ]
    }
  });

  clarifai.inputs.create(jtURLS).then(
    createModel,
    errorHandler
  );
};


function createModel(inputs) {
  clarifai.models.create(celebrities, ['justin timberlake']).then(
    trainModel,
    errorHandler
  );
};


function trainModel(model) {
  model.train();
}

function errorHandler(err) {
  console.error(err);
};

module.exports = clarifai;