import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
  isFirestorePermissionError: boolean;
  isQuotaExceeded: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
      isFirestorePermissionError: false,
      isQuotaExceeded: false,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const rawMsg = error?.message || 'An unexpected application error occurred.';
    let friendlyMsg = rawMsg;
    let isFirestorePermissionError = false;
    let isQuotaExceeded = false;

    try {
      const parsed = JSON.parse(rawMsg);
      if (parsed && typeof parsed.error === 'string') {
        const lower = parsed.error.toLowerCase();
        if (lower.includes('permission') || lower.includes('insufficient')) {
          isFirestorePermissionError = true;
          friendlyMsg =
            'Your account does not have permission for this database action. Please sign in again with your verified Google account.';
        } else if (lower.includes('quota') || lower.includes('resource-exhausted')) {
          isQuotaExceeded = true;
          friendlyMsg =
            'Cloud database daily quota has been temporarily reached. Please try again shortly.';
        } else {
          friendlyMsg = parsed.error;
        }
      }
    } catch {
      const lower = rawMsg.toLowerCase();
      if (lower.includes('quota') || lower.includes('resource-exhausted')) {
        isQuotaExceeded = true;
        friendlyMsg =
          'Cloud database daily quota has been temporarily reached. Please try again shortly.';
      }
    }

    return {
      hasError: true,
      errorMessage: friendlyMsg,
      isFirestorePermissionError,
      isQuotaExceeded,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Application ErrorBoundary caught error:', error, errorInfo);
  }

  handleReload = (): void => {
    this.setState({
      hasError: false,
      errorMessage: '',
      isFirestorePermissionError: false,
      isQuotaExceeded: false,
    });
    window.location.reload();
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-amber-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                </svg>
              </div>
              <div>
                <h1 className="text-base font-bold text-white">
                  {this.state.isFirestorePermissionError
                    ? 'Database Access Verification Needed'
                    : this.state.isQuotaExceeded
                    ? 'Cloud Sync Temporarily Paused'
                    : 'Something went wrong'}
                </h1>
                <p className="text-xs text-slate-400">CA Saarthi AI Workspace</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">{this.state.errorMessage}</p>

            <button
              type="button"
              onClick={this.handleReload}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 16H3v5" />
              </svg>
              <span>Reload Workspace</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
