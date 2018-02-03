var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

gulp.task("build", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("./dist"));
});

gulp.task('copy', function () {
    return gulp.src('./src/index.html')
        .pipe(gulp.dest('./dist/'));
});

gulp.task("default", function () {
  gulp.start("build");
  gulp.start("copy");
});