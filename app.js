const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('express-flash') // lets us render messages without refreshing page
const connectDB = require('./config/db')

const mainRoutes = require('./routes/main')
const clientRoutes = require('./routes/clients')

// LOAD CONFIG
dotenv.config({path: './config/.env'})

//LOAD PASSPORT
require('./config/passport.js')(passport)

connectDB()

const app = express()

//BODY PARSER
app.use(express.urlencoded({ extended: false}))
app.use(express.json())

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
)

//DETERMINE LEVEL OF LOGGING
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//HELPERS
const { formatDate, mailChecks, lastChecked, checkedToday, checkSafety, checkStatus, stripTags, truncate, editIcon, select } = require('./helpers/hbs')

//Handlebars
app.engine(
    '.hbs', 
    exphbs.engine({
        helpers: {
            formatDate,
            mailChecks,
            lastChecked,
            checkedToday,
            checkSafety,
            checkStatus,
            stripTags,
            truncate,
            editIcon,
            select
        },
        defaultLayout: 'default',
        extname: '.hbs'
    })
);
app.set('view engine', '.hbs');

// SESSIONS
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.DB_STRING
      })
    })
  )
  

// PASSPORT MIDDLEWARE
app.use(passport.initialize())
app.use(passport.session())

//SET GLOBAL VARIABLE
app.use(function(req, res, next){
    res.locals.user = req.user || null
    next()
})

//STATIC FOLDER
app.use(express.static(path.join(__dirname, 'public')))

app.use(flash())

//ROUTES
app.use('/', mainRoutes)
app.use('/clients', clientRoutes)

const PORT = process.env.PORT || 8888

app.listen(
    PORT, 
    console.log(`Server running on ${process.env.NODE_ENV} mode on PORT ${PORT}`)
    )