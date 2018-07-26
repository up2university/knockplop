//const debug = require('gulp-debug');
var gulp = require('gulp'),
  sass = require('gulp-sass'),
  pm2 = require('pm2');
  wiredep = require('wiredep').stream,
  concat = require('gulp-concat');

gulp.task('js-process', function(){
  gulp.src('app/js/*.js')
  .pipe(concat('app.js'))
  .pipe(gulp.dest('dist/scripts'));
  return new Promise(function(resolve, reject) {
    console.log("JS Reloaded");
    resolve();
  });
});

gulp.task('html-process', function(){
  gulp.src('app/**/*.html')
  .pipe(gulp.dest('./dist'));
  return new Promise(function(resolve, reject) {
    console.log("HTML Reloaded");
    resolve();
  });
});

gulp.task('css-process', function(){
  gulp.src('app/css/*.css')
  .pipe(concat('all.css'))
  .pipe(gulp.dest('./dist/css'));
  return new Promise(function(resolve, reject) {
    console.log("CSS Reloaded");
    resolve();
  });
});

gulp.task('sass',function(){
  return gulp.src('app/scss/*.scss')
  .pipe(sass())
  .pipe(gulp.dest('app/css'));
  return new Promise(function(resolve, reject) {
    console.log("SASS Reloaded");
    resolve();
  });
});

gulp.task('serve', function () {
    pm2.connect(true,function () {
	pm2.start({
		name	: 'server',
	        script  : 'server/server.js',
	}, function () {
            console.log('pm2 started');
            pm2.streamLogs('all', 0);
        });
    });
});

gulp.task('bower-dependencies', function () {
    gulp.src('./index.html',{ allowEmpty: true })
    .pipe(wiredep({
  directory: './bower_components',
  bowerJson: require('./bower.json'),
    }))
    .pipe(gulp.dest('./dist'));
});

const watchjs = gulp.series('js-process');
gulp.task('watch',function(){
  gulp.watch(['./app/scss/*.scss'], gulp.series('sass'));
  gulp.watch(['./app/js/*.js'], watchjs);
  gulp.watch(['./app/**/*.html'], gulp.series('html-process'));
  gulp.watch(['./app/css/*.css'], gulp.series('css-process'));
});


gulp.task('default',gulp.parallel('watch','sass','js-process','serve','bower-dependencies','html-process'));
