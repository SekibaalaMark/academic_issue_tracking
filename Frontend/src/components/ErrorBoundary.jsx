import React, { Component } from "react";

class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error for debugging
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI when an error occurs
      return (
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            color: "#1A1A1A",
            backgroundColor: "#fff",
            borderRadius: "5px",
            margin: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ color: "#ff0000" }}>Something went wrong</h2>
          <p>
            An unexpected error occurred. Please try refreshing the page or
            contact support if the issue persists.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: "#008000",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Refresh Page
          </button>
          {process.env.NODE_ENV === "development" && (
            <details style={{ marginTop: "20px", textAlign: "left" }}>
              <summary>Error Details</summary>
              <pre style={{ color: "#1A1A1A" }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    // Render children if no error
    return this.props.children;
  }
}

export default ErrorBoundary;
