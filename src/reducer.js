// @flow
import { Map } from 'immutable';
import { RESET_ERROR_STATE } from './reduxTypes';
import { existsIn } from './utils';
import type {
  reducerType,
  reducerCreatorType,
  snapshotErrorType,
} from './types';

export const initialState: snapshotErrorType = Map({
  meta: {},
});

const reducer: reducerType = (state = initialState, lastAction) => {
  const {
    type,
    error,
    action,
    args,
    meta,
  } = lastAction;

  if (type === RESET_ERROR_STATE) {
    return initialState;
  } else if (error) {
    return state.mergeDeep({
      error,
      action,
      args,
      meta,
    });
  }

  return state;
};

export default reducer;

export const reducerCreator: reducerCreatorType = (blacklist = []) =>
  (state, action) => {
    if (existsIn(action.type, blacklist)) {
      return initialState;
    }

    return reducer(state, action);
  };
