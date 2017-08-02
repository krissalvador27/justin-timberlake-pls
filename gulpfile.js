"use strict";
// Organized with inspiration from Mike Valstar's solution:
// http://mikevalstar.com/post/fast-gulp-browserify-babelify-watchify-react-build/

const babelify   = require('babelify');
const browserify = require('browserify');
const buffer     = require('vinyl-buffer');
const coffeeify  = require('coffeeify');
const gulp       = require('gulp');
const livereload = require('gulp-livereload');
const merge      = require('merge');
const rename     = require('gulp-rename');
const source     = require('vinyl-source-stream');
const sourceMaps = require('gulp-sourcemaps');
const watchify   = require('watchify');
const sass       = require('gulp-sass');
const watch      = require('gulp-watch');

var config = {
    js: {
      src: 'src/js/app.js',   // Entry point
      outputDir: './build/',  // Directory to save budle to
      mapDir: './maps/',      // Subdirectory to save maps to
      outputFile: 'bundle.js' // Name to use for bundle
    },
    css: {
      src: 'src/scss/*.scss',
      outputFile: 'lib/assets/css'
    }
};

function bundle (bundler) {
  // Add options to add to bundler passed as parameter
  bundler
    .bundle()                                    // Start bundle
    .pipe(source(config.js.src))                 // Entry point
    .pipe(buffer())                              // Convert to gulp pipeline
    .pipe(rename(config.js.outputFile))          // Rename output from 'amin.js'
                                                 //   to 'bundle.js'
    .pipe(sourceMaps.init({ loadMaps : true }))  // Strip inline source maps
    .pipe(sourceMaps.write(config.js.mapDir))    // Save source maps to their
                                                 //   own directory
    .pipe(gulp.dest(config.js.outputDir))        // Save 'bundle' to build/
    .pipe(livereload());                         // Reload browser if relevant
}

// Watch task: Bundle, kick off live reload server, and rebundle/reload on file changes
gulp.task('watch', function () {
    livereload.listen();
    let args = merge(watchify.args, { debug : true });
    let bundler = browserify(config.js.src, args)
                    .plugin(watchify, { ignoreWatch: ['**/node_modules'] })
                    .transform(coffeeify)
                    .transform(babelify, { presets : [ 'es2015' ] });

    bundle(bundler);

    bundler.on('update', function () {
      bundle(bundler);
    });
});

gulp.task('styles', function () {
    livereload.listen();
    return gulp.src(config.css.src)
        .pipe(watch(config.css.src))
        .pipe(sass())
        .pipe(gulp.dest(config.css.outputFile));
});

// Bundle task: Just spit out a bundle and source maps
gulp.task('bundle', function () {
    var bundler = browserify(config.js.src)
                    .transform(coffeeify)
                    .transform(babelify, { presets : [ 'es2015' ] });

    bundle(bundler);
})

gulp.task('build', ['bundle', 'watch', 'styles']);
