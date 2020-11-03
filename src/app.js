const express = require('express')
require('./db/mongo')
const bodyParser = require('body-parser')
const cors = require("cors")
const helmet = require('helmet')
const path = require('path')
const hbs = require('hbs')
const { error } = require('./controllers/error.controller')
const { _404_ } = require('./controllers/404.controller')

const app = express()

app.set('trust proxy', true)
app.use(cors())
app.use(helmet())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '../templates/views'))
hbs.registerPartials(path.join(__dirname, '../templates/partials'))
app.use(express.static(path.join(__dirname, '../public')))
app.get('/',(req,res,next)=> {
    res.render('index', {
        title: 'The TaskAPP',
        heading: 'Welcome to The Task app',
        description: 'Makes your life easier by not remembering your TODO tasks!',
        links: [{url:'/',name:'home'}, {url:'/login',name:'login'}, {url:'/signup',name:'signup'}]
    })
})

app.get('/signup', (req, res, next)=> {
    res.render('userSignup', {
        title: 'The TaskAPP',
        links: [{url:'/',name:'home'}, {url:'/login',name:'login'}, {url:'/signup',name:'signup'}]
    })
})
app.get('/login', (req, res, next)=> {
    res.render('userLogin', {
        title: 'The TaskAPP',
        links: [{url:'/',name:'home'}, {url:'/login',name:'login'}, {url:'/signup',name:'signup'}]
    })
})
app.use('/users', require('./routers/user'))
app.use('/tasks', require('./routers/task'))
app.use(error)
app.all('*', _404_)

module.exports = app