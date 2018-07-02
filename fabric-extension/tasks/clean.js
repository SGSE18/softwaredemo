import gulp from 'gulp'
import del from 'del'
import args from './lib/args'

gulp.task('clean', () => {
  return del([`dist/${args.vendor}/**/*`, `frontend/dist/frontend/**/*`, `fabric-grpc-client/_protos/**/*`]);
})
