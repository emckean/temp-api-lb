//lets require/import the mongodb native drivers.
console.log('converting data')
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var async = require('async')

var validUrl = require('valid-url');
var url = require('url');
var moment = require('moment');


var formats = ['ddd MMM d YYYY HH:mm:ss a', 'ddd, d MMM YYYY HH:mm:ss z', 'YYYY-MM-DDTHH:mm:ssZ' ]

//don't forget that this file isn't clean JSON and needs line-end commas and square brackets
var testData = require('/Users/emckean/Documents/datasets/adopt/01192017-2.json')
// var testData = require('/Users/emckean/Documents/datasets/adopt/sanitize-small-edit.json')
var cleanTestData = [];

function selectValues(topLevelObj){
   return new Promise(function(resolve, reject) {
  if (topLevelObj.path.collection === "adoptedWords" && topLevelObj.value ){
    resolve(topLevelObj.value)
  } 
})
 }

var fixTwitter = function(adoptObj) {
  return new Promise(function(resolve, reject) {
        if (adoptObj.hasOwnProperty('Twitter') && adoptObj.Twitter === 'None'){
           adoptObj.Twitter = ''
        }
        resolve(adoptObj)
})}

function convertDate(date){
  var ISODate = moment(date, formats).format();
  return(ISODate)
}

var addPayment = function(adoptObj){
  return new Promise(function(resolve, reject) {
    var date = convertDate(adoptObj.dateAdded);
    var payment = [
      {
        "date": date,
        "type": "not recorded",
        "amount": "25.00"
      }
    ]
    if (adoptObj.hasOwnProperty('payment') && !Array.isArray(adoptObj.payment)){
      var tempArray = adoptObj.payment
      delete adoptObj.payment;
      adoptObj.payment = [tempArray]
    }
    if (adoptObj.hasOwnProperty('payment')){
       adoptObj.payment[0].date = convertDate(adoptObj.payment[0].date)
    }
    if (!adoptObj.hasOwnProperty('payment')){
      adoptObj.payment = payment
      if (moment(adoptObj.dateAdded, formats).isSame('2016-01-01', 'day')){
        adoptObj.payment[0].type = 'Kickstarter'
      }
    }
     resolve(adoptObj)
  })
}

var checkDateAdded = function(adoptObj) {
  return new Promise(function(resolve, reject) {
    if (!adoptObj.hasOwnProperty('dateAdded')){
      adoptObj.error = true
      adoptObj.dateAdded = 'Fri Jan 01 2016 19:46:45 GMT-0800'
    }
      resolve(adoptObj)
  })
}

var addExpire = function(adoptObj){
    return new Promise(function(resolve, reject) {
    if (!adoptObj.hasOwnProperty('dateExpires')){
      adoptObj.dateExpires = moment(adoptObj.dateAdded, formats).add(1, 'years').format()
    }    
    // console.log(adoptObj)
    resolve(adoptObj)
})
  }


var miscCleanup = function(adoptObj){
   return new Promise(function(resolve, reject) {
      delete adoptObj['paypal-url'];
      delete adoptObj.paidStatus;
      adoptObj._id = adoptObj.wordHash;
      adoptObj.dateAdded = convertDate(adoptObj.dateAdded)
      if (adoptObj.hasOwnProperty('dateRenewed')){ adoptObj.dateRenewed =convertDate(adoptObj.dateRenewed)}
      resolve(adoptObj)
   })
}

var cleanData = testData.map(function(obj){
        if (selectValues(obj) !== undefined){
               return (selectValues(obj));
        }
    })

var finalData = [];
function makeFinalArray(word, callback){
    return miscCleanup(word)
      .then(fixTwitter)
      .then(addPayment)
      .then(checkDateAdded)
      .then(addExpire)
      // .then(function(data){
      //   // console.log(data)
      //   return(data)
        
      // })
      .catch(function(error) {
        console.log('oh no', error);
      })
}



//this is the bit that isn't working as expected
Promise.all(cleanData.map(function(word){
  return makeFinalArray(word)

})).then(res => console.log(JSON.stringify(res, null, 2)))


// function tryThis(callback){
//   callback(null, Promise.all(cleanData.map(function(word, index){
//   return makeFinalArray(word)
//   // finalData.push(word)

//   })))
// }

// tryThis(function(err, response){
//   console.log(response)
// })

// async.map(cleanData, makeFinalArray, function(err, results) {
//     // results is now an array of stats for each file
//     console.log(err)
//     console.log(results[0])
// });
//this is coming up weird promises




