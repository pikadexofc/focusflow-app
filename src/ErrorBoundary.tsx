import React from 'react';
import { Shield } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMsg: string;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) { 
    super(props); 
    this.state = { hasError: false, errorMsg: '' }; 
  }
  
  static getDerivedStateFromError(error: Error) { 
    return { hasError: true, errorMsg: error.message }; 
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) { 
    console.error("FocusFlow Critical Error:", error, errorInfo); 
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center p-6 text-white text-center">
          <Shield size={48} className="text-[#FF5A00] mb-4 opacity-50" />
          <h1 className="text-2xl font-display font-bold mb-2">System Interruption</h1>
          <p className="text-[#A1A1AA] text-sm mb-6 max-w-xs font-body">An unexpected anomaly occurred in the atmospheric engine. Please reboot the environment.</p>
          <button 
            onClick={() => { localStorage.clear(); window.location.reload(); }} 
            className="px-6 py-3 bg-white/10 rounded-full text-xs font-display font-bold uppercase tracking-widest hover:bg-white/20 transition-all"
          >
            Reboot Core
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
