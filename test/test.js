"use strict";
if (process.env.NODE_ENV === undefined){
	console.log(process.env.NODE_ENV)
	process.env.NODE_ENV = 'development'
}
var rewire = require('rewire');
var app = require('../server/server.js');
var expect = require ('chai').expect;
var supertest = require('supertest');
var api = supertest(app)

var adoptFunctions = rewire('../common/models/adoption.js');
console.log(adoptFunctions)
var checkURL = adoptFunctions.__get__('checkURL'); 

if (process.env.NODE_ENV === 'development') {
	process.env.MONGODB_CONNECTION_URL = 'mongodb://localhost:27017/test';
}

if (process.env.NODE_ENV === 'Bluemix-test') {
	console.log(process.env.MONGODB_CONNECTION_URL)
}

describe ('canary test', function (){
	it ('should pass this canary test', function (){
		expect(true).to.be.true;
	});
});

describe ('API tests', function (){

	before(function(done) {
	    // runs before all tests in this block

	    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'circle'){
	    	console.log('got here')
			var teardownLocal = require ('./database/teardownLocalMongo.js');
			teardownLocal.tearDown(function(err, response){
				if (err){
					console.log(err)
				}
			})
			var setupLocal = require ('./database/setupLocalMongo.js');
			setupLocal.setUp(function(err, response){
				done();
			})
		}


		if (process.env.NODE_ENV === 'Bluemix-test'){
	    	console.log('got here')
			var teardownBluemix = require ('./database/teardownBluemixMongo.js');
			teardownBluemix.tearDown(function(err, response){
				if (err){
					console.log(err)
				} 
				var setupBluemix = require ('./database/setupBluemixMongo.js');
				setupBluemix.setUp(function(err, response){
					if (err){
						console.log(err)
					}
					done();
				})
			})

		}

	});


 it('returns all the adopted word', function(done) {
    api.get('/api/adoptions/')
    .end(function (err, res){
    	expect(Object.keys(res.body).length).to.equal(10);
    	done();
    })
  });

  it('returns an adopted word by wordHash', function(done) {
    api.get('/api/adoptions/findByHash?wordHash=4b7489207cc9382e0a55c3791a1a3cfc5ae684bb')
    .end(function (err, res){
    	if (err) throw err;
    	expect(Object.keys(res.body).length).to.equal(1);
    	done();
    })   
  });

  it('returns adopted words that have expired', function(done) {
    api.get('/api/adoptions/findExpired?date=01-Jan-2015')
    .end(function (err, res){
    	if (err) throw err;
    	expect(res.body.adoptions[0].word).to.equal('testwordtwo');
    	done();
    })   
  });


 it('returns an error for a bad date in findExpired', function(done) {
    api.get('/api/adoptions/findExpired?date=turnip')
    .end(function (err, res){
    	// console.log(res.body)
    	// console.log(res)
    	expect(res.body.error.message).to.equal('Date must be in format DD-MMM-YYYY');
    	expect(res.body.error.statusCode).to.equal(400);
    	
    	done();
    })   
  });

  it('returns adopted words by wordnikUserName', function(done) {
    api.get('/api/adoptions/getAllByUserName?username=fakeymcfakeypants')
    .end(function (err, res){
    	if (err) throw err;
    	// console.log(res.body)
    	expect(res.body.adoptions.length).to.equal(6);
    	done();
    })   
  });

  it('returns adopted words by date created', function(done) {
    api.get('/api/adoptions/findByCreateDate?date=01-Jan-2014')
    .end(function (err, res){
    	if (err) throw err;
    	// console.log(res.body)
    	expect(res.body.adoptions[0].word).to.equal('testwordsix');
    	done();
    })   
  });

  it('returns an error for a bad date in findByCreateDate', function(done) {
    api.get('/api/adoptions/findByCreateDate?date=turnip')
    .end(function (err, res){
    	// console.log(res.body)
    	// console.log(res)
    	expect(res.body.error.message).to.equal('Date must be in format DD-MMM-YYYY');
    	expect(res.body.error.statusCode).to.equal(400);
    	
    	done();
    })   
  });

});

describe ('helper function tests', function (){

	it('adoption.checkURL: should return ok if link is Twitter link', function(done){

		var testLink = 'https://www.twitter.com/emckean'
		checkURL(testLink, function(err, res){
			expect(res).to.equal('Twitter ok')
		});
		done();
	});

	it('adoption.checkURL: should return ok if link is Twitter name', function(done){

		var testLink = '@emckean'
		checkURL(testLink, function(err, res){
			expect(res).to.equal('Twitter ok')
		});
		done();
	});

	it('adoption.checkURL: should return adoptlink if link is other URL', function(done){

		var testLink = 'https://www.google.com'
		checkURL(testLink, function(err, res){
			expect(res).to.equal('adoptlink')
		});
		done();
	});

});