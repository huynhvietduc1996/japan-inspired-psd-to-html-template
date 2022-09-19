'use strict';

const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

// Sass Task
function scssTask() {
    return src('assets/scss/style.scss', { sourcemaps: true, allowEmpty: true })
        .pipe(sass())
        .pipe(postcss([cssnano()]))
        .pipe(dest('public/css', { sourcemaps: '.' }));
}

// Javascript Task
function jsTask() {
    return src('assets/js/script.js', { sourcemaps: true, allowEmpty: true })
        .pipe(terser())
        .pipe(dest('public/js', { sourcemaps: '.' }));
}

// Browsersync Task
function browsersyncServe(cb) {
    browsersync.init({
        server: {
            baseDir: '.'
        }
    });
    cb();
}

function browsersyncReload(cb) {
    browsersync.reload();
    cb();
}

// Watch Task
function watchTask() {
    watch('*.html', browsersyncReload);
    watch(['assets/scss/**/*.scss', 'assets/js/**/*.js'], series(scssTask, jsTask, browsersyncReload));
}

// Default Gulp Task
exports.default = series(
    scssTask,
    jsTask,
    browsersyncServe,
    watchTask
);