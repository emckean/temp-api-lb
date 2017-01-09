//lets require/import the mongodb native drivers.
console.log('in teardown')
var MongoClient = require('mongodb').MongoClient;
var url = require('url');

var util = require('util')
var cfenv = require('cfenv');

//from a local git-ignored copy of services 
// var localVCAP = null
// localVCAP = require("../local-vcap.json")
// var appEnv = cfenv.getAppEnv({vcap: localVCAP})
var appEnv = JSON.parse(process.env.appEnv);
console.log(appEnv)
// Within the application environment (appenv) there's a services object
var services = appEnv.services;
console.log((services))
// The services object is a map named by service so we extract the one for mongo
var mongodb_services = services["compose-for-mongodb"];
console.log(mongodb_services)

// We now take the first bound mongodb service and extract its credentials object
var credentials = mongodb_services[0].credentials;

console.log(credentials)

// Within the credentials, an entry ca_certificate_base64 contains the SSL pinning key
// We convert that from a string into a Buffer entry in an array which we use when
// connecting.
var caCert = new Buffer(credentials.ca_certificate_base64, 'base64');

var mongodb;

exports.tearDown = function(callback) {
	//We need to work with "MongoClient" interface in order to connect to a mongodb server.
mongodb://admin:DWEUSRBMBWEWXDAA@sl-us-dal-9-portal.4.dblayer.com:18234,sl-us-dal-9-portal.3.dblayer.com:18234/admin?ssl=true'
	//let's parse the credentials.uri
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
	    console.log('Connection established to', credentials.uri);

	    // do some work here with the database.
	    mongodb = db.db("test")
	    var collection = mongodb.collection('adoptedWords');
	    
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
