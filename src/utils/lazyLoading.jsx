import React, { Suspense } from 'react';
import '../scss/LoadingFallback.scss';

/**
 * Loading Component - Displayed while lazy-loaded components are loading
 */
export const LoadingFallback = () => (
  <div className="loading-container">
    <div className="loading-spinner">
      <div className="spinner"></div>
    </div>
    <p className="loading-text">Loading...</p>
  </div>
);

/**
 * LazyComponent Wrapper - Wraps lazy-loaded components with Suspense boundary
 * @param {React.ReactNode} Component - The lazy-loaded component
 * @param {string} fallback - Optional fallback message
 * @returns {React.ReactNode} Component wrapped with Suspense
 */
export const LazyComponent = ({ Component, fallback = <LoadingFallback /> }) => (
  <Suspense fallback={fallback}>
    <Component />
  </Suspense>
);

/**
 * createLazyComponent - Helper to create lazy-loaded components
 * @param {Function} importFunc - Dynamic import function
 * @returns {React.LazyExoticComponent} Lazy component
 */
export const createLazyComponent = (importFunc) => {
  return React.lazy(importFunc);
};

/**
 * Page-level route component lazy loader with error handling
 */
export const LazyPage = ({ Component }) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);
