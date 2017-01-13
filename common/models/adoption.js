'use strict';
var moment = require('moment');
var validUrl = require('valid-url');
var url = require('url');
// require the app to do native connector
var loopback = require('loopback');
var app = require('../../server/server.js')

// var db = app.dataSources.mLab.database
// console.log('this is the db: '+ db)

function checkURL(adoptionURL, callback){
 	if (validUrl.isWebUri(adoptionURL)) {
 		var parsedUrl = url.parse(adoptionURL);
 		console.log(parsedUrl.hostname)
 		if (parsedUrl.hostname === 'twitter.com' || parsedUrl.hostname === 'www.twitter.com'){
 			callback(null, 'Twitter ok')
 		} else {
 			callback(null, 'adoptlink')
 		}
 	} else {
 		callback(null, 'Twitter ok')
 	}
} 	

// console.log((app.dataSources))
module.exports = function(Adoption) {

	Adoption.observe('before save', function (ctx, next) {
	  if (ctx.isNewInstance) {
	    console.log('document is new')
	    console.log('save(), create(), or upsert() called')
	    console.log('ctx.instance', ctx.instance)
	  } else {
	    console.log('document is updated')
	    if (ctx.instance) {
	      console.log('save() called')
	      console.log('ctx.instance', ctx.instance)
	    } else if (ctx.data && ctx.currentInstance) {
	      console.log('prototype.updateAttributes() called')
	      console.log('ctx.currentInstance', ctx.instance)
	      console.log('ctx.data', ctx.data)
	    } else if (ctx.data) {
	      console.log('updateAll() or upsert() called')
	      console.log('ctx.data', ctx.data)
	    }
	  }

	  next()
	})

	//validations
	// adoption.validatesUniquenessOf('wordHash', {message: 'word is not unique'});


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
			console.log(ISODate)
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

	Adoption.findByCreateDate = function(date, cb){
		var ISODate;
		var ISODateEnd;
		if (moment(date, "YYYY-MM-DD hh:mm:ss A Z").isValid()){
			ISODate = date;
			ISODateEnd = moment(date, "YYYY-MM-DD hh:mm:ss A Z").endOf('day');
		}
		else {
			var err = new Error('Date must be in format DD-MMM-YYYY');
			err.statusCode = 400;
			cb(err)
		}
		Adoption.find({
			where: {
				dateAdded: {"between": [ISODate, ISODateEnd]}
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

	Adoption.remoteMethod(
		'findByCreateDate', {
			http: {
				path: '/findByCreateDate',
				verb: 'get'
			},
			description: "returns adoptions created on date",
			accepts: {arg: 'date', type: 'date', http: {source: 'query'}, description: "date: DD-MMM-YYYY"},
			returns: {
				arg: 'adoptions',
				type: 'json'

			}
		});

};
