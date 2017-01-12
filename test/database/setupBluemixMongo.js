//lets require/import the mongodb native drivers.
console.log('in setup')
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var url = require('url');
var testData = require('./testdata.json')

var util = require('util')

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

    var parsedURI = url.parse(credentials.uri)
    var mongoURI = 'mongodb://loopback-test:' + process.env.MONGO_PWD+'@' + parsedURI.host+ '/test?ssl=true&sslValidate=true'
    console.log(mongoURI)
	// Use connect method to connect to the Server
    var options = {
          server: { poolSize: 1 },
        }
    mongoose.connect(mongoURI, options);

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function() {
        var Schema = mongoose.Schema;
        var wordSchema = mongoose.Schema({
            dateExpires: { type: Date},
            dateAdded: {type: Date}
        }, { collection: 'adoption' });

        var Adoption = mongoose.model('Adoption', wordSchema);
        console.log('here')

        //add callback here? 

        var newData = testData.map(function(word){
           word.dateAdded = new Date(word.dateAdded)
           if (word.dateExpires){
            word.dateExpires = new Date(word.dateExpires)
           } else {
              word.dateExpires = new Date(word.dateExpires)
           }
           if (word.dateRenewed){
            word.dateRenewed = new Date(word.dateRenewed)
           }
           return (word);
        });
        Adoption.collection.insertMany(testData, function(err,r) {
            if (err) {
                console.log(err)
            } else {
                console.log(r.insertedCount + ' documents inserted')
                 callback(null, '10 documents inserted')
            }
        })
        
        db.close();
    });
}  



