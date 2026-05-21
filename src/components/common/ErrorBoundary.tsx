import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="bg-red-50 border border-red-200 rounded-3xl p-8 space-y-4 max-w-2xl mx-auto">
            <h2 className="text-xl font-extrabold text-red-650">Đã xảy ra lỗi hiển thị (React Crash)</h2>
            <p className="text-sm text-slate-600">
              Có một lỗi xảy ra khi tải hoặc hiển thị phần này của trang web. Chi tiết lỗi bên dưới:
            </p>
            <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl text-left overflow-auto max-h-60 text-xs font-mono">
              <div className="font-bold text-rose-400">{this.state.error?.toString()}</div>
              <pre className="mt-2 text-slate-400 whitespace-pre-wrap">{this.state.error?.stack}</pre>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-full text-xs transition-colors cursor-pointer"
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

export default ErrorBoundary;
