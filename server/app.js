'use strict'

const express = require('express')
const path = require('path')

const app = express()
const rootDir = path.resolve(__dirname, '..')

app.use('/static/ckeditor', express.static(path.join(rootDir, 'ckeditor')))
app.use('/static/ckeditor/plugins', express.static(path.join(rootDir, 'plugins')))
app.use('/static/ckeditor', express.static(path.join(rootDir, 'customConfig')))
app.use('/static/ckeditor', express.static(path.join(rootDir, 'cssOverrides')))

app.use('/vendor/bootstrap', express.static(path.join(rootDir, 'node_modules/bootstrap/dist')))
app.use('/vendor/kth-style', express.static(path.join(rootDir, 'node_modules/kth-style/dist')))
app.use(express.static(path.join(__dirname, '/public')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.post('/upload', (req, res) => {
  // This is a mock implementation of the upload endpoint.
  // In a real application, you would handle the file upload and return the URL of the uploaded file.
  res.json({ uploaded: true, url: '/static/ckeditor/logo.svg' })
})
app.use(
  '/static/ckeditor/logo.svg',
  express.static(path.join(rootDir, 'node_modules/kth-style/dist/img/kth-style/KTH_Logotyp_RGB_2013-2.svg'))
)

const port = process.env.PORT || 5050
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`CKEditor dev server: http://localhost:${port}/`)
})
