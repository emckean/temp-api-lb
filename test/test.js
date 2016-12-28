"use strict";

var expect = require ('chai').expect;
var supertest = require('supertest');
var api = supertest('http://localhost:3000/api')


describe ('canary test', function (){
	it ('should pass this canary test', function (){
		expect(true).to.be.true;
	});
});

describe ('get all test', function (){

 it('returns an adopted word', function(done) {
    api.get('/adoptedWords')
    .expect(200, done);
  });

});