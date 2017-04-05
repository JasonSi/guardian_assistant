var gulp = require('gulp'),
    concat = require('gulp-concat'),

    // JS
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    buffer = require('vinyl-buffer'),
    source = require('vinyl-source-stream'),

    // SASS
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-minify-css'),

    svg2png = require('gulp-svg2png'),
    del = require('del'),
    watch = require('gulp-watch'),
    rename = require("gulp-rename");


gulp.task('js', function() {
    var bundler = browserify('src/js/main.js');
    bundler.transform(babelify);

    bundler.bundle()
        .on('error', function(err) {
            console.error(err);
        })
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js/'));
})

gulp.task('scss', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(concat('index.css'))
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(minifyCSS())
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('img', function() {
    return gulp.src(['./src/images/*.svg', '!./src/images/icon.svg'])
        .pipe(svg2png())
        .pipe(gulp.dest('./dist/images/'));
});

gulp.task('icon', function() {
    var src = gulp.src('./src/images/icon.svg');
    var sizes = [16, 48, 128];
    for(i of sizes){
        src.pipe(svg2png({height:i, width:i}))
        .pipe(rename({
            suffix: i
        }))
        .pipe(gulp.dest('./dist/images/icons'));
    }
});

gulp.task('manifest', function() {
    return gulp.src('./src/manifest.json')
        .pipe(gulp.dest('./dist/'));
});

gulp.task('clean', function() {
    del.sync(['./dist/**']);
});

gulp.task('bundle', ['js', 'scss', 'img', 'icon', 'manifest']);
gulp.task('rebundle', ['clean', 'bundle']);

gulp.task('default', ['bundle'], function() {
    gulp.watch('./src/js/*.js', ['js']);
    gulp.watch('./src/scss/*.scss', ['scss']);
    gulp.watch('./src/images/*.svg', ['img']);
    gulp.watch('./src/images/icon.svg', ['icon']);
    gulp.watch('./src/manifest.json', ['manifest']);
});

gulp.task('hint', function() {
    return gulp.src('./src/js/*.js')
        .pipe(watch('./src/js/*.js'))
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});
