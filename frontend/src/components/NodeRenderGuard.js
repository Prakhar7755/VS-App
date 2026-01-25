import React from "react";

export class NodeRenderGuard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { errorCaught: false };
  }

  static getDerivedStateFromError() {
    return { errorCaught: true };
  }

  componentDidCatch(error, info) {
    console.error("Error rendering node:", error, info);
  }

  render() {
    if (this.state.errorCaught) {
      return (
        <div className="p-2 rounded-md bg-red-100 border border-red-400 text-red-700 text-xs">
          Node could not render
        </div>
      );
    }

    return this.props.children;
  }
}
