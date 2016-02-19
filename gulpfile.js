var source     = require("vinyl-source-stream")
var buffer     = require('vinyl-buffer');
var chalk      = require("chalk")
var gulp       = require("gulp")
var gutil      = require("gulp-util")
var rename     = require("gulp-rename")
var sourcemaps = require("gulp-sourcemaps")
var browserify = require("browserify")
var watchify   = require("watchify")
var uglify     = require("gulp-uglify")
var webserver  = require('gulp-webserver');

function map_error(err) {
  if (err.fileName) {
    // regular error
    return gutil.log(chalk.red(err.name)
      + ": "
      + chalk.yellow(err.fileName.replace(__dirname + "/src/", ""))
      + ": "
      + "Line "
      + chalk.magenta(err.lineNumber)
      + " & "
      + "Column "
      + chalk.magenta(err.columnNumber || err.column)
      + ": "
      + chalk.blue(err.description))
  } else {
    // browserify error..
    return gutil.log(chalk.red(err.name)
      + ": "
      + chalk.yellow(err.message))
  }
}

function bundle(bundler) {
  return bundler.bundle()
    .on("error", map_error)

    .pipe(source("mvvm.js"))
    .pipe(buffer())
    .pipe(gulp.dest("./dist"))
    .pipe(rename("mvvm.min.js"))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify().on("error", map_error))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./dist"))
}

gulp.task('build', function () {
  bundle(browserify('./src/mvvm.js', { extensions: ['.js'], debug: true }))
})

gulp.task("watch", function() {
  var bundler = watchify(browserify("./src/mvvm.js"))
  bundle(bundler);
  bundler.on("update", function () { bundle(bundler) })
  bundler.on("log", function (msg) { gutil.log("watchify:", msg) })
})

gulp.task("default", ["build", "watch"])
