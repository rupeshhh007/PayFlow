import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Unhandled error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a1020] text-white px-4">
          <div className="max-w-lg rounded-3xl border border-slate-800 bg-slate-950/90 p-10 text-center shadow-2xl">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 13h2v2h-2z" />
                <path d="M11 7h2v4h-2z" />
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-white">Something went wrong</h1>
            <p className="mt-3 text-sm text-slate-400 leading-6">
              PayFlow encountered an unexpected error. Refresh the page to continue.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-8 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
