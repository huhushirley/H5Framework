var gulp = require('gulp');
var less = require('gulp-less');
var hash = require('gulp-hash');
var revCollector = require('gulp-rev-collector');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var pxtorem = require('postcss-pxtorem');
var minifyCSS = require('gulp-csso');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');

var paths = {
  less: ['./css/*.less'],
  js: ['./js/*.js']
};

function handleError(err) {
  this.emit('end');
}

gulp.task('css', function () {
  var processors = [
    autoprefixer({
      browsers: ['last 2 versions', 'iOS 7', 'Android 4.2']
    }),
    pxtorem({
      root_value: 100,
      replace: true,
      prop_white_list: ['font', 'font-size', 'line-height', 'letter-spacing',
      'width', 'height', 'margin', 'padding'],
    })
  ];
  return gulp.src('css/main.less')
    .pipe(sourcemaps.init())
    .pipe(less().on('error', handleError))
    .pipe(postcss(processors))
    .pipe(minifyCSS())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./css/'))
    .pipe(hash())
    .pipe(gulp.dest('public/css'))
    .pipe(hash.manifest({ manifestPath: './css/assets.json'}))
    .pipe(gulp.dest('public'));
});

gulp.task('js',function () {
  return gulp.src(paths.js)
    .pipe(hash())
    .pipe(gulp.dest('public/js'))
    .pipe(hash.manifest({ manifestPath: './js/assets.json'}))
    .pipe(gulp.dest('public'));
});

gulp.task('revHtml', function () {
  return gulp.src(['js/assets.json', 'css/assets.json', 'pages/*.html'])
    .pipe(revCollector({
      replaceReved: true
    }))
    .pipe(gulp.dest('pages'));
});

gulp.task('build', ['css', 'js', 'revHtml']);
gulp.task('default', function() {
  gulp.watch(paths.less, ['css']);
});
