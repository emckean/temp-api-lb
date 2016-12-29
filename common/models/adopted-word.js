'use strict';

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
				cb(null, word);
			})
		};	


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

};
