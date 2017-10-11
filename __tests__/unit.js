// @flow
import { existsIn } from '../src/utils';

describe('existsIn', () => {
  it ('should return true if and only if the value exists in array', () => {
    expect(existsIn('@@redux-form/STOP_SUBMIT', ['@@redux-form/*', 'NAVIGATION/Back'])).toBe(true);
    expect(existsIn('nope', ['should', 'not', 'be'])).toBe(false);
  });
});
