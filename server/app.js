'use strict'

const http = require('http')
const express = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const limax = require('limax')
const morgan = require('morgan')

const uploadDir = path.join(__dirname, '/uploads')

try {
  // try to create the upload directory
  fs.mkdirSync(uploadDir)
} catch (err) {}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: function (req, file, cb) {
      const parts = path.parse(file.originalname)
      const name = limax(parts.name)
      const now = Date.now()
      const ext = parts.ext
      cb(null, `${name}_${now}${ext}`.toLowerCase())
    }
  })
})

const app = express()

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '/views'))

app.use(morgan('dev'))

// setup static routes
app.use('/vendor/ckeditor', express.static('./dist'))
app.use('/vendor/bootstrap', express.static('./node_modules/bootstrap/dist'))
app.use('/vendor/jquery', express.static('./node_modules/jquery/dist'))
app.use('/vendor/kth-style', express.static('./node_modules/kth-style/dist'))
app.use('/uploads', express.static(uploadDir))
app.use(express.static(path.join(__dirname, '/public')))

app.get('/', function (req, res) {
  res.render('index', {
    lang: req.query.l === 'sv' ? 'sv' : 'en'
  })
})

app.post('/upload', upload.single('upload'), function (req, res) {
  res.json({
    url: 'http://localhost:5050/uploads/' + req.file.filename
  })
})

function humanSize (size) {
  var suffix = ['', 'k', 'M', 'G', 'T']
  var i = 0

  while (size > 1000) {
    size = size / 1000
    i = i + 1
  }

  size = Math.round(size * 100) / 100

  return size + ' ' + suffix[i] + 'B'
}

app.get('/browse', function (req, res, next) {
  fs.readdir(uploadDir, function (err, files) {
    if (err) {
      return next(err)
    }

    res.render('browse', {
      layout: null,
      files: files.map(function (filename) {
        return {
          name: filename,
          url: 'http://localhost:5050/uploads/' + filename,
          isImage: /\.(png|gif|jpe?g)$/.test(filename),
          size: humanSize(fs.statSync(path.join(uploadDir, filename)).size)
        }
      })
    })
  })
})

app.post('/delete/:filename', function (req, res, next) {
  fs.unlink(path.join(uploadDir, req.params.filename), function (err) {
    if (err) {
      return res.json({ message: err.message })
    }

    res.json({ ok: true })
  })
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

http.createServer(app).listen(process.env.PORT || 5050)
