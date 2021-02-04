import { createTransform } from 'redux-persist';
import JsonTyped from '../lib/json-typed';
import LoadStatus from '../lib/load-status';

const restoreTypes = [
    LoadStatus
];

function saveState(state, key) {
    return JsonTyped.stringifyTyped(state);
}

function restoreValue(value, key) {
    if (value) {
        if (value.constructor == LoadStatus) {
            // We should never restore a LoadStatus in a running state because many UI elements lock the user out of performing
            // - an action if that action is already running. It can lock up the UI if we restored a running LoadStatus;
            if (value.running) {
                value.running = false;
            }
            value = restoreStateRecursive(value);
        } else if (typeof value == 'object') {
            value = restoreStateRecursive(value);
        }
    }
    return value;
}

function restoreStateRecursive(state) {
    Object.keys(state).forEach(key => {
        state[key] = restoreValue(state[key], key);
    });
    return state;
};

function restoreState(state, key) {
    return restoreStateRecursive(JsonTyped.parseTyped(state, restoreTypes));
}

const transform = createTransform(
    saveState,
    restoreState,
    {}
);

export default transform;
