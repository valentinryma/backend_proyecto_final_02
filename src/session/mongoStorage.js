const MongoStore = require('connect-mongo')
const session = require('express-session')
const defaultOptions = require(`${__dirname}/defaultOptions.js`);

const { dbName, mongoUrl } = require(`${__dirname}/../dbConfig`);

const storage = MongoStore.create({
    dbName,
    mongoUrl,
    // ttl: 60
})

module.exports = session({
    store: storage,
    ...defaultOptions
})