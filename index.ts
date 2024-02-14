import { of, from, concatMap, delay, tap, Subject, takeWhile } from 'rxjs';

let mutableArray = [1, 2, 3, 4, 5];
let persistedValues: number[] = [];

const makeRequest = (data: number) => {
  return persistedValues.findIndex((v) => v == data) == -1
    ? of(data).pipe(
        delay(1000),
        tap((a) => {
          console.log(a);
          persistedValues.push(a);
        })
      )
    : of();
};

const subject$ = new Subject<number[]>();
subject$.next(mutableArray);

const observable$ = subject$.pipe(
  concatMap((item) => from(item)),
  concatMap((item: number) => makeRequest(item)),
  takeWhile(() => persistedValues.length !== mutableArray.length)
);

observable$.subscribe({
  next: (result: any) => {
    // If the array is being mutated, you can update the mutableArray here
    // and the next request will be made with the updated array
  },
  complete: () => {
    persistedValues = [];
    mutableArray = [];
    console.log('finito');
  },
});

// Add more values to the subject after subscribing
mutableArray.push(6, 7, 8);
mutableArray.push(9, 10, 11);
mutableArray.push(12, 13, 14);
subject$.next(mutableArray);
mutableArray.push(15, 16, 17);
subject$.next(mutableArray);
mutableArray.push(18, 19, 20);
mutableArray.push(21, 22, 23);
mutableArray.push(24, 25, 26);
subject$.next(mutableArray);
console.log(mutableArray);
