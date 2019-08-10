const { of, interval, zip } = require('./observables');
const {
  map,
  filter,
  reduce,
  scan,
} = require('./operators');

zip(
  of('a', 'b', 'c'),
  interval(250, 3),
  of(1, 2, 3, 4)
)
  .pipe(
    map(([a, b]) => [a, b * 2]),
    filter(([, b]) => b > 0),
    scan((total, [,value]) => total + value, 0),
  )
  .subscribe(
    console.log,
    undefined,
    () => console.log('Done')
  );
