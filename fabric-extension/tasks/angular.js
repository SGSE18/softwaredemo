import gulp from 'gulp'
import gulpif from 'gulp-if'
import livereload from 'gulp-livereload'
import args from './lib/args'
import * as child from 'child_process';

gulp.task('angular', (cb) =>{
  let params = ['build', '--base-href', '/pages/',  '--no-progress']

  if(args.watch)
    params.push('--watch');

  if(args.production)
    params.push('--prod');

  let bg = child.spawn('ng', params, { cwd: 'frontend', shell: true });
  
  bg.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  
  bg.stderr.on('data', (data) => {
    console.log('\x1b[31m', data.toString());
  });
  
  bg.on('close', (code) => {
    if(!params.watch) {
      gulp.src('frontend/dist/frontend/**/*.{html,js,css,woff2}')
          .pipe(gulp.dest(`dist/${args.vendor}/pages`))
    }
    cb();
  });
})
