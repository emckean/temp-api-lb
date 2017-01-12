'use strict';
var moment = require('moment');
// require the app to do native connector
var loopback = require('loopback');
var app = require('../../server/server.js')

// var db = app.dataSources.mLab.database
// console.log('this is the db: '+ db)

// console.log((app.dataSources))
module.exports = function(Adoption) {


	Adoption.findByHash = function(wordHash, cb){
		Adoption.findOne({
			where: {
				wordHash: wordHash
            }}, function (err, word){
				cb(null, word);
			})
		};

	Adoption.getAllByUserName = function(userName, cb){
		Adoption.find({
			where: {
				wordnikUsername: userName
            }}, function (err, words){
				cb(null, words);
			})
		};	

	Adoption.findExpired = function(date, cb){
		var ISODate;
		if (moment(date, "DD-MMM-YYYY").isValid()){
			ISODate = moment(date, "DD-MMM-YYYY").format();
		}
		else {
			var err = new Error('Date must be in format DD-MMM-YYYY');
			err.statusCode = 400;
			cb(err)
		}
		Adoption.find({
			where: {
				dateExpires: {lte: ISODate}
            }}, function (err, words){
				cb(null, words);
			})

		};	


//remote methods setup
	Adoption.remoteMethod(
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

	Adoption.remoteMethod(
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

	Adoption.remoteMethod(
		'findExpired', {
			http: {
				path: '/findExpired',
				verb: 'get'
			},
			description: "returns adoptions that have expired",
			accepts: {arg: 'date', type: 'date', http: {source: 'query'}, description: "date: DD-MMM-YYYY"},
			returns: {
				arg: 'adoptions',
				type: 'json'

			}
		});

};
