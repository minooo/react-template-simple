import React from "react";
import { common } from "@utils"

export default class extends React.Component {
  componentDidMount() {
    common.setTitle(this.props.title)
  }
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
