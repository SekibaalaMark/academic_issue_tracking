import React, { Component } from "react";
import PropTypes from "prop-types";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
    // Optionally, send error to a logging service here
  }

  handleRetry = () => {
    // Reset the error state to allow retrying
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI with retry button and customizable error message
      return (
        <div
          style={{ textAlign: "center", marginTop: "20px" }}
          role="alert"
          aria-live="assertive"
        >
          <h1>
            {this.props.errorMessage ||
              "Something went wrong. Please try again later."}
          </h1>
          <button onClick={this.handleRetry} style={{ marginTop: "10px" }}>
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// PropTypes for validation
ErrorBoundary.propTypes = {
  errorMessage: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
