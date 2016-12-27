12/18
-- with nvm it seems that global command-line options are hard to get, so I aliased slc to /Users/emckean/Code/wordnik-api-lb/node_modules/strongloop/bin/slc.js
-- need to update connector: npm WARN deprecated mongodb@2.1.21: Please use 2.2.16 or higher due to a regression in updateOne/Many upsertedId return value

12/27
-- testing: node_modules/.bin/mocha test/test.js
-- CircleCI: setting up mongodb in circle.yml: http://thecodebarbarian.com/setting-up-circle-ci-with-node-js
-- removed ,
    "posttest": "npm run lint && nsp check" from package.json for the moment

-- need example of embedded object property w/model
-- debugging: DEBUG=loopback:connector:mongodb node .

environment-specific config: 
https://loopback.io/doc/en/lb2/Environment-specific-configuration.html