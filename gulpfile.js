const gulp = require('gulp');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const nunjucks = require('gulp-nunjucks-render');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const notify = require('gulp-notify');
const svgmin = require('gulp-svgmin');
const zip = require('gulp-zip');
const stripCssComments = require('gulp-strip-css-comments');
const replace = require('gulp-replace');
const del = require('del');
const sprite = require('gulp-svg-sprite');
const tinypng = require('gulp-tinypng-compress');


//---------------------------------------------------Node dir-----------------------------------------------------------
const path = {
  npm: 'node_modules/'
};
//----------------------------------------------------------------------------------------------------------------------


//--------------------------------------------------BrowserSync---------------------------------------------------------
gulp.task('browser-sync', function () {
  return browserSync.init({
    server: {
      baseDir: "dist"
    }
  });
});
//----------------------------------------------------------------------------------------------------------------------


//-------------------------------------------CSS minify for dist-------------------------------------------------------
gulp.task('sass', function () {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sass({
      includePaths: [path.npm]
    }).on('error', function (err) { return notify().write(err); }))
    .pipe(gulp.dest('src/css'))
});
//----------------------------------------------------------------------------------------------------------------------


//--------------------------------------------Compile CSS task----------------------------------------------------------

gulp.task('css', ['sass'], function () {
  return gulp.src([
    path.npm + 'normalize.css/normalize.css',
    'src/css/app/app.css'
  ])
    .pipe(concat('main.css'))
    .pipe(cleanCSS().on('error', function (err) { return notify().write(err); }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(stripCssComments({
      preserve: false
    }))
    .pipe(gulp.dest('dist/css'))
});


//----------------------------------------HTML copy, find and replace paths---------------------------------------------
gulp.task('html', function () {
  return gulp.src('src/html/app/pages/*.html')
    .pipe(nunjucks({
    }).on('error', function (err) { return notify().write(err); }))
    .pipe(gulp.dest('dist'))
});
//----------------------------------------------------------------------------------------------------------------------


//-----------------------------------------------dist javascript task--------------------------------------------------
gulp.task('js', function () {
  return gulp.src([
    path.npm + 'jquery/dist/jquery.js',
    path.npm + 'bootstrap/dist/js/bootstrap.js',
    'src/js/**/*.js'
  ])

    .pipe(babel({ compact: false }))
    .pipe(concat('app.js'))
    // .pipe(gulp.dest('src/js/app/'))

    .pipe(concat('main.js'))
    .pipe(uglify().on('error', function (err) { return notify().write(err); }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist/js'))
});
//----------------------------------------------------------------------------------------------------------------------


//------------------------------------------------------TinyPNG task----------------------------------------------------
gulp.task('png', function () {
  return gulp.src(['src/media/img/*.png', 'src/media/img/*.jpg'])
    .pipe(tinypng({
      key: 'qvtT2BPQtOvhT-97B47ELxqa-Lcq5FUO',
      sigFile: 'images/.tinypng-sigs',
      log: true
    }))
    .pipe(gulp.dest('dist/media'));
});
//----------------------------------------------------------------------------------------------------------------------


//---------------------------------------------SVG sprite task----------------------------------------------------------
gulp.task('sprite', function () {
  return gulp.src('src/media/symbols/*.svg')
    .pipe(sprite({
      mode: {
        css: {
          render: {
            scss: true,
            scss: {
              dest: '../scss/app/02_tools/_sprite',
            },
          },
          bust: false,
          sprite: '../media/sprite/sprite',
        }
      }
    }).on('error', function (err) { return notify().write(err); }))
    .pipe(gulp.dest('src'))
});
//----------------------------------------------------------------------------------------------------------------------


//-------------------------------------------Sprite + minify all SVGs---------------------------------------------------
gulp.task('svg', ['sprite'], function () {
  return gulp.src(['src/media/**/*.svg', '!src/media/symbols/*.svg'])
    .pipe(svgmin())
    .pipe(gulp.dest('dist/media'))
});
//----------------------------------------------------------------------------------------------------------------------


//--------------------------------------Compress all dist files to dist.zip-------------------------------------------
gulp.task('zip', function () {
  return gulp.src('dist/**/*.*')
    .pipe(zip('dist.zip'))
    .pipe(gulp.dest('./'));
});
//----------------------------------------------------------------------------------------------------------------------


gulp.task('watch', function () {
  gulp.watch(['src/media/**/*.svg', '!src/media/sprite/*.svg'], ['svg']).on('change', browserSync.reload);
  gulp.watch('src/media/**/*.png', ['png']).on('change', browserSync.reload);
  gulp.watch('src/scripts/**/*.js', ['js']).on('change', browserSync.reload);
  gulp.watch('src/scss/**/*.scss', ['css']).on('change', browserSync.reload);
  gulp.watch('src/html/**/*.html', ['html']).on('change', browserSync.reload);
});


//-------------------------------------------CSS minify for dist-------------------------------------------------------
gulp.task('clean', function () {
  del(['dist']);
});
//----------------------------------------------------------------------------------------------------------------------


//-------------------------------------------------Gulp.js dist task---------------------------------------------------
gulp.task('app', [
  'png',
  'svg',
  'css',
  'js',
  'html',
  'browser-sync',
  'watch'], function (app) {
    console.log('\x1b[32m', '----------> App successfully launched, aimo <----------')
    return app;
  });
//----------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------Gulp.js dist task---------------------------------------------------
gulp.task('build', [
  'png',
  'svg',
  'css',
  'js',
  'html'], function (app) {
    console.log('\x1b[32m', '----------> App successfully launched, aimo <----------')
    return app;
  });
//----------------------------------------------------------------------------------------------------------------------
