import {go, put, timeout} from 'js-csp';

export const dbInsert = (updateChannels, newWord) => {
  go(function* () {
    yield put(updateChannels.loading, true);

    // do something costly
    yield timeout(1000);
    yield put(updateChannels.add, newWord);

    yield put(updateChannels.loading, false);
  });
};