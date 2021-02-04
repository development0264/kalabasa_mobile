'use strict'

class LoadStatus {
  constructor(state) {
    state = state ? state : {};
    this.operation = state.operation !== undefined ? state.operation : null;
    this.running = state.running !== undefined ? state.running : false;
    this.done = state.done !== undefined ? state.done : null;
    this.error = state.error !== undefined ? state.error : null;
    this.value = state.value;
    this.time = state.time !== undefined ? state.time : new Date;
  }

  isRunning() {
    return this.running;
  }

  isLoading() {
    return this.isRunning() && this.operation == LoadStatus.OPERATION_LOADING;
  }

  isUpdating() {
    return this.isRunning() && this.operation == LoadStatus.OPERATION_UPDATING;
  }

  isDone() {
    return (this.running === false && this.done === true);
  }

  isDoneLoading() {
    return this.isDone() && this.operation == LoadStatus.OPERATION_LOADING;
  }

  isDoneUpdating() {
    return this.isDone() && this.operation == LoadStatus.OPERATION_UPDATING;
  }

  hasError() {
    return (this.error != null);
  }

  getError() {
    return this.error;
  }

  getErrorString() {
    var result = '';
    if (typeof this.error === 'string') {
      result = this.error;
    } else if (this.error.constructor && this.error.constructor === Error) {
      result = this.error.message;
    } else if (typeof this.error === 'object') {
      result = JSON.stringify(this.error);
    } else if (typeof this.error.toString === 'function') {
      result = this.error.toString();
    }
    return result;
  }

  hasValue() {
    return (this.value !== undefined);
  }

  getValue() {
    return this.value;
  }

  getOperation() {
    return this.operation;
  }

  getTime() {
    return this.time;
  }

  ageSeconds() {
    var now = new Date();
    var milliseconds = this.time ? Math.abs(now.getTime() - this.time.getTime()) : 0;
    var result = milliseconds ? Math.round(milliseconds / 1000) : 0;
    return result;
  }

  // When a LoadStatus object is created the creation time is stored in this.time
  // This allows us check how old the object is when rendering views
  // This is useful for rendering error messages
  // We often only want to render errors which have been newly recieved
  isNew(maxAgeSeconds) {
    maxAgeSeconds = maxAgeSeconds ? maxAgeSeconds : 2;
    return this.ageSeconds() <= maxAgeSeconds;
  }

  static createEmpty() {
    return new LoadStatus({ time: new Date });
  }

  static createRunning(operation) {
    return new LoadStatus({ operation, running: true, done: false });
  }

  static createDone(value, operation) {
    return new LoadStatus({ value, operation, running: false, done: true });
  }

  static createError(error, operation) {
    return new LoadStatus({ running: false, error: error, operation });
  }

  static createOperationCleared(loadStatus) {
    // When the UI needs to respond once to the completion of an operation you need a way to mark it is handled
    // - this action clears the user operation so the UI can see the operation completion was handled
    var result = LoadStatus.createEmpty();
    if (loadStatus.hasValue()) {
      result = LoadStatus.createDone(loadStatus.getValue());
    }
    return result;
  }

  static createLoading() {
    return LoadStatus.createRunning(LoadStatus.OPERATION_LOADING);
  }

  static createDoneLoading(value) {
    return LoadStatus.createDone(value, LoadStatus.OPERATION_LOADING);
  }

  static createErrorLoading(error) {
    return LoadStatus.createError(error, LoadStatus.OPERATION_LOADING);
  }

  static createUpdating(origLoadStatus) {
    // We persist the original value to ensure any display remains during update
    var value = origLoadStatus.getValue();
    var operation = LoadStatus.OPERATION_UPDATING;
    return new LoadStatus({ value, operation, running: true, done: false });
  }

  static createDoneUpdating(value) {
    return LoadStatus.createDone(value, LoadStatus.OPERATION_UPDATING);
  }

  static createErrorUpdating(error, origLoadStatus) {
    var value = origLoadStatus.getValue();
    var operation = LoadStatus.OPERATION_UPDATING;
    return new LoadStatus({ value, running: false, error: error, operation });
  }
}

LoadStatus.OPERATION_LOADING = 'LOADING';
LoadStatus.OPERATION_UPDATING = 'UPDATING';

LoadStatus.alias = 'LoadStatus';

module.exports = LoadStatus;
