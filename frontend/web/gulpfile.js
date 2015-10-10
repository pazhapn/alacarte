var gulp = require('gulp'), clean = require('gulp-clean'), include = require('gulp-include'),
  concat = require('gulp-concat'), uglify = require('gulp-uglify'), rename = require('gulp-rename'),
  filesize = require('gulp-filesize'), less = require('gulp-less'), changed = require('gulp-changed'),
  typescript = require("gulp-typescript"), sourcemaps = require("gulp-sourcemaps"),
  plumber = require('gulp-plumber'), haml = require('gulp-ruby-haml'), sass = require('gulp-sass'),
  minifyCSS = require('gulp-minify-css'), neat = require('node-neat').includePaths,
  tsPath = ['src/ts/**/*.ts'], jsPath = ['src/js/site/*.js'], sassPath = 'src/scss/',
  requirePath = 'src/require/*.js', compilePath = 'build/', cssCompilePath = compilePath + 'css',
  jsCompilePath = compilePath + 'js', connect = require('gulp-connect'),
  delFiles = [compilePath, 'static/scripts/*.min.js', compilePath+'css'];

gulp.task('clean', function() {
  return gulp.src(delFiles, {
      read: false
    })
    .pipe(clean());
});
gulp.task('sass', function() {
  return gulp.src('src/sass/**/*.scss')
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(concat('app.un.css'))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('static/css'))
  .pipe(rename('app.min.css'))
  .pipe(uglify())
  .pipe(gulp.dest('static/css'))
  .pipe(plumber.stop())
  .pipe(connect.reload())
  .on('error', function (err) {
    console.error('Error', err.message);
  });
});
/*
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
  .pipe(connect.reload())
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

gulp.task('webserver', function() {
  connect.server({
    livereload: true,
    port: 8080
  });
});

//gulp.task('default', ['traceur', 'babel', 'watch']);
//gulp.task('default', ['watch', 'typescript', 'js', 'sass', 'require']);
gulp.task('default', ['watch', 'typescript', 'sass', 'require','webserver']);