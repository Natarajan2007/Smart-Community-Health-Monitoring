/**
 * Custom React Hooks
 * Collection of reusable React hooks for common patterns
 * @module hooks
 */

import { useState, useEffect, useRef, useCallback, useReducer } from 'react';
import { safeGetStorage, safeSetStorage } from '../utils/safeStorage';

/**
 * useAsync Hook - Handle async operations with loading, error, and data states
 * @param {Function} asyncFunction - Async function to execute
 * @param {Array} dependencies - Dependency array
 * @returns {Object} { status, data, error, execute }
 */
export const useAsync = (asyncFunction, dependencies = []) => {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setStatus('pending');
    setData(null);
    setError(null);
    try {
      const response = await asyncFunction();
      setData(response);
      setStatus('success');
      return response;
    } catch (err) {
      setError(err);
      setStatus('error');
      throw err;
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  return { status, data, error, execute };
};

/**
 * usePrevious Hook - Get previous value of a prop or state
 * @param {*} value - Value to track
 * @returns {*} Previous value
 */
export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

/**
 * useLocalStorage Hook - Sync state with localStorage (safe version)
 * @param {string} key - LocalStorage key
 * @param {*} initialValue - Initial value if not in storage
 * @returns {Array} [storedValue, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = safeGetStorage(key);
      return value !== null ? value : initialValue;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`Error reading localStorage key "${key}":`, error);
      }
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        safeSetStorage(key, valueToStore);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error(`Error setting localStorage key "${key}":`, error);
        }
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
};

/**
 * useDebounce Hook - Debounce a value
 * @param {*} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {*} Debounced value
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * useThrottle Hook - Throttle a value
 * @param {*} value - Value to throttle
 * @param {number} interval - Interval in milliseconds
 * @returns {*} Throttled value
 */
export const useThrottle = (value, interval = 500) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdated = useRef(null);

  useEffect(() => {
    const now = Date.now();

    if (lastUpdated.current && now >= lastUpdated.current + interval) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else if (!lastUpdated.current) {
      lastUpdated.current = now;
      setThrottledValue(value);
    }
  }, [value, interval]);

  return throttledValue;
};

/**
 * useFetch Hook - Fetch data from API
 * @param {string} url - URL to fetch from
 * @param {Object} options - Fetch options
 * @returns {Object} { data, loading, error, refetch }
 */
export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      setData(json);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
};

/**
 * useToggle Hook - Toggle a boolean value
 * @param {boolean} initialValue - Initial value
 * @returns {Array} [value, toggle, setTrue, setFalse]
 */
export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((v) => !v);
  }, []);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return [value, toggle, setTrue, setFalse];
};

/**
 * useMediaQuery Hook - Check if media query matches
 * @param {string} query - Media query string
 * @returns {boolean} Does media query match
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

/**
 * useClickOutside Hook - Detect click outside element
 * @param {Function} callback - Callback on click outside
 * @returns {React.RefObject} Ref to attach to element
 */
export const useClickOutside = (callback) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [callback]);

  return ref;
};

/**
 * useWindowSize Hook - Get window dimensions
 * @returns {Object} { width, height }
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

/**
 * useForm Hook - Manage form state
 * @param {Object} initialValues - Initial form values
 * @param {Function} onSubmit - Submit callback
 * @returns {Object} { values, errors, handleChange, handleSubmit, reset }
 */
export const useForm = (initialValues = {}, onSubmit = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (onSubmit) {
        await onSubmit(values);
      }
    },
    [values, onSubmit]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error
    }));
  }, []);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue,
    setFieldError
  };
};

/**
 * useMounted Hook - Check if component is mounted
 * @returns {boolean} Is component mounted
 */
export const useMounted = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
};

/**
 * useInterval Hook - Run effect at regular intervals
 * @param {Function} callback - Callback to run
 * @param {number} delay - Delay in milliseconds (null to disable)
 */
export const useInterval = (callback, delay = null) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
};

/**
 * useReducerAsync Hook - useReducer with async actions
 * @param {Function} reducer - Reducer function
 * @param {*} initialState - Initial state
 * @returns {Array} [state, dispatch]
 */
export const useReducerAsync = (reducer, initialState) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const dispatchAsync = useCallback((action) => {
    return Promise.resolve(dispatch(action));
  }, []);

  return [state, dispatchAsync];
};

export default {
  useAsync,
  usePrevious,
  useLocalStorage,
  useDebounce,
  useThrottle,
  useFetch,
  useToggle,
  useMediaQuery,
  useClickOutside,
  useWindowSize,
  useForm,
  useMounted,
  useInterval,
  useReducerAsync
};
