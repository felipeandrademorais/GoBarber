const express = require('express')
const nunjucks = require('nunjucks')
const path = require('path')
const session = require('express-session')
// const FileStore = require('session-file-store')(session)
const flash = require('connect-flash')
const LokiStore = require('connect-loki')(session)

class App {
  constructor () {
    this.express = express()
    this.isDev = process.env.NODE_ENV !== 'production'

    this.middlewares()
    this.views()
    this.routes()
  }

  middlewares () {
    this.express.use(express.urlencoded({ extended: false }))
    this.express.use(flash())
    this.express.use(
      session({
        name: 'root',
        secret: 'MyAppSecret',
        resave: false,
        /* store: new FileStore({
          path: path.resolve(__dirname, '..', 'tmp', 'sessions')
        }) */
        store: new LokiStore({
          path: path.resolve(
            __dirname,
            '..',
            'tmp',
            'sessions',
            'session-store.db'
          )
        }),
        saveUninitialized: true
      })
    )
  }

  views () {
    nunjucks.configure(path.resolve(__dirname, 'app', 'views'), {
      watch: this.isDev,
      express: this.express,
      autoscape: true
    })

    this.express.use(express.static(path.resolve(__dirname, 'public')))
    this.express.set('view engine', 'njk')
  }

  routes () {
    this.express.use(require('./routes'))
  }
}

module.exports = new App().express
