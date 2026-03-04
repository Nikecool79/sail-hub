import React from 'react';
import { useLocation } from 'react-router-dom';
import OptimistBoat from './OptimistBoat';

interface State {
  hasError: boolean;
}

class ErrorBoundaryInner extends React.Component<React.PropsWithChildren<{ resetKey: string }>, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prevProps: { resetKey: string }) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 text-center">
          <OptimistBoat size={64} color="hsl(var(--primary))" />
          <h1 className="font-heading text-2xl font-bold">Something went wrong</h1>
          <p className="text-muted-foreground">An unexpected error occurred.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return <ErrorBoundaryInner resetKey={location.pathname}>{children}</ErrorBoundaryInner>;
}
