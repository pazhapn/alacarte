/**
 * Created by pazha on 3/22/2015.
 */
var gulp = require('gulp'),
  clean = require('gulp-clean'),
  include = require('gulp-include'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  filesize = require('gulp-filesize'),
  less = require('gulp-less'),
  changed = require('gulp-changed'),
  typescript = require("gulp-typescript"),
  sourcemaps = require("gulp-sourcemaps"),
  plumber = require('gulp-plumber'),
  haml = require('gulp-ruby-haml'),
  sass = require('gulp-ruby-sass'),
  minifyCSS = require('gulp-minify-css'),
  neat = require('node-neat').includePaths,
  //reactTemplates = require("gulp-react-templates"),
  //babel = require('gulp-babel'),
  //traceur = require('gulp-traceur'),
  //es6Path = 'es6/*.js',
  //rtPath = 'src/rt/**/*.rt',
  tsPath = ['ts/*.ts'],
  jsPath = ['js/site/*.js'],
  sassPath = 'src/scss/',
  requirePath = 'src/require/*.js',
  compilePath = 'build/',
  cssPath = compilePath + 'css',
  delFiles = [compilePath, 'static/scripts/*.min.js', compilePath+'css'];

gulp.task('clean', function() {
  return gulp.src(delFiles, {
      read: false
    })
    .pipe(clean());
});
gulp.task('sass', function() {
    return sass(sassPath, { style: 'expanded', sourcemap: true})
        .pipe(sourcemaps.write('maps', {
        includeContent: false,
        sourceRoot: '/src/scss'
    }))
        .pipe(gulp.dest('static/css'))
        .on('error', function (err) {
          console.error('Error', err.message);
        });
});
gulp.task('js', function() {
  return gulp.src(jsPath)
  .pipe(plumber())
  .pipe(concat('app.un.js'))
  .pipe(gulp.dest('static/scripts'))
  .pipe(filesize())
  .pipe(uglify())
  .pipe(rename('app.min.js'))
  .pipe(gulp.dest('static/scripts'))
  .pipe(filesize())
  .pipe(plumber.stop());
});
gulp.task('require', function() {
  return gulp.src(requirePath)
  .pipe(plumber())
  .pipe(gulp.dest(compilePath+'/js'))
  .pipe(uglify())
  .pipe(gulp.dest('static/scripts'))
  .pipe(plumber.stop());
});
gulp.task('typescript', function() {
  gulp.src(tsPath)
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(typescript())
  .pipe(concat('home.un.js'))
  .pipe(gulp.dest('static/scripts'))
  .pipe(plumber.stop())
  .on('error', function (err) {
    console.error('Error', err.message);
  });
});

gulp.task('watch', function() {
  //gulp.watch([es6Path], ['traceur', 'babel']);
  gulp.watch(tsPath, ['typescript']);
  gulp.watch(jsPath, ['js']);
  gulp.watch(cssPath, ['css']);
  gulp.watch(sassPath+"*.scss", ['sass']);
  gulp.watch(requirePath, ['require']);
});

//gulp.task('default', ['traceur', 'babel', 'watch']);
gulp.task('default', ['watch', 'typescript', 'js', 'sass', 'require']);


/*
gulp.task('traceur', function () {
  gulp.src([es6Path])
      .pipe(plumber())
      .pipe(traceur({ blockBinding: true }))
      .pipe(gulp.dest(compilePath + '/traceur'));
});
gulp.task('babel', function () {
gulp.src([es6Path])
.pipe(sourcemaps.init())
.pipe(plumber())
.pipe(babel())
.pipe(sourcemaps.write("."))
.pipe(gulp.dest(compilePath + '/babel'));
});
gulp.task('reactTemplates', function() {
  gulp.src(rtPath)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(reactTemplates())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(compilePath + 'rt'));
});

gulp.task('sass', function() {
  return gulp.src(sassPath)
    .pipe(sass())
    .pipe(gulp.dest(compilePath+'css'))
    .on('error', function (err) {
      console.error('Error', err.message);
    });
});
gulp.task('css', function() {
    return gulp.src(cssPath)
    .pipe(plumber())
    .pipe(concat('application.css'))
    .pipe(gulp.dest(compilePath+'/css'))
    .pipe(filesize())
    .pipe(uglify())
    .pipe(rename('app.min.css'))
    .pipe(gulp.dest('static/css'))
    .pipe(filesize())
    .pipe(plumber.stop())
    .on('error', function (err) {
      console.error('Error', err.message);
    });
});

*/
