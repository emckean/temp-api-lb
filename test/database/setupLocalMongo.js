//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

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

exports.setUp  = function(callback) {
	//We need to work with "MongoClient" interface in order to connect to a mongodb server.
	var MongoClient = mongodb.MongoClient;

	// Connection URL. This is where your mongodb server is running.
	var url = 'mongodb://localhost:27017/test';

	// Use connect method to connect to the Server
	MongoClient.connect(url, function (err, db) {
	  if (err) {
	    console.log('Unable to connect to the mongoDB server. Error:', err);
	  	callback(new Error(err))
	  } else {
	    //HURRAY!! We are connected. :)
	    console.log('Connection established to', url);

	    var collection = db.collection('adoptedWords');
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



