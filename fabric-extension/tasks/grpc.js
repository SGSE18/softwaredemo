import gulp from 'gulp'
import * as child from 'child_process';

gulp.task('grpc', (cb) => {
  child.exec("./gen-protos.sh", { shell:true },  (err, stdout, stderr) => {
    cb(err);
  });
})
