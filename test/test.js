"use strict";
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

 it('returns an adopted word', function(done) {
    api.get('/api/adoptedWords/')
    .expect(200, done)
    .expect(function (res) {
      expect(res.body[0].word).to.equal('empiricism')});
  });

});