const {src, dest, watch, parallel, series} = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const sourcemaps = require('gulp-sourcemaps');
// const avif = require('gulp-avif');
// const webp = require('gulp-webp');
// import webp from 'gulp-webp';
// const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');

function images() {
    return src(['app/images/*.*', '!app/images/*.svg'])
    .pipe(src('app/images/*.*'))
    .pipe(newer('app/images/'))
    // .pipe(imagemin())
    .pipe(dest('app/images/'))
}

function styles() {
    return src('app/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(scss({outputStyle: 'compressed'}).on('error', scss.logError))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer({overrideBrowserslist: ['last 2 version']}))
    .pipe(concat('style.min.css'))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream());
}

function scripts() {
    return src(['app/js/**/*.js', '!app/js/main.min.js'])
    .pipe(concat('main.min.js'))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream());
}

function watching() {
    watch(['app/scss/**/*.scss'], styles)
    watch(['app/images/'], images)
    watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts)
    watch(['app/**/*.html']).on('change', browserSync.reload)
}

function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        }
    });
}

function cleanDist() {
    return src('dist')
    .pipe(clean())
}

function buildCopy() {
    return src([
        'app/css/style.min.css',
        'app/images/*.*',
        'app/js/main.min.js',
        'app/fonts/**/*',
        'app/*.html'
    ], {base: 'app'})
    .pipe(dest('dist'))
}

exports.styles = styles
exports.images = images
exports.scripts = scripts
exports.buildCopy = buildCopy
exports.watching = watching
exports.browsersync = browsersync

exports.build = series(cleanDist, buildCopy)

exports.default = parallel(styles, images, scripts, browsersync, watching)