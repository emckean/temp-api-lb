//lets require/import the mongodb native drivers.
console.log('in setup')
var mongodb = require('mongodb');
var mongoose = require('mongoose');

var url = 'mongodb://localhost:27017/test';
var testData = require('./testdata.json')



exports.setUp = function(callback){
    mongoose.connect('mongodb://localhost:27017/test');

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
           // Adoption.collection.insert(word, function(err,r) {
           //  if (err) {
           //      console.log(err)
           //  } else {
           //      console.log(r.insertedCount + ' documents inserted')
           //  }
           //  callback(null, '10 documents inserted')
        
           //  });
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

// exports.setUp  = function(callback) {
//  //We need to work with "MongoClient" interface in order to connect to a mongodb server.
//  var MongoClient = mongodb.MongoClient;

//  // Use connect method to connect to the Server
//  MongoClient.connect(url, function (err, db) {
//    if (err) {
//      console.log('Unable to connect to the mongoDB server. Error:', err);
//      callback(new Error(err))
//    } else {
//      //HURRAY!! We are connected. :)
//      console.log('Connection established to', url);

//      var collection = db.collection('adoption');
//      // do some work here with the database.
//      collection.insert(testData, function (err, result) {
//        if (err) {
//          console.log(err);
//          db.close();
//          callback(new Error(err))
//        } else {
//          console.log('Inserted ' + result.insertedCount + ' documents into the "adoption" collection.');
//          db.close()
//          callback(null, 'test data inserted')
//        }       
//      });
//    }
//  });
// }  
