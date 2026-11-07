import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-200 p-6">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-bold text-rose-400 mb-4">
              Đã xảy ra lỗi
            </h1>
            <p className="text-sm text-slate-400 mb-4">
              {this.state.error?.message || 'Unknown error'}
            </p>
            <button type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-emerald-500 text-white"
            >
              Tải lại trang
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}