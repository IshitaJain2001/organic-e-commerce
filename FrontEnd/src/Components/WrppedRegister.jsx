import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import Register from './Register';

function WrappedRegister() {
  return (
    <ErrorBoundary>
      <Register />
    </ErrorBoundary>
  );
}

export default WrappedRegister;
