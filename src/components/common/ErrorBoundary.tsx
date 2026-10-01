// src/components/common/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('EPEDE Uncaught Engineering View Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleGoHome = () => {
    window.location.hash = '#home';
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 bg-slate-950 text-slate-100 font-sans">
          <div className="max-w-xl w-full bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-3 text-amber-400 mb-4">
              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">
                  {this.props.fallbackTitle || 'Incident de Calcul ou Rendu Graphique'}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  ANOMALIE DE TRAITEMENT SOUS-SYSTÈME
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Une exception a été interceptée lors de l'exécution du module. Les autres services de la plateforme restent opérationnels.
            </p>

            {this.state.error && (
              <div className="mb-6 p-3 bg-slate-950/80 rounded-lg border border-slate-800 font-mono text-xs text-rose-300 overflow-x-auto max-h-32">
                <span className="font-bold text-slate-400">Erreur : </span>
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold font-mono rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Réinitialiser le module
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium font-mono rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                <Home className="h-3.5 w-3.5" />
                Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
