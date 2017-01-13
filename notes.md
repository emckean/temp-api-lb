1/12
updated tests
added findByCreateDate
Bluemix deploy still failing

check Twitter validation

mongo aggregations: https://github.com/strongloop/loopback/issues/890

1/11
cf logs lb-mongo-test-app to get logs
figured out date issue, it was ISODate()
had to do some Mongo hijinks to get the date saved correctly
next step: update testsetup for Bluemix

1/9
CI testing working, CI Deploy stuck in staging

1/3
maybe IDs need to be ObjectID because wordHash is too long? 
https://github.com/strongloop/loopback-connector-mongodb/issues/52
http://stackoverflow.com/questions/21867199/loopback-mongodb-connector-modification-to-support-slug-ids

really hard time trying to do a native query with mongodb

http://stackoverflow.com/questions/28346169/how-do-i-get-the-mongodb-connection-from-inside-loopback-io
https://groups.google.com/forum/#!topic/loopbackjs/NvmQPkRldIw

https://groups.google.com/forum/#!topic/loopbackjs/wkJBgzusmw0

this bit worked: https://github.com/strongloop/loopback/issues/576

`app.dataSources.mLab.connect(function(err,db){ except err, db undefined)`

12/28
-- connecting to ssh: ssh -i emckeanNIK_rsa -p PORT ubuntu@IP
-- removed mongo url from circle
-- changed to url in config
-- info about deploying to BlueMix: https://circleci.com/docs/deploy-bluemix/
-- mongo on BMDevOps: https://www.ng.bluemix.net/docs/services/MongoDB/index.html
-- created testdata.json file (/test/database)
run mongo locally before running tests: mongod --config /usr/local/etc/mongod.conf
added setup and teardown for mongo in test.js

12/27
-- testing: node_modules/.bin/mocha test/test.js
-- CircleCI: setting up mongodb in circle.yml: http://thecodebarbarian.com/setting-up-circle-ci-with-node-js
-- removed ,
    "posttest": "npm run lint && nsp check" from package.json for the moment
-- adding data to mongodb w/mongo shell: http://www.mwtestconsultancy.co.uk/unexpected-automation-quickly-creating-test-data-in-mongodb/
-- running supertest
-- adding mongo to CircleCI, adding data, running tests
-- added mongo url to CircleCI env variables (this was probably a mistake)
NEXT STEPS: ssh into circle, run app w/debug and check connectors
?? maybe change to local url instead of port? 


12/18
-- with nvm it seems that global command-line options are hard to get, so I aliased slc to /Users/emckean/Code/wordnik-api-lb/node_modules/strongloop/bin/slc.js
-- need to update connector: npm WARN deprecated mongodb@2.1.21: Please use 2.2.16 or higher due to a regression in updateOne/Many upsertedId return value




Load-testing resources:
http://loader.io/
nice blog post from 3Scale: https://www.3scale.net/2015/04/how-to-load-test-and-tune-performance-on-your-api-part-i/
part II: https://www.3scale.net/2015/05/how-to-load-test-and-tune-performance-on-your-api-part-ii/
https://artillery.io/faq.html
dino (uses AWS Lambda: http://veldstra.org/2016/02/18/project-dino-load-testing-on-lambda-with-artillery.html)

mongo + Cloudant: https://developer.ibm.com/integration/blog/2016/09/13/using-some-of-the-more-advanced-features-of-the-loopbackrequest-node/

-- need example of embedded object property w/model
-- debugging: DEBUG=loopback:connector:mongodb node .

environment-specific config: 
https://loopback.io/doc/en/lb2/Environment-specific-configuration.html