/**
 * State Management Utilities
 * Helper functions and patterns for managing application state
 * @module stateManagement
 */

/**
 * Create a simple event emitter for state updates
 * @returns {Object} Event emitter instance
 */
export const createEventEmitter = () => {
  const listeners = {};

  return {
    on(event, handler) {
      if (!listeners[event]) {
        listeners[event] = [];
      }
      listeners[event].push(handler);

      return () => {
        listeners[event] = listeners[event].filter((h) => h !== handler);
      };
    },

    off(event, handler) {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter((h) => h !== handler);
      }
    },

    emit(event, data) {
      if (listeners[event]) {
        listeners[event].forEach((handler) => handler(data));
      }
    },

    once(event, handler) {
      const unsubscribe = this.on(event, (data) => {
        handler(data);
        unsubscribe();
      });
      return unsubscribe;
    }
  };
};

/**
 * Create a simple store with getters, setters, and subscribers
 * @param {*} initialState - Initial state value
 * @returns {Object} Store instance
 */
export const createStore = (initialState = {}) => {
  let state = initialState;
  const listeners = new Set();

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const getState = () => ({ ...state });

  const setState = (updates) => {
    const newState = typeof updates === 'function' ? updates(state) : updates;
    state = { ...state, ...newState };
    listeners.forEach((listener) => listener(state));
  };

  const updateState = (key, value) => {
    setState({ [key]: value });
  };

  const reset = () => {
    state = initialState;
    listeners.forEach((listener) => listener(state));
  };

  return {
    subscribe,
    getState,
    setState,
    updateState,
    reset
  };
};

/**
 * Create a reducer manager
 * @param {Function} reducer - Reducer function
 * @param {*} initialState - Initial state
 * @returns {Object} Reducer manager
 */
export const createReducerManager = (reducer, initialState) => {
  let state = initialState;
  const listeners = new Set();

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach((listener) => listener(state));
  };

  const getState = () => state;

  const reset = () => {
    state = initialState;
    listeners.forEach((listener) => listener(state));
  };

  return {
    subscribe,
    dispatch,
    getState,
    reset
  };
};

/**
 * Create a async action manager
 * @returns {Object} Async action manager
 */
export const createAsyncActionManager = () => {
  const state = {
    loading: false,
    error: null,
    data: null
  };

  const listeners = new Set();

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const notify = () => {
    listeners.forEach((listener) => listener({ ...state }));
  };

  const execute = async (asyncFn) => {
    state.loading = true;
    state.error = null;
    notify();

    try {
      const data = await asyncFn();
      state.data = data;
      state.loading = false;
      notify();
      return data;
    } catch (error) {
      state.error = error;
      state.loading = false;
      notify();
      throw error;
    }
  };

  const reset = () => {
    state.loading = false;
    state.error = null;
    state.data = null;
    notify();
  };

  return {
    execute,
    reset,
    subscribe,
    getState: () => ({ ...state })
  };
};

/**
 * Immer-like draft pattern for immutable updates
 * @param {Object} state - Current state
 * @param {Function} producer - Function that modifies draft
 * @returns {Object} New state
 */
export const produce = (state, producer) => {
  const draft = JSON.parse(JSON.stringify(state));
  producer(draft);
  return draft;
};

/**
 * Create a selectable store (with getters)
 * @param {Object} initialState - Initial state
 * @param {Object} selectors - Selector functions
 * @returns {Object} Store with selectors
 */
export const createSelectableStore = (initialState = {}, selectors = {}) => {
  let state = initialState;
  const listeners = new Set();

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const getState = () => ({ ...state });

  const setState = (updates) => {
    const newState = typeof updates === 'function' ? updates(state) : updates;
    state = { ...state, ...newState };
    listeners.forEach((listener) => listener(state));
  };

  const select = (selectorName) => {
    const selector = selectors[selectorName];
    if (!selector) {
      console.error(`Selector "${selectorName}" not found`);
      return null;
    }
    return selector(state);
  };

  return {
    subscribe,
    getState,
    setState,
    select
  };
};

/**
 * Persist state to localStorage
 * @param {Object} store - Store instance
 * @param {string} key - LocalStorage key
 * @returns {Function} Cleanup function
 */
export const persistStore = (store, key = 'app-state') => {
  try {
    const persisted = localStorage.getItem(key);
    if (persisted) {
      store.setState(JSON.parse(persisted));
    }
  } catch (error) {
    console.error('Failed to restore state:', error);
  }

  return store.subscribe((state) => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to persist state:', error);
    }
  });
};

/**
 * Sync two stores
 * @param {Object} sourceStore - Source store
 * @param {Object} targetStore - Target store
 * @returns {Array} Unsubscribe functions
 */
export const syncStores = (sourceStore, targetStore) => {
  const unsub1 = sourceStore.subscribe((state) => {
    targetStore.setState(state);
  });

  const unsub2 = targetStore.subscribe((state) => {
    sourceStore.setState(state);
  });

  return [unsub1, unsub2];
};

/**
 * Combine multiple stores into one
 * @param {Object} stores - Map of store names to store instances
 * @returns {Object} Combined store
 */
export const combineStores = (stores = {}) => {
  const listeners = new Set();

  const subscribe = (listener) => {
    const unsubscribers = Object.values(stores).map((store) =>
      store.subscribe(() => listener(getState()))
    );

    return () => unsubscribers.forEach((unsub) => unsub());
  };

  const getState = () => {
    const combined = {};
    Object.entries(stores).forEach(([name, store]) => {
      combined[name] = store.getState();
    });
    return combined;
  };

  const setState = (updates) => {
    Object.entries(updates).forEach(([storeName, storeUpdates]) => {
      if (stores[storeName]) {
        stores[storeName].setState(storeUpdates);
      }
    });
  };

  return {
    subscribe,
    getState,
    setState
  };
};

/**
 * Create middleware chain
 * @param {Array} middlewares - Array of middleware functions
 * @returns {Function} Middleware chain executor
 */
export const createMiddlewareChain = (middlewares = []) => {
  return async (action, next) => {
    let index = 0;

    const dispatch = async () => {
      if (index >= middlewares.length) {
        return next(action);
      }

      const middleware = middlewares[index++];
      return middleware(action, dispatch);
    };

    return dispatch();
  };
};

/**
 * Create action creator factory
 * @param {string} actionType - Action type prefix
 * @returns {Object} Action creators
 */
export const createActionCreators = (actionType) => {
  return {
    setLoading: (payload) => ({ type: `${actionType}_LOADING`, payload }),
    setSuccess: (payload) => ({ type: `${actionType}_SUCCESS`, payload }),
    setError: (payload) => ({ type: `${actionType}_ERROR`, payload }),
    reset: () => ({ type: `${actionType}_RESET` })
  };
};

/**
 * Create async thunk
 * @param {string} actionType - Action type prefix
 * @param {Function} asyncFn - Async function
 * @returns {Function} Thunk function
 */
export const createAsyncThunk = (actionType, asyncFn) => {
  return async (dispatch) => {
    dispatch({ type: `${actionType}_LOADING` });
    try {
      const result = await asyncFn();
      dispatch({ type: `${actionType}_SUCCESS`, payload: result });
      return result;
    } catch (error) {
      dispatch({ type: `${actionType}_ERROR`, payload: error });
      throw error;
    }
  };
};

/**
 * Create state normalizer
 * @param {string} idField - Field to use as ID
 * @returns {Object} Normalizer methods
 */
export const createNormalizer = (idField = 'id') => {
  return {
    normalize: (data) => {
      const entities = {};
      const ids = [];

      if (Array.isArray(data)) {
        data.forEach((item) => {
          entities[item[idField]] = item;
          ids.push(item[idField]);
        });
      }

      return { entities, ids };
    },

    denormalize: (entities, ids) => {
      return ids.map((id) => entities[id]);
    },

    upsert: (entities, item) => ({
      ...entities,
      [item[idField]]: item
    }),

    remove: (entities, id) => {
      const { [id]: _, ...rest } = entities;
      return rest;
    }
  };
};

/**
 * Create undo/redo manager
 * @param {*} initialState - Initial state
 * @returns {Object} Undo/redo manager
 */
export const createUndoRedoManager = (initialState) => {
  let current = initialState;
  const history = [initialState];
  let historyIndex = 0;

  return {
    getState: () => current,

    setState: (newState) => {
      current = newState;
      history.splice(historyIndex + 1);
      history.push(newState);
      historyIndex = history.length - 1;
    },

    undo: () => {
      if (historyIndex > 0) {
        historyIndex--;
        current = history[historyIndex];
      }
      return current;
    },

    redo: () => {
      if (historyIndex < history.length - 1) {
        historyIndex++;
        current = history[historyIndex];
      }
      return current;
    },

    canUndo: () => historyIndex > 0,
    canRedo: () => historyIndex < history.length - 1,
    getHistory: () => history.slice()
  };
};

export default {
  createEventEmitter,
  createStore,
  createReducerManager,
  createAsyncActionManager,
  produce,
  createSelectableStore,
  persistStore,
  syncStores,
  combineStores,
  createMiddlewareChain,
  createActionCreators,
  createAsyncThunk,
  createNormalizer,
  createUndoRedoManager
};
