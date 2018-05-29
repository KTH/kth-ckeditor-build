'use strict'
const gulp = require('gulp')

gulp.task('ckeditor:moveCssOverrides', function () {
  let sources = [ './node_modules/kth-ckeditor-build/cssOverrides/*' ]
  return gulp.src(sources)
    .pipe(gulp.destination('./public/css/'))
})

gulp.task('ckEditor:moveAssets', [ 'ckEditor:moveEditor', 'ckeditor:moveCssOverrides' ])

gulp.task('ckEditor:moveCustomConfig', function () {
  let sources = [ './node_modules/kth-ckeditor-build/customConfig/customConfig.js' ]
  return gulp.src(sources)
    .pipe(gulp.dest('./public/js/ckeditor/'))
})

gulp.task('ckEditor:movePlugins', function () {
  let sources = [ './node_modules/kth-ckeditor-build/plugins/**/*' ]
  return gulp.src(sources)
    .pipe(gulp.dest('./public/js/ckeditor/plugins/'))
})

gulp.task('ckEditor:moveEditor', [ 'ckEditor:movePlugins', 'ckEditor:moveCustomConfig' ], function () {
  let sources = [ './node_modules/kth-ckeditor-build/ckeditor/**/*' ]
  return gulp.src(sources)
    .pipe(gulp.dest('./public/js/ckeditor/'))
})

/**
 * Generates a gulp task function.
 * @param {Gulp} gulp - a gulp instance (usually via require('gulp'))
 * @param {String} base - the root path for the ckeditor build module, e.g. './node_modules/kth-ckeditor-build'
 * @param {String} destination - the target directory for the output
 * @returns {Function}
 */
function buildTask (gulp, base, destination) {
  return function build () {
    gulp.src(base + '/ckeditor/**/*')
      .pipe(gulp.dest(destination))
    gulp.src(base + '/plugins/**/*', { base: base })
      .pipe(gulp.dest(destination))
    gulp.src([
      base + '/customConfig/*',
      base + '/cssOverrides/*'
    ])
      .pipe(gulp.dest(destination))
  }
}

gulp.task('build', buildTask(gulp, '.', './dist/'))
gulp.task('build:watch', function () {
  return gulp.watch([
    './plugins/**/*',
    './customConfig/*',
    './cssOverrides/*',
    './ckeditor/**/*'
  ], ['build'])
})

module.exports = {
  gulp: gulp,
  buildTask: buildTask
}
