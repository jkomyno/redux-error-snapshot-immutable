// @flow
import type { existsInType } from './types';
/**
 * Returns true if and only if the pattern of the value exists in array.
 */
export const existsIn: existsInType = (value, array) =>
  array.reduce((prev, curr) => prev || RegExp(curr).test(value), false);
