"use strict";
if (process.env.NODE_ENV === undefined){
	console.log(process.env.NODE_ENV)
	process.env.NODE_ENV = 'development'
}

var app = require('../server/server.js');
var expect = require ('chai').expect;
var supertest = require('supertest');
var api = supertest(app)

//cloudFoundry local setup
if (process.env.NODE_ENV === 'development') {
	var util = require('util')
	var cfenv = require('cfenv');

	//from a local git-ignored copy of services 
	var localVCAP = null
	localVCAP = require("../local-vcap.json")
	var appEnv = cfenv.getAppEnv({vcap: localVCAP})

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

}

if (process.env.NODE_ENV === 'Bluemix-test') {
	console.log(process.env.MONGODB_CONNECTION_URL)
}

describe ('canary test', function (){
	it ('should pass this canary test', function (){
		expect(true).to.be.true;
	});
});

describe ('get all test', function (){

	before(function(done) {
	    // runs before all tests in this block

	    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'Bluemix-test'){
	    	console.log('got here')
			var teardownLocal = require ('./database/teardownLocalMongo.js');
			teardownLocal.tearDown(function(err, response){
			})
		}

	   if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'Bluemix-test'){
			var setupLocal = require ('./database/setupLocalMongo.js');
			setupLocal.setUp(function(err, response){
				done();
			})
		}
	});

	// after(function(done) {
	 //   if (process.env.NODE_ENV = 'development'){
		// 	var teardownLocal = require ('./database/teardownLocalMongo.js');
		// 	teardownLocal.tearDown(function(err, response){
		// 		done();
		// 	})
		// }
		
	// });

 it('returns all the adopted word', function(done) {
    api.get('/api/adoptedWords/')
    .end(function (err, res){
    	expect(Object.keys(res.body).length).to.equal(10);
    	done();
    })
  });

  it('returns an adopted word by wordHash', function(done) {
    api.get('/api/adoptedWords/findByHash?wordHash=4b7489207cc9382e0a55c3791a1a3cfc5ae684bb')
    .end(function (err, res){
    	if (err) throw err;
    	console.log(res.body)
    	expect(Object.keys(res.body).length).to.equal(1);
    	done();
    })   
  });

  it('returns a adopted words by wordnikUserName', function(done) {
    api.get('/api/adoptedWords/getAllByUserName?username=fakeymcfakeypants')
    .end(function (err, res){
    	if (err) throw err;
    	console.log(res.body)
    	expect(res.body.adoptions.length).to.equal(6);
    	done();
    })   
  });

});