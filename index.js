const {onCall} = require("firebase-functions/v2/https");
const {onDocumentWritten} = require("firebase-functions/v2/firestore");
const dotenv = require('dotenv')
dotenv.config()

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const {onSchedule} = require("firebase-functions/v2/scheduler")

exports.scheduledRun = onSchedule("every day 20:00", async (event) => {

    logger.log("Hi logs!")
});

var axios = require('axios');

var config = {
  method: 'get',
maxBodyLength: Infinity,
  url: 'https://api.ebird.org/v2/data/obs/KZ/recent',
  headers: { 
    'X-eBirdApiToken': process.env.YOUR_ACCESS_KEY,
  }
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});
