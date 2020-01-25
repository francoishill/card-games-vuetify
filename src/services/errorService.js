import Vue from 'vue';

const state = Vue.observable({
    errors: [],
    randomId: 1,
});

const defaultTimeout = 30000;

class Service {
    getErrors() {
        return state.errors;
    }

    add(err, { timeoutMs, actions } = {}) {
        if (!(err instanceof Error)) {
            err = new Error(err);
        }

        err.id = state.randomId++;

        if (actions) {
            err.actions = actions;
        }

        state.errors.push(err);

        let timeoutDuration = timeoutMs || defaultTimeout;
        setTimeout(() => {
            if (!err.preventAutoDismiss) {
                this.remove(err);
            }
        }, timeoutDuration);
    }

    remove(err) {
        let idx = state.errors.indexOf(err);
        if (idx === -1) return;
        state.errors.splice(idx, 1);
    }

    preventAutoDismiss(err) {
        err.preventAutoDismiss = true;
    }
}

export const ErrorService = new Service();
