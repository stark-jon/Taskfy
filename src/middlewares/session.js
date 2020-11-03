const router = require('express').Router()
const session = require('express-session')
const { nanoid } = require("nanoid")
const MongoDBStore = require('connect-mongodb-session')(session)
require('dotenv').config()

const {
    SESS_LIFETIME = 1000 * 60 * 60 * 24 * 14
} = process.env

const storeDB = new MongoDBStore({
    uri: process.env.MONGO_URI,
    databaseName: process.env.SESSION_DB,
    collection: process.env.SESSION_COLLECTION,
    connectionOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000
      }
}, (error) => {
    if(error){
        console.log(error)
    }
})
const IN_PROD = process.env.NODE_ENV === 'production'
router.use(session({
    secret: process.env.SESS_SECRET,
    saveUninitialized: true,
    resave: false,
    store: storeDB,
    cookie: {
        maxAge: SESS_LIFETIME,
        sameSite: true,
        secure: IN_PROD,
        path: '/'
    }
}))


module.exports = router