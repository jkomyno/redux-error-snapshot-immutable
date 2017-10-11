// @flow
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map } from 'immutable';
import {
  resetErrorState,
  retryLastAction,
} from '../src/actions';
import reducer, {
  initialState,
  reducerCreator,
} from '../src/reducer';
import { RESET_ERROR_STATE } from '../src/reduxTypes';
import { defaultReducerName } from '../src/config';
import type {
  genericThunkActionCreatorType,
  lastActionType,
  snapshotErrorType,
} from '../src/types';

const expectedResetAction: lastActionType = {
  type: RESET_ERROR_STATE,
};

const meta: $PropertyType<snapshotErrorType, 'meta'> = {
  cause: 'Something happened',
  code: 123,
};

const mockedAction: genericThunkActionCreatorType = (arg1, arg2, arg3) => (
  dispatch => {
    try {
      // ...
      throw new Error('Something went wrong');
    } catch (error) {
      dispatch({
        type: 'RANDOM_ERROR_TYPE',
        error: error.message,
        action: mockedAction,
        args: [
          arg1,
          arg2,
          arg3,
        ],
        meta,
      })
    }
  }
);

const args = [1, 2, 3];

const expectedAction: snapshotErrorType = {
  error: 'Something went wrong',
  action: mockedAction,
  args,
  meta,
};

const mockStore = configureStore([thunk]);

describe('reducer', () => {
  it ('should return the initial state', () => {
    expect(reducer(undefined, {
      type: 'RANDOM_TYPE',
    })).toEqual(initialState);
  });

  it ('should reset the reducer', () => {
    expect(reducer(undefined, resetErrorState())).toEqual(initialState);
  });

  it ('should return an object with props `error`, `action`, `args`, `meta`', () => {
    const expectedState = {
      error: 'randomError',
      action: jest.fn(),
      args: [],
      meta: {},
    };

    const mockedActionResult = Object.assign({}, {
      type: 'RANDOM_ERROR_TYPE',
    }, expectedState);

    expect(reducer(undefined, mockedActionResult).toJS()).toEqual(expectedState);
    expect(expectedState.action).not.toBeCalled();
  });
});

describe('actions', () => {
  it ('should create an action to reset the reducer', () => {
    expect(resetErrorState()).toEqual(expectedResetAction);
  });

  it (`if the argument isn't a string, the reducerName should default to ${defaultReducerName} and
       work correctly, without throwing an error due to trying to access properties of undefined.`, () => {
    const lastAction = jest.fn(() => ({
      type: 'RANDOM_ERROR_TYPE',
    }));

    const store = mockStore(Map({
      [defaultReducerName]: Map({
        type: 'RANDOM_ERROR_TYPE',
        action: lastAction,
        args: [],
      }),
    }));

    expect(() => {
      store.dispatch(retryLastAction());
    }).not.toThrow();
    
    const expectedActions = [
      expectedResetAction,
      { type: 'RANDOM_ERROR_TYPE' },
    ];

    expect(store.getActions()).toEqual(expectedActions);
    expect(lastAction).toBeCalled();
  });
});

describe('core', () => {

  const mockedActionResult = Object.assign({}, {
    type: 'RANDOM_ERROR_TYPE',
  }, expectedAction);

  it (`should send a thunk which will throw, and the catched error will be dispatched along
      with the action that threw and its arguments`, () => {

    const store = mockStore();
    store.dispatch(mockedAction.apply(null, args));

    expect(store.getActions()).toEqual([mockedActionResult]);
  });

  it ('should retrieve last action, arguments, error message and meta', () => {
    const newStore = mockStore(Map({
      [defaultReducerName]: Map(expectedAction),
    }));

    newStore.dispatch(retryLastAction(defaultReducerName));

    const expectedActions = [
      expectedResetAction,
      mockedActionResult,
    ];
    expect(newStore.getActions()).toEqual(expectedActions);
  });
});

describe('reducerCreator', () => {
  it('should be a curried function that returns the reducer state', () => {
    const action: lastActionType = {
      type: 'ERROR',
    };
    expect(reducerCreator()(initialState, action)).toEqual(initialState);
  });

  it('should prevent certain types patterns to be captured by the reducer', () => {
    const blacklist = ['@@redux-form/*', 'NAVIGATION/Back'];
    const expAction1: lastActionType = Object.assign({},
      expectedAction, { type: 'ERROR' },
    );
    const expAction2: lastActionType = Object.assign({},
      expectedAction, { type: '@@redux-form/STOP_SUBMIT' },
    );

    expect(reducerCreator(blacklist)(initialState, expAction1).toJS())
      .toEqual(expectedAction);

    expect(reducerCreator(blacklist)(initialState, expAction2))
      .toEqual(initialState);
  });
});
