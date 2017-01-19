var gulp = require('gulp');
var less = require('gulp-less');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var pxtorem = require('postcss-pxtorem');
var csso = require('gulp-csso');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var gulpsync = require('gulp-sync')(gulp);

var paths = {
  less: ['src/css/*.less'],
  js: ['src/js/*.js']
};

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


function handleError(err) {
  this.emit('end');
}

gulp.task('css', function (){
  return gulp.src('src/css/main.less')
    .pipe(sourcemaps.init())
    .pipe(less().on('error', handleError))
    .pipe(postcss(processors))
    .pipe(csso())
    .pipe(rename({ extname: '.css' }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('src/pages/assets'));
});

gulp.task('js', function (){
  return gulp.src('src/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('src/pages/assets'));
});


gulp.task('revision', function () {
  return gulp.src(["src/pages/assets/main.js", "src/pages/assets/main.css"])
    .pipe(rev())
    .pipe(gulp.dest('dist/assets'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist/assets'))
});

gulp.task("replace", ["revision"], function () {
  var manifest = gulp.src('dist/assets/rev-manifest.json');
  return gulp.src('src/pages/*.html')
    .pipe(revReplace({ manifest: manifest }))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', gulpsync.sync([['css','js'], ['replace']]));
gulp.task('watch', function () {
  gulp.watch(paths.less, ['css']);
  gulp.watch(paths.js, ['js']);
})
gulp.task('default', ['css', 'js', 'watch']);
