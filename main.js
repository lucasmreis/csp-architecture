import {chan, go, take, offer, put, putAsync, buffers, timeout} from 'js-csp';

let ch = chan();

let gen = id => function* () {
  console.log('Init id: ', id);
  while(true) {
    const v = yield take(ch);
    console.log(id, '===>', v);
    yield timeout(100);
  }
}

go(gen(1));
//go(gen(2));
//go(gen(3));
//go(gen(4));
//go(gen(5));
//go(gen(6));
//go(gen(7));
// go(gen(8));
// go(gen(9));
// go(gen(10));

go(function* () {
  let counter = 0;
  console.time('processes');
  while(counter < 100) {
    yield put(ch, counter);
    counter++;
    yield timeout(10);
  }
  console.timeEnd('processes');
});