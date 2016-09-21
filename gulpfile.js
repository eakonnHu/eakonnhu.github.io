var gulp = require('gulp'),
    sass = require('gulp-sass'),
    notify = require('gulp-notify'),
    browserSync = require('browser-sync'),
    postcss = require('gulp-postcss'),
    // rename = require('gulp-rename'),
    // rtlcss = require('rtlcss'),
    //压缩css
    cssnano = require('cssnano'),
    notify = require("gulp-notify")
    bower = require('gulp-bower');

    var bootstrapPath ='./bower_components/bootstrap/scss';
    var fontawesomePath = './bower_components/font-awesome/scss';
    var config = {
        sassPath: './resources/sass',
        bowerDir: './bower_components'
    }

gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest(config.bowerDir))
});

// Copy js files to public folder
gulp.task('js', function() {
    return gulp.src([config.bowerDir + '/bootstrap/dist/js/bootstrap.min.js',
            config.bowerDir + '/jquery/dist/jquery.min.js',
            config.bowerDir + '/tether/dist/js/tether.min.js',
        ])
        .pipe(gulp.dest('./public/js'));
});

// Copy fontawesome icons to public/fonts folder
gulp.task('icons', function() {
    return gulp.src(config.bowerDir + '/font-awesome/fonts/**.*')
        .pipe(gulp.dest('./public/fonts'));
});


gulp.task('css', function () {
    var processors = [
        cssnano,
        // rtlcss
    ];
    return gulp.src(config.sassPath + '/style.scss')
        .pipe(sass({ includePaths : [bootstrapPath , fontawesomePath] }).on('error',  notify.onError(function (error) {
        return error.message;
        })))
        .pipe(postcss(processors))
        .pipe(gulp.dest('./public/css'))
        .pipe(browserSync.stream());
        // .pipe(notify("Sass files compiles successfuly!"));
});

// Add browserSync task
gulp.task('serve', ['css'], function() {
    browserSync({
        server: {
            baseDir: './',
        }
    });
    gulp.watch(config.sassPath + '/**/*.scss', ['css']);
    gulp.watch("./*.html").on('change', browserSync.reload);
});

gulp.task('default', ['bower', 'icons', 'js','serve']);
