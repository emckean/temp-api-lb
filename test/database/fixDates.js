var moment = require('moment');

var testData = require('./testdata.json');


// console.log(testData)


// for ISO Dates
var newData = testData.map(function(word){
   console.log(word.dateAdded)
   word.dateAdded = 'ISODate("'+word.dateAdded+')'
   console.log('date added: ' + word.dateAdded)
   if (word.dateExpires){
   	word.dateExpires = 'ISODate("'+word.dateExpires+'")'
   	console.log('new expiration format: ' + word.dateExpires)
   } else {
   	console.log('date added: ' + word.dateAdded)
      word.dateExpires = 'ISODate("'+word.dateExpires+'")'
   	console.log('date expires: ' + word.dateExpires)
   }
   if (word.dateRenewed){
   	console.log('date renewed: ' + word.dateRenewed)
   	word.dateRenewed = 'ISODate("'+word.dateRenewed+'")'
   	console.log('new format renewed date: ' + word.dateRenewed)
   }
   return (word);
});

//for timestamps
// var newData = testData.map(function(word){
//    console.log(word.dateAdded)
//    var newFormat =moment(word.dateAdded).unix()*1000
//    console.log(newFormat)
//    // word.dateAdded = newFormat;
//    if (word.dateExpires){
//    	console.log('date expires: ' + word.dateExpires)
//    	// var newExpires = moment(word.dateExpires, "ddd, DD MMM YYYY").format()
//    	// word.dateExpires = newExpires;
//    	// console.log('new expiration format: ' + word.dateExpires)
//    } else {
//    	console.log('date added: ' + word.dateAdded)
//    	// word.dateExpires = moment(word.dateAdded).add(1, 'y').format()
//    	// console.log('date expires: ' + word.dateExpires)
//    }
//    if (word.dateRenewed){
//    	console.log('date renewed: ' + word.dateRenewed)
//    	// var newRenewal = moment(word.dateRenewed, "ddd, DD MMM YYYY").format()
//    	// word.dateRenewed = newRenewal;
//    	// console.log('new format renewed date: ' + word.dateRenewed)
//    }
//    return (word);
// });

console.log(JSON.stringify(newData))