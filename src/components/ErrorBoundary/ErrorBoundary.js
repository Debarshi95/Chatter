import React from 'react';
import { Text } from 'components';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      error: null,
      hasError: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.log(error, errorInfo);
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      return (
        <div className="bg-gray-800 flex h-screen items-center justify-center">
          <Text className="text-3xl text-slate-300 text-center">Oops! Some error occurred</Text>
        </div>
      );
    }
    return children;
  }
}

export default ErrorBoundary;
