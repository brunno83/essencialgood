import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div 
          style={{ 
            minHeight: '80vh', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '40px 20px',
            textAlign: 'center',
            backgroundColor: '#FAF7F2',
            color: '#141210'
          }}
        >
          <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '12px' }}>
            Something went wrong loading this product page.
          </h2>
          {this.state.error && (
            <pre style={{ fontSize: '11.5px', color: '#C0392B', backgroundColor: '#FFF0F0', border: '1px solid #F5C6CB', padding: '12px 16px', borderRadius: '8px', maxWidth: '700px', overflowX: 'auto', textAlign: 'left', margin: '12px 0 20px 0' }}>
              {this.state.error.toString()}
            </pre>
          )}
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px', maxWidth: '500px' }}>
            Please click below to return to our full collection.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              backgroundColor: '#4B6833',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '14px 28px',
              fontSize: '14px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            RETURN TO HOME PAGE →
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
