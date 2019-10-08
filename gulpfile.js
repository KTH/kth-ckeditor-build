'use strict'
const gulp = require('gulp')
const mergeStream = require('merge-stream')

gulp.task('ckeditor:moveCssOverrides', done => {
  return gulp.src(['./node_modules/kth-ckeditor-build/cssOverrides/*']).pipe(gulp.destination('./public/css/'))
})
gulp.task('ckEditor:moveCustomConfig', done => {
  return gulp
    .src(['./node_modules/kth-ckeditor-build/customConfig/customConfig.js'])
    .pipe(gulp.dest('./public/js/ckeditor/'))
})

gulp.task('ckEditor:movePlugins', done => {
  return gulp.src(['./node_modules/kth-ckeditor-build/plugins/**/*']).pipe(gulp.dest('./public/js/ckeditor/plugins/'))
})

gulp.task(
  'ckEditor:moveEditor',
  gulp.series(['ckEditor:movePlugins', 'ckEditor:moveCustomConfig'], done => {
    return gulp.src(['./node_modules/kth-ckeditor-build/ckeditor/**/*']).pipe(gulp.dest('./public/js/ckeditor/'))
  })
)

gulp.task('ckEditor:moveAssets', gulp.series(['ckEditor:moveEditor', 'ckeditor:moveCssOverrides'], done => {}))

/**
 * Generates a gulp task function.
 * @param {Gulp} gulp - a gulp instance (usually via require('gulp'))
 * @param {String} base - the root path for the ckeditor build module, e.g. './node_modules/kth-ckeditor-build'
 * @param {String} destination - the target directory for the output
 * @returns {Function}
 */
// function buildTask(gulp, base, destination) {
//   return () => {
//     gulp.src(base + '/ckeditor/**/*').pipe(gulp.dest(destination))
//     gulp.src(base + '/plugins/**/*', { base: base }).pipe(gulp.dest(destination))
//     gulp.src([base + '/customConfig/*', base + '/cssOverrides/*']).pipe(gulp.dest(destination))
//   }
// }

const taskParams = []

function buildCK(done) {
  const tasks = taskParams.map(app => {
    function buildByApp(done) {
      return mergeStream(
        gulp.src(app.base + '/ckeditor/**/*').pipe(gulp.dest(app.destination)),
        gulp.src(app.base + '/plugins/**/*', { base: app.base }).pipe(gulp.dest(app.destination)),
        gulp.src([app.base + '/customConfig/*', app.base + '/cssOverrides/*']).pipe(gulp.dest(app.destination))
      )
    }

    buildByApp.displayName = `${app.name}_ckbuild`
    return buildByApp
  })

  const ckTask = tasks[0]

  return gulp.series(ckTask, seriesDone => {
    seriesDone()
    done()
  })()
}

function buildTask(gulp, base, destination, name = 'ckEditorBuild') {
  taskParams.push({ name: name, base: base, destination: destination })
  const build = gulp.series(buildCK)
  return build
}

gulp.task('build', done => {
  const base = '.'
  const destination = './dist'
  return (
    gulp.src(base + '/ckeditor/**/*').pipe(gulp.dest(destination)),
    gulp.src(base + '/plugins/**/*', { base: base }).pipe(gulp.dest(destination)),
    gulp.src([base + '/customConfig/*', base + '/cssOverrides/*']).pipe(gulp.dest(destination))
  )
})

gulp.task('build:watch', () => {
  return gulp.watch(
    ['./plugins/**/*', './customConfig/*', './cssOverrides/*', './ckeditor/**/*'],
    gulp.parallel('build')
  )
})

module.exports = {
  gulp: gulp,
  buildTask: buildTask,
}
