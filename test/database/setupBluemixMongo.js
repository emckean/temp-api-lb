//lets require/import the mongodb native drivers.
console.log('in setup')
var MongoClient = require('mongodb').MongoClient;
var url = require('url');
var testData = require('./testdata.json')

var adoption = {
    "fullName": "Testy McTesterson",
    "email": "michaeldayreads@alphaorder.com",
    "word": "empiricism",
    "wordHash": "5857087ff36d2873dac58e77",
    "status": "active",
    "dateAdded": "Sun Dec 18 2016 15:43:37 GMT+0000 (UTC)",
    "note": "",
    "Twitter": "",
    "type": "paid",
    "earlyAdopter": "",
    "paidStatus": "paid",
    "promoCode": "",
    "offensive": "FALSE",
    "giftee": "",
    "gifteeEmail": "",
    "gifteeNote": "",
    "gifteeTwitter": "",
    "gifteeLink": "",
    "WordnikUsername": "",
    "backerType": "ADOPTER",
    "adoptLink": "",
    "renewal": "false",
    "dateExpires": "Mon 19 Dec 2017 06:46:45 GMT",
    "payment": [
      {
        "date": "Sun Dec 18 2016 15:43:37 GMT+0000 (UTC)",
        "type": "Stripe",
        "amount": "25.00"
      }
    ],
    "paypal-url": ""
  }

var util = require('util')
var cfenv = require('cfenv');

//from a local git-ignored copy of services 
// var localVCAP = null
// localVCAP = require("../local-vcap.json")
// var appEnv = cfenv.getAppEnv({vcap: localVCAP})
var appEnv = JSON.parse(process.env.appEnv);

// Within the application environment (appenv) there's a services object
var services = appEnv.services;
// The services object is a map named by service so we extract the one for mongo
var mongodb_services = services["compose-for-mongodb"];

// We now take the first bound mongodb service and extract its credentials object
var credentials = mongodb_services[0].credentials;


// Within the credentials, an entry ca_certificate_base64 contains the SSL pinning key
// We convert that from a string into a Buffer entry in an array which we use when
// connecting.
var caCert = new Buffer(credentials.ca_certificate_base64, 'base64');

var mongodb;

exports.setUp  = function(callback) {
	//We need to work with "MongoClient" interface in order to connect to a mongodb server.


	// Connection URL. This is where your mongodb server is running.
	// var url = 'mongodb://localhost:27017/test';
    // var url = process.env.MONGODB_CONNECTION_URL;

    var parsedURI = url.parse(credentials.uri)
    var mongoURI = 'mongodb://loopback-test:' + process.env.MONGO_PWD+'@' + parsedURI.host+ '/test?ssl=true'
    console.log(mongoURI)
	// Use connect method to connect to the Server
	MongoClient.connect(mongoURI, {
        mongos: {
            ssl: true,
            sslValidate: true,
            sslCA: caCert,
            poolSize: 1,
            reconnectTries: 1
        }
    }, function (err, db) {
	  if (err) {
	    console.log('Unable to connect to the mongoDB server. Error:', err);
	  	callback(new Error(err))
	  } else {
	    //HURRAY!! We are connected. :)
	    console.log('Connection established to', mongoURI);
        mongodb = db.db("test")
	    var collection = mongodb.collection('adoptedWords');
	    // do some work here with the database.
	    collection.insert(testData, function (err, result) {
	      if (err) {
	        console.log(err);
	        db.close();
	        callback(new Error(err))
	      } else {
	        console.log('Inserted ' + result.insertedCount + ' documents into the "adoptedWords" collection.');
	      	db.close()
	      	callback(null, 'test data inserted')
	      }	      
	    });
	  }
	});
}  



