import { Component, type ErrorInfo, type ReactNode } from 'react';
import ErrorPage from '../pages/ErrorPage';

export class AppErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(_error: Error, _info: ErrorInfo) { /* Render a recoverable error page without exposing internals. */ }
  render() { return this.state.failed ? <ErrorPage code={500} /> : this.props.children; }
}
