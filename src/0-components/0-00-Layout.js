import React from "react";

export default class extends React.Component {
  componentDidMount() {}
  render() {
    const { children } = this.props;
    return (
      <div
        className="box bg-border h-full flex column overflow-y"
      >
        {children}
      </div>
    );
  }
}
