const { Observable } = require('./observables');

const map = transformation => stream$ =>
  new Observable(o => {
    stream$.subscribe(
      v => o.next(transformation(v)),
      e => o.error(e),
      () => o.complete(),
    );
  });

const filter = predicate => stream$ =>
  new Observable(o => {
    stream$.subscribe(
      v => predicate(v) && o.next(v),
      e => o.error(e),
      () => o.complete(),
    );
  });

const reduce = (reducer, initialValue) => stream$ =>
  new Observable(o => {
    let value = initialValue;
    stream$.subscribe(
      v => {
        value = reducer(value, v);
      },
      e => o.error(e),
      () => {
        o.next(value);
        o.complete();
      },
    );
  });

const scan = (reducer, initialValue) => stream$ =>
  new Observable(o => {
    let value = initialValue;
    stream$.subscribe(
      v => {
        value = reducer(value, v);
        o.next(value);
      },
      e => o.error(e),
      () => o.complete(),
    );
  });

const tap = sideEffect => stream$ => {
  stream$.subscribe(v => sideEffect(v));
  return stream$;
};

module.exports = {
  map,
  filter,
  reduce,
  scan,
  tap,
};
