import { Card } from "@nextui-org/card";
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="p-6 text-center">
          <h1 className="text-2xl text-red-600">Oops! Something went wrong.</h1>
          <p className="text-gray-500">
            Please try refreshing the page or contact support if the issue
            persists.
          </p>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
