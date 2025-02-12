"use strict";

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const axios = require("axios");
const admin = require('firebase-admin');
const functions = require("firebase-functions");

const dotenv = require('dotenv')
dotenv.config()

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId
};

admin.initializeApp(firebaseConfig);

const db = admin.firestore();




exports.pubsub = functions
                  .runWith({timeoutSeconds: 60, memory: "1GB"})
                  .pubsub
                  .schedule('every 5 minutes')
                  .onRun(async context =>{
                    const params = {}
                    axios.get('https://cat-fact.herokuapp.com/facts', {params})
                    .then(response => {
                      const docRef = db.collection("facts").doc("wVxqRwCoIVoDsMqWGqHeHe");
                      const apiResponse = response.data
                      docRef.set({
                          current: apiResponse,
                      })
                    }).catch(error =>{
                      console.log(error);
                      logger.error(error, {structuredData: true});
                    })
                  })

const docRef = db.collection("facts").doc("wVxqRwCoIVoDsMqWGqHeHe");


exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

exports.createUpdate = onRequest(async (request, response) => {
  await docRef.set({
    fact: "dogs are better than all... All hail dogs.",
  });
  await response.send("Write to database complete!");
});

exports.delete = onRequest((request, response) => {
  console.log(request.query)
  const docRef = db.collection(request.query.collection).doc(request.query.doc);
  docRef.delete();
  response.send("Deleted!");
});

exports.read = onRequest((request, response) => {
  const docRef = db.collection().doc();
  docRef.get();
});


exports.catFacts = onRequest( (req, res) => {
  logger.info("Woof!", {structuredData: true});
  axios.get('https://cat-fact.herokuapp.com/facts', {params})
       .then(response => {
          const apiResponse = response.data;
          res.send(apiResponse[Math.floor(Math.random() * 5)].text)
        }).catch(error => {
          console.log(error)
          logger.error("Woof!? " + error, {structuredData: true});
        })
})