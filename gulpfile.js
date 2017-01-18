var gulp = require('gulp');
var less = require('gulp-less');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var pxtorem = require('postcss-pxtorem');
var minifyCSS = require('gulp-csso');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var pump = require('pump');

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
    .pipe(rev())
    .pipe(gulp.dest('./dist/assets/css'))
    .pipe(rev.manifest('css/asset.json'))
    .pipe(gulp.dest('rev'));
});

gulp.task('compress', function (cb) {
  pump([
      gulp.src(paths.js),
      uglify(),
      rename({ extname: '.min.js' }),
      gulp.dest('js')
    ],
    cb
  );
});

gulp.task('js',function () {
  return gulp.src('js/*.min.js')
    .pipe(rev())
    .pipe(gulp.dest('./dist/assets/js'))
    .pipe(rev.manifest('js/asset.json') )
    .pipe(gulp.dest('./rev/'));
});

gulp.task('revHtml', function () {
  return gulp.src(['rev/*/*.json', 'pages/*.html'])
    .pipe(revCollector({
      replaceReved: true,
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['css', 'js']);
gulp.task('default', function() {
  gulp.watch(paths.less, ['css']);
});
