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
var gulpsync = require('gulp-sync')(gulp);

var paths = {
  less: ['./css/*.less'],
  js: ['./js/*.js']
};

function handleError(err) {
  this.emit('end');
}

gulp.task('watch', function(){
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
  return gulp.src('./css/main.less')
    .pipe(sourcemaps.init())
    .pipe(less().on('error', handleError))
    .pipe(postcss(processors))
    .pipe(rename({ extname: '.css' }))
    .pipe(gulp.dest('./css/'));
});


gulp.task('minify', function() {
  return gulp.src('./css/main.css')
    .pipe(rev())
    .pipe(minifyCSS())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./dist/assets/css'))
    .pipe(rev.manifest('asset.json'))
    .pipe(gulp.dest('./rev/css'));
});

gulp.task('js',function () {
  return gulp.src(paths.js)
    .pipe(rev())
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('./dist/assets/js'))
    .pipe(rev.manifest('asset.json') )
    .pipe(gulp.dest('./rev/js'));
});

gulp.task('revHtml', function() {
  return gulp.src(['rev/*/*.json', 'pages/*.html'])
    .pipe(revCollector({
      replaceReved: true,
      dirReplacements: {
        '../css/': './dist/css',
        '../js/': './dist/js'
      }
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build', gulpsync.sync([['minify','js'], 'revHtml']));
gulp.task('default', function() { 
  gulp.watch(paths.less, ['watch']);
});
