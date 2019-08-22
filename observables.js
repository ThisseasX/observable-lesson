const noop = () => {};

class Observable {
  constructor(sub) {
    this.sub = sub;
  }

  subscribe(next = noop, error = noop, complete = noop) {
    this.sub({
      next,
      error,
      complete,
    });
  }

  pipe(...operators) {
    return operators.reduce(
      (stream$, operator) => operator(stream$),
      this,
    );
  }
}

const of = (...items) =>
  new Observable(o => {
    items.forEach(x => o.next(x));
    o.complete();
  });

const interval = (msec, ticks = 10) =>
  new Observable(o => {
    let i = 0;
    const intervalId = setInterval(() => {
      if (i < ticks) {
        o.next(i++);
      } else {
        clearInterval(intervalId);
        o.complete();
      }
    }, msec);
  });

const zip = (...streams$) =>
  new Observable(o => {
    let firstFinishedLength;
    
    let itemIndex = 0;
    let itemBuckets = Array(streams$.length)
      .fill()
      .map(() => []);

    const isWaveReady = () =>
      itemBuckets.every(
        bucket => bucket.length - 1 >= itemIndex,
      );

    streams$.forEach((stream$, i) => {
      const next = v => {
        itemBuckets[i].push(v);

        if (isWaveReady()) {
          const fullWave = itemBuckets.reduce(
            (wave, bucket) => [...wave, bucket[itemIndex]],
            [],
          );
          o.next(fullWave);
          itemIndex++;
        }
      };

      const error = e => error(e);

      const complete = () => {
        if (firstFinishedLength === undefined) {
          firstFinishedLength = itemBuckets[i].length;
        }

        if (
          itemBuckets.every(
            bucket => bucket.length >= firstFinishedLength,
          )
        ) {
          o.complete();
        }
      };

      stream$.subscribe(next, error, complete);
    });
  });

module.exports = {
  Observable,
  of,
  interval,
  zip,
};
