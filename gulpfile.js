var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    del = require('del'),
    svg2png = require('gulp-svg2png'),
    stylish = require('jshint-stylish'),
    watch = require('gulp-watch');

gulp.task('js', function() {
    return gulp.src('./src/js/*.js')
      .pipe(babel({presets: ['es2015']}))
      .pipe(uglify())
      .pipe(gulp.dest('./dist/js/'));
});
gulp.task('scss', function() {
    return gulp.src('./src/scss/*.scss')
    .pipe(concat('index.css'))
    .pipe(sass())
    .pipe(gulp.dest('./dist/css/'));
});
gulp.task('img', function() {
    return gulp.src('./src/images/*.svg')
    .pipe(svg2png())
    .pipe(gulp.dest('./dist/images/'));
});
gulp.task('manifest', function() {
    return gulp.src('./src/manifest.json')
    .pipe(gulp.dest('./dist/'));
});

gulp.task('clean', function() {
    del.sync(['./dist/**']);
});

gulp.task('bundle', ['js', 'scss', 'img', 'manifest']);
gulp.task('rebundle', ['clean', 'bundle']);

gulp.task('default', ['bundle'], function() {
    gulp.watch('./src/**', ['bundle']);
});

gulp.task('hint', function(){
  return gulp.src('./src/js/*.js')
    .pipe(watch('./src/js/*.js'))
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});
