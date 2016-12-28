"use strict";
// process.env.NODE_ENV = 'circle';

var app = require('../server/server.js');
var expect = require ('chai').expect;
var supertest = require('supertest');
var api = supertest(app)


describe ('canary test', function (){
	it ('should pass this canary test', function (){
		expect(true).to.be.true;
	});
});

describe ('get all test', function (){

	before(function(done) {
	    // runs before all tests in this block
	   if (process.env.NODE_ENV = 'development'){
			var setupLocal = require ('./database/setupLocalMongo.js');
			setupLocal.setUp(function(err, response){
				done();
			})
		}
	});

	after(function(done) {
	   if (process.env.NODE_ENV = 'development'){
			var teardownLocal = require ('./database/teardownLocalMongo.js');
			teardownLocal.tearDown(function(err, response){
				done();
			})
		}
		
	});

 it('returns an adopted word', function(done) {
    api.get('/api/adoptedWords/')
    .expect(200, done)
    .expect(function (res) {
    	console.log(res.body)
        expect(res.body[0].word).to.equal('empiricism')});
  });

});