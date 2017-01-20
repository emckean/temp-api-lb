//lets require/import the mongodb native drivers.
console.log('converting data')
var mongodb = require('mongodb');
var mongoose = require('mongoose');

var validUrl = require('valid-url');
var url = require('url');
var moment = require('moment');

var devConfig = require('../../server/config.development.js');
var newUrl = devConfig.MONGODB_CONNECTION_URL;
console.log(newUrl);
var url = 'mongodb://localhost:27017/test';
// var testData = require('./testdata.json')

var testData = require('/Users/emckean/Documents/datasets/adopt/01192017-edit.json')

function fixTwitter(adoptObj, callback){
  if (adoptObj.hasOwnProperty('Twitter') && adoptObj.Twitter === 'None'){
    adoptObj.Twitter = ''
  }
  callback(null, adoptObj)
} 

function convertDate(date){
  var formats = ['ddd MMM d YYYY HH:mm:ss a', 'ddd, d MMM YYYY HH:mm:ss z', 'YYYY-MM-DDTHH:mm:ssZ' ]
  var ISODate = moment(date, formats).format();
  // console.log(ISODate)
  return(ISODate)
}

function addPayment(adoptObj, callback){
  // console.log(adoptObj.dateAdded)
  var date = convertDate(adoptObj.dateAdded);
  var payment = [
    {
      "date": date,
      "type": "not recorded",
      "amount": "25.00"
    }
  ]
  if (adoptObj.hasOwnProperty('payment')){
     adoptObj.payment[0].date = convertDate(adoptObj.payment[0].date)
  }
  if (!adoptObj.hasOwnProperty('payment')){
    adoptObj.payment = payment
    if (moment(adoptObj.dateAdded).isSame('2016-01-01', 'day')){
      adoptObj.payment[0].type = 'Kickstarter'
    }
  }
    callback(null, adoptObj)
}

function addExpire(adoptObj, callback){
    var formats = ['ddd MMM d YYYY HH:mm:ss a', 'ddd, d MMM YYYY HH:mm:ss z', 'YYYY-MM-DDTHH:mm:ssZ' ]
    if (!adoptObj.hasOwnProperty('dateExpires')){
      adoptObj.dateExpires = moment(adoptObj.dateAdded, formats).add(1, 'years').format()
      // console.log(adoptObj.dateExpires)
      callback(null, adoptObj) 
    }    
}

// testData.map(function(word){
//   console.log(word.word)
//   ad
//   console.log(word)
// })

// convertDate('Fri, 22 Jan 2016 03:46:45 GMT')

testData.map(function(word){
  // console.log(word.word);
    delete word['paypal-url'];
    delete word.paidStatus;
    word._id = word.wordHash;
    word.dateAdded = convertDate(word.dateAdded)
    if (word.hasOwnProperty('dateRenewed')){ word.dateRenewed =convertDate(word.dateRenewed)}
    fixTwitter(word, function (err, response){
      addPayment(response, function(err, response){
        addExpire(response, function(err, response){
          console.log(JSON.stringify(response, null, 2))
          return(response)
        })
      })
      
    })
    
           
});

// exports.setUp = function(callback){
//     mongoose.connect('mongodb://localhost:27017/test');

//     var db = mongoose.connection;
//     db.on('error', console.error.bind(console, 'connection error:'));
//     db.once('open', function() {
//         var Schema = mongoose.Schema;
//         var wordSchema = mongoose.Schema({
//             dateExpires: { type: Date},
//             dateAdded: {type: Date}
//         }, { collection: 'adoption' });

//         var Adoption = mongoose.model('Adoption', wordSchema);
//         console.log('here')

//         //add callback here? 

//         var newData = testData.map(function(word){
//            word.dateAdded = new Date(word.dateAdded)
//            if (word.dateExpires){
//             word.dateExpires = new Date(word.dateExpires)
//            } else {
//               word.dateExpires = new Date(word.dateExpires)
//            }
//            if (word.dateRenewed){
//             word.dateRenewed = new Date(word.dateRenewed)
//            }
//            word._id = word.wordHash;
//            return (word);
//         });
//         Adoption.collection.insertMany(testData, function(err,r) {
//             if (err) {
//                 console.log(err)
//             } else {
//                 console.log(r.insertedCount + ' documents inserted')
//                  callback(null, '10 documents inserted')
//             }
//         })
        
//         db.close();
//     });

// }

