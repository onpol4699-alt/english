import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, XCircle } from 'lucide-react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  fallbackTitle?: string;
  onReset?: () => void;
  componentName?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[ErrorBoundary caught error in ${this.props.componentName || 'component'}]:`, error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public override render() {
    if (this.state.hasError) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error || new Error('Unknown error'), this.handleReset);
      }
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6 rounded-2xl bg-rose-50/90 border border-rose-200 text-slate-800 shadow-sm flex flex-col items-center justify-center text-center space-y-3 my-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-xs">
            <AlertTriangle className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base font-khmer">
              {this.props.fallbackTitle || 'មានបញ្ហាក្នុងការបង្ហាញមេរៀន (Lesson Render Error)'}
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-md font-khmer">
              {this.state.error?.message || 'មេរៀននេះមានបញ្ហាក្នុងការផ្ទុកទិន្នន័យ។ សូមចុចប៊ូតុងខាងក្រោមដើម្បីព្យាយាមម្តងទៀត ឬត្រឡប់ទៅបញ្ជីមេរៀនវិញ។'}
            </p>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={this.handleReset}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>ព្យាយាមម្តងទៀត (Retry)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                this.handleReset();
              }}
              className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>បិទ (Close)</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
