'use strict'

const fs = require('fs')
const path = require('path')

const rootDir = path.resolve(__dirname, '..')
const distDir = path.join(rootDir, 'dist')

function copyDir(sourceRelativePath, destinationRelativePath) {
  const source = path.join(rootDir, sourceRelativePath)
  const destination = path.join(distDir, destinationRelativePath)

  if (!fs.existsSync(source)) {
    return
  }

  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.cpSync(source, destination, { recursive: true, force: true })
}

function copyFile(sourceRelativePath, destinationRelativePath) {
  const source = path.join(rootDir, sourceRelativePath)
  const destination = path.join(distDir, destinationRelativePath)

  if (!fs.existsSync(source)) {
    return
  }

  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.copyFileSync(source, destination)
}

copyDir('ckeditor', 'ckeditor')
copyDir('plugins', 'plugins')
copyFile('customConfig/customConfig.js', 'customConfig.js')

const cssOverrideDir = path.join(rootDir, 'cssOverrides')
if (fs.existsSync(cssOverrideDir)) {
  const cssFiles = fs.readdirSync(cssOverrideDir)
  cssFiles.forEach(fileName => {
    copyFile(path.join('cssOverrides', fileName), fileName)
  })
}
