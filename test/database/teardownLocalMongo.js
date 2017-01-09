//lets require/import the mongodb native drivers.
console.log('in teardown')
var MongoClient = require('mongodb').MongoClient;

exports.tearDown = function(callback) {
	//We need to work with "MongoClient" interface in order to connect to a mongodb server.


	// Connection URL. This is where your mongodb server is running.
	// var url = 'mongodb://localhost:27017/test';
	var url = process.env.MONGODB_CONNECTION_URL;

	// Use connect method to connect to the Server
	MongoClient.connect(url, function (err, db) {
	  if (err) {
	    console.log('Unable to connect to the mongoDB server. Error:', err);
	    callback(new Error(err))
	  } else {
	    //HURRAY!! We are connected. :)
	    console.log('Connection established to', url);

	    // do some work here with the database.

	    var collection = db.collection('adoptedWords');
	    
	    collection.drop(function (err, result){
	    	if (err) {
	        	console.log(err);
	        	db.close();
	      		callback(err)
	      	} else {
		       	console.log('collection dropped');
		       	db.close();
		       	callback (null, 'collection dropped')
	      	}
	    });    
	  }
	});
}
