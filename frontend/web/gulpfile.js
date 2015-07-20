var gulp = require('gulp'), clean = require('gulp-clean'), include = require('gulp-include'),
  concat = require('gulp-concat'), uglify = require('gulp-uglify'), rename = require('gulp-rename'),
  filesize = require('gulp-filesize'), less = require('gulp-less'), changed = require('gulp-changed'),
  typescript = require("gulp-typescript"), sourcemaps = require("gulp-sourcemaps"),
  plumber = require('gulp-plumber'), haml = require('gulp-ruby-haml'), sass = require('gulp-ruby-sass'),
  minifyCSS = require('gulp-minify-css'), neat = require('node-neat').includePaths,
  tsPath = ['src/ts/**/*.ts'], jsPath = ['src/js/site/*.js'], sassPath = 'src/scss/',
  requirePath = 'src/require/*.js', compilePath = 'build/', cssCompilePath = compilePath + 'css',
  jsCompilePath = compilePath + 'js',
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
/*
gulp.task('js', function() {
  return gulp.src(jsCompilePath)
  .pipe(plumber())
  .pipe(concat('home.un.js'))
  .pipe(gulp.dest('static/scripts'))
  .pipe(filesize())
  .pipe(uglify())
  .pipe(rename('app.min.js'))
  .pipe(gulp.dest('static/scripts'))
  .pipe(filesize())
  .pipe(plumber.stop());
});
*/
gulp.task('require', function() {
  return gulp.src(requirePath)
  .pipe(plumber())
  .pipe(gulp.dest(compilePath+'/js'))
  .pipe(uglify())
  .pipe(gulp.dest('static/scripts'))
  .pipe(plumber.stop());
});

gulp.task('typescript', function() {
  var tsresult = gulp.src(tsPath)
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(typescript({sortOutput: true}));
  return tsresult.js
  .pipe(concat('app.un.js'))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('static/scripts'))
  .pipe(rename('app.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('static/scripts'))
  .pipe(plumber.stop())
  .on('error', function (err) {
    console.error('Error', err.message);
  });
});

gulp.task('watch', function() {
  gulp.watch(tsPath, ['typescript']);
  //gulp.watch(jsPath, ['js']);
  gulp.watch(cssCompilePath, ['css']);
  gulp.watch(sassPath+"*.scss", ['sass']);
  gulp.watch(requirePath, ['require']);
});

//gulp.task('default', ['traceur', 'babel', 'watch']);
//gulp.task('default', ['watch', 'typescript', 'js', 'sass', 'require']);
gulp.task('default', ['watch', 'typescript', 'sass', 'require']);