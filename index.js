const { of, interval, zip } = require('./observables');
const {
  map,
  filter,
  reduce,
  scan,
  tap,
} = require('./operators');

zip(
  of('a', 'b', 'c'),
  interval(250, 3),
  of(1, 2, 3, 4)
)
  .pipe(
    tap(x => console.log('Before map: %O', x)),
    map(([,, c]) => c * 2),
    tap(x => console.log('After map: %d', x)),
    filter(x => x > 2),
    scan((total, value) => total + value, 0),
  )
  .subscribe(
    console.log,
    undefined,
    () => console.log('Done')
  );
