'use strict';
var moment = require('moment');
// require the app to do native connector
var loopback = require('loopback');
var app = require('../../server/server.js')

// var db = app.dataSources.mLab.database
// console.log('this is the db: '+ db)

// console.log((app.dataSources))
module.exports = function(Adoptedword) {


	Adoptedword.findByHash = function(wordHash, cb){
		Adoptedword.findOne({
			where: {
				wordHash: wordHash
            }}, function (err, word){
				cb(null, word);
			})
		};

	Adoptedword.getAllByUserName = function(userName, cb){
		Adoptedword.find({
			where: {
				wordnikUsername: userName
            }}, function (err, words){
				cb(null, words);
			})
		};	

	Adoptedword.findExpired = function(date, cb){
		//need to deal with date format, probably use MOMENT
		//Mon, 02 Jan 2017 03:46:45 GMT
		var ISODate;
		if (moment(date, "DD-MMM-YYYY").isValid()){
			console.log('got here')
			ISODate = moment(date, "DD-MMM-YYYY").format();
		}

		var testDate = new Date(ISODate)

		// dataSource.connector.collection(collectionName)

		// app.dataSources.mLab.connect(function(err,db){
	 //        db.collection('adoptedWords').findOne({},function(err,doc){
	 //            console.log(doc)
	 //        })
	 //        console.log(err)
	 //        console.log(db)
	 //    })
	 	//this almost works! 
	 	var dbFunc = 'function() { return db.adoptedWords.findOne({}); }';

		 app.dataSources.mLab.connector.db.eval(dbFunc, function(err, result) {
		 	console.log(err)
		 	console.log(result)
		 	cb(null, result)
	    if (err) {
	        console.log("There was an error calling dbFunc", err);
	        return;
	    }
	   // Do something with returned value 'result'
	});

	//  db.findOne({}, function(err, doc) {
 //      console.log(err)
 //      console.log(doc)
	// })

		// Adoptedword.find({
		// 	where: {
		// 		dateExpires: {lt: testDate}
  //           }}, function (err, words){
		// 		cb(null, words);
		// 	})
		};	


//remote methods setup
	Adoptedword.remoteMethod(
		'findByHash', {
			http: {
				path: '/findByHash',
				verb: 'get'
			},
			description: "returns word by hash",
			accepts: {arg: 'wordHash', type: 'string', http: {source: 'query'}, description: "wordHash"},
			returns: {
				arg: 'adoptions',
				type: 'json'

			}
		});

	Adoptedword.remoteMethod(
		'getAllByUserName', {
			http: {
				path: '/getAllByUserName',
				verb: 'get'
			},
			description: "returns words adopted by username",
			accepts: {arg: 'username', type: 'string', http: {source: 'query'}, description: "wordHash"},
			returns: {
				arg: 'adoptions',
				type: 'json'

			}
		});

	Adoptedword.remoteMethod(
		'findExpired', {
			http: {
				path: '/findExpired',
				verb: 'get'
			},
			description: "returns adoptions that have expired",
			accepts: {arg: 'date', type: 'date', http: {source: 'query'}, description: "date"},
			returns: {
				arg: 'adoptions',
				type: 'json'

			}
		});

};
