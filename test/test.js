"use strict";
// process.env.NODE_ENV = 'circle';

var app = require('../server/server.js');
var expect = require ('chai').expect;
var supertest = require('supertest');
var api = supertest(app)

//cloudFoundry setup
var cfenv = require('cfenv');
var appenv = cfenv.getAppEnv();
// Within the application environment (appenv) there's a services object
var services = appenv.services;
// The services object is a map named by service so we extract the one for rabbitmq
var mongodb_services = services["compose-for-mongodb"];

// This check ensures there is a services for MongoDb databases
assert(!util.isUndefined(mongodb_services), "Must be bound to compose-for-rabbitmq services");

// We now take the first bound RabbitMQ service and extract its credentials object
var credentials = mongodb_services[0].credentials;

// Within the credentials, an entry ca_certificate_base64 contains the SSL pinning key
// We convert that from a string into a Buffer entry in an array which we use when
// connecting.
var caCert = new Buffer(credentials.ca_certificate_base64, 'base64');



describe ('canary test', function (){
	it ('should pass this canary test', function (){
		expect(true).to.be.true;
	});
});

describe ('get all test', function (){

	before(function(done) {
	    // runs before all tests in this block

	    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'Bluemix-test'){
			var teardownLocal = require ('./database/teardownLocalMongo.js');
			teardownLocal.tearDown(function(err, response){
				done();
			})
		}

	   if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'development'){
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