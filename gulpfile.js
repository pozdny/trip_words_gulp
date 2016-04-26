/**
 * Created by user on 24.03.16.
 */

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var plumber = require("gulp-plumber");
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var jshint = require('gulp-jshint');
var runSequence = require('run-sequence');
var del = require('del');
var browserify = require('browserify');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var postcss = require('gulp-postcss');
/*
var imagemin = require('gulp-imagemin');
var babel = require("gulp-babel");
var cache = require('gulp-cache');

var clean = require('gulp-clean');

var postcss = require('gulp-postcss');
*/
var globalConfig = {
    prodDir: "dist",
    baseDir: "./app",
    moduleDir: "node_modules"

};
var config = {
    pathDevSCSS: globalConfig.baseDir + "/scss/**/*.scss",
    pathDevCSS: globalConfig.baseDir + "/css",
    pathDevJS: globalConfig.baseDir + "/js",
    pathProdCSS: globalConfig.prodDir + "/css",
    pathProdJS: globalConfig.prodDir + "/js",
    pathFramework7: globalConfig.moduleDir + "/framework7/dist"
};
// External dependencies you do not want to rebundle while developing,
// but include in your application deployment
var dependencies = [
    'framework7'
];
// keep a count of the times a task refires
var scriptsCount = 0;
gulp.task('scripts', function () {
    bundleApp(false);
    /*return gulp.src('app/scripts/!*.js')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(minify({
            ext:{
                src:'.js',
                min:'.min.js'
            },
            exclude: ['components'],
            noSource: true
        }))
        .pipe(gulp.dest('./app/js/'));*/
});
gulp.task('useref', function(){
    return gulp.src(globalConfig.baseDir + '/*.html')
        .pipe(plumber({
            errorHandler: onError
         }))
        .pipe(useref())
        .pipe(gulp.dest(globalConfig.prodDir))
});

gulp.task('minify', ['useref'], function() {
    // Минифицируем только CSS файлы
    gulp.src(config.pathProdCSS + '/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest(config.pathProdCSS));
    // Минифицируем только js файлы
    gulp.src(config.pathProdJS + '/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(config.pathProdJS));
});


gulp.task('prejs',  function () {
    return gulp.src(config.pathDevJS + '/scripts/*.js')
        .pipe(jshint({
            "lookup": true
        }))
        .pipe(jshint.reporter('default'))
       /* .pipe(gulp.dest('app/js'));*/

});
gulp.task('deploy', ['prejs'], function () {
    bundleApp(true);
});
// --------------------------------------------------------------------
// Task:
// --------------------------------------------------------------------

// синхронизация окна браузера и изменения файлов
gulp.task('watch', ['sass'], function(){
    gulp.watch(config.pathDevSCSS, ['sass']);
    gulp.watch(config.pathDevCSS + '/*.css', ['css']);
    gulp.watch(globalConfig.baseDir + '/*.html', browserSync.reload);
    gulp.watch(config.pathDevJS + '/scripts/*.js', ['deploy']);
    gulp.watch(config.pathDevJS + '/tmp/*.js', browserSync.reload);
    gulp.watch(config.pathDevJS + '/*.js', browserSync.reload);
});

gulp.task('css', function () {
    var cssnext = require('postcss-cssnext');
    var precss = require('precss');
    var processors = [cssnext, precss];
    return gulp.src(config.pathDevCSS + '/*.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest(config.pathDevCSS))
        .pipe(browserSync.reload({
            stream: true
        }))
});
gulp.task('sass', function() {
    return gulp.src(config.pathDevSCSS)
        .pipe(sass())
        .pipe(gulp.dest(config.pathDevCSS))
});


// синхронизация окна браузера и изменения файлов
gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: globalConfig.baseDir
        }
    })
});


// build готового проекта
gulp.task('build', function (cb){
    runSequence(['clean:dist', 'sass', 'useref', 'minify', 'images', 'fonts'],
        function(){ }
    );
});
// запуст рабочего проекта
gulp.task('default', function (callback) {
    runSequence(['scripts','sass','browserSync', 'watch'],
        function(){
            console.log('default');
        }
    );

});

// Private Functions
// ----------------------------------------------------------------------------
function bundleApp(isProduction) {
    scriptsCount++;
    // Browserify will bundle all our js files together in to one and will let
    // us use modules in the front end.
    var appBundler = browserify({
        entries: config.pathDevJS + '/scripts/init.js',
        debug: true
    });

    // If it's not for production, a separate vendors.js file will be created
    // the first time gulp is run so that we don't have to rebundle things like
    // react everytime there's a change in the js file
    if (!isProduction && scriptsCount === 1){
        // create vendors.js for dev environment.
        browserify({
            require: dependencies,
            debug: true
        })
            .bundle()
            .on('error', gutil.log)
            .pipe(source('vendors.js'))
            .pipe(gulp.dest(config.pathDevJS));
        // copy css framework7
        gulp.src(config.pathFramework7 + '/js/framework7.min.js')
            .pipe(gulp.dest('app/js/lib/', {}));
        gulp.src(config.pathFramework7 + '/css/framework7.ios.colors.min.css')
            .pipe(gulp.dest('app/css/lib/', {}));
        gulp.src(config.pathFramework7 + '/css/framework7.ios.min.css')
            .pipe(gulp.dest('app/css/lib/', {}));
    }
    if (!isProduction){
        // make the dependencies external so they dont get bundled by the
        // app bundler. Dependencies are already bundled in vendor.js for
        // development environments.
        dependencies.forEach(function(dep){
            appBundler.external(dep);
        })
    }
    appBundler
        .bundle()
        .on('error',gutil.log)
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(config.pathDevJS));
}

// --------------------------------------------------------------------
// Error Handler
// --------------------------------------------------------------------

var onError = function (err) {
    console.log(err);
    this.emit('end');
};
