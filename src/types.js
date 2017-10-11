// @flow
import type { ThunkAction } from 'redux-thunk';

export type typeType = { type: string };

export type genericThunkActionCreatorType = (...args: Array<any>) =>
  ThunkAction<void, {reducerName: typeType}>;

export type snapshotErrorType = {
  +error?: string,
  +action?: genericThunkActionCreatorType,
  +args?: Array<any>,
  +meta?: {
    [string]: any,
  },
};

export type lastActionType =
  & typeType
  & snapshotErrorType;

export type reducerType = (state?: snapshotErrorType, lastAction: lastActionType) =>
  snapshotErrorType;

export type reducerCreatorType = (blacklist?: Array<string>) => reducerType;

export type existsInType = (value: string, array: Array<string>) => bool;

export type retryLastActionType = (reducerName: string | void) =>
  ThunkAction<void, {reducerName: lastActionType}>
