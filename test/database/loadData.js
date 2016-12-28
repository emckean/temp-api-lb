use adoptedWords

var adoption = {
    "fullName": "Testy McTesterson",
    "email": "michaeldayreads@alphaorder.com",
    "word": "empiricism",
    "wordHash": "5857087ff36d2873dac58e77",
    "status": "active",
    "dateAdded": "Sun Dec 18 2016 15:43:37 GMT+0000 (UTC)",
    "note": "",
    "Twitter": "",
    "type": "paid",
    "earlyAdopter": "",
    "paidStatus": "paid",
    "promoCode": "",
    "offensive": "FALSE",
    "giftee": "",
    "gifteeEmail": "",
    "gifteeNote": "",
    "gifteeTwitter": "",
    "gifteeLink": "",
    "WordnikUsername": "",
    "backerType": "ADOPTER",
    "adoptLink": "",
    "renewal": "false",
    "dateExpires": "Mon 19 Dec 2017 06:46:45 GMT",
    "payment": [
      {
        "date": "Sun Dec 18 2016 15:43:37 GMT+0000 (UTC)",
        "type": "Stripe",
        "amount": "25.00"
      }
    ],
    "paypal-url": ""
  }

db.adoptedWords.insert(adoption);
