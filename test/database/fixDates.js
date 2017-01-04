var moment = require('moment');

var testData = require('./testdata.json');


// console.log(testData)



var newData = testData.map(function(word){
   // console.log(word.dateAdded)
   var newFormat = moment(word.dateAdded, "ddd MMM DD YYYY").format()
   // console.log(newFormat)
   word.dateAdded = newFormat;
   if (word.dateExpires){
   	console.log('date expires: ' + word.dateExpires)
   	var newExpires = moment(word.dateExpires, "ddd, DD MMM YYYY").format()
   	word.dateExpires = newExpires;
   	console.log('new expiration format: ' + word.dateExpires)
   } else {
   	console.log('date added: ' + word.dateAdded)
   	word.dateExpires = moment(word.dateAdded).add(1, 'y').format()
   	console.log('date expires: ' + word.dateExpires)
   }
   if (word.dateRenewed){
   	console.log('date renewed: ' + word.dateRenewed)
   	var newRenewal = moment(word.dateRenewed, "ddd, DD MMM YYYY").format()
   	word.dateRenewed = newRenewal;
   	console.log('new format renewed date: ' + word.dateRenewed)
   }
   return (word);
});

console.log(JSON.stringify(newData))