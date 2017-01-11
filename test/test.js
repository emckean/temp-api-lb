"use strict";
if (process.env.NODE_ENV === undefined){
	console.log(process.env.NODE_ENV)
	process.env.NODE_ENV = 'development'
}

var app = require('../server/server.js');
var expect = require ('chai').expect;
var supertest = require('supertest');
var api = supertest(app)



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
			})
		}

	   if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'circle'){
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
				} else {
				var setupBluemix = require ('./database/setupBluemixMongo.js');
				setupBluemix.setUp(function(err, response){
					if (err){
						console.log(err)
					}
					done();
				})
				}
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
    	console.log(res.body)
    	expect(Object.keys(res.body).length).to.equal(1);
    	done();
    })   
  });

  it('returns a adopted words by wordnikUserName', function(done) {
    api.get('/api/adoptions/getAllByUserName?username=fakeymcfakeypants')
    .end(function (err, res){
    	if (err) throw err;
    	console.log(res.body)
    	expect(res.body.adoptions.length).to.equal(6);
    	done();
    })   
  });

});